import { nanoid } from 'nanoid';

import session from '../db/neo4j.js'

const findAll = async () => {
    const result = await session.run(`Match (u:User) return u`)
    return result.records.map(i => i.get('u').properties)
}

const findById = async (id) => {
    const result = await session.run(`MATCH (u:User {_id : '${id}'} ) return u limit 1`)
    return result.records[0].get('u').properties
}
const create = async (user,id__) => {
    // const unique_id = nanoid(8)
    await session.run(`CREATE (u:User {_id : '${id__}', name: '${user.username}', email: '${user.email}', password: '${user.password}' , nom : '${user.nom}', prenom : '${user.prenom}',
    nationality :  '${user.nationality}' , school_level : '${user.school_level}' , domain : '${user.domain}' } ) return u`)
    return await findById(id__)
}

const findByIdAndUpdate = async (id, user) => {
    const result = await session.run(`MATCH (u:User {_id : '${id}'}) SET u.name= '${user.name}', u.email= '${user.email}', u.password= '${user.password}' return u`)
    return result.records[0].get('u').properties
}
const findByIdAndDelete = async (id) => {
    await session.run(`MATCH (u:User {_id : '${id}'}) DELETE u`)
    return await findAll()
}

export default {
    findAll,
    findById,
    create,
    findByIdAndUpdate,
    findByIdAndDelete
}
