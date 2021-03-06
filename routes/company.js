var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var bcrypt = require("bcrypt");

router.post("/", async (req, res, next) => {
  console.log("Company Body Received", req.body);
  var isResponseSent = false;

  const {
    companyName,
    companyLocation,
    companyBio,
    companyUsername,
    companyPassword,
  } = req.body;

  try {
    var salt = await bcrypt.genSalt();
    var hashedPassword = await bcrypt.hash(companyPassword, salt);
  } catch (err) {
    console.log(err);
    if (!isResponseSent) {
      res.send(err);
      isResponseSent = true;
      return;
    }
  }

  try {
    sql.query(
      "Insert into company(Comp_name,Comp_location,Comp_bio,Comp_username,Comp_password) values?",
      [[[
        companyName,
        companyLocation,
        companyBio,
        companyUsername,
        hashedPassword,
      ]]],
      (err, results, fields) => {
        if (!err) {
          console.log("Successfully added data to database");
          if (!isResponseSent) {
            res.send(
              { message: "Successfully added data to database", error: false },
            );
            isResponseSent = true;
            return;
          }
        } else {
          console.log(err);
          if (!isResponseSent) {
            res.send({ message: err.sqlMessage, error: true });
            isResponseSent = true;
            return;
          }
        }
      },
    );
  } catch (error) {
    if (!isResponseSent) {
      res.send({ message: error.message, error: true });
      isResponseSent = true;
      return;
    }
  }
});

router.post("/fetch", (req, res, next) => {
  const { companyUsername, all } = req.body;
  var isResponseSent = false;

  if (all === true) {
    try {
      sql.query("select * from company", (err, results, fields) => {
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
                message: "Successfully fetched all companies",
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
        res.send({ message: err.message, error: true, data: [] });
        isResponseSent = true;
        return;
      }
    }
  } else if (all === false) {
    try {
      sql.query(
        "select * from company where Comp_username=?",
        [[companyUsername]],
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
                  message: "Successfully fetched particular company",
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
  const { Comp_name, Comp_username, Comp_bio, Comp_location } = req.body;
  var isResponseSent = false;

  try {
    sql.query(
      "update company set Comp_bio=?,Comp_location=?,Comp_name=? where Comp_username=?",
      [Comp_bio, Comp_location, Comp_name, Comp_username],
      (err, results, fields) => {
        if (err) {
          console.log(err.sqlMessage);
          if (!isResponseSent) {
            res.send({ message: err.sqlMessage, error: true });
            isResponseSent = true;
            return;
          }
        } else {
          console.log("Updated company successfully");
          if (!isResponseSent) {
            res.send({ message: "Updated company successfully", error: false });
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
});

router.post("/sponsor", (req, res, next) => {
  const { companyUsername, game } = req.body;
  var isResponseSent = false;

  try {
    sql.query(
      "select * from company_sponsors_game where Comp_username=? and G_name=?",
      [companyUsername, game],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          if (!isResponseSent) {
            res.send({ error: true, mesage: err.sqlMessage });
            isResponseSent = true;
            return;
          }
        } else if (results.length > 0) {
          console.log(
            companyUsername,
            " has already conducted one event for ",
            game,
          );
          if (!isResponseSent) {
            res.send(
              {
                error: false,
                message: companyUsername +
                  " has already conducted one event for " + game,
              },
            );
            isResponseSent = true;
            return;
          }
        } else {
          console.log(
            companyUsername,
            game,
            " record doesn't exists in the table company_sponsors_game",
          );

          try {
            sql.query(
              "insert into company_sponsors_game(Comp_username,G_name) values?",
              [[[companyUsername, game]]],
              (err, results, fields) => {
                if (err) {
                  console.log(err);
                  if (!isResponseSent) {
                    res.send({ error: true, message: err.sqlMessage });
                    isResponseSent = true;
                    return;
                  }
                } else {
                  console.log(
                    companyUsername,
                    game,
                    " record inserted successfully into the table company_sponsors_game",
                  );
                  if (!isResponseSent) {
                    res.send(
                      {
                        error: false,
                        messge: companyUsername + "," + game +
                          " record inserted successfully into the table company_sponsors_game",
                      },
                    );
                    isResponseSent = true;
                    return;
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
});

module.exports = router;
