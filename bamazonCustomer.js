var mysql = require("mysql");
var inquirer = require("inquirer");
var ctable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Octopus0687@",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    showProducts();
});




// function which prompts the user for what action they should take
function promtStart() {
    inquirer
        .prompt([{
            name: "itemId",
            type: "input",
            message: "Enter the id of the item you wish to purchase",

        }, {
            name: "custQuantity",
            type: "input",
            message: "Enter your desired quantity",

        }])
        .then(function(answer) {
            let item = answer.itemId;
            let quantity = answer.custQuantity;
            let userCost;
            let updatedQuantity;

            connection.query("SELECT * FROM products WHERE ?", { item_id: item }, function(err, res) {
                    if (err) throw err;

                    if (quantity > res[0].stock_quantity) {
                        console.log("Insufficient Quantity");
                    } else {

                        let userCost = quantity * res[0].price;
                        let updatedQuantity = res[0].stock_quantity - quantity;

                        console.log(`You purchased ${quantity} of ${res[0].product_name}! Nice! Your total is ${userCost}! `);

                        connection.query("Update products set ? where ?", [{ stock_quantity: updatedQuantity }, { item_id: item }], function(err, res) {
                            if (err) throw err;
                            console.log(`The inventory for ${res[0].product_name} was updated!`);
                        })





                    }
                    connection.end();
                }
                // based on their answer, either call the bid or the post functions

            )
        });
}

function showProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.table(res);
        promtStart();

        // once you have the items, prompt the user for which they'd like to bid on

    })
};