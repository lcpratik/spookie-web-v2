import path from "node:path"
import fs from "node:fs"
import express from "express"
import { sightingsRouter } from "./routes/sightings.js"
import { alertsRouter } from "./routes/alerts.js"

const PORT = process.env.PORT || 6969
const rootDir = path.join(import.meta.dirname, "..")
const uploadsDir = path.join(import.meta.dirname, "uploads")
const clientDist = path.join(rootDir, "client", "dist")

fs.mkdirSync(uploadsDir, { recursive: true })

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(uploadsDir))
app.use("/uploads", (req, res) => res.status(404).json({ error: "Not found" }))

app.use("/api/sightings", sightingsRouter)
app.use("/api/alerts", alertsRouter)
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }))

if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist))
    app.use((req, res) => {
        res.sendFile(path.join(clientDist, "index.html"))
    })
}

app.use((err, req, res, next) => {
    console.error(err)
    if (err.message?.includes("Only JPEG")) {
        return res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: "Something went wrong" })
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
