import path from "node:path"
import crypto from "node:crypto"
import multer from "multer"

const uploadsDir = path.join(import.meta.dirname, "..", "uploads")

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `${crypto.randomUUID()}${ext}`)
    },
})

const allowedTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"])

export const uploadPhoto = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!allowedTypes.has(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, GIF, or WEBP photos are allowed."))
        }
        cb(null, true)
    },
})
