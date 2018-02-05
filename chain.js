module.exports = async function(context) {
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
    var path = require("path")
    require("dotenv").config({path: path.join('/usr/src/app', "test.env")})
    var Chainlib = require("coval.js/build/transport/Multichain")
    var Multichain = Chainlib.Multichain
    var MultichainConnection = Chainlib.MultichainConnection
    var multichain = makeConnectedMultichainObject()
        /* return multichain.Info(function(err, info){ */
            var i = multichain.Info(function(err, info){return err})
            return {
                status: 200,
                body: 
                JSON.stringify({ 
                    script: 'chain',
                    chain: multichain,
                    /* req: context.request.query  */
                },null,4),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        /* }) */
    

}