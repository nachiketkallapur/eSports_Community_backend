var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send({name:'Nachiket'});
});

router.post('/',(req,res,next) => {
 console.log("Body: ",req.body);
  res.send("Successfully received body").status(200);
}) 

module.exports = router;