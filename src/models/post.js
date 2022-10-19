import { nanoid } from 'nanoid';

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
        const comment = i.get('c').properties
        if (!set.has(post._id)) {
            set.add(post._id)
            post.comments = [comment]
            results.push(post)
        } else {
            results.find(i => i._id === post._id).comments.push(comment)
        }
    })
    return results;
}

const findByIdPost = async (id) => {
    const result = await session.run(`MATCH (p:Post {_id : '${id}'} ) return p limit 1`)
    return result.records[0].get('p').properties
}

const createPost = async (post) => {

    // console.log(post.replace(/"/g, "'").replace(/{/g, '').replace(/}/g, ''))

    /*name : '${post.name}' ,title: '${post.title}', body: '${post.body}', author: '${post.author}' , category : '${post.category}'
    , document : '${post.document}' , image : '${post.image}' 
    , date : '${post.date}' , likes : '${post.likes}' , dislikes : '${post.dislikes}' , comments : '${post.comments}' , shares : '${post.shares}' , views : '${post.views}'*/

    const unique_id = nanoid(8)
    
    const defaultPost = {
        _id: unique_id,
        views: parseInt(0),
        likes: parseInt(0),
        dislikes: parseInt(0),
    }
    const obj = {...defaultPost, ...post }

    // const arr = JSON.stringify(post).replace(/"/g, "'").replace(/{/g, '').replace(/}/g, '').split(',')

    // var str = arr.reduce((acc,curr)=>acc+','+curr.split(':')[0].replace(/'/g, "")+' : '+curr.split(':')[1])
    // str = str.concat(` , _id : '${unique_id}'`)
    // console.log(str)

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
    let tags = []
    result.forEach(i => {
        if (i.tags) {
            tags = [...tags, ...i.tags]
        }
    })
    return tags
}

const findAllByTag = async (tag) => {
    const result = await session.run(`MATCH (p:Post) WHERE '${tag}' IN p.tags return p`)
    return result.records.map(i => i.get('p').properties)
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
    findByIdAndUpdatePostDislikes
}