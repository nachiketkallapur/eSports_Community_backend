var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

router.post("/", async(req, res, next) => {
  console.log("Company Body Received", req.body);
  var isResponseSent = false;

  const {
    companyName,
    companyLocation,
    companyBio,
    companyUsername,
    companyPassword
  } = req.body;

  try {
    var salt = await bcrypt.genSalt();
    var hashedPassword = await bcrypt.hash(companyPassword, salt);
  } catch (err) {
    res.send(err);
    isResponseSent = true;
  }

  try {
    sql.query(
      "Insert into company(Comp_name,Comp_location,Comp_bio,Comp_username,Comp_password) values?",
      [[[
        companyName,
        companyLocation,
        companyBio,
        companyUsername,
        hashedPassword
      ]]],
      (err, results, fields) => {
        if (!err) {
          console.log("Query1 successful");
          console.log("Successfully added data to database");
          if(!isResponseSent){
            res.send("Successfully added data to database");
            isResponseSent=true;
          }
        } else {
          console.log(err)
          if (!isResponseSent) {
            res.send(err.sqlMessage);
            isResponseSent = true;
          }
        }
      },
    );
  } catch (error) {
    if(!isResponseSent){
      res.send(error.message);
      isResponseSent=true;
    }
  }
});

module.exports = router;
