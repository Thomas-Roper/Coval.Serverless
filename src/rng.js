module.exports = async function(context) {
    var rnd = Math.floor(Math.random() * (1000000 - 1) + 1)
    return {
        status: 200,
        body: rnd.toString()
    }
}