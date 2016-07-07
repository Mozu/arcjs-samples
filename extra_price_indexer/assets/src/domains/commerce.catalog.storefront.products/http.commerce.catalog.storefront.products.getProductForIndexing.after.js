/**
 * Implementation for http.commerce.catalog.storefront.products.getProductForIndexing.after


 * HTTP Actions all receive a similar context object that includes
 * `request` and `response` objects. These objects are similar to
 * http.IncomingMessage objects in NodeJS.

{
  configuration: {},
  request: http.ClientRequest,
  response: http.ClientResponse
}

 * Call `response.end()` to end the response early.
 * Call `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 * 
 * The `request` and `response` objects are both Streams and you can read
 * data out of them the way that you would in Node.

 */

var PriceHelper = require('../PriceHelper');
var NO_RANGE_PRICE = -0.01;
module.exports = function (context, callback) {
    console.info('Start getProductForIndexing.after ');

    var product;

    if (context.response.status !== 200) {
        return callback();
    }
    product = context.response.body;
    if (!product || (product.productUsage != 'Standard'  && !product.options)) {
	    console.info('Exiting getProductForIndexing because it does not have options or is not a standard product.');
        return callback();
    }
    console.info("Product Usage: " + product.productUsage);

    if (product.options.length > 0) {
	    console.info('Found some options to process for product: ' + product.productCode);
    	var i = 0;
    	var totalLowPrice = NO_RANGE_PRICE;
    	var totalHighPrice = NO_RANGE_PRICE;
    	var defaultPriceAdded = 0.00;
    	var extras = product.options;
   		var lowPrice = 0.00;
   		var highPrice = 0.00;
	    console.info('Extra length: ' + extras.length);
	    for (i = 0; i < extras.length; i++) {
		    console.info('Extra.isRequired? ' + extras[i].isRequired);
		    // find the required extras and add them to a list.
	    	if (extras[i].attributeDetail.usageType === "Extra") {

    			// only add if the product is required.
		    	if (extras[i].isRequired && extras[i].values && extras[i].values.length > 0) {
				    console.info('Found an extras that is required!' );
		    		var optionValues = extras[i].values;
			   		lowPrice = 0.00;
   					highPrice = 0.00;
		    		// find the lowest and highest delta prices for the extra.
		    		for (var j = 0; j < optionValues.length; j++) {
		    			if (optionValues[j].isDefault) {
		    				// if there is a default, the  price is set already added to the total product price.  We'll need to subtract it our later.
		    				defaultPriceAdded = optionValues[j].deltaPrice;
		    			}
		    			if (lowPrice === 0.00 || optionValues[j].deltaPrice < lowPrice ) {
		    				lowPrice = optionValues[j].deltaPrice;
		    			}
		    			if (optionValues[j].deltaPrice > highPrice) {
		    				highPrice = optionValues[j].deltaPrice;
		    			}
		    		}
					console.info("Before Calc:Total High Price: " + totalHighPrice + ";High Price: " + highPrice);
					console.info("Before Calc:Total Low Price: " + totalLowPrice + ";Low Price: " + lowPrice);
		    		totalHighPrice = totalHighPrice > NO_RANGE_PRICE ? totalHighPrice + highPrice : highPrice;
		    		totalLowPrice = totalLowPrice > NO_RANGE_PRICE ? totalLowPrice + lowPrice : lowPrice;
					console.info("After Calc: Total High Price: " + totalHighPrice + ";High Price: " + highPrice);
		    	}
		    }
	    }
		console.info("High Price: " + totalHighPrice + ";Low Price: " + totalLowPrice);

	    // check to see if we found a range while going through the extras price.
	    if (totalLowPrice != NO_RANGE_PRICE  && totalHighPrice != NO_RANGE_PRICE && totalHighPrice != totalLowPrice) {
		    console.info("add the range to product index!");
	    	var basePrice = 0.00;

	    	if (product.price) {
	    		if (product.price.salePrice) {
	    			basePrice = product.price.salePrice;
	    		} else {
	    			basePrice = product.price.price;
	    		}
	    		basePrice = basePrice - defaultPriceAdded;
	    	}

	    	totalLowPrice = basePrice + totalLowPrice;
	    	totalHighPrice = basePrice + totalHighPrice;
			console.info("High Price w basePrice: " + totalHighPrice + ";Low Price w basePrice: " + totalLowPrice);

	    	product.price = null;
	    	product.priceRange = {
			  "lower": {
			   "price": totalLowPrice,
			   "salePrice": totalLowPrice,
			   "priceType": "List",
			   "catalogListPrice": lowPrice
			  },
			  "upper": {
			   "price": totalHighPrice,
			   "salePrice": totalHighPrice,
			   "priceType": "List",
			   "catalogListPrice": totalHighPrice
			  }
		   };
		}
	}
    console.info('End getProductForIndexing.after...before callback');
    callback();
};
