const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    async function getCat(text) {
        let resp = await fetch(`https://cataas.com/cat/says/${text}`, { method: "GET" });
        let data = await resp.arrayBuffer();
    
        let base64data = Buffer.from(data).toString('base64');
        return base64data
    }

    let cats = [];

    for (var i=0; i<4; i++) {
        context.log(req.headers[`name${i+1}`])
        cats.push(await getCat(req.headers[`name${i+1}`]));
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            name1: cats[0],
            name2: cats[1],
            name3: cats[2],
            name4: cats[3],
        }
        
    };
}