module.exports = function(context, callback) {

    var path = require("path")
    var Chainlib = require("coval.js/build/transport/Multichain")
    var Multichain = Chainlib.Multichain
    var MultichainConnection = Chainlib.MultichainConnection
    var multichain = makeConnectedMultichainObject()
    var qs = context.request.query

    function makeConnectionFromEnv() {
        return new MultichainConnection(
            Number(process.env.MULTICHAINport), 
            process.env.MULTICHAINhost, 
            process.env.MULTICHAINuser, 
            process.env.MULTICHAINpass
        )
    }
    function makeConnectedMultichainObject() {
        return new Multichain(process.env.MULTICHAINADDRESS, makeConnectionFromEnv())
    }
    

    if (!qs.address) {
        callback(200,{err: 'no address provided'})
    } else {
        var payload = {}
        multichain.GrantPermissionToAddress(qs.address, "send,receive", function(err, result){
            payload.grant = result
            callback(200, payload)
        })       
    }
}
