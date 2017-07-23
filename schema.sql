DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
	product_id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(10) NOT NULL,
	primary key (product_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("telescope", "astronomy", 3499.99, 10),
("paint gallon", "home decor", 24.95, 30),
("kickball", "sports and outdoors", 9.98, 20),
("Monopoly", "games", 19.55, 7),
("Balderdash", "games", 10.88, 14),
("laundry detergent", "household", 59.95, 214),
("tape", "stationery", 1.85, 324),
("treadmill", "fitness", 899, 6),
("Tylenol", "OTC-Drugs", 13.19, 86),
("TV", "electronics", 19999, 3);