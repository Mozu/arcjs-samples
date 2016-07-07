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