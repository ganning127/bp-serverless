const querystring = require('querystring');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body)
    const queryObject = querystring.parse(req.body);

    context.res = {
        body: queryObject.MediaUrl0
    };
}