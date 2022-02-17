const User = require("../models/user");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const _ = require("lodash");
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require("../helpers/email");
const expressJwt = require("express-jwt");

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
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Please try again.",
        });
      }

      const { name, email, password } = jwt.decode(token);
      const username = shortid.generate();

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.status(401).json({
            error: "Email already in use",
          });
        }

        // register new user
        const newUser = new User({ username, name, email, password });
        newUser.save((err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database. Please try again later.",
            });
          }
          return res.json({
            message: "Registration success. Please login.",
          });
        });
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // check for user in db
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    // compare password to hashed password stored in db
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }
    // generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// req.user
// get user info from front end via jwt token
// This checks to see if a token is valid
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// check for user
exports.authMiddleware = (req, res, next) => {
  // req.user is the default for express-jwt package.
  // req.user._id is available because that's what was used when the token was generated (jwt.sign()) during the login process.
  // requireSignIn must be used first in the routes inorder to access req.user._id. otherwise this will not be available and the findOne({}) will not work.
  const authUserId = req.user._id;
  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "user not found",
      });
    }

    // Just like requireSignIn attached the user property to the request object and populated it with _id (userid), you can attach other properties and populate them with things like user info as done below with req.profile.
    req.profile = user;
    next();
  });
};

// check for admin
exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "user not found",
      });
    }

    if (user.role !== "admin") {
      res.status(401).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  // query db to see if users email exists

  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: "User with that email does not exist",
      });
    }
    // generate token and email to user

    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );

    // send email
    const params = forgotPasswordEmailParams(email, token);

    // populate the database user resetPaswordLink
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(404).json({
          error: "Failed to reset password. Try again later.",
        });
      }
      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          console.log("ses reset password success data: ", data);
          return res.json({
            message: `Email sent to ${email}. Follow the instructions to reset your password.`,
          });
        })
        .catch((error) => {
          console.log("ses reset password failed error: ", error);
          return res.json({
            error: "We could not verify your email. Please try again later.",
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    // check if the link has expired
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Forgot password email link has expired. Try again.",
          });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Invalid token. Try again",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          // use loadash to update/merge values of the returned user from previous query
          user = _.extend(user, updatedFields);

          // save user new values in password and resetPasswordLink 'columns' in db.
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Password reset failed. Try again.",
              });
            }
            res.json({
              message: "You can now login with your new password.",
            });
          });
        });
      }
    );
  }
};
