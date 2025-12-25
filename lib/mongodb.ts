"use server"

import { MongoClient, ServerApiVersion } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var mongoClient: MongoClient | undefined
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  if (!global.mongoClient) {
    global.mongoClient = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  }

  await global.mongoClient.connect()

  return global.mongoClient
}

export default dbConnect
