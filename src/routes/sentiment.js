import { Router } from "express";
const sentiment = Router()
import * as sentimentController from '../controllers/sentiment.controller.js'


sentiment.post('/getSentiment', (req, res) => {
    sentimentController.rt_sentiment_analysis(req, res);
})

export default sentiment;