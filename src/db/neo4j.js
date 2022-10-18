import neo4j from 'neo4j-driver';

const url = "bolt://localhost:7687";
const db_username = "neo4j"
const db_password = "test"
const database = "test"

const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password));

// ? testing connectivity 
driver.verifyConnectivity().then(() => {
    console.log("Connected to Neo4j");
}).catch((err) => {
    console.log("Error connecting to Neo4j", err);
});

const session = driver.session({ database });

export default session