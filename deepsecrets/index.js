const qs = require('qs');
const CosmosClient = require("@azure/cosmos").CosmosClient;



const config = {
    endpoint: "https://ganning.documents.azure.com:443/",
    key: "CqgZhMjxjpPTSqQF53uFFHQYhFaZtPambO7WGa955Ka0c2iRA04sb2VitRI6CMjV8tZKzom9p4y8NERtmsIisw==",
    databaseId: "SecretStorer",
    containerId: "secrets",
    partitionKey: {kind: "Hash", paths: ["/secrets"]}
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // const config = {
    //     endpoint: process.env.ENDPOINT,
    //     key: process.env.KEY,
    //     databaseId: "SecretStorer",
    //     containerId: "secrets",
    //     partitionKey: {kind: "Hash", paths: ["/secrets"]}
    // }

    context.log("__________")
    context.log(req.body)
    const queryObject = qs.parse(req.body);
    context.log(queryObject)

    const message = queryObject.Body;
    let document = {"message" : message}
    let items = await createDocument(document)

    var random_value = Math.floor(items.length * Math.random());

    const responseMessage = `Thanks 😊! Stored your secret "${message}". 😯 Someone confessed that: ${JSON.stringify(items[random_value].message)}`
    context.log(responseMessage)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage

    };
}

async function create(client) {
    const { database } = await client.databases.createIfNotExists({
        id: config.databaseId
    });
    const { container } = await client
        .database(config.databaseId)
        .containers.createIfNotExists(
            { id: config.containerId, key: config.partitionKey },
            { offerThroughput: 400 }
    );
}

async function createDocument(newItem) {
    var { endpoint, key, databaseId, containerId } = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    await create(client, databaseId, containerId);

    const querySpec = {
        query: "SELECT * from c"
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();
    const {resource: createdItem} = await container.items.create(newItem);

   
    return items;
}