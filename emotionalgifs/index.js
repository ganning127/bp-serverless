
const multipart = require('parse-multipart');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var parts = multipart.Parse(body, boundary);

    var result = await analyzeImage(parts[0].data);
    let emotions = result[0].faceAttributes.emotion;
    let dominantEmotion = determineDom(emotions);

    var gif = await findGifs(dominantEmotion)
    context.res = {
        body: process.env
    };
}


async function analyzeImage(img) {
    const subKey = process.env.SUBSCRIPTIONKEY;
    const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })

    let urlToUse = uriBase + '?' + params.toString();
    console.log(urlToUse)
    let resp = await fetch(urlToUse, {
        method: 'POST',  
        body: img,
      
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subKey
        }
    })

    let data = await resp.json();
    return data;
}

function determineDom(emotionJSON) {
    let maxValue = 0;
    let domEmo;

    for (var emo in emotionJSON) {
        if (emotionJSON[emo] > maxValue) {
            maxValue = emotionJSON[emo];
            domEmo = emo;
        }
    }
    return domEmo
}

async function findGifs(emotion) {

    const gifParams = new URLSearchParams({
        "api_key": process.env.GIFKEY,
        "s": emotion
    });


    const gifSearchUrl = `https://api.giphy.com/v1/gifs/translate?${gifParams.toString()}`;
    console.log(gifSearchUrl)
    let gifResp = await fetch(gifSearchUrl, {
        method: 'GET',
    });
    let jsonResult = await gifResp.json();
    return jsonResult.data.url;

}