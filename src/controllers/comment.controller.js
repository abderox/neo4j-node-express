import {client} from '../db/hbase.js'
import { nanoid } from 'nanoid';

export const addComment = async (req, res) => {
    console.log("addComment-1")
    const unique_id = nanoid(8)
    const comment = req.body;
    const columns = Object.keys(comment);
    if(columns.length === 0) {
        return res.status(400).send('No data provided')
    }
    if(!columns.includes('userId') || !columns.includes('postId') || !columns.includes('content') || !columns.includes('date_publish')) {
        return res.status(400).send('Missing required fields')
    }
    console.log("addComment-2")
    const data = [];
    columns.forEach(column => {
        data.push({
            column: `general_info:${column}`,
            $: comment[column]
        })
    })

    console.log("addComment-3")
    
    client.table('comment_test')
    .row(unique_id)
    .put(data, function (err, success) {
      if (err) return res.status(500).send(err)
      console.log('success', success);
      return res.status(200).send(success)
    })
}

export const getCommentsByPostId = async (req, res) => {
    
}
