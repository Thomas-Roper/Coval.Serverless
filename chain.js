module.exports = function(context, callback) {

    var Chainlib = require("coval.js/build/transport/Multichain")
    var Multichain = Chainlib.Multichain
    var MultichainConnection = Chainlib.MultichainConnection
    var multichain = makeConnectedMultichainObject()
    

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

    if (!process.env.MC || !process.env.MULTICHAINport || !process.env.MULTICHAINADDRESS || !process.env.MULTICHAINuser || !process.env.MULTICHAINpass) {
        callback(200, {err: 'Multichain Env Vars are missing'})
    } else {
        multichain.Info(function(err, info) {
            callback(200, info)
        })
    }
    

}
