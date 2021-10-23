const User = require("../models/user");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const { registerEmailParams } = require("../helpers/email");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secrectAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create the promise and SES service object
const ses = new AWS.SES({
  apiVersion: "2010-12-01",
});

exports.register = (req, res) => {
  // console.log("Register Controller", req.body);
  const { name, email, password } = req.body;

  // check if user exists in database
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is already in use",
      });
    }
    // generate json web token with name, email, passwaord
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "60m" }
    );

    // send email
    const params = registerEmailParams(email, name, token);

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
      .then((data) => {
        console.log("email submitted to ses", data);
        res.json({
          message: `Email has been sent to ${email}. Follow the instructions to complete your registration.`,
        });
      })
      .catch((err) => {
        console.log("ses email on register error", err);
        res.json({
          error: `Could not verify your email. Please try agin.`,
        });
      });
  });
};

exports.registerActivate = (req, res) => {
  const { token } = req.body;
  // console.log(token);
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decodedData) {
      if (err) {
        return res.status(401).json({
          error: "expired link. Please try again.",
        });
      }

      const { name, email, password } = jwt.decode(token);
    }
  );
};
