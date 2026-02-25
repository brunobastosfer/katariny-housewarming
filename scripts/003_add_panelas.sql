-- Add new ceramic cookware sets
INSERT INTO gifts (name, price, image_url)
VALUES
('Jogo de panelas ceramica 8 peças branca', 399.90, '/images/panelas-branca.png'),
('Jogo de panelas ceramica 10 peças', 399.90, '/images/panelas-10pecas.png'),
('Jogo de panelas ceramica 9 peças', 399.90, '/images/panelas-9pecas.png')
ON CONFLICT (name) DO NOTHING;

-- Add companion_name column to rsvps if it doesn't exist
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS companion_name TEXT;
