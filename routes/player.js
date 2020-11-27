var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send({name:'Nachiket'});
});

router.post('/',(req,res,next) => {
 console.log("Player Body received ",req.body);
  res.send("Successfully player body received").status(200);
}) 

module.exports = router;