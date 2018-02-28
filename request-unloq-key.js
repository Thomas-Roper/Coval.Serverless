//* TODO: Check that request was initiated by unloq user_id specified by checking signed request
module.exports = function(context, callback) {
    var rp = require('request-promise-native');
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var Secure = coval.Secure
    var ManyKeys = require('coval.js/build/secure/ManyKeys')
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var UnloqLib = coval.Partner.Unloq
    var qs = context.request.query
    var agent = new Agent(UserLib.Server)
    //var qs = context.request.query
    //const stringBody = JSON.stringify(context.request.body);
    //const body = JSON.parse(stringBody);
    //const location = body.location;
    var CryptoJS = require("crypto-js")

    var Unloq = new UnloqLib(process.env.UNLOQ_KEY)
    var payload = {}
    if (!qs.unloq_id) { 
        payload.error = "Missing Unloq ID"
        return returnPayload()
    }
    Unloq.GetEncryptionKey(qs.unloq_id, function(key){        
        payload.key = key
        return returnPayload()
    })
    function returnPayload() {
        return callback(200, payload, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    }
}