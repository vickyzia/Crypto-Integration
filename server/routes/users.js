const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const smtpTransport = require("nodemailer-smtp-transport");
const secret = "secret";
const isEmpty = require("../validation/is-empty");
const validateToken = require('../validation/verify-token');
const moment = require('moment');
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateChangePasswordInput = require("../validation/change-password");
const validateUpdateWalletInput = require("../validation/update-wallet");

const User = require("../models/User");
const Token = require("../models/Token");

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.regemail = "Email already exists";
      return res.status(400).json(errors);
    } else {
      userrefcode = crypto.randomBytes(4).toString("hex");

      User.findOne({ refcode: userrefcode }).then(ref => {
        if (ref) {
          errors.referror = "Server busy. Please try again";
          return res.status(400).json(errors);
        } else {
          const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            refcode: userrefcode,
            sponsor: req.body.sponsor
          });

          User.findOne({ refcode: newUser.sponsor }).then(spon => {
            if (!isEmpty(newUser.sponsor) && !spon) {
              errors.referror = "Invalid Sponsor";
              return res.status(400).json(errors);
            } else {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => {
                      // Create a verification token for this user
                      var token = new Token({
                        _userId: user._id,
                        token: crypto.randomBytes(16).toString("hex")
                      });
                      // Save the verification token
                      token.save(function(err) {
                        if (err) {
                          return res.status(500).send({ msg: err.message });
                        }

                        // Send the email
                        var transporter = nodemailer.createTransport(
                          smtpTransport({
                            service: "gmail",
                            host: "smtp.gmail.com",
                            port: 465,
                            secure: false,
                            auth: {
                              user: "jxking890@gmail.com",
                              pass: "M0n9b8v7"
                            }
                          })
                        );
                        var mailOptions = {
                          from: "no-reply@yourwebapplication.com",
                          to: user.email,
                          subject: "Account Verification Token",
                          text:
                            "Welcome to BitHFT!\n\n" +
                            "Complete your registration by clicking below: \n\nhttp://" +
                            "localhost:3000" +
                            "/confirmation/" +
                            token.token +
                            "\n\nThank you,\n\nBitHFT Team"
                        };

                        transporter.sendMail(mailOptions, function(err) {
                          if (err) {
                            return res.status(500).json({ msg: err.message });
                          }
                          return res.status(200).json({
                            msg:
                              "A verification email has been sent to " +
                              user.email +
                              "."
                          });
                        });
                      });
                    })
                    .catch(err => console.log(err));
                });
              });
            }
          });
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email: email }).then(user => {
    if (!user) {
      errors.email = "Invalid email or password";
      return res.status(404).json(errors);
    }
    if(!user.isEnabled){
      return res.status(403).json("Your account is disabled");
    }
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Make sure the user has been verified
        if (!user.isVerified) {
          errors.type = "not-verified";
          errors.msg = "Your account has not been verified yet.";
          return res.status(400).json(errors);
        }

        const payload = { id: user.id, email: user.email, role: user.role };

        // sign token
        jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.match = "Invalid email or password";
        return res.status(400).json(errors);
      }
    });
  });
});

router.post("/change-password",validateToken, (req, res) => {
  const { errors, isValid } = validateChangePasswordInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const newPassword2 = req.body.newPassword2;

  // find user by email
  User.findOne({ email: email }).then(user => {
    if (!user) {
      errors.changepwemail = "User email not found!";
      return res.status(404).json(errors);
    }
    if(!user.isEnabled){
      return res.status(403).json("Your account is disabled");
    }
    bcrypt.compare(currentPassword, user.password).then(isMatch => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then(user => {
                return res.status(200).json({
                  reset: "Your password has been changed",
                  success: 200
                });
              })
              .catch(err => console.log(err));
          });
        });
      } else {
        errors.changepwpassword = "Incorrect password";
        return res.status(404).json(errors);
      }
    });
  });
});

router.post("/update-wallet",validateToken, (req, res) => {
  const { errors, isValid } = validateUpdateWalletInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const newWallet = req.body.wallet;

  // find user by email
  User.findOne({ email: email }).then(user => {
    if (!user) {
      errors.changepwemail = "User email not found!";
      return res.status(404).json(errors);
    } else {
      user.ETH = newWallet;
      var allowChange = true;
      if(user.lastUpdatedETH){
        let differentDays = moment(Date.now()).diff(user.lastUpdatedETH, 'days');
        if(differentDays < 1){
          errors.wallet = "Wallet Address has been updated in last 24 hours.";
          return res.status(400).json(errors);
        }
      }
      user.lastUpdatedETH = Date.now();
      user
        .save()
        .then(user => {
          return res.status(200).json({
            reset: "Your password has been changed",
            success: 200
          });
        })
        .catch(err => console.log(err));
    }
  });
});

router.get("/loadUserWalletData",validateToken, (req, res) => {
  const errors ={};
  const email = req.body.email;

  // find user by email
  User.findOne({ email: email }).then(user => {
    if (!user) {
      errors.loadUserWalletData = "User email not found!";
      return res.status(404).json(errors);
    } else {
      var differentDays = 2;
      if(user.lastUpdatedETH){
        differentDays = moment(Date.now()).diff(user.lastUpdatedETH, 'days');
      }
      return res.status(200).json({userWalletAddress: user.ETH, walletLastUpdatedDays:differentDays});
    }
  });
});
router.get("/confirmation/:token", (req, res) => {
  const errors = {};

  Token.findOne({ token: req.params.token }, function(err, token) {
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg:
          "We were unable to find a valid token. Your token may have expired."
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, function(err, user) {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user for this token." });
      if (user.isVerified)
        return res.status(400).send({
          type: "already-verified",
          msg: "This user has already been verified."
        });

      // Verify and save the user
      user.isVerified = true;
      user.save(function(err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).send({
          type: "verified",
          msg: "The account has been verified. Please log in"
        });
      });
    });
  });
});

module.exports = router;
