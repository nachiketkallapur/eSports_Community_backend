var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

router.post("/", async(req, res, next) => {
  console.log("Clan Body Received", req.body);
  var isResponseSent = false;

  const {
    clanName,
    clanCategory,
    clanSize,
    clanGame,
    clanUsername,
    clanPassword,
  } = req.body;

  try {
    var salt = await bcrypt.genSalt();
    var hashedPassword = await bcrypt.hash(clanPassword, salt);
  } catch (err) {
    res.send(err);
    isResponseSent = true;
  }

  try {
    sql.query(
      "Insert into clan(C_name,C_category,C_size,G_name,C_username,C_password) values?",
      [[[
        clanName,
        clanCategory,
        clanSize,
        clanGame,
        clanUsername,
        hashedPassword,
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
