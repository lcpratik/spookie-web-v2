-- Spookie Web schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS sightings (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    location TEXT NOT NULL,
    occurred_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    photo_url TEXT,
    upvote_count INTEGER NOT NULL DEFAULT 0,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);

ALTER TABLE sightings ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE sightings ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    sighting_id INTEGER NOT NULL REFERENCES sightings(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL DEFAULT 'Anonymous',
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS upvotes (
    id SERIAL PRIMARY KEY,
    sighting_id INTEGER NOT NULL REFERENCES sightings(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (sighting_id, user_identifier)
);

CREATE INDEX IF NOT EXISTS idx_sightings_location ON sightings(location);
CREATE INDEX IF NOT EXISTS idx_sightings_created_at ON sightings(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_sighting_id ON comments(sighting_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_sighting_id ON upvotes(sighting_id);

CREATE OR REPLACE FUNCTION update_sighting_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE sightings SET upvote_count = upvote_count + 1 WHERE id = NEW.sighting_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE sightings SET upvote_count = upvote_count - 1 WHERE id = OLD.sighting_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_upvotes_insert ON upvotes;
CREATE TRIGGER trg_upvotes_insert
    AFTER INSERT ON upvotes
    FOR EACH ROW EXECUTE FUNCTION update_sighting_upvote_count();

DROP TRIGGER IF EXISTS trg_upvotes_delete ON upvotes;
CREATE TRIGGER trg_upvotes_delete
    AFTER DELETE ON upvotes
    FOR EACH ROW EXECUTE FUNCTION update_sighting_upvote_count();
