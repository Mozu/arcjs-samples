# mozu-softdeclinesample

## version 0.1.0

### Steps to Install

1. In Dev center create an application for softdecline.
2. git pull <repo url>
3. edit mozu.config.json values for the enviorment, dev account and app (created in step 1).
4. open command prompt, cd to the directory in step 2.
5. npm install
6. grunt
7. Step 5, would have uploaded the app to Dev Center. Now install the app to a sandbox.

### Test mode config

<code>
	{
            "applicationKey": "yourApplicationKey", // The application key for the application created in Step 1.
            "configuration": { 
                "isTestMode": true,
                "zeroDollarAuthAmount": 0.06 // VISA cardtype amount. Add 1 to it for other card types. Reason Code: 200
            }
	}
</code>

Navigate to System Administration -> Action Management -> Place the above json in the <configurations> array.

The possible values for the field "zeroDollarAuthAmount" is documented there - http://vconfluence/display/Product/CyberSource


