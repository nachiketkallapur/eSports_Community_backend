var express = require("express");
var router = express.Router();

router.post("/", (req, res, next) => {
  console.log("Clan Body Received", req.body);
  res.send("Successfully clan body received").status(200);
});

module.exports = router;
