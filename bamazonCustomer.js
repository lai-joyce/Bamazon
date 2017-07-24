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

// make sure only positive integers are taken for inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return "Please enter a positive integer.";
	}
}

function productsFORSALE() {
	console.log("Items available for purchase: \n");
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		// console.log(res);
		for (var i = 0; i < res.length; i++) {
			console.log("Item ID: " + res[i].product_id
				+ "  |  " + "Product Name: " + res[i].product_name
				+ "   |   " + "Price: " + res[i].price);
		}

		console.log("----------------------------------------------------------");
		
		// connection.end();
		selectProducts();
	});
}

productsFORSALE();

function selectProducts() {
	inquirer.prompt([
	{
		name: "product_id",
		type: "input",
		message: "What is the Item ID of what you'd like to buy?",
		validate: validateInput,
		filter: Number
	}, {
		name: "quantity",
		type: "input",
		message: "How many are you buying?",
		validate: validateInput,
		filter: Number
	}
	]).then(function(answer) {
		// console.log(answer.product_id);
		// console.log(answer.quantity)
		var product = answer.product_id;
		var quantity = answer.quantity;

		//query database to see that item has sufficient quantity
		var queryDB = "SELECT * FROM products WHERE ?";

		connection.query(queryDB, {product_id: product}, function (err, data) {
			if (err) throw err;

			// console.log("data = " + JSON.stringify(data));
			// console.log(data);
			if (data.length === 0) {
				console.log("Please select an Item ID.");
				productsFORSALE();
			} else {
				var productInfo = data[0];
				// console.log(data);

				//if item is in stock
				if (quantity <= productInfo.stock_quantity) {
					console.log("This item is in stock.");

					var queryUpdate = "UPDATE products SET stock_quantity = "
					+ (productInfo.stock_quantity - quantity) + " WHERE product_id = "
					+ product;

					// console.log(queryUpdate);

					//update database
					connection.query(queryUpdate, function(err, data) {
						if (err) throw err;

						console.log("Order placed! Your total is $" + productInfo.price * quantity);
						console.log("\n---------------------------------------------------------\n");

						connection.end();
					})
				} else {
					console.log("Not enough in stock.");
					console.log("Try again.");
					console.log("\n------------------------------------------\n");

					productsFORSALE();
				}
			}
		})
	})
}

