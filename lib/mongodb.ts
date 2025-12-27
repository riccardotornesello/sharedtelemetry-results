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

/**
 * Establishes and maintains a connection to MongoDB.
 *
 * This function implements connection pooling by reusing a global MongoClient instance
 * across requests. This is important for serverless environments where creating new
 * connections on every request would be inefficient.
 *
 * The connection is configured with MongoDB's Stable API (v1) for consistent behavior
 * across server versions.
 *
 * @returns Promise<MongoClient> - The connected MongoDB client
 * @throws {Error} If MONGODB_URI environment variable is not defined
 *
 * @example
 * ```ts
 * const client = await dbConnect()
 * const db = client.db("myDatabase")
 * const collection = db.collection("myCollection")
 * ```
 */
async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  // Reuse existing connection if available (connection pooling)
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
