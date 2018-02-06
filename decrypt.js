module.exports = async function(context) {
    var qs = context.request.query
    var ip_parts = context.request.headers.host.split(':')[0].split('.')
    var HDKey = require('coval.js/build/secure/HDKey').HDKey
    var hDKey = new HDKey()
    var wallet = hDKey.MakeWalletFromNs(qs.key).GetValue()
    var decrypted = hDKey.CreateKeysFromEncrypted(wallet.encrypted)
        decrypted.derived = JSON.parse(JSON.parse(JSON.stringify(decrypted.derived)))
        decrypted.pk = JSON.parse(JSON.parse(JSON.stringify(decrypted.pk)))

    if (!qs.key /* || ip_parts[0] != 10 */) {
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
                /* req: context.request.query  */
            },null,4),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    
}
