import { nanoid } from 'nanoid';
import fs from 'fs-extra';
import path from 'path';


import session from '../db/neo4j.js'

const findAllPosts = async () => {
    const result = await session.run(`Match (p:Post) return p`)
    return result.records.map(i => i.get('p').properties)
}

const findAllandComments = async () => {

    const results = []
    let set = new Set()

    const result = await session.run(`Match (p:Post)-[r:HAS_COMMENT]->(c:Comment) return p,c`)
    result.records.forEach(i => {
        const post = i.get('p').properties
        const comment = i.get('c').properties || {}

        if (!set.has(post._id)) {
            set.add(post._id)
            if (comment!=={}) {
                post.comments = []
            } else {
                post.comments = [comment]
            }
            results.push(post)
        } else {
            results.find(i => i._id === post._id).comments.push(comment)
        }

    })

    const resultwithoutcomments = await session.run(`Match (p:Post) where not (p)-[:HAS_COMMENT]->() return p`)
    resultwithoutcomments.records.forEach(i => {
        const post = i.get('p').properties
        if (!set.has(post._id)) {
            set.add(post._id)
            post.comments = []
            results.push(post)
        }
    })

    
    return results;
}

const findByIdPost = async (id) => {
    const result = await session.run(`MATCH (p:Post {_id : '${id}'} ) return p limit 1`)
    return result.records[0].get('p').properties
}

const createPost = async (post) => {

    const unique_id = nanoid(8)

    const defaultPost = {
        _id: unique_id,
        views: parseInt(0),
        likes: parseInt(0),
        dislikes: parseInt(0),
    }
    const obj = { ...defaultPost, ...post }

    // ! finally it worked

    await session.run(`CREATE (p:Post $post ) return p`, { post: obj })
    return await findByIdPost(unique_id)
}

const findByIdAndUpdatePostViews = async (id, post) => {
    const result = await session.run(`MATCH (p:Post {_id : '${id}'}) SET p.views= '${parseInt(post.views)}' return p`)
    return result.records[0].get('p').properties
}

const findByIdAndUpdatePostLikes = async (id, post) => {
    const result = await session.run(`MATCH (p:Post {_id : '${id}'}) SET p.likes= '${post.likes}' return p`)
    return result.records[0].get('p').properties
}

const findByIdAndUpdatePostDislikes = async (id, post) => {
    const result = await session.run(`MATCH (p:Post {_id : '${id}'}) SET p.dislikes= '${post.dislikes}' return p`)
    return result.records[0].get('p').properties
}

const findByIdAndDeletePost = async (id) => {
    await session.run(`MATCH (p:Post {_id : '${id}'}) DELETE p`)
    return await findAllPosts()
}

const findAllByUserId = async (userId) => {
    const result = await session.run(`MATCH (u:User {_id : '${userId}'})-[r:AUTHOR_OF]->(p:Post) return p`)
    console.log(result.records)
    return result.records.map(i => i.get('p').properties)
}

const findAllByUserIdAndComments = async (userId) => {

    let results = []
    let set = new Set()
    const result = await session.run(`MATCH (u:User {_id : '${userId}'})-[r:AUTHOR_OF]->(p:Post)-[r2:HAS_COMMENT]->(c:Comment) return p,c`)
    result.records.forEach(i => {
        const post = i.get('p').properties
        const comment = i.get('c').properties
        if (!set.has(post._id)) {
            set.add(post._id)
            post.comments = [comment]
            results.push(post)
        } else {
            results.find(i => i._id === post._id).comments.push(comment)
        }
    })
    console.log(results)
    return results
}


const findAllTags = async () => {
    const result = await findAllPosts();
    let tags = new Set()
    result.forEach(i => {
        if (i.tags) {
            tags = new Set([...tags, ...i.tags])
        }
    })
    console.log(tags)
    return Array.from(tags)
}

const findAllByTag = async (tag) => {
    const result = await session.run(`MATCH (p:Post) WHERE '${tag}' IN p.tags return p`)
    return result.records.map(i => i.get('p').properties)
}


const downloadfile = async (req, res) => {

    const { name } = req.params
    // const result = await session.run(`MATCH (p:Post {_id : '${id}'}) return p limit 1`)
    // const post = result.records[0].get('p').properties

    if (name) {
        const filePath = path.join(process.cwd(), 'src', 'media', `${name}`)

        console.log(filePath)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.status(500).send({ message: 'Error retrieving file' })
            } else {
                res.status(200).send(data)
            }
        })
    }
    else {
        res.status(200).send({ message: 'No file was found !' })
    }

}

const uploadfile = async (req, res) => {


    const { name } = req.params

    const maxSize = 8 * 1024 * 1024;

    if (!req.files.file) {
        return res.status(400).send('No files were uploaded.');
    }


    if (req.files.file > maxSize) {
        return res.status(400).send('File too large');
    }


    const filePath = path.join(process.cwd(), 'src', 'media', `${name}.${req.files.file.name.split('.').pop()}`)


    req.files.file.mv(filePath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded!');
    });


}





export default {
    findAllPosts,
    findByIdPost,
    createPost,
    findByIdAndDeletePost,
    findAllByUserId,
    findAllByUserIdAndComments,
    findAllandComments,
    findAllTags,
    findAllByTag,
    findByIdAndUpdatePostViews,
    findByIdAndUpdatePostLikes,
    findByIdAndUpdatePostDislikes,
    downloadfile,
    uploadfile
}