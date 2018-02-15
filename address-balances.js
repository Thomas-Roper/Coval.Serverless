module.exports = function(context, callback) {
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var Agent = coval.Agent
    var UserLib = coval.User
    var agent = new Agent(UserLib.Server)
    var multichain = agent.user.multichain.multichain.multichain

    var qs = context.request.query
    
    if (!qs.address) {
        callback(200,{err: 'no address provided'})
    } else {  
        //callback(200, multichain.getAddressBalances)
        multichain.getAddressBalances({address: qs.address}, function(err, val){
            callback(200, err || val, {'Access-Control-Allow-Origin': '*'})
        })
    }
}
