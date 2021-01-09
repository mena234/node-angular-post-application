const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new User({
        email: email,
        password: hash,
      });
      console.log(hash);
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        message: "User Have Been Created Successfuly",
        user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Invalid authentication credentials",
      });
    });
};


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          res.status(401).json({
            message: "There are no User With That Email",
          });
        }
        fetchedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((result) => {
        if (!result) {
          res.status(401).json({
            message: "The Password is Wrong",
          });
        }
        const token = jwt.sign(
          {
            email: fetchedUser.email,
            userId: fetchedUser._id,
          },
          "This is most be very long string here",
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          token,
          expireTime: 3600,
          userId: fetchedUser._id
        })
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Invalid authentication credentials'
        });
      });
  }