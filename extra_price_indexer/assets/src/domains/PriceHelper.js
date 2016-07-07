//var sdk = require('mozu-node-sdk');

//var FiddlerProxy = require('mozu-node-sdk/plugins/fiddler-proxy');

//process.env.USE_FIDDLER = 'true'

var EntityClient = require('mozu-node-sdk/clients/platform/entitylists/entity');
var ProductAdminClient = require('mozu-node-sdk/clients/commerce/catalog/admin/attributedefinition/attribute');
var getAppInfo = require('mozu-action-helpers/get-app-info');

function PriceRangeFinder(context, cache) {
}

PriceRangeFinder.prototype.calculatePriceRangeForIndexing = function (option, product) {

    //get from cache or services..
    return this.getMap()
        .then(function (map) {

        var newProp = {
            attributeFQN: 'Tenant~size',
            values: [],
            isMultiValue : true,
            attributeDetail : map.attributeDetail
        };

        option.values.forEach(function (optionValue) {
            var mappedVal = map.sizeMap[optionValue.value];
            if (mappedVal && !newProp.values.some(function (element, index, array) { return element.value === mappedVal.id; })) {
                newProp.values.push({
                    value : mappedVal.id.toString(),
                    stringValue: mappedVal.solrSize.toString()
                });
            }
        });

        if (newProp.values.length) {
            product.properties.push(newProp);
        }
    });
};

module.exports = PriceRangeFinder;
