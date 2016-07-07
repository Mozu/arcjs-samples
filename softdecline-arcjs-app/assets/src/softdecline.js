var constants = require("./constants");
var _ = require("underscore");
var orderClient = require("mozu-node-sdk/clients/commerce/order")();

module.exports = {

  isSoftDeclinePayment: function(payment, paymentAction) {

    if (!paymentAction.ActionName || !_.contains(["AUTHORIZEPAYMENT"], paymentAction.ActionName.toUpperCase())) {
      return false;
    }

    var isCreditCard = payment.PaymentType && payment.PaymentType.toUpperCase() === "CREDITCARD";
    if (!isCreditCard) {
      return false;
    }

    return true;

  },

  shouldSoftDecline: function(payment) {

    var shouldSoftDecline = !payment.Data || !_.has(payment.Data, constants.SOFTDECLINECOUNT_KEY) ||
      payment.Data[constants.SOFTDECLINECOUNT_KEY] <= constants.RETRYCOUNT;

    return shouldSoftDecline;
  },

  getSoftDeclineCount: function(payment){

    var count = ( payment.Data && _.has(payment.Data, constants.SOFTDECLINECOUNT_KEY) ) ? payment.Data[constants.SOFTDECLINECOUNT_KEY] : 0;

    return count;
  },

  getOriginalAuthAmount: function(payment){

    var originalAmount = ( payment.Data && _.has(payment.Data, constants.ORIGINAL_AUTH_AMOUNT_KEY) ) ? payment.Data[constants.ORIGINAL_AUTH_AMOUNT_KEY] : null;
    return originalAmount;

  },

  isOfflineOrder: function(orderId) {
    return orderClient.getOrder({
        orderId: orderId
      })
      .then(function(order) {
        console.log('Retrieved order ' + order.id);
        console.log('Order type =' + order.type);
        return order.type.toUpperCase() === "OFFLINE";
      });
  }

};