# 👻 Spokiee Web

A full-stack horror story community platform where users can publish, browse, and read spooky stories. Built with a custom Node.js server, RESTful API design, and a dark, immersive frontend — no heavy frameworks, just clean modular architecture.

---

## Features

- 📖 Public story submission and retrieval — no account required
- 🧩 Modular backend with separated handlers, events, and data layers
- 🌐 Custom Node.js HTTP server (no Express)
- 🎨 Dark, atmospheric frontend with a horror-themed design
- 🛡️ Input sanitization and structured error handling

---

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Backend   | Node.js (custom HTTP server)|
| Frontend  | HTML, CSS, JavaScript       |
| Storage   | JSON-based data layer       |

---

## Project Structure

```
Spokiee-Web/
├── package.json
├── src/                      # Server-side source code
│   ├── server.js             # HTTP server entry point / router
│   ├── data/                 # Data access layer
│   │   ├── data.json
│   │   ├── sightingsStore.js # read/write sightings
│   │   └── stories.js
│   ├── events/
│   │   └── sightingEvents.js # sighting-added event wiring
│   ├── handlers/
│   │   └── routeHandlers.js  # /api and /api/news request handlers
│   ├── services/
│   │   └── createAlert.js    # ghost hunter alert side effect
│   └── utils/
│       ├── contentType.js
│       ├── parseJsonBody.js
│       ├── sanitizeInput.js
│       ├── sendResponse.js
│       └── serveStatic.js
└── public/                   # Static assets served to the browser
    ├── index.html / index.js / index.css
    ├── news.html / news.js
    ├── sightings.html
    ├── upload-sighting.html / upload-sighting.js
    ├── 404.html
    └── images/
```
