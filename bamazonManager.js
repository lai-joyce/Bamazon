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
					// exit(1);
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
			// exit(1);
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

function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return "Please enter a positive integer.";
	}
}

function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return "Must enter a positive number.";
	}
}

function addToExistingInventory() {
	inquirer.prompt([
	{
		name: "product_id",
		type: "input",
		message: "Which Item ID do you want to add more to?",
		validate: validateInput,
		filter: Number
	},
	{
		name: "quantity",
		type: "input",
		message: "How many of these do you want to add?",
		validate: validateInput,
		filter: Number
	}
	]).then(function(answers) {
		// console.log(answers.product_id);
		var product = answers.product_id;
		var quantityToAdd = answers.quantity;

		var query = "SELECT * FROM products WHERE ?";

		connection.query(query, {product_id: product}, function(err, data) {
			if (err) throw err;
			if (data.length === 0) {
				console.log("Please select an Item ID.");
				addToExistingInventory();
			} else {
				var productInfo = data[0];

				console.log("Inventory is being updated......");

				var queryToAdd = "UPDATE products SET stock_quantity = "
				+ (productInfo.stock_quantity + quantityToAdd) + " WHERE product_id = " + product;
				// console.log(queryToAdd);

				connection.query(queryToAdd, function(err, data) {
					if (err) throw err;

					console.log("The count for Item ID " + product + " has been updated to " 
						+ (productInfo.stock_quantity + quantityToAdd) + ".");
					console.log("\n-----------------------------------------------------\n");

					connection.end();
				})
			}
		})
	})
}

managerActions();



