"use server";
import { MongoClient, ServerApiVersion } from "mongodb";

const URI = process.env.URL;
const client = new MongoClient(URI, {
  serverApi: {
    timestamps: true,
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getDb() {
  try {
    if (!client.isConnected) {
      await client.connect();
    }
    console.log("connected to MongoDB!");
    return client.db("kenyanmix");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

export default getDb;