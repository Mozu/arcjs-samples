/**
 * Implementation for embedded.commerce.payments.action.after

 * This custom function will receive the following context object:
{
  "exec": {
    "setFailedStateName": {
      "parameters": [
        {
          "name": "stateName",
          "type": "string"
        }
      ]
    },
    "setSuccess": {
      "parameters": [
        {
          "name": "isSuccess",
          "type": "bool"
        }
      ]
    },
    "setNewStateName": {
      "parameters": [
        {
          "name": "stateName",
          "type": "string"
        }
      ]
    },
    "setPaymentData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": "object"
        }
      ]
    },
    "removePaymentData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        }
      ]
    }
  },
  "get": {
    "payment": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.payments.payment"
      }
    },
    "paymentAction": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.payments.paymentAction"
      }
    }
  }
}


*/

var constants = require("../../constants");
var softdecline = require("../../softdecline");
var _ = require("underscore");

function gatewayInteractionIsSoftDecline(paymentInteraction) {
  var result = _.contains(constants.SOFTDECLINE_CODES, paymentInteraction.gatewayResponseCode);
  return result;
}

function clearSoftDeclineCount(context, payment) {
  if (payment.Data && _.has(payment.Data, constants.SOFTDECLINECOUNT_KEY)) {
    context.exec.removePaymentData(constants.SOFTDECLINECOUNT_KEY);
  }
}

function getLatestPaymentInteraction(payment) {

  var orderedPaymentInteractions = _.sortBy(payment.interactions, function(i) {
    return i.interactionDate;
  });
  var latestPaymentInteraction = _.last(orderedPaymentInteractions);

  return latestPaymentInteraction;
}

module.exports = function(context, callback) {
  var paymentAction = context.get.paymentAction();
  var payment = context.get.payment();
  var order = context.get.order();

  console.log("Payment Action", paymentAction);
  console.log("Payment", payment);
  console.log("Order", order);
  console.log("apiContext", context.apiContext);

  var isStorefrontInitiated = context.get.isStorefrontInitiated();
  console.log('isStorefrontInitiated = ' + isStorefrontInitiated);
  if (!isStorefrontInitiated) {
    console.log('This is not storefront initiated.');
    return callback();
  }

  // not a soft decline payment type .. we don't do anything.
  if (!softdecline.isSoftDeclinePayment(payment, paymentAction)) {
    console.log('not a softdecline payment.');
    return callback();
  }

  var latestPaymentInteraction = getLatestPaymentInteraction(payment);

  // success, clear the softdecline count, and indicate we need a retry, with the original auth amount.
  if (latestPaymentInteraction.status.toUpperCase() === "AUTHORIZED") {
    console.log('interaction was AUTHORIZED, so nothing to do.');
    clearSoftDeclineCount(context, payment);

    var preAuthAmount = (!payment.Data || !_.has(payment.Data, constants.PRE_AUTH_AMOUNT_KEY)) ? 0 : payment.Data[constants.PRE_AUTH_AMOUNT_KEY];
    console.log('Pre auth amount was - ' + preAuthAmount);
    if (paymentAction.amount === preAuthAmount) {
      console.log('interaction amount was less than 1, so get the original auth amount.');
      var originalAuthAmount = softdecline.getOriginalAuthAmount(payment);
      context.exec.setActionAmount(originalAuthAmount);
      context.exec.setRetryFlag(true);

      context.exec.setActionPreAuthFlag(false);
    }

    return callback();
  }

  // hard decline, clear the softdecline count, nothing else to do.
  if (latestPaymentInteraction.status.toUpperCase() === "DECLINED" &&
    !gatewayInteractionIsSoftDecline(latestPaymentInteraction)) {
    console.log('interaction was hard DECLINED, so nothing to do.');
    clearSoftDeclineCount(context, payment);
    return callback();
  }

  // soft decline.
  if (latestPaymentInteraction.status.toUpperCase() === "DECLINED" &&
    gatewayInteractionIsSoftDecline(latestPaymentInteraction) &&
    softdecline.shouldSoftDecline(payment)) {

    var retryCount = (!payment.Data || !_.has(payment.Data, constants.SOFTDECLINECOUNT_KEY)) ? 0 : payment.Data[constants.SOFTDECLINECOUNT_KEY];
    var newRetryCount = retryCount + 1;
    context.exec.setPaymentData(constants.SOFTDECLINECOUNT_KEY, newRetryCount);

    // soft decline
    if (retryCount < constants.RETRYCOUNT) {
      console.log('interaction is a soft decline with retryCount=' + newRetryCount);
      context.exec.setFailedStateName("New");
      return callback();
    }

    // soft decline 4th time
    if (retryCount == constants.RETRYCOUNT) {
      console.log('interaction is a soft decline, but treating as a successful Auth.');
      context.exec.setSuccessFlag(true);
      context.exec.setNewStateName("Authorized");
      return callback();

    }

  }

  return callback();
};