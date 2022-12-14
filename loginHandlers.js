const database = require("./database");

const postLogin = (req, res) => {
    const { email, hashedPassword } = req.body;
    const emailUser = req.body.email;
    const hashedPasswordUser = req.body.hashedPassword;
    //let emailOk = false;

    console.log(hashedPasswordUser);
    database
      .query("select email from users where email = ? AND hashedPassword = ?", [emailUser, hashedPasswordUser])
      .then(([login]) => {
        if (login[0] != null) {       
        res.send("Credentials are valid");
            } else res.status(401).send("Invalid credentials");
        })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error during Login");
      });        
  };

  module.exports = {
    postLogin,
  };