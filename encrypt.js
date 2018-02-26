module.exports = async function(context) {
    var qs = context.request.query
    var HDKey = require('coval.js/build/secure/HDKey').HDKey
    var hDKey = new HDKey()
    var encrypted = hDKey.MakeWalletFromNs(qs.key).GetValue()

    if (!qs.key) {
        return {
            status: 409
        }
    } else {
        return {
            status: 200,
            body: 
            JSON.stringify({ 
                script: 'encrypt',
                payload: encrypted,
            },null,4),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
}


