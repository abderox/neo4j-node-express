import { nanoid } from 'nanoid';

import session from '../db/neo4j.js'


const createComment = async (comment) => {
    const unique_id = nanoid(8)
    await session.run(`CREATE (c:Comment {_id : '${unique_id}',name : '${comment.name}', content: '${comment.content}' , date_publish : '${comment.date_publish}'}) return c`)
    return await findById(unique_id)
}

const findAll = async () => {
    const result = await session.run(`Match (c:Comment) return c`)
    return result.records.map(i => i.get('c').properties)
}

const findById = async (id) => {
    const result = await session.run(`MATCH (c:Comment {_id : '${id}'} ) return c limit 1`)
    console.log(result.records)
    return result.records[0].get('c').properties
}

const findByIdAndUpdate = async (id, comment) => {
    const result = await session.run(`MATCH (c:Comment {_id : '${id}'}) SET c.content= '${comment.content}', c.user_id= '${comment.userId}', c.post_id= '${comment.postId}'  return c`)
    return result.records[0].get('c').properties
}

const findByIdAndDelete = async (id) => {
    await session.run(`MATCH (c:Comment {_id : '${id}'}) DELETE c`)
    return await findAll()
}

const findAllByPostId = async (id) => {
    const result = await session.run(`MATCH (p:Post {_id : '${id}'})-[r:HAS_COMMENT]->(c:Comment) return c`)
    return result.records.map(i => i.get('c').properties)
}   

export default {
    createComment,
    findAll,
    findById,
    findByIdAndUpdate,
    findByIdAndDelete,
    findAllByPostId
}