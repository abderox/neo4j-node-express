import { client } from '../db/hbase.js'
import { nanoid } from 'nanoid';
import { filter_bad_words } from '../utils/sentiment.util.js';
import { topic_modeling } from '../utils/filesManip.js';

export const addPost = async (req, res) => {
    console.log("addPost-1")
    const unique_id = nanoid(8)
    const post = req.body;
    const columns = Object.keys(post);
    if (columns.length === 0) {
        return res.status(400).send('No data provided')
    }
    if (!columns.includes('userId') || !columns.includes('publisher') || !columns.includes('createdAt') || !columns.includes('name')) {
        return res.status(400).send('Missing required fields')
    }
    console.log("addPost-2")
    const data = [];
    columns.forEach(column => {
        if (column == 'userId' || column == 'publisher' || column == 'createdAt' || column == 'name') {
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
            if (err) {
                console.log(err);
                return res.status(500).send(err)
            }
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
        }, (err, rows) => {
            let set = new Set()
            var data = []
            rows && rows.forEach(row => {
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

    client
        .table('post_test')
        .scan({
            startRow: id,
            stopRow: id,
            maxVersions: 1,
            filter: {
                "op": "MUST_PASS_ALL", "type": "FilterList", "filters": [{
                    "op": "EQUAL",
                    "type": "RowFilter",
                    "comparator": { "value": id, "type": "BinaryComparator" }
                }
                ]
            }
        }, (err, rows) => {
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
                .scan({}, (err, rows) => {
                    console.log('rows', rows)
                    let set = new Set()
                    var comment_data_ = []
                    if (rows && rows.length > 0) {
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
                            item.content = filter_bad_words(item.content);
                            comment_data.push(item)
                        }
                    })
                    console.log('comment_data', comment_data);
                    return res.status(200).send({ post: post_data[0] ? post_data[0] : {}, comments: comment_data });
                })
        }
        )
}



// TODO: the second method will insert array as array

export const addTopicColumnsToPost = async (req, res) => {

    const id = req.params.id;
    const fileName = req.body.fileName;

    const topicsObj = await topic_modeling(fileName,2,4);

    // example
    const topicsObjSouldBeLike = {
        Topic_1: [
            'module (0.21%)',
            'es (0.16%)',
            'dirname (0.092%)',
            'scope (0.062%)',
            'error (0.062%)'
        ],
        Topic_2: [
            'nodejs (0.052%)',
            'path (0.033%)',
            'web (0.021%)',
            'starting (0.021%)',
            'reserve (0.021%)'
        ],
        Topic_3: [
            'nodejs (0.059%)',
            'path (0.039%)',
            'waiting (0.02%)',
            'usingdirname (0.02%)',
            'tailwind (0.02%)'
        ]
    }


    for (const [key, value] of Object.entries(topicsObj)) {
        console.log(key, value);
        let data = []
        value.forEach((item, index) => {
            data.push({
                column: `topics:${key}`,
                $: item.toString()
            })
        })

        client.table('post_test')
            .row(id)
            .put(data, function (err, success) {
                if (err) {
                    console.log(err);
                    return res.status(500
                    ).send(err)
                }
                console.log('success', success);
                return res.status(200).send(success)
            })
    }
}

// TODO: the second method will insert array of topics as a String

export const addTopicColumnsToPostWay2 = async (req, res) => {

    const id = req.params.id;
    const fileName = req.body.fileName;

    console.log("filename", fileName)

    const topicsObj = await topic_modeling(fileName,2,4);


    // example
    const topicsObjSouldBeLike = {
        Topic_1: [
            'module (0.21%)',
            'es (0.16%)',
            'dirname (0.092%)',
            'scope (0.062%)',
            'error (0.062%)'
        ],
        Topic_2: [
            'nodejs (0.052%)',
            'path (0.033%)',
            'web (0.021%)',
            'starting (0.021%)',
            'reserve (0.021%)'
        ],
        Topic_3: [
            'nodejs (0.059%)',
            'path (0.039%)',
            'waiting (0.02%)',
            'usingdirname (0.02%)',
            'tailwind (0.02%)'
        ]
    }


    var data = []

    for (const [key, value] of Object.entries(topicsObj)) {
        console.log(key, value);
       
            data.push({
                column: `topics:${key}`,
                $: value.toString()
            })
        
    }

        client.table('post_test')
            .row(id)
            .put(data, function (err, success) {
                if (err) {
                    console.log(err);
                    return res.status(500
                    ).send(err)
                }
                console.log('success', success);
                return res.status(200).send(success)
            })
        
}


// ! just for testing since the server cannot work
// const resCallback =  
//     (err, success) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log('success', success);
     
//     }

// await addTopicColumnsToPostWay2({
//     params: {
//         id: 'post_1'
//     },
//     body: {
//         fileName: 'tp_3_CONTAINEURISATION_ABDELHADI_MOUZAFIR.pdf'
//     }
// },
//     resCallback
//     )





export const updatePostViews = async (req, res) => {
    const views = req.body.views;
    const id = req.params.id;

    // const newViews = post?.views ? Number.parseInt(post.views) + 1 : 1;

    client.table('post_test')
        .row(id)
        .put([
            {
                column: 'general_info:views',
                $: views.toString()
            },
        ], function (err, success) {
            if (err) console.log(err)
            return console.log(success);
        })
}

export const updatePostLikes = async (req, res) => {
    const likes = req.body.likes;
    const id = req.params.id;

    console.log('likes', likes)
    console.log('id', id)
    // const newLikes = post?.likes ? Number.parseInt(post.likes) + 1 : 1;

    client.table('post_test')
        .row(id)
        .put([
            {
                column: 'general_info:likes',
                $: likes.toString()
            },
        ], function (err, success) {
            if (err) console.log(err)
            return console.log(success);
        })
}

export const updatePostDislikes = async (req, res) => {
    const dislikes = req.body.dislikes;
    const id = req.params.id;

    // const newDislikes = post?.dislikes ? Number.parseInt(post.dislikes) + 1 : 1;

    client.table('post_test')
        .row(id)
        .put([
            {
                column: 'general_info:dislikes',
                $: dislikes.toString()
            },
        ], function (err, success) {
            if (err) console.log(err)
            return console.log(success);
        })
}
