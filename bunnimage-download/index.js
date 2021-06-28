const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const username = req.headers.username;

    let downloadObj = await getDownloadLink(username);
    context.log(downloadObj)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            "downloadUri": downloadObj.download,
            "success": downloadObj.success
        }
    };
}

async function getDownloadLink(username) {
    let download;
    let success;

    let downloadpng = "https://ganningstorage.blob.core.windows.net/images/" + username + ".png";
    let downloadjpg = "https://ganningstorage.blob.core.windows.net/images/" + username + ".jpeg";

    let pngresp = await fetch(downloadpng, {
        method: 'GET',
     })
     let pngdata = await pngresp;
     
     let jpgresp = await fetch(downloadjpg, {
        method: 'GET',
     })
     let jpgdata = await jpgresp;

     // check which one is valid
     if (pngdata.statusText == "The specified blob does not exist." && jpgdata.statusText == "The specified blob does not exist." ) {
        success = false;
        console.log("Does not exist: " + pngdata)
        console.log("Does not exist: " + jpgdata)
     } else if (pngdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadpng
        console.log("Does exist: " + pngdata)
     } else if (jpgdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadjpg
        console.log("Does exist: " + jpgdata)
     }

    return {
        "download": download,
        "success": success
    };

}