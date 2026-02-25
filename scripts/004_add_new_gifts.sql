-- Add new gifts to the database

INSERT INTO gifts (name, price, image_url) VALUES
('Jogo de panelas ceramica 8 peças branca', 399.90, '/images/image.png'),
('Jogo de panelas ceramica 10 peças', 399.90, '/images/image.png'),
('Jogo de panelas ceramica 9 peças', 399.90, '/images/image.png')
ON CONFLICT (name) DO NOTHING;
