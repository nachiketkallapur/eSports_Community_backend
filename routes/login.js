var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

router.post("/player", (req, res, next) => {
  console.log("Player Login Credentals Received", req.body);

  try {
    sql.query("SELECT * FROM player", async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      var user = results.find((result) =>
        result.P_username === req.body.username
      );

      if (!user) {
        console.log("User doesn't exist");
        return res.send("User doesn't exist");
      }

      try {
        if (await bcrypt.compare(req.body.password, user.P_password)) {
          console.log("Successful login");
          return res.send("Successful login");
        } else {
          console.log("Incorrect password");
          return res.send("Incorrect password");
        }
      } catch (err) {
        console.log(err);
        return res.send(err);
      }
    });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

router.post("/clan", (req, res, next) => {
  console.log("Clan Login Credentals Received", req.body);

  try {
    sql.query("SELECT * FROM clan", async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.send(err.sqlMessage);
      }
      var user = results.find((result) =>
        result.C_username === req.body.username
      );

      if (!user) {
        console.log("User doesn't exist");
        return res.send("User doesn't exist");
      }

      try {
        if (await bcrypt.compare(req.body.password, user.C_password)) {
          console.log("Successful login");
          return res.send("Successful login");
        } else {
          console.log("Incorrect password");

          return res.send("Incorrect password");
        }
      } catch (err) {
        console.log(err)
        return res.send(err);
      }
    });
  } catch (err) {
    return res.send(err);
  }
});

router.post("/company", (req, res, next) => {
  console.log("Company Login Credentals Received", req.body);

  try {
    sql.query("SELECT * FROM company", async (err, results, fields) => {
      if (err) {
        return res.send(err);
      }
      var user = results.find((result) =>
        result.Comp_username === req.body.username
      );

      if (!user) {
        return res.send("User doesn't exist");
      }

      try {
        if (await bcrypt.compare(req.body.password, user.Comp_password)) {
          return res.send("Successful login");
        } else {
          return res.send("Incorrect password");
        }
      } catch (err) {
        return res.send(err);
      }
    });
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
