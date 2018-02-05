module.exports = async function(context) {
    var HDKey = require('coval.js/build/secure/HDKey')
    var hDKey = new HDKey()
    //var coval = new Coval()
    var fromNs, from
    //var HDKey = coval.Secure
    /* var hdKey = new HDKey()
    var qs = context.request.query
    fromNs = hdKey.MakeNamespace(createReqMock("mocha", "test", "from"))
    from = hdKey.MakeWalletFromNs(fromNs) */
    return {
        status: 200,
        body: 
        JSON.stringify({ 
            script: 'address',
            HDKey: HDKey,
            fromNs: fromNs,
            from: from
            /* req: context.request.query  */
        },null,4),
        headers: {
            'Content-Type': 'application/json'
        }
    }
}