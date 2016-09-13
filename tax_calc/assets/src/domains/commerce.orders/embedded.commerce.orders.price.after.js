/**
 * Implementation for embedded.commerce.orders.price.after
 * 
 * This is an example of calculating a special tax.  
 * 
 * To get this sample to work, you must add an attribute call "Tax Code" with the FQN of 'tenant~tax-code'.  
 * There must be at least one list item added to the attribute: 'MN-Amusement-Tax'

 * To have the Minnesota Amusement tax calculated, you must do the following to the products you wish to have this tax calculation performed:
 *    1) Uncheck the "Taxable" field in the product.  This is so the default tax will not be calculated.
 *    2) In the Tax Cpde property, Select the Tax code value 'MN Amusement Tax'
 *
 */

module.exports = function(context, callback) {
  console.info("Start: Order Price After Arc.JS");

  var order = context.get.order();
  console.info("Order #: " + order.orderNumber);

  // If the customer is tax exempt, do not calculate the tax.
  if (order.isTaxExempt) {
    console.info("Customer is tax exempt. No tax calculated");
    return callback();
  }

  // make sure to get current tax so we can add to the total.
  var orderDutyAmount = 0.0;
  // for each
  if (order.items && order.items.length > 0) {
    for (var i = 0; i < order.items.length; i++) {
      var properties = order.items[i].product.properties;
      var mnTax = 0.00;
      for (var j = 0; j < properties.length; j++) {
        console.info("property FQN: " + properties[j].attributeFQN);

        // Calculate Minnesota amusement tax baded on the discounted price.
        if (properties[j].attributeFQN == 'tenant~tax-code' && properties[j].values[0].value == "MN-Amusement-Tax") {
            itemDutyAmount = order.items[i].discountedTotal * 0.10275;
            console.info("Adding a dutyAmount of: " + itemDutyAmount);
            mnTax += itemDutyAmount;
        }
      }

      if (mnTax <= 0.00 && order.items[i].itemTaxTotal > 0.00) {
        orderDutyAmount += order.items[i].itemTaxTotal;
      } else {
        orderDutyAmount += mnTax;
      }
    }
    context.exec.setDutyAmount(orderDutyAmount);
  }

  console.info("End: Order Price After Arc.JS. Duty Amount = " + orderDutyAmount);

  return callback();
};