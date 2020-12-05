var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

router.post("/player", (req, res, next) => {
  console.log("PlayerLogin Credentals Received", req.body);

  try {
    sql.query('SELECT * FROM player',async(err,results,fields) => {
        if(err){
            return res.send(err);
        }
        var user = results.find(result => result.username===req.body.username);

        if(!user){
            return res.send("User doesn't exist");
        }

        try{
            if(await bcrypt.compare(req.body.password,user.password)){
                return res.send("Successful login");
            }
            else{
                return res.send("Incorrect password");
            }
        } catch(err){
            return res.send(err);
        }
    })
  } catch(err){
      return res.send(err);
  }
});

router.post("/clan", (req, res, next) => {
    console.log("Clan Login Credentals Received", req.body);
  
    try {
      sql.query('SELECT * FROM clan',async(err,results,fields) => {
          if(err){
              return res.send(err);
          }
          var user = results.find(result => result.username===req.body.username);
  
          if(!user){
              return res.send("User doesn't exist");
          }
  
          try{
              if(await bcrypt.compare(req.body.password,user.password)){
                  return res.send("Successful login");
              }
              else{
                  return res.send("Incorrect password");
              }
          } catch(err){
              return res.send(err);
          }
      })
    } catch(err){
        return res.send(err);
    }
  });

  router.post("/company", (req, res, next) => {
    console.log("Company Login Credentals Received", req.body);
  
    try {
      sql.query('SELECT * FROM company',async(err,results,fields) => {
          if(err){
              return res.send(err);
          }
          var user = results.find(result => result.username===req.body.username);
  
          if(!user){
              return res.send("User doesn't exist");
          }
  
          try{
              if(await bcrypt.compare(req.body.password,user.password)){
                  return res.send("Successful login");
              }
              else{
                  return res.send("Incorrect password");
              }
          } catch(err){
              return res.send(err);
          }
      })
    } catch(err){
        return res.send(err);
    }
  });

module.exports = router;
