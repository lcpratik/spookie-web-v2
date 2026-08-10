import path from "node:path"
import fs from "node:fs/promises"
import { pool } from "./pool.js"

const schemaPath = path.join(import.meta.dirname, "schema.sql")

async function migrate() {
    const schema = await fs.readFile(schemaPath, "utf8")
    await pool.query(schema)
    console.log("Schema applied successfully.")
    await pool.end()
}

migrate().catch((err) => {
    console.error("Migration failed:", err)
    process.exit(1)
})
