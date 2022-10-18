import { Router } from "express";
import postModel from '../models/post.js'
import relationships from "../models/relationships.js";
const post = Router();

post.get('/', async (req,res)=>{
    await postModel.findAll().then(async (posts)=>{
        const relationships =  await relationships.findAllRelationships()
        res.json({posts,relationships})
    })
})


post.get('/:id', async (req,res)=>{
     await postModel.findByIdPost(req.params.id).then(async (post)=>{
        const result = await relationships.findRelationshipsByPostId(post._id)
        res.json({...post, date :  result[0]})
    })
})

post.post('/', async (req,res)=>{
     await postModel.createPost(req.body).then(async (result)=>{
        await relationships.createRelationShip(result._id,req.body)
        res.json(result)
    })

})

post.put('/:id', async (req,res)=>{
    const result = await postModel.findByIdAndUpdatePost(req.params.id, req.body)
    res.json(result)
})

post.delete('/:id', async (req,res)=>{
    const result = await postModel.findByIdAndDeletePost(req.params.id);
    res.json(result)
})





export  default post;

