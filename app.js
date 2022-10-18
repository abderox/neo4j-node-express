import express from 'express'
import user from './src/routes/user.js'
import post from './src/routes/post.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/user',user)
app.use('/post',post)
app.use('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(3001)


