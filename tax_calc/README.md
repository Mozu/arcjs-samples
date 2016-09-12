# tax_calc
### version 0.1.0

Special Tax Calculator

Implementation of a tax calculator using embedded.commerce.orders.price.after and setting the tax based on a tax code property.

This example calculates a tax of 10.275% on for products with a certain tax code, regardless of where the customers resides.

To get this sample to work, you must add an attribute call "Tax Code" with the FQN of 'tenant~tax-code'.  
There must be at least one list item added to the attribute: 'MN-Amusement-Tax'

To have the Minnesota Amusement tax calculated, you must do the following to the products you wish to have this tax calculation performed:
   1) Uncheck the "Taxable" field in the product.  This is so the default tax will not be calculated.
   2) In the Tax Code property, Select the Tax code value 'MN Amusement Tax'

The tax is not computed if the customer is tax exempt.

You will also need to update the file mozu.config.json and enter in your developer account, developer account id, and application key.

Please see the Mozu Arc.JS documenation at https://www.mozu.com/docs/developer/arcjs-guides/quickstart.htm for more help installing and working with Arc.JS applications.