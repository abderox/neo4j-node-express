import {client} from '../db/hbase.js'
import { nanoid } from 'nanoid';

export const initComment = async (req, res) => {
    await client.table('comment_test')
   .create({
     name: 'info',
     ColumnSchema: [
       {
         name: 'general_info'
       }
     ]
   }
     , function (err, success) {
       if (err) return res.status(500).send(err)
       console.log('success', success);
       return res.status(200).send(success)
     })
 } 

//  initComment()