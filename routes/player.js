var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");


router.get("/", (req, res, next) => {
  res.send({ name: "Nachiket" });
});

router.post("/", async (req, res, next) => {
  console.log("Player Body received ", req.body);
  var isResponseSent = false;
  const {
    playerName,
    playerAge,
    playerSex,
    playerCity,
    playerState,
    playerYTChannel,
    playerUsername,
    playerPassword,
  } = req.body;
  try {
    var salt = await bcrypt.genSalt();
    var hashedPassword = await bcrypt.hash(playerPassword, salt);
  } catch (err) {
    res.send(err);
    isResponseSent = true;
  }
  var iscityStatePresent=false;
  try{
    sql.query("select * from citystate", async (err,results,fields)=>{
      if(err){
        if(!isResponseSent){
          res.send(err);
          isResponseSent=true;
        }
      } else {
        var user = results.find(user => user.P_city===playerCity);
        console.log("User: ",user);
        if(!user){
          iscityStatePresent=false;
        }else {
          console.log("City-state exists");
        }
      }
    })
  } catch(err){
    if(!isResponseSent){
      res.send(err);
      isResponseSent=true;
    }
  }

  if(iscityStatePresent===false){
    try {
      sql.query("insert into citystate(P_city,P_state) values? ",
    [[[playerCity,playerState]]],
    (err,result,fields)=>{
      if(err){
        if(!isResponseSent){
          res.send(err);
          isResponseSent=true;
        }
      }
      else{
        console.log("New city-state-added");
      }
    })

    } catch(error){
      if(!isResponseSent){
        res.send(error);
        isResponseSent=true;
      }
    }
  }

  try {
    sql.query(
      "Insert into player(P_name,P_age,P_sex,P_city,P_username,P_password) values?",
      [[[
        playerName,
        playerAge,
        playerSex,
        playerCity,
        playerUsername,
        hashedPassword,
      ]]],
      (err, results, fields) => {
        if (!err) {
          console.log("Player table query successful");
        } else {
          if (!isResponseSent) {
            res.send(err.sqlMessage);
            isResponseSent = true;
          }
        }
      },
    );
  } catch (error) {
    console.log("Line 48: ", error);
    if(!isResponseSent){
      res.send(error.message);
      isResponseSent=true;

    }
  }

  try {
    sql.query(
      "Insert into youtube(Y_channelName,P_username) values?",
      [[[playerYTChannel, playerUsername]]],
      (err, results, fields) => {
        if (!err) {
          console.log("Youtube table query successful");
          console.log("Successfully added data to database");
          if(!isResponseSent){
            res.send("Successfully added data to database");
            isResponseSent=true;
          }
        } else {
          if(!isResponseSent){
            res.send(err.sqlMessage);
            isResponseSent=true;
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
