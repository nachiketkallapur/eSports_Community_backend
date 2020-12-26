var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");

/*fetch game that a particular player plays*/
router.post("/fetch", (req, res, next) => {
  const { playerUsername, all } = req.body;
  console.log("Game body received: ", req.body);

  if (all === true) {
    try {
      sql.query(
        "select * from player_plays_game",
        (err, results, fields) => {
          if (err) {
            console.log(err);
            res.send({ message: err.sqlMessage, error: true, data: [] });
            return;
          } else if (results.length === 0) {
            console.log("player_plays_game table empty");
            res.send(
              {
                message: "player_plays_game table empty",
                error: true,
                data: [],
              },
            );
            return;
          } else {
            console.log("Successfully fetched player_plays_game table data");
            // console.log("Results: ",results)
            res.send(
              {
                message: "Successfully fetched player_plays_game table data",
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
      res.send({ message: err.message, error: true, data: [] });
      return;
    }
  } else if (all === false) {
    try {
      sql.query(
        "select * from player_plays_game where P_username=?",
        [[playerUsername]],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            res.send({ message: err.sqlMessage, error: true, data: [] });
            return;
          } else if (results.length === 0) {
            console.log("player hasn't updated game table");
            res.send(
              {
                message: "player hasn't updated game table",
                error: false,
                data: [],
              },
            );
            return;
          } else {
            console.log("Success");
            // console.log("Results: ",results)
            res.send({ message: "Success", error: false, data: results });

            return;
          }
        },
      );
    } catch (err) {
      console.log(err);
      res.send({ message: err.message, error: true, data: [] });
      return;
    }
  }
});

router.post("/update", (req, res, next) => {
  console.log("Game body received for update: ", req.body);
  const {
    P_username,
    pubg,
    cod,
    faug,
    pubgLevel,
    codLevel,
    faugLevel,
    isGameRecordPresent,
    pubgPresentPreviously,
    codPresentPreviously,
    faugPresentPreviously,
  } = req.body;

  var isResponseSent = false;
  var isRecordPresent = isGameRecordPresent;

  // try {
  //   sql.query(
  //     "select * from player_plays_game where P_username=?",
  //     [[P_username]],
  //     (err, results, fields) => {
  //       if (err) {
  //         console.log(err);
  //         res.send({ message: err.sqlMessage, error: true, data: [] });
  //         isResponseSent = true;
  //         return;
  //       } else if (results.length === 0) {
  //         console.log("player hasn't updated game table");
  //         // res.send({ message: "player hasn't updated game table", error: false, data: [] });
  //         // return;
  //         isRecordPresent = false;
  //       } else {
  //         console.log("Success");
  //         isRecordPresent = true;
  //         // results.map((result) => {
  //         //   if (result.G_name === "PUBG") pubgPresent = true;
  //         //   else if (result.G_name === "FAUG") faugPresent = true;
  //         //   else if (result.G_name === "COD") codPresent = true;
  //         // });
  //         // res.send({ message: "Success", error: false, data: results });
  //         // return;
  //       }
  //     },
  //   );
  // } catch (err) {
  //   console.log(err);
  //   if (!isResponseSent) {
  //     res.send({ message: err.message, error: true, data: [] });
  //     isResponseSent = true;
  //     return;
  //   }
  // }

  // console.log(pubgLevel,codLevel,faugLevel);

  // if (isRecordPresent === true) {
  if (pubgPresentPreviously === true) {
    try {
      sql.query(
        "update player_plays_game set P_level=? where P_username=? and G_name=?",
        [pubgLevel, P_username, "PUBG"],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send({ message: err.sqlMessage, error: true });
              isResponseSent = true;
              return;
            }
          } else {
            console.log("pubg record updated");
            // res.send({message:"Updated player_plays_game",error:false});
          }
        },
      );
    } catch (err) {
      console.log(err);
      if (!isResponseSent) {
        res.send({ message: err.message, error: true });
        isResponseSent = true;
        return;
      }
    }
  } else if (pubg === true) {
    try {
      sql.query(
        "insert into player_plays_game(P_username,G_name,P_level) values? ",
        [[[P_username, "PUBG", pubgLevel]]],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send({ message: err.sqlMessage, error: true });
              isResponseSent = true;
              return;
            }
          } else {
            console.log("pubg record created");
          }
        },
      );
    } catch (err) {
      console.log(err);
      if (!isResponseSent) {
        res.send({ message: err.message, error: true });
        isResponseSent = true;
        return;
      }
    }
  }
  if (codPresentPreviously === true) {
    try {
      sql.query(
        "update player_plays_game set P_level=? where P_username=? and G_name=?",
        [codLevel, P_username, "COD"],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send({ message: err.sqlMessage, error: true });
              isResponseSent = true;
              return;
            }
          } else {
            console.log("cod record updated");

            // res.send({message:"Updated player_plays_game",error:false});
          }
        },
      );
    } catch (err) {
      console.log(err);
      if (!isResponseSent) {
        res.send({ message: err.message, error: true });
        isResponseSent = true;
        return;
      }
    }
  } else if (cod === true) {
    try {
      sql.query(
        "insert into player_plays_game(P_username,G_name,P_level) values? ",
        [[[P_username, "COD", codLevel]]],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send({ message: err.sqlMessage, error: true });
              isResponseSent = true;
              return;
            }
          } else {
            console.log("cod record created");
          }
        },
      );
    } catch (err) {
      console.log(err);
      if (!isResponseSent) {
        res.send({ message: err.message, error: true });
        isResponseSent = true;
        return;
      }
    }
  }
  if (faugPresentPreviously === true) {
    try {
      sql.query(
        "update player_plays_game set P_level=? where P_username=? and G_name=?",
        [faugLevel, P_username, "FAUG"],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send({ message: err.sqlMessage, error: true });
              isResponseSent = true;
              return;
            }
          } else {
            console.log("faug record updated");

            // res.send({message:"Updated player_plays_game",error:false});
          }
        },
      );
    } catch (err) {
      console.log(err);
      if (!isResponseSent) {
        res.send({ message: err.message, error: true });
        isResponseSent = true;
        return;
      }
    }
  } else if (faug === true) {
    try {
      sql.query(
        "insert into player_plays_game(P_username,G_name,P_level) values? ",
        [[[P_username, "FAUG", faugLevel]]],
        (err, results, fields) => {
          if (err) {
            console.log(err);
            if (!isResponseSent) {
              res.send({ message: err.sqlMessage, error: true });
              isResponseSent = true;
              return;
            }
          } else {
            console.log("faug record created");
          }
        },
      );
    } catch (err) {
      console.log(err);
      if (!isResponseSent) {
        res.send({ message: err.message, error: true });
        isResponseSent = true;
        return;
      }
    }
  }
  // } else if (isRecordPresent === false) {
  //   if (pubg === true) {
  //     try {
  //       sql.query(
  //         "insert into player_plays_game(P_username,G_name,P_level) values? ",
  //         [[[P_username, "PUBG", pubgLevel]]],
  //         (err, results, fields) => {
  //           if (err) {
  //             console.log(err);
  //             if (!isResponseSent) {
  //               res.send({ message: err.sqlMessage, error: true });
  //               isResponseSent = true;
  //               return;
  //             }
  //           } else {
  //             console.log("pubg record created");
  //           }
  //         },
  //       );
  //     } catch (err) {
  //       console.log(err);
  //       if (!isResponseSent) {
  //         res.send({ message: err.message, error: true });
  //         isResponseSent = true;
  //         return;
  //       }
  //     }
  //   }
  //   if (cod === true) {
  //     try {
  //       sql.query(
  //         "insert into player_plays_game(P_username,G_name,P_level) values? ",
  //         [[[P_username, "COD", codLevel]]],
  //         (err, results, fields) => {
  //           if (err) {
  //             console.log(err);
  //             if (!isResponseSent) {
  //               res.send({ message: err.sqlMessage, error: true });
  //               isResponseSent = true;
  //               return;
  //             }
  //           } else {
  //             console.log("cod record created");
  //           }
  //         },
  //       );
  //     } catch (err) {
  //       console.log(err);
  //       if (!isResponseSent) {
  //         res.send({ message: err.message, error: true });
  //         isResponseSent = true;
  //         return;
  //       }
  //     }
  //   }
  //   if (faug === true) {
  //     try {
  //       sql.query(
  //         "insert into player_plays_game(P_username,G_name,P_level) values? ",
  //         [[[P_username, "FAUG", faugLevel]]],
  //         (err, results, fields) => {
  //           if (err) {
  //             console.log(err);
  //             if (!isResponseSent) {
  //               res.send({ message: err.sqlMessage, error: true });
  //               isResponseSent = true;
  //               return;
  //             }
  //           } else {
  //             console.log("faug record created");
  //           }
  //         },
  //       );
  //     } catch (err) {
  //       console.log(err);
  //       if (!isResponseSent) {
  //         res.send({ message: err.message, error: true });
  //         isResponseSent = true;
  //         return;
  //       }
  //     }
  //   }
  // }
  console.log("player_plays_game table updated successfully");
  if (!isResponseSent) {
    res.send(
      { message: "player_plays_game table updated successfully", error: false },
    );
    isResponseSent = true;
    return;
  }
});

module.exports = router;
