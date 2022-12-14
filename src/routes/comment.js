import { Router } from "express";
import comment from "../models/comment.js";
import relationships from "../models/relationships.js";
const commentRouter = Router();


commentRouter.get('/', async (req, res) => {
    const result = await comment.findAll()
    res.json(result)
})

commentRouter.get('/:id', async (req, res) => {
    const result = await comment.findById(req.params.id)
    res.json(result)
})

commentRouter.post('/', async (req, res) => {
    await comment.createComment(req.body).then(async (result) => {
        console.log(result._id)
        await relationships.createRelationShipCommentUser(result._id, req.body)
        res.json(result)
    })

})

commentRouter.put('/:id', async (req, res) => {
    const result = await comment.findByIdAndUpdate(req.params.id, req.body)
    res.json(result)
})

commentRouter.delete('/:id', async (req, res) => {
    const result = await comment.findByIdAndDelete(req.params.id)
    res.json(result)
})

export default commentRouter