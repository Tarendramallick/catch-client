import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Derive database name from env or URI path if present
function resolveDatabaseName() {
  // Prefer explicit env var, else attempt to read from URI path, else default
  const fromEnv = process.env.MONGODB_DB?.trim()
  if (fromEnv) return fromEnv

  try {
    const u = new URL(uri)
    const path = u.pathname.replace(/^\//, "")
    if (path) return path
  } catch {
    // ignore parse errors
  }
  return "catchclients_crm"
}

export const DATABASE_NAME = resolveDatabaseName()

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(DATABASE_NAME)
}
