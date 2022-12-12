const argon2 = require("argon2");

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


module.exports = {
  hashPassword,
};