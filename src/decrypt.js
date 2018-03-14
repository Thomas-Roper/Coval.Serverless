//* TODO: make secure. This function takes key that's been passed by combine function and returns a decrypted private key object
module.exports = async function(context) {
    var qs = context.request.query
    var HDKey = require('coval.js/build/secure/HDKey').HDKey
    var hDKey = new HDKey()
    var wallet = hDKey.MakeWalletFromNs(qs.key).GetValue()
    var decrypted = hDKey.CreateKeysFromEncrypted(wallet.encrypted)
        decrypted.derived = JSON.parse(JSON.parse(JSON.stringify(decrypted.derived)))
        decrypted.pk = JSON.parse(JSON.parse(JSON.stringify(decrypted.pk)))

    if (!qs.key) {
        return {
            status: 409
        }
    } else {
        return {
            status: 200,
            body: 
            JSON.stringify({ 
                script: 'decrypted',
                keys: decrypted,
                address: wallet.address
            },null,4),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    
}
