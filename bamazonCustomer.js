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
    console.log(`
~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

    Welcome to the Green Gatsby, a Premium New Jersey Marijuana Dispensary!
    
~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
`)
        // run the start function after the connection is made to show the inventory and promt the user
    showProducts();
});



// function which prompts the user to select an item and enter the number of selected item they wish to purchase
function promtStart() {

    inquirer
        .prompt([{
            name: "itemId",
            type: "input",
            message: "Enter the item ID of the Product you wish to purchase: ",

        }, {
            name: "custQuantity",
            type: "input",
            message: "Enter your desired quantity: ",

        }])
        .then(function(answer) {
            //we set these variables to easily access our customer's choices from the promt
            let item = answer.itemId;
            let quantity = answer.custQuantity;
            //these variables will help give the order totals to our user and database
            let userCost;
            let updatedQuantity;
            let prodName;

            connection.query("SELECT * FROM products WHERE ?", { item_id: item }, function(err, res) {
                prodName = res[0].product_name;
                stock = res[0].stock_quantity;
                if (err) throw err;

                if (quantity > stock) {
                    //returns a message to the customer if the quantity they want is more than the current stock
                    console.log(`
------------------------------
------------------------------

    I'm sorry, we are unable to fufill the amount you request.  
        You requested ${quantity}, and our store only has ${stock} of ${prodName} in stock!
        Please enter an amount less than or equal to ${stock} if you wish to purchase ${prodName}!
    Thank you!

------------------------------
------------------------------
`);
                    //fires the promts again so they can try to make another purchase
                    showNoTable();

                } else {
                    //getting our user's total and updating our inventory
                    let userCost = quantity * res[0].price;
                    let updatedQuantity = res[0].stock_quantity - quantity;
                    console.log(`
------------------------------                    
------------------------------

    Thank you for your purchase!
        Your cart now contains ${quantity} of ${prodName}! Nice! 
        Your total is ${userCost} dollars!

------------------------------                    
------------------------------
`);

                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updatedQuantity }, { item_id: item }], function(err, res) {
                        if (err) throw err;
                        // console.log(res);
                        //we dont really need this console.log message for our customers to see
                        //                         console.log(`
                        // ------------------------------
                        // ------------------------------

                        //     The inventory for ${prodName} was succesfully updated!

                        // ------------------------------
                        // ------------------------------`);
                        continueShopping()

                    })
                }
                //end our connection to our database server once we are done purchasing
                // connection.end();
            })
        });
}

function showProducts() {
    //selects everything from our products table, displays it to our user, and then runs our promt function
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promtStart();

        // once you have the items, prompt the user for which they'd like to bid on

    })
};

function showNoTable() {
    //this function regrabs the info from our db, without flooding the CLI with our table again, and asks the user to make another selection
    //it occured to me after the fact that this is ACTUALLY no good
    //the user will have had made a purchase, and they need to see the new updated inventory, so reshowing the table is a GOOD thing

    connection.query("SELECT * FROM products", function(err, res) {
        promtStart();

    })

}

function continueShopping() {
    //this function is to ask the customer if the want to continue shopping or if they are finished
    inquirer.prompt({
            name: "continue",
            type: "list",
            message: "Thank you for shopping with the Green Gatsby! Would you like to continue shopping?",
            choices: ["Yes, please!", "No thanks, I'm good!"]
        })
        .then(function(answer) {
            switch (answer.continue) {
                case "Yes, please!":
                    // connection.end();
                    showProducts();
                    break;
                case "No thanks, I'm good!":
                    connection.end();
                    console.log(` 
*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
     Thanks again for checking us out!  See you soon!             
~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~`)
                    break;
            }
        })
};