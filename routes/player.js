var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send({ name: "Nachiket" });
});

router.post("/", (req, res, next) => {
  console.log("Player Body received ", req.body);
  // res.send("Successfully player body received").status(200);
});

router.post("/test", async (req, res, next) => {
  console.log("Body: ", req.body);

  try {
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // console.log("Salt: ", salt);
    // console.log("hashedPassword: ", hashedPassword);
    // var values = [];
    // values.push(req.body.name.toString());
    // values.push(hashedPassword.toString());
    // console.log(values)

    sql.query(`select * from test`, async (err, results, fields) => {
      if (err) {
        console.log(err);
        res.send(err)
      }
      else {
        var user = results.find(user => user.name===req.body.name);
        if(!user) {
          return res.send("user not found").status(400);
        }
        try {
          if(await bcrypt.compare(req.body.password, user.password)){
            res.send("Successful login");
          }
          else {
            res.send("Wrong Password");
          }
        }
        catch(err){
          res.send("Wrong Password");
        }
      }
    });

  } catch (err) {
    console.log(err.message);
    res.send("Error").status(400);
  }
});

module.exports = router;
