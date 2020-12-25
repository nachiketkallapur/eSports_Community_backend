var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

/*Add new clan*/
router.post("/", async (req, res, next) => {
  console.log("Clan Body Received", req.body);
  var isResponseSent = false;

  const {
    clanName,
    clanCategory,
    clanSize,
    clanGame,
    clanUsername,
    clanPassword,
  } = req.body;

  try {
    var salt = await bcrypt.genSalt();
    var hashedPassword = await bcrypt.hash(clanPassword, salt);
  } catch (err) {
    res.send(err);
    isResponseSent = true;
  }

  try {
    sql.query(
      "Insert into clan(C_name,C_category,C_size,G_name,C_username,C_password) values?",
      [[[
        clanName,
        clanCategory,
        clanSize,
        clanGame,
        clanUsername,
        hashedPassword,
      ]]],
      (err, results, fields) => {
        if (!err) {
          console.log("Query1 successful");
          console.log("Successfully added data to database");
          if (!isResponseSent) {
            res.send("Successfully added data to database");
            isResponseSent = true;
          }
        } else {
          console.log(err);
          if (!isResponseSent) {
            res.send(err.sqlMessage);
            isResponseSent = true;
          }
        }
      },
    );
  } catch (error) {
    if (!isResponseSent) {
      res.send(error.message);
      isResponseSent = true;
    }
  }
});

router.post("/fetch", (req, res, next) => {
  console.log("Received clan body for fetchL ", req.body);
  const { clanUsername, all } = req.body;
  var isResponseSent = false;

  if (all === true) {
    try {
      sql.query("select * from clan", (err, results, fields) => {
        if (err) {
          console.log(err.sqlMessage);
          if (!isResponseSent) {
            res.send({ message: err.sqlMessage, error: true, data: [] });
            isResponseSent = true;
            return;
          }
        } else {
          if (!isResponseSent) {
            res.send(
              {
                message: "Successfully fetched all clans",
                error: false,
                data: results,
              },
            );
            isResponseSent = true;
            return;
          }
        }
      });
    } catch (err) {
      console.log(err.message);
      if (!isResponseSent) {
        res.send({ message: err.message, data: [], error: true });
        isResponseSent = true;
        return;
      }
    }
  } else if (all === false) {
    try {
      sql.query(
        "select * from clan where C_username=?",
        [[clanUsername]],
        (err, results, fields) => {
          if (err) {
            console.log(err.sqlMessage);
            if (!isResponseSent) {
              res.send({ message: err.sqlMessage, error: true, data: [] });
              return;
            }
          } else {
            if (!isResponseSent) {
              res.send(
                {
                  message: "Successfully fetched particular clan",
                  error: false,
                  data: results,
                },
              );
              isResponseSent = true;
              return;
            }
          }
        },
      );
    } catch (err) {
      console.log(err.message);
      if (!isResponseSent) {
        res.send({ message: err.message, error: true, data: [] });
        isResponseSent = true;
        return;
      }
    }
  }
});

router.post("/update",(req,res,next) => {
  const { C_username, C_name, C_category, C_size, G_name } = req.body;
  var isResponseSent = false;
  try {

    sql.query("update clan set C_category=?, C_size=?, G_name=? where C_name=?",
    [C_category,C_size,G_name,C_name],
    (err,results,fields)=>{
      if(err){
        console.log(err.sqlMessage);
        if(!isResponseSent){
          res.send({message:err.sqlMessage,error:true});
          isResponseSent=true;
          return;
        }
      } else {
        console.log("Updated clan successfully");
        if(!isResponseSent){
          res.send({message:"Updated clan successfully",error:false});
          isResponseSent=true;
          return;
        }
      }
    })
    
  } catch (err) {

    console.log(err.message);
    if(!isResponseSent){
      res.send({message:err.message,error:true});
      isResponseSent=true;
      return;
    }
  }
  
})

module.exports = router;
