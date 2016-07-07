/**
 * Quantity Checking routines.
 */

 module.exports = function (context, callback) {
 	var self = this;
 	self.ctx = context;
 	self.cb = callback;

 	self.checkMaxQuantity = function (cartItem) {
    
	  if(cartItem.product) {
	    var properties;
	    var maxCartQuantity = 0;
	    console.info(cartItem.product.name);
	    properties = cartItem.product.properties;
	    if (properties) {
	      for (var i = 0;  i < properties.length; i++) {
	        console.info('propName: ' + properties[i].attributeFQN);
	        if (properties[i].attributeFQN === 'c367d49~max-cart-quantity') {
	          console.info("Max Cart Property: ");
	          console.info(properties[i]);
	          if (properties[i].values[0] && properties[i].dataType === 'Number') {
	            maxCartQuantity = properties[i].values[0].value;
	          }
	          break;
	        }
	      }
	    }
	    console.info('Max Qty: ' + maxCartQuantity);
	    console.info('Qty: ' + cartItem.quantity);
	    if (maxCartQuantity > 0 && cartItem.quantity > maxCartQuantity) {
	      var msg = 'You have exceeded the quantity allowed in your cart for ' + cartItem.product.name + '.  Max Quantity is: ' + maxCartQuantity;
	      console.warn (msg);
	      throw new Error(msg);
	    }
	  }
 	};

 	self.checkCreateOrderMaxQty = function (order) {
 		if (order.items) {
   		  var items = order.items;
    	  for (var j = 0; j < items.length; j++) {
      		this.checkMaxQuantity (items[j]);    
    	  }
  		}
 	};
 };