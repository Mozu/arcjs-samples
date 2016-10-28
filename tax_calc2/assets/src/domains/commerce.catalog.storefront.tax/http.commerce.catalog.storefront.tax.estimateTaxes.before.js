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

	// if the destination is not MN, calculate using the default tax engine.
	if (taxOrderInfo.TaxContext.DestinationAddress.StateOrProvince === 'MN') {
		calculateMnTax(taxOrderInfo, function (responseBody){
			console.info("%j", responseBody);
			context.response.body = responseBody;
			// call end to return this reponse and to skip calling the built in mozu
			// route which would over write this.
			context.response.end();
			console.info("Special MN Taxing for this state! Tax State: " +
					taxOrderInfo.TaxContext.DestinationAddress.StateOrProvince);

			callback();
		});
	} else {
		console.info("Using default Taxing for this state! Tax State: " + 
				taxOrderInfo.TaxContext.DestinationAddress.StateOrProvince);
		callback();
	}
};

function calculateMnTax(taxOrderInfo, callback) {
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
			if (!taxOrderInfo.TaxContext.TaxExemptId && lineItem.IsTaxable) {

				itemTaxAmount = lineItem.LineItemPrice * 0.10275;
				console.info("Adding a item tax Amount of: " + itemTaxAmount);
			} else {
				console.info("Tax exempt customer (or item).  TaxID: " +
						taxOrderInfo.TaxContext.TaxExemptId);
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
		responseBody.orderTax = orderTotalTax.toFixed(2);

		console.info("End: storefront.tax.estimateTaxes.before. Total Tax = " + orderTotalTax);
	}
	callback(responseBody);
}