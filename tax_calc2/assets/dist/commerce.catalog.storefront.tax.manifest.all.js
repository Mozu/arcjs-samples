(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  
  'http.commerce.catalog.storefront.tax.estimateTaxes.before': {
      actionName: 'http.commerce.catalog.storefront.tax.estimateTaxes.before',
      customFunction: require('./domains/commerce.catalog.storefront.tax/http.commerce.catalog.storefront.tax.estimateTaxes.before')
  },
  
  'http.commerce.catalog.storefront.tax.estimateTaxes.after': {
      actionName: 'http.commerce.catalog.storefront.tax.estimateTaxes.after',
      customFunction: require('./domains/commerce.catalog.storefront.tax/http.commerce.catalog.storefront.tax.estimateTaxes.after')
  }
};

},{"./domains/commerce.catalog.storefront.tax/http.commerce.catalog.storefront.tax.estimateTaxes.after":2,"./domains/commerce.catalog.storefront.tax/http.commerce.catalog.storefront.tax.estimateTaxes.before":3}],2:[function(require,module,exports){
/**
 * Implementation for http.commerce.catalog.storefront.tax.estimateTaxes.after
 * 
 * 
 * HTTP Actions all receive a similar context object that includes `request` and
 * `response` objects. These objects are similar to http.IncomingMessage objects
 * in NodeJS.
 *  { configuration: {}, request: http.ClientRequest, response:
 * http.ClientResponse }
 * 
 * Call `response.end()` to end the response early. Call
 * `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 * 
 * The `request` and `response` objects are both Streams and you can read data
 * out of them the way that you would in Node.
 * 
 */

module.exports = function(context, callback) {
	console.info("Start: storefront.tax.estimateTaxes.after");
	var taxOrderInfo = context.request.body;
	console.info("request.body: %j", taxOrderInfo);
	console.info("response.body: %j", context.response.body);

	callback();
};
},{}],3:[function(require,module,exports){
/**
 * Implementation for http.commerce.catalog.storefront.tax.estimateTaxes.before
 * 
 * 
 * HTTP Actions all receive a similar context object that includes `request` and
 * `response` objects. These objects are similar to http.IncomingMessage objects
 * in NodeJS. { configuration: {}, request: http.ClientRequest, response:
 * http.ClientResponse }
 * 
 * Call `response.end()` to end the response early. Call
 * `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 * 
 * The `request` and `response` objects are both Streams and you can read data
 * out of them the way that you would in Node.
 * 
 */

module.exports = function(context, callback) {
	console.info("Start: storefront.tax.estimateTaxes.before");
	var taxOrderInfo = context.request.body;
	console.info("request: %j", context.request);
	console.info("request.body: %j", taxOrderInfo);
	console.info("response: %j", context.response);
	console.info("Order #: " + taxOrderInfo.OrderNumber);

	var responseBody = {
		"itemTaxContexts" : [],
		"shippingTax" : 0.00,
		"handlingFeeTax" : 0.00,
		"orderTax" : 0.00
	};

	// make sure to get current tax so we can add to the total.
	var orderTotalTax = 0.0;
	// for each
	if (taxOrderInfo.LineItems && taxOrderInfo.LineItems.length > 0) {
		var itemTaxAmount = 0.00;
		for (var i = 0; i < taxOrderInfo.LineItems.length; i++) {
			var lineItem = taxOrderInfo.LineItems[i];
			console.info("LineItemPrice: " + lineItem.LineItemPrice);
			// Only apply special tax to people in Minnesota!! Skip Tax
			// exempt
			if (taxOrderInfo.TaxContext.DestinationAddress.StateOrProvince == 'MN' && 
					!taxOrderInfo.TaxContext.TaxExemptId &&  
					lineItem.IsTaxable) {

				itemTaxAmount = lineItem.LineItemPrice * 0.10275;
				console.info("Adding a item tax Amount of: " + itemTaxAmount);
			} else {
				console.info("No tax for this state (or tax exempt customer). Tax State: " + 
						taxOrderInfo.TaxContext.DestinationAddress.StateOrProvince);
			}
			responseBody.itemTaxContexts.push({
				"id" : lineItem.Id,
				"productCode" : lineItem.ProductCode,
				"quantity" : lineItem.Quantity,
				"tax" : itemTaxAmount.toFixed(2),
				"shippingTax" : 0.0
			});
			orderTotalTax += itemTaxAmount;
		}
		responseBody.orderTax = orderTotalTax.toFixed (2);

		console.info("End: storefront.tax.estimateTaxes.before. Total Tax = " + orderTotalTax);
	} 
	console.info ("%j", responseBody);
	context.response.body = responseBody;
    //call end to return this reponse and to skip calling the built in mozu route which would over write this.
    context.response.end();
};
},{}]},{},[1])(1)
});