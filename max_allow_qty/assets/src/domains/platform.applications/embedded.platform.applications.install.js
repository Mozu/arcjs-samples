/**
 * Implementation for embedded.platform.applications.install

 * This custom function will receive the following context object:
{
  "exec": {
    "saveInstallationState": {
      "parameters": [
        {
          "type": "object"
        }
      ]
    }
  },
  "get": {
    "applicationKey": {
      "parameters": [],
      "return": {
        "type": "string"
      }
    },
    "exports": {
      "parameters": [],
      "return": {
        "type": "object"
      }
    },
    "installationState": {
      "parameters": [],
      "return": {
        "type": "object"
      }
    },
    "tenant": {
      "parameters": [],
      "return": {
        "type": "object"
      }
    },
    "nameSpace": {
      "parameters": [],
      "return": {
        "type": "string"
      }
    }
  }
}


 */

var ActionInstaller = require('mozu-action-helpers/installers/actions');

module.exports = function(context, callback) {
  var installer = new ActionInstaller({ context: context.apiContext });
  installer.enableActions(context).then(callback.bind(null, null), callback);
};