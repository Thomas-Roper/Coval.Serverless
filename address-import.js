module.exports = function(context, callback) {
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var Agent = coval.Agent
    var UserLib = coval.User
    var agent = new Agent(UserLib.Server)
    var multichain = agent.user.multichain.multichain

    var qs = context.request.query
    
    if (!qs.address) {
        callback(200,{err: 'no address provided'})
    } else {
        var rnd = Math.floor(Math.random() * (1000000 - 1) + 1)
        var name = "Emblem - "
        if (!qs.name) {
            name += rnd.toString()
        } else {
            name += qs.name
        }
        multichain.ImportAddress(qs.address, "emblem-import", function(err, info){
            var payload = {import: err || info, name: name}
            multichain.GrantPermissionToAddress(qs.address, "send,receive", function(err, result){
                payload.grant = err || result
                multichain.Issue(qs.address, name, 1, function(err, info){
                    payload.emblem = err || info
                    callback(200, payload, {'Access-Control-Allow-Origin': '*'})
                })                
            })
        })
    }
}
