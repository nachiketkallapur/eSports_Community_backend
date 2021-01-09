var express = require("express");
var router = express.Router();
var sql = require("../mysql-connection");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
var path = require("path");

router.post("/getInterestedUsersEmail", (req, res, next) => {
  /*playersEmail is array of player usernames*/
  const { interestedUsernames } = req.body;

  console.log(req.body);

  let playerEmails = {};
  var isResponseSent = false;
  // var n = playerUsernames.length;

  interestedUsernames.forEach((username) => {
    if (username.split("@")[1] === "player.com") {
      try {
        sql.query(
          "select P_email from player where P_username=?",
          [[username]],
          (err, results, fields) => {
            if (err) {
              console.log(err);
              if (!isResponseSent) {
                res.send(
                  { message: err.sqlMessage, error: true, dataObject: {} },
                );
                isResponseSent = true;
                return;
              }
            } else {
              // console.log(results[0].P_email)
              playerEmails[username] = results[0].P_email;
            }
          },
        );
      } catch (err) {
        console.log(err);

        if (!isResponseSent) {
          res.send({ message: err.message, error: true, dataObject: {} });
          isResponseSent = true;
          return;
        }
      }
    } else if (username.split("@")[1] === "clan.com") {
      try {
        sql.query(
          "select C_email from clan where C_username=?",
          [[username]],
          (err, results, fields) => {
            if (err) {
              console.log(err);
              if (!isResponseSent) {
                res.send(
                  { message: err.sqlMessage, error: true, dataObject: {} },
                );
                isResponseSent = true;
                return;
              }
            } else {
              // console.log(results[0].P_email)
              playerEmails[username] = results[0].C_email;
            }
          },
        );
      } catch (err) {
        console.log(err);

        if (!isResponseSent) {
          res.send({ message: err.message, error: true, dataObject: {} });
          isResponseSent = true;
          return;
        }
      }
    }
  });

  /*Settimeout because to let all queries executed*/

  setTimeout(() => {
    if (!isResponseSent) {
      res.send(
        {
          message: "Successfully fetched emails of all users",
          error: false,
          dataObject: playerEmails,
        },
      );
      isResponseSent = true;
      return;
    }
  }, 500);
});

router.post("/confirmParticipation", (req, res, next) => {
  console.log(req.body);
  const {
    username,
    userEmail,
    eventName,
    eventDataTime,
    eventLocation,
    eventOrganiser,
    eventOrganiserEmail,
  } = req.body;

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
    to: userEmail,
    subject: "eSports Community confirm Participation mail",
    template: "confirmParticipation",
    context: {
      username,
      eventName,
      eventDataTime,
      eventLocation,
      eventOrganiser,
      eventOrganiserEmail
    }
  };

//   console.log("Till here")
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send({ message: error.message, error: true });
      console.log("Error: ", error);
      //   alert(error.message)
    } else {
      res.send(
        {
          message: "Confirmation email sent to " + username,
          error: false,
        },
      );
      //   alert(info.response);
      console.log("Email sent: " + info.response);
    }
  });
});

module.exports = router;
