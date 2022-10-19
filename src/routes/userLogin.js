import express from 'express'
const router = express.Router();

import {signin} from '../controllers/auth.controller.js'
router.post("/login", signin);

export default router;