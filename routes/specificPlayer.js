var express=require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var sql = require('../mysql-connection');

router.get('/',(req,res,next)=>{
    console.log("Request: ",req);
    res.send("success");
})

module.exports = router;