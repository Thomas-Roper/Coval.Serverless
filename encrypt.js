module.exports = async function(context) {
    var qs = context.request.query
    function createReqMock(service, teamId, userId){
        var mock = JSON.stringify(requestMock.req)
        mock = mock.replace("$teamId", teamId)
        mock = mock.replace("$userId", userId)
        mock = mock.replace("$service", service)
        return JSON.parse(mock)
      }
      var requestMock = {
        req: {
            body:{
                originalRequest: {
                    data: {
                        team_id: "$teamId",
                        event: {
                            user: "$userId"
                        }
                    },
                    source: "$service"
                }
            }
        }
    }

    var HDKey = require('coval.js/build/secure/HDKey').HDKey
    var hDKey = new HDKey()
    var encrypted = hDKey.MakeWalletFromNs(qs.key).GetValue()
    var ip_parts = context.request.headers.host.split(':')[0].split('.')
    //var fromKey = hDKey.CreateKeysFromEncrypted(from.encrypted)

    if (!qs.key /* || ip_parts[0] != 10 */) {
        return {
            status: 409
        }
    } else {
        return {
            status: 200,
            body: 
            JSON.stringify({ 
                script: 'encrypt',
                payload: encrypted,
                /* context: ips */
                /* req: context.request.query  */
            },null,4),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    
}


