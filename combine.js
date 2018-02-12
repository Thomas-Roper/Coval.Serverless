
module.exports = async function(context) {
    var Coval = require('coval.js').Coval
    var rp = require('request-promise-native');
    var coval = new Coval()
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var ManyKeys = require('coval.js/build/secure/ManyKeys')
    var agent = new Agent(UserLib.Server)
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

    var combined = agent.user.Combine(shares)
    var response = await rp('http://35.224.43.101/decrypt?key='+combined.GetValue())
    var many_keys = new ManyKeys.ManyKeys(combined.GetValue())
    var payload = {
        keys: JSON.parse(response).keys,
        address: JSON.parse(response).address,
    }
    payload.addresses = many_keys.GetAllAddresses()
    return {
        status: 200,
        body: 
        JSON.stringify({ 
            my_share: qs.my_share, 
            id_share: qs.id_share,
            payload: payload
        },null,4),
        headers: {
            'Content-Type': 'application/json'
        }
    }
}