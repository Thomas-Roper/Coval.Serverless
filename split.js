module.exports = async function(context) {
    var Coval = require('coval.js').Coval
    var coval = new Coval()
    var UserLib = coval.User
    var UserType = UserLib.UserType
    var Agent = coval.Agent
    var Unloq = coval.Partner.Unloq

    var agent = new Agent(UserLib.Server)
    var qs = context.request.query
    var key, key_action
    if (qs.key) {
        key = qs.key
        agent.SetKey(key)
        key_action = 'Loaded Key'
    } else {
        key = agent.Generate()
        key_action = 'Generated Key'
    }
    var shares = agent.Split(2, 2, 256)
    var combined = agent.Combine(shares.value)
    return {
        status: 200,
        body: 
        JSON.stringify({ 
            my_share: shares.GetValue()[0], 
            id_share: shares.GetValue()[1],
            agent: agent, 
            key_action: key_action,
            key: JSON.stringify(agent.SetKey(key)),
        },null,4),
        headers: {
            'Content-Type': 'application/json'
        }
    }
}