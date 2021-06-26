const multipart = require('parse-multipart');
// const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const connectionString = "DefaultEndpointsProtocol=https;AccountName=ganningstorage;AccountKey=N5XOc6bSeeK4gYn94OAehXRmZdfTLA36pLkb74N5nU1yjCojRDlZmQSehyK3PYuAx2mRAfCoP6MMvAcUEmiTkA==;EndpointSuffix=core.windows.net"
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let responseMessage;

    // get the data from the request
    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var headers = req.headers;

    try {
        var parsedBody = multipart.Parse(body, boundary);
        // get the file extension
        var ext = determineExt(parsedBody[0].type);
        var password = headers.codename;
        // upload the file to blob
        responseMessage = await uploadFile(parsedBody, ext, password);
    }
    catch(err) {
        context.log("Undefined body image");
        responseMessage = "Sorry! No image attached."
    }
        
    
    context.log(responseMessage);
    context.res = {
        body: responseMessage
    };
}

async function uploadFile(parsedBody, ext, filename) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "images";
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container
    const blobName = `${filename}.${ext}`;    // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client
    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    return uploadBlobResponse

}

function determineExt(filetype) {
    if (filetype == "image/png") {
        ext = "png";
    } else if (filetype == "image/jpeg") {
        ext = "jpeg";
    } else if (filetype == "image/jpg") {
        ext = "jpg"
    } else {
        username = "invalidimage"
        ext = "";
    }
    return ext
}