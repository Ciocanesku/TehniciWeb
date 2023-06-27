DROP TABLE adidasi
DROP TYPE IF EXISTS categ_adidasi;
DROP TYPE IF EXISTS gen_produse;
DROP TYPE IF EXISTS marca_produse;
DROP TYPE IF EXISTS culori_adidasi;
DROP TYPE IF EXISTS marimi_adidasi;

CREATE TYPE categ_adidasi AS ENUM( 'incaltaminte fotbal', 'incaltaminte baschet', 'sneaker', 'pantofi', 'none');
CREATE TYPE gen_produse AS ENUM('barbati', 'unisex', 'femei');
CREATE TYPE marca_produse AS ENUM('nike', 'jordan', 'adidas', 'none');
CREATE TYPE culori_adidasi AS ENUM('negru', 'alb', 'albastru', 'rosu', 'galben', 'gri', 'none');
CREATE TYPE marimi_adidasi AS ENUM('35', '36', '37', '38', '39', '40', '41', '42', '42.5', '43', '44', '45', '46', '47', 'none');

CREATE TABLE IF NOT EXISTS adidasi (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate>=0),   
   gen_produs gen_produse DEFAULT 'unisex',
   marca marca_produse default 'none',
   categorie categ_adidasi DEFAULT 'none',
   culoare culori_adidasi DEFAULT 'none',
   marimi marimi_adidasi[] DEFAULT '{none}' , --pot sa nu fie specificare deci nu punem NOT NULL
   stock BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into adidasi (nume,descriere,pret, greutate, marca, gen_produs, categorie, culoare, marimi, stock, imagine) VALUES 
('Air Force 1', 'Nike Air Force 1', 600 , 500, 'nike', 'barbati', 'sneaker', 'alb','{"41","42","43"}', True, 'af1.jpg'),

('Retro 1 Off-White Blue', 'Air Jordan Retro 1 in colaborare cu OFF-WHITE', 3500 , 700, 'jordan', 'barbati', 'sneaker', 'albastru','{"43"}', True, 'af1ow.jpg'),

('Air Force 1 Gore-Tex', 'Nike Air Force 1 Gore-Tex', 1000 , 600, 'nike', 'barbati', 'sneaker', 'albastru','{"41","43","44","46"}', True, 'afgoretex.jpg'),

('Nike Dunk Low', 'Nike Dunk Low Black Panda', 600 , 550, 'nike', 'barbati', 'sneaker', 'negru','{"41","42","43"}', True, 'dunklow.jpg'),

('Nike Kyrie 4', 'Adidasi de baschet Nike Kyrie 4', 700 , 450, 'nike', 'barbati', 'incaltaminte baschet', 'negru','{"41","43","44","46"}', True, 'kyrie4.jpg'),

('Ghete Fotbal Nike', 'Ghete Fotbal Nike', 1000 , 350, 'nike', 'barbati', 'incaltaminte fotbal', 'alb','{"40","42","44"}', True, 'nike-fotbal.jpg'),

('Pantofi Rosii', 'Pantofi rosii pentru ocazii femei', 1300 , 500, 'none', 'femei', 'pantofi', 'rosu','{"35","36","38"}', True, 'pantofi-femei.jpg'),

('Retro 1', 'Air Jordan Retro 1', 1000 , 600, 'jordan', 'barbati', 'sneaker', 'alb','{"41","42","43"}', True, 'retro1.jpg'),

('Retro 4 Off-White', 'Air Jordan Retro 4 in colaborare cu OFF-WHITE', 3600 , 800, 'jordan', 'femei', 'sneaker', 'alb','{"35","36","38"}', True, 'retro4ow.jpg'),

('Retro 5', 'Air Jordan Retro 5 Fire Red', 1600 , 700, 'jordan', 'barbati', 'sneaker', 'alb','{}', False, 'retro5.jpg'),

('Yeezy 350 v2 Blue Tint', 'Adidas Yeezy', 2000 , 550, 'adidas', 'barbati', 'sneaker', 'alb','{}', False, 'yeezy.jpg');

