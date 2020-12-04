const mysql = require("mysql");

const mySQLConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"rvce",
    password:"password",
    multipleStatements:true
})

mySQLConnection.connect((err) => {
    if(err) throw err;
    else console.log("Connected");
    
})

module.exports = mySQLConnection;
