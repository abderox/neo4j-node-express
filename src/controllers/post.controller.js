import {client} from '../db/hbase.js'
import { nanoid } from 'nanoid';

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
        maxVersions: 1
    }, (err, rows) =>
        {
            let set = new Set()
            var data = []
            rows.forEach(row => {
                console.log('row', row)
                if (!set.has(row.key)) {
                    let row_data = {}
                    set.add(row.key)
                    row_data["_id"] = row.key
                    row_data[row.column.split(':')[1]] = row.$
                    data.push(row_data)
                } else {
                    data.forEach((item, index) => {
                        if (item._id === row.key) {
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

export const getPostById = async (req, res) => {
    const id = req.params.id;
    console.log("-----------------------" + id)
    // client
    // .table('post_test')
    // .row(id)
    // .get((err, row) => {
    //     if (err) return res.status(500).send(err)
    //     console.log('row', row)
    //     let row_data = {}
    //     // row_data["_id"] = row.key
    //     // row_data[row.column.split(':')[1]] = row.$
    //     return res.status(200).send({post : row_data, comments : []});
    // })
    client
    .table('post_test')
    .scan({
        startRow: id,
        stopRow: id,
        maxVersions: 1,
        filter: {
            "op":"MUST_PASS_ALL","type":"FilterList","filters":[{
                "op":"EQUAL",
                "type":"RowFilter",
                "comparator":{"value":id,"type":"BinaryComparator"}
              }
            ]}
    }, (err, rows) =>
    {
            console.log('rows', rows)
            let set = new Set()
            var post_data = []
            rows.forEach(row => {
                console.log('row', row)
                if (!set.has(row.key)) {
                    let row_post_data = {}
                    set.add(row.key)
                    row_post_data["_id"] = row.key
                    row_post_data[row.column.split(':')[1]] = row.$
                    post_data.push(row_post_data)
                } else {
                    post_data.forEach((item, index) => {
                        if (item._id === row.key) {
                            post_data[index][row.column.split(':')[1]] = row.$
                        }
                    })        
                }
            })
            console.log('post_data', JSON.stringify(post_data));
            
            console.log(id)
            client
            .table('comment_test')
            .scan({}, (err, rows) =>
            {
                console.log('rows', rows)
                let set = new Set()
                var comment_data_ = []
                if(rows && rows.length > 0) {
                    rows.forEach(row => {
                        console.log('row', row)
                        if (!set.has(row.key)) {
                            let row_comment_data_ = {}
                            set.add(row.key)
                            row_comment_data_["_id"] = row.key
                            row_comment_data_[row.column.split(':')[1]] = row.$
                            comment_data_.push(row_comment_data_)
                        } else {
                            comment_data_.forEach((item, index) => {
                                if (item._id === row.key) {
                                    comment_data_[index][row.column.split(':')[1]] = row.$
                                }
                            })
                        }
                    })
                }
                let comment_data = []
                comment_data_.forEach((item, index) => {
                    if (item.postId === id) {
                        comment_data.push(item)
                    }
                })
                console.log('comment_data', comment_data);
                return res.status(200).send({post : post_data[0] ? post_data[0] : {}, comments : comment_data});
            })
        }
    )
}