
module.exports = async function(context) {
    var Coval = require('coval.js').Coval
    var rp = require('request-promise-native');
    var coval = new Coval()
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var Unloq = coval.Partner.Unloq
    var agent = new Agent(UserLib.Server)
    //var key = agent.Generate()
    //var shares = agent.Split(2, 2, 256)
    var qs = context.request.query
    var shares = []
    
    if (!qs.my_share || !qs.id_share) {
        return {
            status: 200,
            body: {error: 'Need to specify shares'},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    shares.push(qs.my_share)
    shares.push(qs.id_share)
    var combined = agent.Combine(shares)
    var response = await rp('http://35.185.104.148/decrypt?key='+combined.GetValue())
    return {
        status: 200,
        body: 
        JSON.stringify({ 
            my_share: qs.my_share, 
            id_share: qs.id_share,
            payload: {
                keys: JSON.parse(response).keys,
                address: JSON.parse(response).address
            }
            /* agent: agent, */
            /* combined: combined, */
            /* req: context.request.query  */
        },null,4),
        headers: {
            'Content-Type': 'application/json'
        }
    }
}