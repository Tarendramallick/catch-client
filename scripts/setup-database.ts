import { createIndexes } from "../lib/database/indexes"
import { seedDatabase } from "./seed-database"

async function setupDatabase() {
  try {
    console.log("🚀 Setting up CatchClients CRM Database...")

    // Create indexes
    console.log("📊 Creating database indexes...")
    await createIndexes()

    // Seed with initial data
    console.log("🌱 Seeding database with initial data...")
    await seedDatabase()

    console.log("✅ Database setup completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  }
}

setupDatabase()
