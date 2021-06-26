const multipart = require('parse-multipart');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(connectionString)

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var parsedBody = multipart.Parse(body, boundary);
    context.log(parsedBody)
    var filetype = parsedBody[0].type;
    if (filetype == "image/png") {
        ext = "png";
    } else if (filetype == "image/jpeg") {
        ext = "jpeg";
    } else if (filetype == "image/jpg") {
        ext = "jpg"
    }
    
    else {
        username = "invalidimage"
        ext = "";
    }

    var responseMessage = await uploadFile(parsedBody, ext);
    context.log(responseMessage);
    context.res = {
        body: "File Saved"
    };
}

async function uploadFile(parsedBody, ext) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "images";
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container
    const blobName = 'test.' + ext;    // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client
    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    return uploadBlobResponse

}