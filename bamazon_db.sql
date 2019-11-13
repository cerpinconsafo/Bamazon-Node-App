-- alter user 'root' @'localhost' identified WITH mysql_native_password BY 'Octopus0687@';

DROP DATABASE IF EXISTS bamazon_db;
create database bamazon_db;
use bamazon_db;

drop table if exists products;


create table products  (
item_id INTEGER(11) auto_increment not null,
product_name VARCHAR(200) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(5,2) not null,
stock_quantity integer(5) NOT NULL,
PRIMARY KEY (item_id)

);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Starberry-Cough", "Plant-Material", 10.00, 448),
("Jack-Herer", "Plant-Material", 15.00, 448),
("Sour-Diesel", "Plant-Material", 15.00, 448),
("Blueberry-Haze", "Plant-Material", 10.00, 448),
("OG-Kush", "Plant-Material", 12.50, 224),
("Oregon-OG", "Plant Material", 12.50, 224),
("Grinder-Sm", "Accessories", 24.95, 100),
("Grinder-Lrg", "Accessories", 64.95, 150),
("Bic-Lighter-Single", "Accessories", 1.50, 200),
("Bic-Lighter-3Pack", "Accessories", 3.75, 200),
("Raw-Organic-Hemp-Papers", "Materials", 3.75, 350),
("Backwoods-Cigar", "Materials", 1.25, 250),
("Game-Dutch-Green", "Materials", 1.25, 250),
("Game-Dutch-Vanilla", "Materials", 1.25, 250),
("Game-Dutch-White-Grape", "Materials", 1.25, 250); 