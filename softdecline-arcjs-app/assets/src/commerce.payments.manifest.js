module.exports = {
  
  'embedded.commerce.payments.action.before': {
      actionName:'embedded.commerce.payments.action.before',
      customFunction: require('./domains/commerce.payments/embedded.commerce.payments.action.before')
   },
  
  'embedded.commerce.payments.action.after': {
      actionName:'embedded.commerce.payments.action.after',
      customFunction: require('./domains/commerce.payments/embedded.commerce.payments.action.after')
   }
  
};