import { Router } from "express";
import {signup} from '../controllers/auth.controller.js'
const user = Router()


user.get('/', async (req,res)=>{
    // const result = await userModel.findAll()
    // res.json(result)
})
user.get('/:id', async (req,res)=>{
    // const result = await userModel.findById(req.params.id)
    // res.json(result)
})
user.post('/', async (req,res)=>{
    //  await signup(req,res).then(async (user_)=>{
    //     console.log(user_._id)
    //     const result = await userModel.create(req.body,user_._id)
    //     res.json(result)
    //  })
})
user.put('/:id', async (req,res)=>{
    // const result = await userModel.findByIdAndUpdate(req.params.id, req.body)
    // res.json(result)
})
user.delete('/:id', async (req,res)=>{
    // const result = await userModel.findByIdAndDelete(req.params.id)
    // res.json(result)
})

export  default user