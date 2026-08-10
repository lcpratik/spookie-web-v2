import { Router } from "express"
import { pool } from "../db/pool.js"
import { sanitizeText } from "../lib/sanitize.js"
import { uploadPhoto } from "../middleware/upload.js"
import { sightingEvents } from "../events.js"
import { geocodeLocation } from "../lib/geocode.js"

export const sightingsRouter = Router()

const SORTS = {
    newest: "s.created_at DESC",
    corroborated: "s.upvote_count DESC, s.created_at DESC",
    discussed: "comment_count DESC, s.created_at DESC",
}

sightingsRouter.get("/locations", async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            "SELECT DISTINCT location FROM sightings ORDER BY location ASC"
        )
        res.json(rows.map((row) => row.location))
    } catch (err) {
        next(err)
    }
})

sightingsRouter.get("/", async (req, res, next) => {
    try {
        const search = req.query.search ? `%${req.query.search}%` : null
        const location = req.query.location || null
        const sort = SORTS[req.query.sort] ? req.query.sort : "newest"
        const page = Math.max(1, parseInt(req.query.page, 10) || 1)
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9))
        const offset = (page - 1) * limit

        const viewer = req.query.viewer || null

        const filterClause = `
            WHERE ($1::text IS NULL OR s.title ILIKE $1 OR s.body ILIKE $1)
              AND ($2::text IS NULL OR s.location = $2)
        `

        const { rows } = await pool.query(
            `SELECT s.id, s.uuid, s.title, s.body, s.location, s.occurred_at,
                    s.created_at, s.photo_url, s.upvote_count, s.lat, s.lng,
                    COUNT(DISTINCT c.id)::int AS comment_count,
                    BOOL_OR(u.user_identifier IS NOT NULL) AS upvoted
             FROM sightings s
             LEFT JOIN comments c ON c.sighting_id = s.id
             LEFT JOIN upvotes u ON u.sighting_id = s.id AND u.user_identifier = $5
             ${filterClause}
             GROUP BY s.id
             ORDER BY ${SORTS[sort]}
             LIMIT $3 OFFSET $4`,
            [search, location, limit, offset, viewer]
        )

        const { rows: countRows } = await pool.query(
            `SELECT COUNT(DISTINCT s.id)::int AS total
             FROM sightings s
             ${filterClause}`,
            [search, location]
        )

        const total = countRows[0].total
        res.json({
            sightings: rows,
            total,
            page,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        })
    } catch (err) {
        next(err)
    }
})

sightingsRouter.get("/:uuid", async (req, res, next) => {
    try {
        const viewer = req.query.viewer || null
        const { rows } = await pool.query(
            `SELECT s.*, COUNT(DISTINCT c.id)::int AS comment_count,
                    BOOL_OR(u.user_identifier IS NOT NULL) AS upvoted
             FROM sightings s
             LEFT JOIN comments c ON c.sighting_id = s.id
             LEFT JOIN upvotes u ON u.sighting_id = s.id AND u.user_identifier = $2
             WHERE s.uuid = $1
             GROUP BY s.id`,
            [req.params.uuid, viewer]
        )
        if (rows.length === 0) {
            return res.status(404).json({ error: "Sighting not found" })
        }

        const { rows: comments } = await pool.query(
            `SELECT id, author_name, body, created_at
             FROM comments
             WHERE sighting_id = $1
             ORDER BY created_at ASC`,
            [rows[0].id]
        )

        res.json({ ...rows[0], comments })
    } catch (err) {
        next(err)
    }
})

sightingsRouter.post("/", uploadPhoto.single("photo"), async (req, res, next) => {
    try {
        const title = sanitizeText(req.body.title)
        const body = sanitizeText(req.body.body || req.body.details)
        const location = sanitizeText(req.body.location)
        const occurredAtRaw = req.body.occurred_at || req.body.datetime
        const occurredAt = occurredAtRaw ? new Date(occurredAtRaw) : null

        if (!title || !body || !location) {
            return res.status(400).json({ error: "title, body, and location are required" })
        }
        if (occurredAt && Number.isNaN(occurredAt.getTime())) {
            return res.status(400).json({ error: "occurred_at must be a valid date" })
        }

        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null
        const coords = await geocodeLocation(location)

        const { rows } = await pool.query(
            `INSERT INTO sightings (title, body, location, occurred_at, photo_url, lat, lng)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, body, location, occurredAt, photoUrl, coords?.lat ?? null, coords?.lng ?? null]
        )

        const sighting = { ...rows[0], comment_count: 0 }
        sightingEvents.emit("sighting-added", sighting)
        res.status(201).json(sighting)
    } catch (err) {
        next(err)
    }
})

sightingsRouter.post("/:uuid/comments", async (req, res, next) => {
    try {
        const body = sanitizeText(req.body.body)
        const authorName = sanitizeText(req.body.author_name) || "Anonymous"

        if (!body) {
            return res.status(400).json({ error: "Comment body is required" })
        }

        const { rows: sightingRows } = await pool.query(
            "SELECT id FROM sightings WHERE uuid = $1",
            [req.params.uuid]
        )
        if (sightingRows.length === 0) {
            return res.status(404).json({ error: "Sighting not found" })
        }

        const { rows } = await pool.query(
            `INSERT INTO comments (sighting_id, author_name, body)
             VALUES ($1, $2, $3)
             RETURNING id, author_name, body, created_at`,
            [sightingRows[0].id, authorName, body]
        )

        res.status(201).json(rows[0])
    } catch (err) {
        next(err)
    }
})

sightingsRouter.post("/:uuid/upvote", async (req, res, next) => {
    try {
        const userIdentifier = sanitizeText(req.body.user_identifier)
        if (!userIdentifier) {
            return res.status(400).json({ error: "user_identifier is required" })
        }

        const { rows: sightingRows } = await pool.query(
            "SELECT id FROM sightings WHERE uuid = $1",
            [req.params.uuid]
        )
        if (sightingRows.length === 0) {
            return res.status(404).json({ error: "Sighting not found" })
        }
        const sightingId = sightingRows[0].id

        const { rows: existing } = await pool.query(
            "SELECT id FROM upvotes WHERE sighting_id = $1 AND user_identifier = $2",
            [sightingId, userIdentifier]
        )

        let upvoted
        if (existing.length > 0) {
            await pool.query("DELETE FROM upvotes WHERE id = $1", [existing[0].id])
            upvoted = false
        } else {
            await pool.query(
                `INSERT INTO upvotes (sighting_id, user_identifier)
                 VALUES ($1, $2)
                 ON CONFLICT (sighting_id, user_identifier) DO NOTHING`,
                [sightingId, userIdentifier]
            )
            upvoted = true
        }

        const { rows: updated } = await pool.query(
            "SELECT upvote_count FROM sightings WHERE id = $1",
            [sightingId]
        )

        res.json({ upvoted, upvote_count: updated[0].upvote_count })
    } catch (err) {
        next(err)
    }
})
