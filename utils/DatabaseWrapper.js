import { CosmosClient, Database, Container } from "@azure/cosmos";

export async function getClient() {
    return new CosmosClient({
      key: process.env.COSMOSDB_KEY,
      endpoint: process.env.COSMOSDB_ENDPOINT,
    });
}
  
export async function getContainer(client, container) {
    return client
    .database(process.env.COSMOSDB_DATABASE)
    .container(container);
}
  
export async function getAllData(container){
    // query to return all children in a family
    const querySpec = {
      query: 'SELECT * FROM c ',
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
}


export async function getApprovedUser(container, email){
  console.log("getRecordByEmail() using container: ", container.id);
  // query to return all children in a family
  const querySpec = {
    //query: "SELECT * FROM Users c where c."+column+"='"+value+"'",
    "query": "SELECT u.id,u.email,u.password FROM u WHERE u.approved=true AND u.email=@email",
    //"query": "SELECT u.id,u.email,u.password FROM u",
    "parameters": [
      //{"name": "@table", value: container.id},
      {"name": "@email", "value": email},
  ]
  }
  console.log(querySpec);
  try {
    const { resources } = await container.items.query(querySpec, { enableCrossPartitionQuery: true }).fetchAll();
    // console.log("Found: ", resources);
    return resources;
  } catch(e) {
    console.log("Failed: ", e);
    return null;
  }
  
}