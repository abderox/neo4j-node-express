import {client} from '../db/hbase.js'

// export const initUser = async (req, res) => {
//   await client.table('user_test')
//  .create({
//    name: 'info',
//    ColumnSchema: [
//      {
//        name: 'general_info'
//      },
//      {
//        name: 'personal_info'
//      }
//    ]
//  }
//    , function (err, success) {
//      if (err) return res.status(500).send(err)
//      console.log('success', success);
//      return res.status(200).send(success)
//    })
// } 
export const initUser = async () => {
    await client.table('user_test')
   .create({
     name: 'info',
     ColumnSchema: [
       {
         name: 'general_info'
       },
       {
         name: 'personal_info'
       }
     ]
   }
     , function (err, success) {
      //  if (err) return res.status(500).send(err)
       console.log('success', success);
      //  return res.status(200).send(success)
     })
 } 

//  initUser()