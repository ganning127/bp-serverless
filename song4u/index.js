const querystring = require('querystring');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);
    const url = queryObject.MediaUrl0;
    // const url = "https://images.unsplash.com/photo-1555888997-03e986fc157b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8b2xkJTIwbWFufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"

    const binaryData = await downloadImage(url);
    const faceData = await getFaceData(binaryData)
    // const age = await faceData[0].faceAttributes.age
    const age = faceData[0].faceAttributes.age.toString()
    context.log(age)

    const generation = determineAge(age)
    context.log("GENERATION: " + generation)

    context.res = {
        body: `${generation}`
    };
}

async function downloadImage(imgUrl) {
    let resp = await fetch(imgUrl,{
        method: 'GET',
    })

    let data = await resp.arrayBuffer();
    return data;
}

async function getFaceData(binaryData) {
   
    const subKey = process.env['SUBKEY'];
    const uriBase = process.env['ENDPOINT'] + 'face/v1.0/detect'

    // const subKey = "84292ce5d06d428393896771b243d34c"
    // const uriBase = "https://face-ganning.cognitiveservices.azure.com/face/v1.0/detect"
    // const uriBase = "https://face-ganning.cognitiveservices.azure.com/face/v1.0/detect";

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'age' 
    });
    
    const urlToUse = uriBase + '?' + params.toString()
    // making the post request
    let resp = await fetch(urlToUse,{
        method: 'POST',
        body: binaryData,
        headers: {
            'Content-Type' : 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subKey
        }
    })
    // receive the response
    let data = await resp.json();
    return data;
}

function determineAge(age) {
    if (age > 5 && age < 25) {
        return "GenZ"
    }
    else if (age > 24 && age < 41) {
        return "GenY"
    }
    else if (age > 40 && age < 57) {
        return "GenX"
    }
    else if (age > 56 && age < 76) {
        return "BabyBoomers"
    }
    else {
        return "Unknown"
    }
}