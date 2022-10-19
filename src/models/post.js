import { nanoid } from 'nanoid';

import session from '../db/neo4j.js'

const findAllPosts = async () => {
    const result = await session.run(`Match (p:Post) return p`)
    return result.records.map(i => i.get('p').properties)
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
    const obj = {_id:unique_id, ...post}
    
    // const arr = JSON.stringify(post).replace(/"/g, "'").replace(/{/g, '').replace(/}/g, '').split(',')

    // var str = arr.reduce((acc,curr)=>acc+','+curr.split(':')[0].replace(/'/g, "")+' : '+curr.split(':')[1])
    // str = str.concat(` , _id : '${unique_id}'`)
    // console.log(str)

    // ! finally it worked

    await session.run(`CREATE (p:Post $post ) return p`,{post : obj})
    return await findByIdPost(unique_id)
}

const findByIdAndUpdatePost = async (id, post) => {
    const result = await session.run(`MATCH (p:Post {_id : '${id}'}) SET p.title= '${post.title}', p.body= '${post.body}', p.author= '${post.author}' return p`)
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

    let results= []
    let set = new Set()
    const result = await session.run(`MATCH (u:User {_id : '${userId}'})-[r:AUTHOR_OF]->(p:Post)-[r2:HAS_COMMENT]->(c:Comment) return p,c`)
    result.records.forEach(i => {
        const post = i.get('p').properties
        const comment = i.get('c').properties
        if(!set.has(post._id)){
            set.add(post._id)
            post.comments = [comment]
            results.push(post)
        }else{
            results.find(i => i._id === post._id).comments.push(comment)
        }
    })
    console.log(results)
    return results
}

export default {
    findAllPosts,
    findByIdPost,
    createPost,
    findByIdAndUpdatePost,
    findByIdAndDeletePost,
    findAllByUserId,
    findAllByUserIdAndComments
}