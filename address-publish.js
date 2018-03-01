module.exports = function(context, callback) {
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var Agent = coval.Agent
    var UserLib = coval.User
    var agent = new Agent(UserLib.Server)
    var multichain = agent.user.multichain.multichain.multichain
    const stringBody = JSON.stringify(context.request.body)
    const body = JSON.parse(stringBody)
    var qs = context.request.query
    
     if (!qs.data && !body.data) {
        callback(200,{err: 'no data provided'})
    } else if(!qs.name&& !body.name) {
        callback(200,{err: 'no name provided'})
    } else if(!qs.type&& !body.type) {
        callback(200,{err: 'no type provided'})
    } else {  
        //callback(200, multichain.getAddressBalances)
        multichain.publish({stream: "emblems", key: (qs.name || body.name) +":"+ (qs.type || body.type) , data: qs.data || body.data  }, function(err, val){
            callback(200, err || val, {'Access-Control-Allow-Origin': '*'})
        })
    }
}
