import mongoose from 'mongoose';

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    nom: String,
    prenom: String,
    email: {
      type: "string",
      required: true,
      unique: true,
      match:
        /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    },
    password: { type: "string", required: true },
    
  }, { timestamps: true })
);

export default User;
