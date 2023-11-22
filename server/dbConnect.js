require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const { MONGODB_URI_SCHEME, MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE } = process.env;

const uri = `${MONGODB_URI_SCHEME}://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?retryWrites=true&w=majority`;

let client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

(async () => {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.log("error connect to db", err);
    await client.close();
  }
})()


module.exports = { client };