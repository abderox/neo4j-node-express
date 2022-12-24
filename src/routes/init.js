import { Router } from "express";
const initRouter = Router();
import * as commentController from '../controllers/comment.controller.js'
import * as userController from '../controllers/user.controller.js'
import * as postController from '../controllers/post.controller.js'

import * as commentModel from '../models/comment.js'
import * as userModel from '../models/user.js'
import * as postModel from '../models/post.js'

initRouter.post('/', async (req, res) => {
    // const result = await comment.findAll()
    // res.json(result)
    userModel.initUser();
    postModel.initPost();
    commentModel.initComment();

    return res.status(200).send("success")

})

export default initRouter
