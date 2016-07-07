/**
 * Implementation for embedded.commerce.payments.action.before

 * This custom function will receive the following context object:
{
  "exec": {
    "setActionAmount": {
      "parameters": [
        {
          "name": "amount",
          "type": "number"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.payments.paymentAction"
      }
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

To simulate a soft decline, in case of cybersource, we need to pass certain order totals to the payment gateway.
Which means we cannot do a zero or a one dollar Auth. So if this flag is set, we pass the actual amount through for every auth.
{
            "applicationKey": "yourApplicationKey", // The application key for the application that contains the actions
            "configuration": { 
                "isTestMode": true,
                "zeroDollarAuthAmount": "0.06"// VISA cardtype amount. Add 1 to it for other card types. Reason Code: 200
            }
}


 */

var constants = require("../../constants");
var softdecline = require("../../softdecline");
var _ = require("underscore");


module.exports = function(context, callback) {
  var paymentAction = context.get.paymentAction();
  var payment = context.get.payment();
  var order = context.get.order();

  console.log('entering softdecline.');

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

  if (!softdecline.isSoftDeclinePayment(payment, paymentAction)) {
    console.log('not a softdecline payment.');
    return callback();
  }

  if (!softdecline.shouldSoftDecline(payment)) {
    console.log('cannot softdecline because retries exceeded.');
    return callback();
  }

  var originalAuthAmount = softdecline.getOriginalAuthAmount(payment);
  if (!originalAuthAmount) {
    console.log('saving original authorize amount.');
    context.exec.setPaymentData(constants.ORIGINAL_AUTH_AMOUNT_KEY, paymentAction.amount);
  }

  // set 1 dollar as the amount for Auth for cards other than Visa. Visa is 0 dollar.
  var authAmount = 1;
  if (payment.billingInfo.card.paymentOrCardType.toUpperCase() === "VISA") {
    authAmount = 0;
  }


  if (softdecline.getSoftDeclineCount(payment) >= 3) {
    console.log('setting original amount for auth.');
    authAmount = softdecline.getOriginalAuthAmount(payment);

    // since this is no longer a pre auth, if it's the fourth time round.
    context.exec.setActionPreAuthFlag(false);
  } else {
    context.exec.setActionPreAuthFlag(true);
  }

  // testmode 
  if (context.configuration && context.configuration.isTestMode && context.configuration.zeroDollarAuthAmount) {
    console.log('App is running in TestMode');

    // in test mode, pass in the configured amount.
    if (softdecline.getSoftDeclineCount(payment) < 3) {
      authAmount = Number(context.configuration.zeroDollarAuthAmount);
      if (payment.billingInfo.card.paymentOrCardType.toUpperCase() !== "VISA") {
        authAmount = authAmount + 1;
      }
    }

  }

  console.log('setting auth amount to ' + authAmount);
  context.exec.setPaymentData(constants.PRE_AUTH_AMOUNT_KEY, authAmount);
  context.exec.setActionAmount(authAmount);
  console.log('exiting softdecline.');
  return callback();
};