import { Router } from "express";
import postModel from '../models/post.js'
import relationships from "../models/relationships.js";
import commentModel from "../models/comment.js";

const post = Router();

post.get('/', async (req, res) => {
    const result = await postModel.findAllandComments();
    res.send(result)
})


post.get('/:id', async (req, res) => {
    await postModel.findByIdPost(req.params.id).then(async (post) => {
        // const result = await relationships.findRelationshipsByPostId(post._id)
        const comments = await commentModel.findAllByPostId(post._id)
        res.json({ post, comments })
    })
})

post.get('/byUser/:id', async (req, res) => {


    const result = await postModel.findAllByUserIdAndComments(req.params.id)
    res.json(result)
})

post.post('/', async (req, res) => {
    await postModel.createPost(req.body).then(async (result) => {
        await relationships.createRelationShip(result._id, req.body)
        res.json(result)
    })

})

post.get('/tags/all', async (req, res) => {
    const result = await postModel.findAllTags()
    res.json(result)
})

post.get('/tags/:tag', async (req, res) => {
    const result = await postModel.findAllByTag(req.params.tag)
    res.json(result)
})


post.get('/download/:name', async (req, res) => {
    await postModel.downloadfile(req, res);
})


post.post('/upload/:name', 
     postModel.uploadfile
)



post.put('/views/:id', async (req, res) => {
    const result = await postModel.findByIdAndUpdatePostViews(req.params.id, req.body)
    res.json(result)
})


post.put('/likes/:id', async (req, res) => {
    const result = await postModel.findByIdAndUpdatePostLikes(req.params.id, req.body)
    res.json(result)
})


post.put('/dislikes/:id', async (req, res) => {
    const result = await postModel.findByIdAndUpdatePostDislikes(req.params.id, req.body)
    res.json(result)
})



post.delete('/:id', async (req, res) => {
    const result = await postModel.findByIdAndDeletePost(req.params.id);
    res.json(result)
})





export default post;

