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
    

    if (!qs.address /* || ip_parts[0] != 10 */) {
        callback(409,{})
    } else {
        //var rnd = Math.floor(Math.random() * (1000000 - 1) + 1)
        //var payload = {}
        multichain.ImportAddress(qs.address, "emblem-", function(err, result){
            //payload.import = result
            //multichain.GrantPermissionToAddress(qs.address, "send,receive", function(err, result){
            //    payload.grant = result
                callback(200, {script: 'import address', err: err, result: result} )
            //})
        })        
    }

    /* multichain.Info(function(err, info){
        callback(200, {i: networkInterfaces} )
    }) */
}
