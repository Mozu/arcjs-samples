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