import express from 'express'
import user from './src/routes/user.js'
import post from './src/routes/post.js'
import comment from './src/routes/comment.js'
import cors from "cors";
import cookieSession from "cookie-session";

var corsOptions = {
    origin: "*",
};

const app = express()

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin; X-Requested-With, Content-Type, Accept, Authorization,x-access-token"
    );
    if (res.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST,PATCH, DELE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(
    cookieSession({
      name: "neo4j-session",
      secret: "COOKIE_SECRET", 
      httpOnly: true,
    })
  );
  


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/user', user)
app.use('/post', post)
app.use('/comment', comment)


app.listen(3001)


