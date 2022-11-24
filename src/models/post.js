import {client} from '../db/hbase.js'
import { nanoid } from 'nanoid';
// import hbase from 'hbase'
// // Instantiate a new client
// const client = hbase({
//     host: '127.0.0.1',
//     port: 10005
//   })


// export const test = async (req, res) => {
// export const test = async () => {
//     // Create a table
//     client
//     .table('my_table2' )
//     .create('my_column_family', function(err, success){
//         // Insert a record
//         client
//         .table('my_table' )
//         .row('my_row')
//         // .put('my_column_family:my_column', 'my value', function(err, success){
//             // if(err) throw err;
//             console.log(err)
//             console.log(success)
//             // res.status(200).send(success)
//         // })
//     })
// }

const gen = async () => {
    // Instantiate a new client
    client = hbase({ host: '127.0.0.1', port: 8080 })
    // Create a table
    client
    .table('my_table' )
    .create('my_column_family', function(err, success){
    // Insert a record
    client
    .table('my_table' )
    .row('my_row')
    .put('my_column_family:my_column', 'my value', function(err, success){
        // Read a record
        client
        .table('my_table' )
        .row('my_row')
        .get('my_column_family', function(err, [cell]){
        // Validate the result
        assert(cell.key, 'my_row')
        assert(cell.column, 'my_column_family:my_column')
        assert(cell.$, 'my value')
        })
    })
    })
}

// await test();

export const initPost = async (req, res) => {
    // client
    // .table('posttest1' )
    // .create('general_infos', function(err, success){
    //     if(err) {
    //         return res.status(500).send(err)
    //     }
    //     return res.status(200).send(success)
    // })

    
   await client.table('post_test')
  .create({
    name: 'info',
    ColumnSchema: [
      {
        name: 'general_info'
      },
      {
        name: 'custom_info'
      }
    ]
  }
    , function (err, success) {
      if (err) return res.status(500).send(err)
      console.log('success', success);
      return res.status(200).send(success)
    })
} 

// initPost()

const createPosth = async (req, res) => {
    // const post = req.body;
    // client.table('post')
    // .row(1)

    // client
    // .table('posttest1' )
    // .row('1')
    // .put('general_infos:my_column1', 'my value 1', function(err, success){
    //     if(err) {
    //         return res.status(500).send(err)
    //     }
    //     return res.status(200).send(success)
    // })

//    await client.table('sds5ds4j')
//   .create({
//     name: 'info',
//     ColumnSchema: [
//       {
//         name: 'email'
//       },
//       {
//         name: 'name'
//       },
//       {
//         name: 'age'
//       }

//     ]

//   }
//     , function (err, success) {
//       if (err) throw err
//       console.log('success', success);
//       //insertion
//       client.table('sds5ds4')
//         .row('my_row')
//         .put('posts:title', 'Blockchain', function (err, success) {
//           if (err) console.error(err)
//           console.log('success', success);
//           res.status(200).send(success)
//         }
//         )

//     })

// client
//   .table('sds5ds4')
//   .scan({
//     startRow: 'my_row',
//     maxVersions: 1
//   }, (err, rows) =>
//     console.info(rows)
//   )

// client
//   .table('sds5ds4' )
//   .row('my_row')
//   .delete(function(err, success){
//     if(err) console.error(err)
//     console.log('success', success);
//   })


//   client
//   .table('sds5ds4j')
//   .scan({
//     startRow: '2',
//     maxVersions: 1,

//   }, (err, rows) =>
//     {
//       console.info(rows)
//     let data = []
//     rows.forEach(row => {
//       // let row_data = {}
//       let row_data = {}
//       row_data["row"] = row.key
//         row_data["bigcolumn"] = row.column.split(':')[0]
//         row_data["column"] = row.column.split(':')[1]
//         row_data["timestamp"] = row.timestamp;
//         row_data["value"] = row.$;
//       data.push(row_data)
//     }
//     )
//     console.log('data', data);
//   }
//   )


// client.table('sds5ds4j')
//     .row('2')
//     .put([
//       {
//         column: 'email:title',
//         $: 'post1'
//       },
//       {
//         column: 'name:description',
//         $: 'blab lba'
//       },
//       {
//         column: 'age:publish_date',
//         $: '2022-10-12'
//       }
//     ], function (err, success) {
//       if (err) throw err
//       console.log('success', success);
//     })


client
  .table('sds5ds4')
  .scan({
    startRow: '1',
    maxVersions: 1,

  }, (err, rows) =>
    {
      let set = new Set()
      var data = []
      rows.forEach(row => {
        if (!set.has(row.key)) {
          let row_data = {}
          set.add(row.key)
          row_data["id"] = row.key
          row_data[row.column.split(':')[0]] = []
          let obj = {}
          obj[row.column.split(':')[1]] = row.$
          row_data[row.column.split(':')[0]].push(obj)

          data.push(row_data)
          }
  
          else {
            let obj_ = {}
            obj_[row.column.split(':')[1]] = row.$;
            data.forEach((item, index) => {
              if (item.id === row.key) {
                let temp = data[index]
                temp[row.column.split(':')[0]]=[]
                temp[row.column.split(':')[0]].push(obj_)
                data[index] = temp
              }
            })
            
          }
  })
  console.log('data', JSON.stringify(data));

    }
  )
}

export const addPost = async (req, res) => {
    console.log("addPost-1")
    const unique_id = nanoid(8)
    const post = req.body;
    const columns = Object.keys(post);
    if(columns.length === 0) {
        return res.status(400).send('No data provided')
    }
    if(!columns.includes('userId') || !columns.includes('publisher') || !columns.includes('createdAt') || !columns.includes('name')) {
        return res.status(400).send('Missing required fields')
    }
    console.log("addPost-2")
    const data = [];
    columns.forEach(column => {
        if(column == 'userId' || column == 'publisher' || column == 'createdAt' || column == 'name') {
            data.push({
                column: `general_info:${column}`,
                $: post[column]
            })
        } else {
            data.push({
                column: `custom_info:${column}`,
                $: post[column]
            })
        }
    })

    console.log("addPost-3")
    
    client.table('post_test')
    .row(unique_id)
    .put(data, function (err, success) {
      if (err) return res.status(500).send(err)
      console.log('success', success);
      return res.status(200).send(success)
    })
}

export const getPosts = async (req, res) => {
    client
    .table('post_test')
    .scan({
        startRow: '1',
        maxVersions: 1,
    }, (err, rows) =>
        {
            let set = new Set()
            var data = []
            rows.forEach(row => {
                console.log('row', row)
                if (!set.has(row.key)) {
                    // let row_data = {}
                    // set.add(row.key)
                    // row_data["id"] = row.key
                    // row_data[row.column.split(':')[0]] = []
                    // let obj = {}
                    // obj[row.column.split(':')[1]] = row.$
                    // row_data[row.column.split(':')[0]].push(obj)
                    // data.push(row_data)
                    
                    let row_data = {}
                    set.add(row.key)
                    row_data["id"] = row.key
                    row_data[row.column.split(':')[1]] = row.$
                    data.push(row_data)
                } else {
                    // let obj_ = {}
                    // obj_[row.column.split(':')[1]] = row.$;
                    data.forEach((item, index) => {
                        if (item.id === row.key) {
                            // let temp = data[index]
                            // temp[row.column.split(':')[0]]=[]
                            // temp[row.column.split(':')[0]].push(obj_)
                            // data[index] = temp

                            // let temp = {}
                            // temp[row.column.split(':')[1]] = row.$
                            data[index][row.column.split(':')[1]] = row.$
                        }
                    })        
                }
            })   
            console.log('data', JSON.stringify(data));
            return res.status(200).send(data)
        }
    )
}



// let set = new Set()
// var data = []
// rows.forEach(row => {
//     if (!set.has(row.key)) {
//         let row_data = {}
//         set.add(row.key)
//         row_data["id"] = row.key
//         row_data[row.column.split(':')[0]] = []
//         let obj = {}
//         obj[row.column.split(':')[1]] = row.$
//         row_data[row.column.split(':')[0]].push(obj)
//         data.push(row_data)
//         }
//         else {
//             let obj_ = {}
//             obj_[row.column.split(':')[1]] = row.$;
//             data.forEach((item, index) => {
//                 if (item.id === row.key) {
//                     let temp = data[index]
//                     temp[row.column.split(':')[0]]=[]
//                     temp[row.column.split(':')[0]].push(obj_)
//                     data[index] = temp
//                 }
//             })
//         }


export const test = createPosth