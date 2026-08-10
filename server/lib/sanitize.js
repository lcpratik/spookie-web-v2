import sanitizeHtml from "sanitize-html"

export function sanitizeText(value) {
    if (typeof value !== "string") return value
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim()
}
