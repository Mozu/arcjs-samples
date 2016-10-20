module.exports = {
  
  'http.commerce.catalog.storefront.shipping.requestRates.before': {
      actionName: 'http.commerce.catalog.storefront.shipping.requestRates.before',
      customFunction: require('./domains/commerce.catalog.storefront.shipping/http.commerce.catalog.storefront.shipping.requestRates.before')
  },
  
  'http.commerce.catalog.storefront.shipping.requestRates.after': {
      actionName: 'http.commerce.catalog.storefront.shipping.requestRates.after',
      customFunction: require('./domains/commerce.catalog.storefront.shipping/http.commerce.catalog.storefront.shipping.requestRates.after')
  }
};
