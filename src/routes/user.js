import { Router } from "express";
import * as authController from '../controllers/auth.controller.js'
import * as userController from '../controllers/user.controller.js'
import * as userModel from '../models/user.js'
const user = Router()


user.get('/', async (req,res)=>{
    await userController.getUsers(req,res);
    // const result = await userModel.findAll()
    // res.json(result)
})
user.get('/:id', async (req,res)=>{
    // const result = await userModel.findById(req.params.id)
    // res.json(result)
})
user.post('/', async (req,res)=>{
     await authController.signup(req,res).then(async (user_)=>{
        console.log(user_._id)
        await userController.addUser(req, res ,user_._id)
     })
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