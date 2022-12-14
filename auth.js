const argon2 = require("argon2");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const hashPassword = (req, res, next) => {
  // hash the password using argon2 then call next()
  argon2.hash(req.body.password, {
    type: argon2.argon2id,
    memory: 15360,
    iterations: 2,
    parallelism: 1,
}).then((hashedPassword) => {
    // do something with hashedPassword
    req.body.hashedPassword = hashedPassword;
    delete req.body.password;
    next();
  })
  .catch((err) => {
    // do something with err
    console.error(err);
    res.sendStatus(500);
  });  
};

const verifyPassword = (req, res) => {
  argon2.verify(req.user.hashedPassword.toString(), req.body.password)
  .then((isVerified) => {
    if (isVerified) {
      var token = jwt.sign({ sub: req.user.id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.send(token);
    } else {
      res.sendStatus(401);
    }
  })
  .catch((err) => {
    // do something with err
    console.error(err);
    res.sendStatus(500);
  });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing!");
    } else {
      const auth = req.get('authorization').split(" ");
      const type = auth[0];
      const token = auth[1];

      if (type !== "Bearer") {
        throw new Error("Authorization header has not the 'Bearer' type");
      } else {
        req.payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(req.payload);
        next();
      }
    }
   
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};


module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
};