module.exports = async function(context) {
    var Coval = require('coval.js').Coval
    var rp = require('request-promise-native')
    var SHA256 = require("crypto-js/sha256")
    var coval = new Coval()
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var ManyKeys = require('coval.js/build/secure/ManyKeys')
    var agent = new Agent(UserLib.Server)
    var multichain = agent.user.multichain.multichain.multichain
    var qs = context.request.query
    var shares = []
    
    if (!qs.my_share) {
        return {
            status: 200,
            body: {error: 'Need to specify share'},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    if (!qs.unloq_id) {
        return {
            status: 200,
            body: {error: 'Need to specify unloq id'},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    if (!qs.address) {
        return {
            status: 200,
            body: {error: 'Need to specify address'},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    if (!qs.name) {
        return {
            status: 200,
            body: {error: 'Need to specify emblem name'},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    /* Check that address actually has this emblem failing early if not */
    var has_balance
    await rp('https://www.synrgtech.net/address-balances?address='+qs.address)
            .then((balance_response)=>{
                var balances = JSON.parse(balance_response)
                has_balance = balances.filter(token=>{return token.name === qs.name}).length > 0
            })
    if (!has_balance) {
        return {
            status: 200,
            body: {error: 'User does not have this emblem in their balance'},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    var unloq_key
    if (!qs.key) {
        unloq_key = await rp('https://www.synrgtech.net/request-unloq-key?unloq_id='+qs.unloq_id)
        unloq_key = JSON.parse(JSON.parse(unloq_key).key).result.encryption_key
    } else {
        unloq_key = qs.key
    }
    var id_share, piece
    piece = await rp('https://www.synrgtech.net/address-stream-item?stream_key='+qs.name+':piece')
    id_share = JSON.parse(piece)[0].decoded
    
    var user_decryption_key = unloq_key
    var identity_decryption_key = SHA256(user_decryption_key + process.env.MULTICHAINpass).toString()
    var decrypt_user_share_url = 'https://www.synrgtech.net/user-decrypt?key='+user_decryption_key+'&unloq_id='+qs.unloq_id+ "&to_decrypt="+qs.my_share
    var decrypted_user_share = await rp(decrypt_user_share_url)
    var json_decrypted_user_share = JSON.parse(decrypted_user_share).decrypted
    var decrypt_id_share_url = 'https://www.synrgtech.net/user-decrypt?key='+identity_decryption_key+'&unloq_id='+qs.unloq_id+ "&to_decrypt="+id_share
    var decrypted_id_share = await rp(decrypt_id_share_url)
    var json_decrypted_id_share = JSON.parse(JSON.parse(decrypted_id_share).decrypted).identity

    var shares = []
    shares.push(json_decrypted_user_share)
    shares.push(json_decrypted_id_share)

    var combined = agent.user.Combine(shares)
    var response = await rp('https://www.synrgtech.net/decrypt?key='+combined.GetValue())
    var many_keys = new ManyKeys.ManyKeys(combined.GetValue())
    var addresses = many_keys.GetAllAddresses()

    /* shares.push(qs.my_share)
    shares.push(qs.id_share)

    var combined = agent.user.Combine(shares)
    var response = await rp('http://35.224.43.101/decrypt?key='+combined.GetValue())
    var many_keys = new ManyKeys.ManyKeys(combined.GetValue())
    var payload = {
        keys: JSON.parse(response).keys,
        address: JSON.parse(response).address,
    }
    payload.addresses = many_keys.GetAllAddresses() */
    return {
        status: 200,
        body: {
            //unloq_key: unloq_key,
            /* user_decryption_key: user_decryption_key,
            identity_decryption_key:identity_decryption_key, */
            /* decrypted_user_share: decrypted_user_share,
            decrypted_id_share: decrypted_id_share, */
            /* decrypted_user_share: json_decrypted_user_share,
            decrypted_id_share: json_decrypted_id_share, */
            /* decrypted_key: JSON.parse(response), */
            emblem_seed: combined.GetValue(),
            name: qs.name,
            /* addresses: addresses */
            /* decrypt_user_share_url: decrypt_user_share_url */
        },
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    
}