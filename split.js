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
    var payload = {}
    var whitelist = [
        "bitcoin",
        "bitcoincash",
        "bitcoindark",
        "bitcoingold",
        "blackcoin",
        "blocknet",
        "canadaecoin",
        "coval",
        "dash",
        "digibyte",
        "dogecoin",
        "dogecoindark",
        "emercoin",
        "feathercoin",
        "florincoin",
        "gridcoinresearch",
        "gulden",
        "litecoin",
        "magicoin",
        "myriadcoin",
        "namecoin",
        "navcoin",
        "neoscoin",
        "paccoin",
        "particl",
        "peercoin",
        "pinkcoin",
        "pivx",
        "potcoin",
        "primecoin",
        "reddcoin",
        "riecoin",
        "stratis",
        "syscoin",
        "trezarcoin",
        "vcash",
        "vergecoin",
        "vertcoin",
        "viacoin",
        "Zcash"
    ]
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
    //generate encrypted seed
    var response = await rp('https://www.synrgtech.net/encrypt?key='+key.GetValue())
    payload.encrypted = JSON.parse(response).payload.encrypted
    var many_keys = new ManyKeys.ManyKeys(key.GetValue())
    var allAddresses = many_keys.GetAllAddresses()
    var unloq_key = await rp('https://www.synrgtech.net/request-unloq-key?unloq_id='+qs.unloq_id)
    
    payload.addresses = {}
    if (qs.unloq_id) {
        await whitelist.forEach(async function(item, index, arr) {
            if (allAddresses[item]) {
                var key = JSON.parse(JSON.parse(unloq_key).key)            
                var encrypted_address  = await rp('https://www.synrgtech.net/user-encrypt?key='+key.result.encryption_key+'&to_encrypt='+allAddresses[item].address)//encrypted_address
                payload.addresses[item] = {address:JSON.parse(encrypted_address).encrypted, unit: allAddresses[item].unit}
                
            }
        })
    } else {
        whitelist.forEach(async function(item, index, arr) {
            if (allAddresses[item]) {
                payload.addresses[item] = {address: allAddresses[item].address, unit: allAddresses[item].unit}
            }
        })
    }
    //backward compatability allows for this to be optional, 
    //providing the address makes the import call more secure 
    //by offloading that work to server agent
    if (qs.address) {
        var importCallResponse = await rp('https://www.synrgtech.net/address-import?address='+qs.address+'&name='+qs.name || null)
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