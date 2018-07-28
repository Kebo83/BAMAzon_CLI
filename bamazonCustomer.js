let mysql = require("mysql");
let inquirer = require("inquirer");
let keys = require('./keys.js');

let connection = mysql.createConnection(keys.connection)
connection.connect(function(err) {
    if (err) throw err;
    console.log("\n" + "\n" + "\n" + "\n" + "\n");
    displayItems();
    buy();

    function displayItems() {
        console.log("Let's See What's in the Store...\n");
        var query = connection.query("SELECT * FROM products",
            function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("\n" + " || Product ID:" + res[i].ID + " || Product: " + res[i].product_name + " || Price: $" + res[i].price + "|| Quantity: " + res[i].stock_quantity);
                }
            })

    };

   function buy() {
        connection.query('SELECT * FROM products', function (err, res) {
            if (err) throw err;
            inquirer.prompt(
                [
                    {name: 'itemNumber',
                        type: 'list',
                        message: 'What is the ID of the product they would like to buy?',
                        choices:
                            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
                    },
                    { type: 'number',
                        message: 'How many would you like to buy?',
                        name: 'howMany'
                    },
                ]).then(function (user) {
                    // console.log(user.itemNumber);
                    // console.log(user.howMany);
                    // console.log(res);
                    // console.log(res[user.itemNumber-1].stock_quantity);
                    if (err) throw err;
                    else if (res[user.itemNumber - 1].stock_quantity > user.howMany) {
                        var newQty = parseInt(res[user.itemNumber - 1].stock_quantity) - parseInt(user.howMany);
                        // console.log(newQty);
                        var totalPrice = parseFloat(user.howMany) * parseFloat(res[user.itemNumber - 1].price);
                        // console.log(totalPrice);
                    
                        connection.query('UPDATE products SET ? WHERE ?',
                            [{stock_quantity: newQty},
                            {ID: user.itemNumber }], 
                            function (error, results) {
                                if (error) throw error;
                                console.log('Your order for ' + user.howMany + ' ' + res[user.itemNumber - 1].product_name +
                                    '(s) has been placed.');
                                console.log('Your total is $' + totalPrice);
                                exit();
                            });
                    } else {
                        console.log("We're sorry, we only have " + res[user.itemNumber - 1].stock_quantity + " of that product. Please check back with us after we have restocked.");
                        exit();
                    }

                    function exit() {
                        connection.end();
                        console.log('Thanks for shopping at BAMAzon.' + '\n' + ' Have a great day!');
                    }
                }
                )
        }
        )
    }
});
