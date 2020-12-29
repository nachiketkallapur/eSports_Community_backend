var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
var path = require("path");

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

router.post("/update", (req, res, next) => {
  const {
    C_username,
    C_name,
    C_category,
    C_size,
    G_name,
    C_email,
    P_username,
    C_level,
  } = req.body;
  var isResponseSent = false;
  var doesPlayerExist;

  try {
    sql.query(
      "select * from player where P_username=?",
      [[P_username]],
      (err, results, fields) => {
        if (err) {
          console.log(err.sqlMessage);
          if (!isResponseSent) {
            res.send({ message: err.sqlMessage, error: true });
            isResponseSent = true;
            doesPlayerExist = false;
            return;
          }
        } else if (results.length === 0) {
          console.log("Player doesn't exist");
          if (!isResponseSent) {
            res.send(
              {
                message: "Invalid clan leader. Such player doesn't exist",
                error: true,
              },
            );
            isResponseSent = true;
            doesPlayerExist = false;
            return;
          }
        } else {
          console.log("Valid clan leader");
          doesPlayerExist = true;
        }
      },
    );
  } catch (err) {
    console.log(err.message);
    if (!isResponseSent) {
      res.send({ message: err.message, error: true });
      isResponseSent = true;
      doesPlayerExist = false;
      return;
    }
  }

  var isLeaderAlreadyMemberOfClan;

  try {
    sql.query(
      "select * from player_isMemberOf_clan where P_username=?and C_name=? ",
      [P_username, C_name],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          if (!isResponseSent) {
            res.send({ error: true, message: err.sqlMessage });
            isResponseSent = true;
            return;
          }
        } else if (results.length === 0) {
          isLeaderAlreadyMemberOfClan = false;
        } else {
          isLeaderAlreadyMemberOfClan = true;
        }
      },
    );
  } catch (err) {
    console.log(err);
    if (!isResponseSent) {
      res.send({ error: true, message: err.message });
      isResponseSent = true;
      return;
    }
  }

  setTimeout(() => {
    if (doesPlayerExist === true) {
      if (isLeaderAlreadyMemberOfClan === false) {
        try {
          sql.query(
            "insert into player_isMemberOf_clan(P_username,C_name,activity) values?",
            [[[P_username, C_name, 0]]],
            (err, results, fields) => {
              if (err) {
                console.log(err);
                if (!isResponseSent) {
                  res.send({ error: true, message: err.sqlMessage });
                  isResponseSent = true;
                  return;
                }
              } else {
                console.log("Leader inserted into the clan");
              }
            },
          );
        } catch (err) {
          console.log(err);
          if (!isResponseSent) {
            res.send({ error: true, message: err.message });
            isResponseSent = true;
            return;
          }
        }
      }

      try {
        sql.query(
          "update clan set C_category=?, C_size=?, G_name=?,C_email=?,P_username=?,C_level=? where C_name=?",
          [C_category, C_size, G_name, C_email, P_username, C_level, C_name],
          (err, results, fields) => {
            if (err) {
              console.log(err.sqlMessage);
              if (!isResponseSent) {
                res.send({ message: err.sqlMessage, error: true });
                isResponseSent = true;
                return;
              }
            } else {
              console.log("Updated clan successfully");
              if (!isResponseSent) {
                res.send(
                  { message: "Updated clan successfully", error: false },
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
          res.send({ message: err.message, error: true });
          isResponseSent = true;
          return;
        }
      }
    }
  }, 1000);
});

router.post("/addNewPlayer", (req, res, next) => {
  /*First time player joins any clan*/
  var isResponseSent = false;

  const { playerUsername, clanUsername, playerEmail,playerName } = req.body;
  console.log("299" ,req.body)
  const activity = 0;
  var clanName;

  try {
    sql.query(
      "select * from player where P_username=?",
      [[playerUsername]],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          if (!isResponseSent) {
            res.send({ error: true, message: err.sqlMessage });
            isResponseSent = true;
            return;
          }
        } else if (results.length === 0) {
          console.log("Such player doesn't exist");
          if (!isResponseSent) {
            res.send({ error: true, message: "Such player doesn't exist" });
            isResponseSent = true;
            return;
          }
        } else {
          console.log("Player exists in DB");
        }
      },
    );
  } catch (err) {
    console.log(err);
    if (!isResponseSent) {
      res.send({ error: true, message: err.message });
      isResponseSent = true;
      return;
    }
  }

  try {
    sql.query(
      "select C_name from clan where C_username=?",
      [[clanUsername]],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          if (!isResponseSent) {
            res.send({ error: true, message: err.sqlMessage });
            return;
          }
        } else if (results.length === 0) {
          console.log("Such clan doesn't exist");
          if (!isResponseSent) {
            res.send({ error: true, message: "Such clan doesn't exist" });
            isResponseSent = true;
            return;
          }
        } else {
          console.log("Fetched clanName from clanUsername");
          clanName = results[0].C_name;
          /*Now insert into player_isMemberOf_clan*/
          try {
            sql.query(
              "insert into player_isMemberOf_clan(P_username,C_name,activity) values?",
              [[[playerUsername, clanName, activity]]],
              (err, results, fields) => {
                if (err) {
                  console.log(err);
                  if (!isResponseSent) {
                    res.send({ error: true, message: err.sqlMessage });
                    isResponseSent = true;
                    return;
                  }
                } else {
                  console.log("Player added to clan successfully");

                  /*Send email notification to player that he was added to a clan*/

                  var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "nachiketgk.cs18@rvce.edu.in",
                      pass: "Jaishriram123",
                    },
                  });
                
                  const handlebarOptions = {
                    viewEngine: {
                      extName: ".handlebars",
                      partialsDir: path.resolve(__dirname, "templateViews"),
                      defaultLayout: false,
                    },
                    viewPath: path.resolve(__dirname, "templateViews"),
                    extName: ".handlebars",
                  };
                
                  transporter.use(
                    "compile",
                    hbs(handlebarOptions),
                  );
                
                  var mailOptions = {
                    from: "nachiketgk.cs18@rvce.edu.in",
                    to: playerEmail,
                    subject: "eSports Community official mail service",
                    template: "addNewPlayer",
                    context: {
                      clanName,
                      playerName
                    },
                  };
                
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      res.send({ message:`${playerUsername} added to ${clanName} successfully but email error\n`+error.message, error: true });

                      console.log("Error: ", error);
                      //   alert(error.message)
                    } else {
                      // res.send({ message: info.response, error: false });
                      //   alert(info.response);
                      console.log("Email sent: " + info.response);
                      if (!isResponseSent) {
                        res.send(
                          {
                            error: false,
                            message:
                              `${playerUsername} added to ${clanName} successfully and email notification sent `,
                          },
                        );
                        isResponseSent = true;
                        return;
                      }
                    }
                  });

                  
                }
              },
            );
          } catch (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send({ error: true, message: err.message });
              isResponseSent = true;
              return;
            }
          }
        }
      },
    );
  } catch (err) {
    console.log(err);
    if (!isResponseSent) {
      res.send({ error: true, message: err.message });
      isResponseSent = true;
      return;
    }
  }

  // setTimeout(() => {

  // }, 1000);
});

router.post("/requestToJoin", (req, res, next) => {
  const { clanEmail, playerUsername } = req.body;

  console.log(req.body);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nachiketgk.cs18@rvce.edu.in",
      pass: "Jaishriram123",
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, "templateViews"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "templateViews"),
    extName: ".handlebars",
  };

  transporter.use(
    "compile",
    hbs(handlebarOptions),
  );

  var mailOptions = {
    from: "nachiketgk.cs18@rvce.edu.in",
    to: clanEmail,
    subject: "eSports Community official mail service",
    template: "requestToJoinClan",
    context: {
      playerUsername,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send({ message: error.message, error: true });
      console.log("Error: ", error);
      //   alert(error.message)
    } else {
      res.send({ message: info.response, error: false });
      //   alert(info.response);
      console.log("Email sent: " + info.response);
    }
  });
});
module.exports = router;
