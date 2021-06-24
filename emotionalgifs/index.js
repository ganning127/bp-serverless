
const multipart = require('parse-multipart');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var parts = multipart.Parse(body, boundary);
    
    // console.log(parts[0].data)
    // var result = await analyzeImage(parts[0].data);
    var result = await analyzeImage(parts[0].data);
    let emotions = result[0].faceAttributes.emotion;
    let dominantEmotion = determineDom(emotions);


    context.res = {
        body: dominantEmotion
    };
}


async function analyzeImage(img) {
    // const subKey = process.env.SUBSCRIPTIONKEY;
    // const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    const subKey = "84292ce5d06d428393896771b243d34c";
    const uriBase = 'https://face-ganning.cognitiveservices.azure.com/' + '/face/v1.0/detect';

    // console.log(process.env.SUBSCRIPTIONKEY)
    // console.log(uriBase)
    // console.log(process.env.FUNCTIONS_WORKER_RUNTIME)
    // console.log(process.env)
    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })

    let urlToUse = uriBase + '?' + params.toString();
    console.log(urlToUse)
    let resp = await fetch(urlToUse, {
        method: 'POST',  //WHAT TYPE OF REQUEST?
        body: img,
      
      	//ADD YOUR TWO HEADERS HERE
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subKey
        }
    })

    let data = await resp.json();
    return data;
}

function determineDom(emotionJSON) {
    console.log(emotionJSON);
    let maxValue = 0;
    let domEmo;

    for (var emo in emotionJSON) {
        if (emotionJSON[emo] > maxValue) {
            maxValue = emotionJSON[emo];
            domEmo = emo;
        }
    }
    console.log(domEmo)
    return domEmo
}