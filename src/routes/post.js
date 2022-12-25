import { Router } from "express";
import uploadController from '../controllers/upload.controller.js'
import * as postModel from "../models/post.js";
import * as postController from "../controllers/post.controller.js";

const post = Router();

post.get('/', async (req, res) => {
    await postController.getPosts(req, res);
    // const result = await postModel.findAllandComments();
    // res.send(result)
})


post.get('/:id', async (req, res) => {
    console.log(req.params.id)
    await postController.getPostById(req, res);
    // await postModel.findByIdPost(req.params.id).then(async (post) => {
    //     const comments = await commentModel.findAllByPostId(post._id)
    //     res.json({ post, comments })
    // })
})

post.get('/byUser/:id', async (req, res) => {
    // const result = await postModel.findAllByUserIdAndComments(req.params.id)
    // res.json(result)
})

post.post('/test', async (req, res) => {
    console.log("test");
    await postModel.test(req, res);
    console.log("test");
})

post.post('/', async (req, res) => {
    await postController.addPost(req, res);
    // await postModel.createPost(req.body).then(async (result) => {
    //     await relationships.createRelationShip(result._id, req.body)
    //     res.json(result)
    // })
})

post.get('/tags/all', async (req, res) => {
    // const result = await postModel.findAllTags()
    // res.json(result)
})

post.get('/tags/:tag', async (req, res) => {
    // const result = await postModel.findAllByTag(req.params.tag)
    // res.json(result)
})


post.get('/download/:name', async (req, res) => {
    await uploadController.downloadfile(req, res);
})


post.post('/upload/:name', async (req, res) => {
    await uploadController.uploadfile(req, res);
})


post.put('/views/:id', async (req, res) => {
    await postController.updatePostViews(req, res);
})


post.put('/likes/:id', async (req, res) => {
    console.log("like")
    await postController.updatePostLikes(req, res);
})


post.put('/dislikes/:id', async (req, res) => {
    await postController.updatePostDislikes(req, res);
})



post.delete('/:id', async (req, res) => {
    // const result = await postModel.findByIdAndDeletePost(req.params.id);
    // res.json(result)
})

post.get('/get-documents', async (req, res) => {
    // const result = await postModel.findAllDocumentsInPosts();
    // res.json(result)
})

post.get('/get-documents/:value', async (req, res) => {
    // const result = await postModel.findAllDocumentsByAnyProperty(req.params.value);
    // res.json(result)
})


// TODO: this one needs to be tested , topics route

post.post('/topicsV1/addTopics/:id',
    async (req, res) => {
        await postController.addTopicColumnsToPost(req, res);
    })

post.post('/topicsV2/addTopics/:id',
    async (req, res) => {
        await postController.addTopicColumnsToPostWay2(req, res);
    })


export default post;

