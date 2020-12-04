var express = require('express');
var router = express.Router();
var sql = require('../mysql-connection');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send({name:'Nachiket'});
});

router.post('/',(req,res,next) => {
 console.log("Player Body received ",req.body);
  res.send("Successfully player body received").status(200);
}) 

router.get('/test', (req,res,next) => {
  sql.query(`SELECT * FROM people`,(err,results,fields) => {
    if(err) console.log(error);
    else res.send(results);
  })

  // res.send("Success").status(200);
})

module.exports = router;