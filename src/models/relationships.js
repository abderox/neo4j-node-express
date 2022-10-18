import session from '../db/neo4j.js'


const createRelationShip = async (id_,body) => {
    console.log(body)
    await session.run(`MATCH (u:User {_id : '${body.userId}'}), (p:Post {_id : '${id_}'}) CREATE (u)-[r:AUTHOR_OF{date_publish : '${body.date_publish}'}]->(p) return r`)
}

const findAllRelationships = async () => {
    const result = await session.run(`Match (u:User)-[r:AUTHOR_OF]->(p:Post) return u, r, p`)
    return result.records.map(i => i.get('r').properties)
}

const findRelationshipsByUserId = async (id) => {
    const result = await session.run(`MATCH (u:User {_id : '${id}'})-[r:AUTHOR_OF]->(p:Post) return u, r, p`)
    return result.records.map(i => i.get('r').properties)
}

const findRelationshipsByPostId = async (id) => {
    const result = await session.run(`MATCH (u:User)-[r:AUTHOR_OF]->(p:Post {_id : '${id}'}) return u, r, p`)
    console.log(result.records.map(i => i.get('r').properties))
    return result.records.map(i => i.get('r').properties)
}

const findRelationshipsByUserIdAndPostId = async (user_id, post_id) => {
    const result = await session.run(`MATCH (u:User {_id : '${user_id}'})-[r:AUTHOR_OF]->(p:Post {_id : '${post_id}'}) return u, r, p`)
    return result.records.map(i => i.get('r').properties)
}

const deleteRelationshipsByUserId = async (id) => {
    await session.run(`MATCH (u:User {_id : '${id}'})-[r:AUTHOR_OF]->(p:Post) DELETE r`)
    return await findAllRelationships()
}

const deleteRelationshipsByPostId = async (id) => {
    await session.run(`MATCH (u:User)-[r:AUTHOR_OF]->(p:Post {_id : '${id}'}) DELETE r`)
    return await findAllRelationships()
}

const deleteRelationshipsByUserIdAndPostId = async (user_id, post_id) => {
    await session.run(`MATCH (u:User {_id : '${user_id}'})-[r:AUTHOR_OF]->(p:Post {_id : '${post_id}'}) DELETE r`)
    return await findAllRelationships()
}

export default {
    createRelationShip,
    findAllRelationships,
    findRelationshipsByUserId,
    findRelationshipsByPostId,
    findRelationshipsByUserIdAndPostId,
    deleteRelationshipsByUserId,
    deleteRelationshipsByPostId,
    deleteRelationshipsByUserIdAndPostId
}