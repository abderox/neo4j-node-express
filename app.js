import express from 'express'
import user from './src/routes/user.js'
import post from './src/routes/post.js'
import comment from './src/routes/comment.js'
import cors from "cors";
import fileUpload from 'express-fileupload';
import cookieSession from "cookie-session";
import connectDB from "./src/db/mongodb.js";
import userLogin from './src/routes/userLogin.js'

var corsOptions = {
    origin: "*",
};

const app = express()

app.use(cors(corsOptions));
app.use(fileUpload());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin; X-Requested-With, Content-Type, Accept, Authorization,x-access-token , multipart/form-data"
    );
    if (res.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST,PATCH, DELE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(
    cookieSession({
      name: "session",
      secret: "COOKIE_SECRET", 
      httpOnly: true,
    })
  );

  connectDB().then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
  


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", userLogin);
app.use('/user', user)
app.use('/post', post)
app.use('/comment', comment)


app.listen(4343, () => {
    console.log('Server is running on port 4343')
})


