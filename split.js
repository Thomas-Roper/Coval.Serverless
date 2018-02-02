module.exports = async function(context) {
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var Unloq = coval.Partner.Unloq

    var agent = new Agent(UserLib.Server)
    var key = agent.Generate()
    var shares = agent.Split(2, 2, 256)
    var combined = agent.Combine(shares.value)
    return {
        status: 200,
        body: 
        JSON.stringify({ 
            my_share: shares.GetValue()[0], 
            id_share: shares.GetValue()[1],
            agent: agent, 
            /* req: context.request.query  */
        },null,4),
        headers: {
            'Content-Type': 'application/json'
        }
    }
}