var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

function managerActions() {
	inquirer.prompt([
	{
		name: "choice",
		type: "list",
		message: "Please select an action.",
		choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"],
		filter: function(value) {
			if (value === 'View products for sale') {
				return 'sale';
			} else if (value === 'View low inventory') {
				return 'lowInventory';
			} else if (value === 'Add to inventory') {
				return 'addInventory';
			} else if (value === 'Add new product') {
				return 'newProduct';
			} else {
					// when not available
					console.log("Action not available");
					exit(1);
				}
			}
		}
		]).then(function(answer) {
			if (answer.choice === "sale") {
				showInventory();
			} else if (answer.choice === 'lowInventory') {
				showLowInventory();
			} else if (answer.choice === 'addInventory') {
				addToExistingInventory();
			} else if (answer.choice === 'newProduct') {
				addNewProduct();
			} else {
			// when not available
			console.log("Action not available");
			exit(1);
		}
	})
	}

function showInventory() {
	console.log("Items available for purchase: \n");
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		// console.log(res);
		for (var i = 0; i < res.length; i++) {
			console.log("Item ID: " + res[i].product_id
				+ "  |  " + "Product Name: " + res[i].product_name
				+ "   |   " + "Price: " + res[i].price
				+ "  |  " + "Stock Quantity: " + res[i].stock_quantity);
		}

		console.log("----------------------------------------------------------");
		
		connection.end();
	});
}

function showLowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 50", function(err, data) {
		if (err) throw err;
		console.log("Low inventory items (below 50): ");
		console.log("-----------------------------------------------------------\n");

		for (var i = 0; i < data.length; i++) {
			console.log("Item ID: " + data[i].product_id
				+ "  |  " + "Product Name: " + data[i].product_name
				+ "   |   " + "Price: " + data[i].price
				+ "  |  " + "Stock Quantity: " + data[i].stock_quantity);
		}

		console.log("----------------------------------------------------------");
		
		connection.end();
	});
}

managerActions();



