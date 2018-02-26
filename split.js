module.exports = async function(context) {
    var rp = require('request-promise-native');
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var Secure = coval.Secure
    var ManyKeys = require('coval.js/build/secure/ManyKeys')
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var Unloq = coval.Partner.Unloq

    var agent = new Agent(UserLib.Server)
    var qs = context.request.query
    var key, key_action

    if (qs.key) {
        key = qs.key
        agent.user.SetKey(key)
        key_action = 'Loaded Entropy'
    } else {
        key = agent.user.Generate()
        key_action = 'Generated Entropy'
    }
    
    var shares = agent.user.Split(2, 2, 256)
    //generate encrypted key
    var response = await rp('http://35.224.43.101/encrypt?key='+key.GetValue())
    var many_keys = new ManyKeys.ManyKeys(key.GetValue())
    var payload = {}
    payload.encrypted = JSON.parse(response).payload.encrypted
    payload.addresses = many_keys.GetAllAddresses()
    payload.addresses.btc = JSON.parse(response).payload.address
    //backward compatability allows for this to be optional, 
    //providing the address makes the import call more secure 
    //by offloading that work to server agent
    if (qs.address) {
        var importCallResponse = await rp('http://35.224.43.101/address-import?address='+qs.address+'&name='+qs.name || null)
        payload.import_response = JSON.parse(importCallResponse)
        return returnPayload()
    } else {
        return returnPayload()
    }
    function returnPayload() {
        return {
            status: 200,
            body: 
            JSON.stringify({ 
                my_share: shares.GetValue()[0], 
                id_share: shares.GetValue()[1],
                payload: payload,
                key_action: key_action,
            },null,4),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    }
}