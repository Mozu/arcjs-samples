(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.index = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  
  'embedded.commerce.carts.addItem.before': {
      actionName: 'embedded.commerce.carts.addItem.before',
      customFunction: require('./domains/commerce.carts/embedded.commerce.carts.addItem.before')
  },
  
  'embedded.commerce.carts.updateItem.after': {
      actionName: 'embedded.commerce.carts.updateItem.after',
      customFunction: require('./domains/commerce.carts/embedded.commerce.carts.updateItem.after')
  }
};

},{"./domains/commerce.carts/embedded.commerce.carts.addItem.before":2,"./domains/commerce.carts/embedded.commerce.carts.updateItem.after":3}],2:[function(require,module,exports){
/**
 * Implementation for embedded.commerce.carts.addItem.before

 * This custom function will receive the following context object:
{
  "exec": {
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
        "type": "mozu.commerceRuntime.contracts.cart.cart"
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
        "type": "mozu.commerceRuntime.contracts.cart.cart"
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
          "optional": true,
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
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
          "optional": true,
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
      }
    },
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
          "optional": true,
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
      }
    },
    "removeItem": {
      "parameters": [
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cart"
      }
    }
  },
  "get": {
    "cart": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cart"
      }
    },
    "cartItem": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
      }
    }
  }
}


 */
var QuantityService = require('../../quantityservice');

module.exports = function(context, callback) {
  console.info("Before Add Item to Cart Routine");
  var quantityService = new QuantityService (context, callback);

  try {
    quantityService.checkMaxQuantity (context.get.cartItem());
    callback();
  } catch (err) {
    callback(err);
  }  
};
},{"../../quantityservice":4}],3:[function(require,module,exports){
/**
 * Implementation for embedded.commerce.carts.updateItem.before

 * This custom function will receive the following context object:
{
  "exec": {
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
        "type": "mozu.commerceRuntime.contracts.cart.cart"
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
        "type": "mozu.commerceRuntime.contracts.cart.cart"
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
          "optional": true,
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
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
          "optional": true,
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
      }
    },
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
          "optional": true,
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
      }
    },
    "removeItem": {
      "parameters": [
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cart"
      }
    }
  },
  "get": {
    "cart": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cart"
      }
    },
    "cartItem": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.cart.cartItem"
      }
    }
  }
}


 */

var QuantityService = require('../../quantityservice');

module.exports = function(context, callback) {
  console.info("After Update Item to Cart Routine");
  var quantityService = new QuantityService (context, callback);

  try {
    quantityService.checkMaxQuantity (context.get.cartItem());
    callback();
  } catch (err) {
    callback(err);
  }  

};
},{"../../quantityservice":4}],4:[function(require,module,exports){
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