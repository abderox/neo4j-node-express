import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userLogin.js";


const checkAuth = (req, res, err, user) => {
  if (err) {
    res.status(500).send({ message: err });
    return;
  }

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  var passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );
  console.log(passwordIsValid);

  if (!passwordIsValid) {
    return res.status(401).send({ message: "Invalid Password!" });
  }


  var token = jwt.sign({ id: user.id }, 'secret', {
    expiresIn: 86400,
  });

  console.log(token);


  res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    accessToken: token,
  });

};


const signin = (req, res) => {

  console.log(req.body);

  if (req.body.username.includes("@")) {

    User.findOne({
      email: req.body.username,
    })
      .exec((err, user) => {
        checkAuth(req, res, err, user);
      });
  }

  else {
    User.findOne({
      username: req.body.username,
    })
      .exec((err, user) => {
        checkAuth(req, res, err, user);
      });
  }
};



const signup = async (req, res) => {


  let user = new User({
    nom: req.body.nom,
    username: req.body.username,
    prenom: req.body.prenom,
    email: req.body.email,
  });

  user.password = bcrypt.hashSync(req.body.password, 8)

  try {
    return await user.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}





export {
  signin,
  signup,
}
