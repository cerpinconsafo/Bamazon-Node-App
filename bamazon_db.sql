use bamazon_db;

create table products  (
item_id INTEGER(100) auto_increment not null,
product_name VARCHAR(200) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) not null,
stock_quantity integer(250) NOT NULL,
PRIMARY KEY (item_id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("starberry-cough", "plant-material", 10.00, 250),
("jack-herer", "plant-material", 15.00, 250),
("sour-diesel", "plant-material", 15.00, 250),
("blueberry-haze", "plant-material", 10.00, 250),
("og-kush", "plant-material", 12.50, 250),
("oregon-og", "plant material", 12.50, 250),
("grinder-sm", "accessories", 24.95, 20),
("grinder-lrg", "accessories", 64.95, 40),
("raw-organic-hemp-papers", "accessories", 3.75, 250),
("game-dutch-green", "accessories", 1.25, 250),
("game-dutch-vanilla", "accessories", 1.25, 250),
("game-dutch-white-grape", "accessories", 1.25, 250);