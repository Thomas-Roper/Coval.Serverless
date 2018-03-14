module.exports = async function(context) {
    var rp = require('request-promise-native');
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var Secure = coval.Secure
    var ManyKeys = require('coval.js/build/secure/ManyKeys')
    var SHA256 = require("crypto-js/sha256")
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var Unloq = coval.Partner.Unloq
    var payload = {emblem_type: "public"}
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
    var encrypted_user_share, encrypted_identity_share, identity_key
    //generate encrypted seed
    var response = await rp('https://www.synrgtech.net/encrypt?key='+key.GetValue())
    payload.encrypted = JSON.parse(response).payload.encrypted
    var many_keys = new ManyKeys.ManyKeys(key.GetValue())
    var allAddresses = many_keys.GetAllAddresses()
    var unloq_key = await rp('https://www.synrgtech.net/request-unloq-key?unloq_id='+qs.unloq_id)
    
    payload.addresses = {}
    payload.encrypted_addresses = {}
    if (qs.unloq_id) {
        var key = JSON.parse(JSON.parse(unloq_key).key)
        encrypted_user_share = await rp('https://www.synrgtech.net/user-encrypt?key='+key.result.encryption_key+'&to_encrypt='+shares.GetValue()[0])
        identity_key = SHA256(key.result.encryption_key + process.env.MULTICHAINpass).toString()
        identity_share_payload = JSON.stringify({ user: JSON.parse(encrypted_user_share).encrypted, identity: shares.GetValue()[1] })
        encrypted_identity_share = await rp('https://www.synrgtech.net/user-encrypt?key='+identity_key+'&to_encrypt='+identity_share_payload)
        //recurrsion over foreach because #async
        async function encryptPiece(index, total) {
            var item = whitelist[index]
            if (allAddresses[item]) {
                await rp('https://www.synrgtech.net/user-encrypt?key='+key.result.encryption_key+'&to_encrypt='+allAddresses[item].address)
                        .then(encrypted_address => {
                            payload.encrypted_addresses[item] = {address:JSON.parse(encrypted_address).encrypted, unit: allAddresses[item].unit}
                            payload.addresses[item] = {address: allAddresses[item].address, unit: allAddresses[item].unit}
                            if (index+1 === total) {
                                return payload.encrypted_addresses
                            } else {
                                payload.encrypt_count = index + 1
                                encryptPiece(index + 1, total)
                            }
                        })                
            }
        }
        if (qs.pvt) {
            payload.emblem_type="private"
            // encrypt emblem contents
            await encryptPiece(0, whitelist.length)
            // encrypt emblem name
            if (qs.name) {
                await rp('https://www.synrgtech.net/user-encrypt?key='+key.result.encryption_key+'&to_encrypt='+qs.name)
                .then((response)=>{
                    payload.provided_name = qs.name
                    payload.provided_encrypted_name = JSON.parse(response).encrypted
                })
            }
        } else {
            payload.provided_name = qs.name
            whitelist.forEach(async function(item, index, arr) {
                if (allAddresses[item]) {
                    payload.addresses[item] = {address: allAddresses[item].address, unit: allAddresses[item].unit}
                }
            })
        }
    } else {
        payload.provided_name = qs.name
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
        var importCallResponse = await rp('https://www.synrgtech.net/address-import?address='+qs.address)
        
        payload.import_response = JSON.parse(importCallResponse)
        //Only publish to stream if emblem is a hash
        if (typeof(payload.import_response.emblem)!=='object') {
            var contents_request
            if (payload.emblem_type === "private") {
                contents_request = createPostRequest('address-publish', payload.import_response.name, JSON.stringify(payload.encrypted_addresses), 'contents')
            } else {
                contents_request = createPostRequest('address-publish', payload.import_response.name, JSON.stringify(payload.addresses), 'contents')
            }
            await executeRequest(contents_request, 'contents_stream_response')
            var type_request = createPostRequest('address-publish', payload.import_response.name, payload.emblem_type, 'emblem_type')
            await executeRequest(type_request, 'type_stream_response')
            if (qs.name) {
                var name_request
                if (payload.emblem_type === "private") {
                    name_request = createPostRequest('address-publish', payload.import_response.name, payload.provided_encrypted_name, 'name')
                } else {
                    name_request = createPostRequest('address-publish', payload.import_response.name, payload.provided_name, 'name')
                }
                await executeRequest(name_request, 'name_stream_response')
            }
            if (qs.unloq_id ) {
                var share_request = createPostRequest('address-publish', payload.import_response.name, JSON.parse(encrypted_identity_share).encrypted, 'piece')
                await executeRequest(share_request, 'id_piece_stream_response')
            }
        }
        return returnPayload()
    } else {
        return returnPayload()
    }
    async function executeRequest(request, container) {
        await rp(request)
                .then((response)=>{
                    payload[container] = response
                })
                .catch((err)=>{
                    payload[container] = {error: err}
                    return returnPayload()
                })
    }
    function createPostRequest(endpoint, emblem_name, data, type) {
        return {
            method: 'POST',
            uri: 'https://www.synrgtech.net/'+endpoint,
            body: {
                type: type,
                name: emblem_name,
                data: new Buffer(data).toString("hex")
            },
            json: true // Automatically stringifies the body to JSON
        }
    }
    function returnPayload() {
        var key = JSON.parse(JSON.parse(unloq_key).key)
        var return_payload = {
            payload: payload,
            key_action: key_action,
            /* encryption_key: key,
            raw_shares: {me: shares.GetValue()[0], id: shares.GetValue()[1]} */
        }
        if (qs.unloq_id) {
            return_payload.my_share = JSON.parse(encrypted_user_share).encrypted
            return_payload.id_share = JSON.parse(encrypted_identity_share).encrypted
        }
        return {
            status: 200,
            body: 
            JSON.stringify(return_payload, null, 4),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    }
    
}