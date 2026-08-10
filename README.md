# 👻 Spookie Web

A full-stack community platform for reporting and browsing paranormal sightings — React frontend, Express API, PostgreSQL (Neon) storage.

## Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React 18 + React Router (Vite)      |
| Backend   | Express 5, `pg`, `multer`           |
| Database  | PostgreSQL (Neon)                   |
| Real-time | Server-Sent Events (SSE) alerts     |

## Project Structure

```
Spookie-Web/
├── package.json          # backend deps + root scripts
├── .env                  # DATABASE_URL (not committed)
├── server/
│   ├── index.js          # Express app entry
│   ├── db/
│   │   ├── schema.sql    # tables, trigger, indexes
│   │   ├── pool.js       # pg Pool
│   │   ├── migrate.js    # applies schema.sql
│   │   └── seed.js       # seeds from legacy data.json (once)
│   ├── routes/
│   │   ├── sightings.js  # sightings, comments, upvotes
│   │   └── alerts.js     # SSE stream
│   ├── middleware/upload.js  # multer photo upload
│   ├── lib/sanitize.js
│   ├── events.js         # EventEmitter -> SSE bridge
│   └── uploads/           # uploaded photos (gitignored)
└── client/                # Vite + React SPA
    ├── src/
    │   ├── pages/          # Home, Read, SightingDetail, MapPage, Upload, Alerts
    │   ├── components/     # Header, SightingCard, UpvoteButton, AuthModal, ...
    │   ├── context/        # AuthContext (local identity), AlertsContext (SSE)
    │   └── styles/index.css
    └── public/images/      # candle-logo.png, ghostbg.jpg
```

## Setup

```bash
npm install
npm --prefix client install
npm run db:migrate   # create tables/trigger/indexes
npm run db:seed      # seed once if sightings table is empty
```

## Development

```bash
npm run dev   # runs Express (6969) + Vite dev server (5173, proxies /api and /uploads)
```

## Production

```bash
npm run build   # builds client/dist
npm start        # Express serves the API and the built SPA on one port
```

## API

| Method | Path                              | Description                          |
|--------|------------------------------------|---------------------------------------|
| GET    | `/api/sightings`                  | list, with `search`, `location`, `sort` (`newest`/`corroborated`/`discussed`), `page`, `limit`, `viewer` |
| GET    | `/api/sightings/locations`        | distinct locations for the filter dropdown |
| GET    | `/api/sightings/:uuid`            | full sighting + comments             |
| POST   | `/api/sightings`                  | create sighting (multipart, optional `photo`) |
| POST   | `/api/sightings/:uuid/comments`   | add a comment                        |
| POST   | `/api/sightings/:uuid/upvote`     | toggle upvote for `user_identifier`  |
| GET    | `/api/alerts/stream`              | SSE stream of `sighting-added` events |

## Notes

- Auth is a lightweight client-side identity (name + email in `localStorage`) used to attribute comments and dedupe upvotes — there's no password/session backend, matching the "simple auth" scope of this build.
- The Map page/toggle is a real Leaflet + OpenStreetMap map. New sightings are geocoded server-side (Nominatim) on submission (`server/lib/geocode.js`); run `npm run db:geocode` to backfill coordinates for any existing sightings that predate this.
