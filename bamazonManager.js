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
    managerPrompt();
});

function managerPrompt() {
    inquirer.prompt({
            name: "managerList",
            type: "list",
            message: "Welcome the to InvManager! Select whether you would like to [View Products], [Check Low Inventory], [Add to Inventory], or [Add a Product]",
            choices: ["View Products", "Check Low Inventory", "Add to Inventory", "Add a Product"]
        })
        .then(function(answer) {
            switch (answer.managerList) {
                case "View Products":
                    showProducts();
                    break;
                case "Check Low Inventory":
                    checkLowInv();
                    break;
                case "Add to Inventory":
                    addInv();
                    break;
                case "Add a Product":
                    addProduct();
                    break;

            }
        })
}


// function which prompts the user for what action they should take

function showProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.table(res);
        managerPrompt();
        connection.end();



        // once you have the items, prompt the user for which they'd like to bid on

    })
};

function checkLowInv() {
    connection.query("Select *FROM products WHERE stock_quantity <=25", function(err, res) {
        if (err) throw err;
        console.table(res);
        managerPrompt();


    })
}

function addInv() {

    connection.query("SELECT * FROM products", function(err, res) {
        console.table(res);




        inquirer
            .prompt([{
                name: "itemId",
                type: "input",
                message: "Enter the id of the item you wish to update.",

            }, {
                name: "manQuantity",
                type: "input",
                message: "Enter the amount you wish to update.",

            }])
            .then(function(answer) {
                    let item = answer.itemId;
                    let quantity = answer.manQuantity;
                    let updatedInvQuantity;

                    connection.query("SELECT * FROM products WHERE ?", { item_id: item }, function(err, res) {
                        if (err) throw err;

                        let updatedInvQuantity = (res[0].stock_quantity + parseInt(quantity));

                        console.log(`You added ${quantity} of ${res[0].product_name}! Nice! That items inventory count is now ${updatedInvQuantity}! `);

                        connection.query("Update products set ? where ?", [{ stock_quantity: updatedInvQuantity }, { item_id: item }], function(err, res) {
                            if (err) throw err;
                            console.log(`The inventory for ${res[0].product_name} was updated!`);
                            connection.end();
                        })


                    })

                }
                // based on their answer, either call the bid or the post functions

            )
    });
}