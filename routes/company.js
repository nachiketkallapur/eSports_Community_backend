var express = require("express");
var router = express.Router();

router.post("/", (req, res, next) => {
  console.log("Company Body Received", req.body);
  res.send("Successfully company body received").status(200);
});

module.exports = router;
