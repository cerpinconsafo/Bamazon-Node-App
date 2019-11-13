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
    
        Welcome to the Green Gatsby Inventory Manager!
        
~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
    
    
    `)
        // run the start function after the connection is made to prompt the user
    managerPrompt();
});

function managerPrompt() {
    inquirer.prompt({
            name: "managerList",
            type: "list",
            message: "Select one of the following: ",
            choices: ["View Products", "Check Low Inventory", "Add to Inventory", "Add a Product", "Exit"]
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
                case "Exit":
                    connection.end();
                    console.log(`
~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

Thanks for using the Green Gatsby Inventory Manager

~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
`);
                    break;



            }
        })
}
//
//
//our functions for the switch case live here
//
//


// function which prompts the user for what action they should take

function showProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.table(res);
        managerPrompt();
    })
};

// function to show only table rows that have a stock under 25

function checkLowInv() {
    connection.query("Select *FROM products WHERE stock_quantity <=25", function(err, res) {
        if (err) throw err;
        console.table(res);
        managerPrompt();


    })
}

//function to add more of a particular item to the database
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
                        prodName = res[0].product_name;
                        if (err) throw err;

                        let updatedInvQuantity = (res[0].stock_quantity + parseInt(quantity));

                        console.log(`
*****************************
-----------------------------

You added ${quantity} of ${prodName}! 
${prodName}'s inventory count is now set to ${updatedInvQuantity}! 

-----------------------------
*****************************
`);

                        connection.query("Update products set ? where ?", [{ stock_quantity: updatedInvQuantity }, { item_id: item }], function(err, res) {
                            if (err) throw err;
                            // console.log("stock quantity updated");
                            managerPrompt()
                        })


                    })

                }
                // based on their answer, either call the bid or the post functions

            )
    });
}

function addProduct() {
    inquirer
        .prompt([{
                name: "newProdName",
                type: "input",
                message: `
Please enter the name of the product you wish to add
(ie: Purple-Haze or Game-Dutch-Peach, etc)
`,

            },
            {
                name: "newProdDepartment",
                type: "list",
                message: "Select one of the following: ",
                choices: ["Plant-Material", "Accessories", "Materials"]
            },
            {
                name: "newProdPrice",
                type: "input",
                message: "Please specify a PPU for the new item: ",

            },
            {
                name: "newProdQuantity",
                type: "input",
                message: "Please enter the amount you wish to add to the inventory: ",

            }
        ])
        .then(function(answer) {
            //we set these variables to easily access our customer's choices from the prompt
            let newProd = answer.newProdName;
            let newDep = answer.newProdDepartment;
            let newPrice = answer.newProdPrice;
            let newQuantity = answer.newProdQuantity;
            //these variables will help keep track of our new item values

            let query = connection.query("INSERT INTO products SET ?", {
                    product_name: newProd,
                    department_name: newDep,
                    price: newPrice,
                    stock_quantity: newQuantity
                },
                function(err, res) {
                    if (err) throw err;

                    console.log(`
*****************************
-----------------------------

    You have successfully added ${newQuantity} ${newProd} to the ${newDep} Department, with a PPU of ${newPrice}!      
    
*****************************
-----------------------------
`);
                    managerPrompt();
                }
            );
            // logs the actual query being run
            // console.log(query.sql);


        });
}