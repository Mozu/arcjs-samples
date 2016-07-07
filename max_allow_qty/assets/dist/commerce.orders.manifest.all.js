(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  
  'embedded.commerce.orders.createFromCart.before': {
      actionName: 'embedded.commerce.orders.createFromCart.before',
      customFunction: require('./domains/commerce.orders/embedded.commerce.orders.createFromCart.before')
  }
};

},{"./domains/commerce.orders/embedded.commerce.orders.createFromCart.before":2}],2:[function(require,module,exports){
/**
 * Implementation for embedded.commerce.orders.createFromCart.before

 * This custom function will receive the following context object:
{
  "exec": {
    "setItemAllocation": {
      "parameters": [
        {
          "name": "allocationId",
          "type": "number"
        },
        {
          "name": "expiration",
          "type": "date"
        },
        {
          "name": "productCode",
          "type": "string"
        },
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.orderItem"
      }
    },
    "setAttribute": {
      "parameters": [
        {
          "name": "fqn",
          "type": "string"
        },
        {
          "name": "values",
          "type": "object"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "removeAttribute": {
      "parameters": [
        {
          "name": "fqn",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "setData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": "object"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "removeData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "setItemData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": "object"
        },
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.orderItem"
      }
    },
    "removeItemData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.orderItem"
      }
    },
    "setDutyAmount": {
      "parameters": [
        {
          "name": "dutyAmount",
          "type": "number"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    }
  },
  "get": {
    "order": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.orders.order"
      }
    }
  }
}


 */

var QuantityService = require('../../quantityservice');

module.exports = function(context, callback) {
  console.info("Before Create From Cart Routine");
  var quantityService = new QuantityService (context, callback);

  var order = context.get.order();
  try {
    quantityService.checkCreateOrderMaxQty (order);    
    callback();
  } catch (err) {
    callback(err);
  }  
};
},{"../../quantityservice":3}],3:[function(require,module,exports){
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
},{}]},{},[1])(1)
});