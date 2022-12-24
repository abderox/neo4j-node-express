import { Router } from "express";
import * as sentimentController from '../controllers/sentiment.controller.js'
const sentiment = Router()


sentiment.post('/getSentiment', (req, res) => {
    sentimentController.rt_sentiment_analysis(req, res);
})

export default sentiment;