module.exports = function(context, callback) {

    var path = require("path")
    var Chainlib = require("coval.js/build/transport/Multichain")
    var Multichain = Chainlib.Multichain
    var MultichainConnection = Chainlib.MultichainConnection
    var multichain = makeConnectedMultichainObject()
    var os = require( 'os' )
    var networkInterfaces = os.networkInterfaces()
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
    multichain.Info(function(err, info) {
        console.log(info)
        callback(200, {msg: 'using env vars', payload: info, err: err})
    })
    

}
