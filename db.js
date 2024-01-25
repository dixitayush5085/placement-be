const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = "mongodb+srv://pupsstyl:pupsstyl@cluster0.pantizu.mongodb.net/your_database_name?retryWrites=true&w=majority";

const uri = "mongodb+srv://pupsstyl:pupsstyl@cluster0.pantizu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("placement");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = {
    connectToDatabase
};