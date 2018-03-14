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
    
    if (!qs.stream_key && !body.stream_key) {
        callback(200,{err: 'no stream_key provided'})
    } else {  
        //callback(200, multichain.getAddressBalances)
        multichain.listStreamKeyItems({stream: "emblems", key: (qs.stream_key || body.stream_key) }, function(err, val){
            if (val[0].data) {
                val[0].decoded = hex2a(val[0].data)
            }
            callback(200, err || val, {'Access-Control-Allow-Origin': '*'})
        })
    }
    function hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}
