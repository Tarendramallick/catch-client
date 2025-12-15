import clientPromise, { getDatabase, DATABASE_NAME } from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request) {
  const url = new URL(req.url)
  const doWrite = url.searchParams.get("write") === "true"

  try {
    const client = await clientPromise
    const db = await getDatabase()

    // 1) Ping
    const ping = await db.command({ ping: 1 })

    // 2) Collections
    const collectionsInfo = await db.listCollections().toArray()
    const collections = collectionsInfo.map((c) => c.name).sort()

    // 3) Optional write-read-delete cycle
    let writeTest: {
      insertedId?: string
      readBack?: boolean
      deleted?: boolean
    } | null = null

    if (doWrite) {
      const col = db.collection("_diagnostics")
      const doc = { _t: "db-health-check", ts: new Date() }
      const insert = await col.insertOne(doc)
      const found = await col.findOne({ _id: insert.insertedId })
      const del = await col.deleteOne({ _id: insert.insertedId })
      writeTest = {
        insertedId: String(insert.insertedId),
        readBack: !!found,
        deleted: del.deletedCount === 1,
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: "MongoDB connection healthy",
        dbName: db.databaseName,
        configuredDbName: DATABASE_NAME,
        ping,
        collections,
        writeTest,
      }),
      {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
        },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error?.message ?? String(error),
      }),
      {
        headers: { "content-type": "application/json", "cache-control": "no-store" },
        status: 500,
      },
    )
  }
}
