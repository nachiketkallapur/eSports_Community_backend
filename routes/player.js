var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

/*Adding a new player*/
router.post("/", async (req, res, next) => {
  console.log("Player Body received ", req.body);
  var isResponseSent = false;
  var temp = {
    "operation": "1",
    "result": "", //0 or 1
    "message": "",
  };
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
    return;
  }
  var iscityStatePresent;

  try {
    sql.query("select * from citystate", async (err, results, fields) => {
      if (err) {
        if (!isResponseSent) {
          res.send(err);
          isResponseSent = true;
          return;
        }
      } else {
        var user = results.find((user) => user.P_city === playerCity);
        console.log("User: ", user);
        if (!user) {
          iscityStatePresent = false;
          // break;
        } else {
          iscityStatePresent = true;
          console.log("City-state exists");
          // break;
        }
      }
    });
  } catch (err) {
    if (!isResponseSent) {
      res.send(err);
      isResponseSent = true;
      return;
    }
  }

  setTimeout(() => {
    if (iscityStatePresent === false) {
      try {
        sql.query(
          "insert into citystate(P_city,P_state) values? ",
          [[[playerCity, playerState]]],
          (err, result, fields) => {
            if (err) {
              if (!isResponseSent) {
                res.send(err);
                isResponseSent = true;
                return;
              }
            } else {
              console.log("New city-state-added");
            }
          },
        );
      } catch (error) {
        if (!isResponseSent) {
          res.send(error);
          isResponseSent = true;
          return;
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
          if (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send(err.sqlMessage);
              isResponseSent = true;
              return;
            }
          } else {
            console.log("Player table query successful");
          }
        },
      );
    } catch (error) {
      console.log("Line 48: ", error);
      if (!isResponseSent) {
        res.send(error.message);
        isResponseSent = true;
        return;
      }
    }
  }, 1000);

  try {
    sql.query(
      "Insert into youtube(Y_channelName,P_username) values?",
      [[[playerYTChannel, playerUsername]]],
      (err, results, fields) => {
        if (!err) {
          console.log("Youtube table query successful");
          console.log("Successfully added data to database");
          if (!isResponseSent) {
            res.send("Successfully added data to database");
            isResponseSent = true;
            return;
          }
        } else {
          if (!isResponseSent) {
            res.send(err.sqlMessage);
            isResponseSent = true;
            return;
          }
        }
      },
    );
  } catch (error) {
    if (!isResponseSent) {
      res.send(error.message);
      isResponseSent = true;
      return;
    }
  }
});

router.post("/fetch", (req, res, next) => {
  console.log(req.body);
  const { playerUsername, all } = req.body;

  if (all === true) {
    try {
      sql.query(
        "select * from player p, citystate c where p.P_city=c.P_city",
        (err, results, fields) => {
          if (err) {
            res.send(
              { message: "Error in fetching players", data: [], error: false },
            );
            return;
          } else {
            res.send(
              {
                message: "Fetched players successfully",
                data: results,
                error: false,
              },
            );
            return;
          }
        },
      );
    } catch (err) {
      console.log(err);
      res.send({ message: err.message, data: [] });
      return;
    }
  } else {
    try {
      sql.query(
        "select * from player p,citystate c where p.P_city=c.P_city and P_username=?",
        [[playerUsername]],
        (err, results, fields) => {
          if (err) {
            res.send(
              { message: err.sqlMessage, error: true, data: [] },
            );
            return;
          } else if (results.length === 0) {
            res.send(
              {
                message: "Player doesn't exist in plalyer table",
                data: [],
                error: false,
              },
            );
            return;
          } else {
            res.send(
              {
                message: "Fetched particular player successfully",
                error: false,
                data: results,
              },
            );
            return;
          }
        },
      );
    } catch (err) {
      console.log(err);
      res.send({ message: err.message, data: [] });
      return;
    }
  }
});

router.post("/update", (req, res, next) => {
  console.log("Received body for update: ", req.body);
  const { P_name, P_username, P_city, P_state, P_age, Y_channelName, P_email } =
    req.body;

  // try{
  //   sql.query("insert into citystate(P_city,P_state) values?",[[[P_city,P_state]]],
  //   (err,results,fields)=>{
  //     if(err){
  //       console.log(err);
  //       res.send({message:err.sqlMessage,error:false}); return;
  //     } else {
  //       console.log("updated citystate table");
  //       // res.send({message:"Updated citystate table",error:false}); return;
  //     }
  //   })
  // } catch(err){
  //   console.log(err);
  //   res.send({message:err.message,error:true});return;
  // }

  try {
    sql.query(
      "update player set P_name=?,P_age=?,P_email=? where P_username=?",
      [P_name, P_age, P_email, P_username],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.send({ message: err.sqlMessage, error: true });
          return;
        } else {
          console.log("updated player table");
          // res.send({message:"updated player table",error:false}); return;
        }
      },
    );
  } catch (err) {
    console.log(err);
    res.send({ message: err.message, error: true });
    return;
  }

  try {
    sql.query(
      "update youtube set Y_channelName=? where P_username=?",
      [Y_channelName, P_username],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.send({ message: err.sqlMessage, error: true });
          return;
        } else {
          console.log("updated youtube table");
          res.send(
            { message: "updated player and youtube table", error: false },
          );
          return;
        }
      },
    );
  } catch (err) {
    console.log(err);
    res.send({ message: err.message, error: true });
  }
});


module.exports = router;
