const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let resp = await fetch("https://cataas.com/cat/says/Serverless", { method: "GET" });
    let data = await resp.arrayBuffer();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: data
    };
}