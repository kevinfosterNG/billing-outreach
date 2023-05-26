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

export async function getRecordById(containerName, id) {
  const client = await getClient();
  const container = await getContainer(client, containerName)
  
  // query to return all children in a family
  const querySpec = {
    "query": 'SELECT * FROM c WHERE c.id=@id',
    "parameters": [
      {"name": "@id", "value": id},
    ],
  };

  try {
    const { resources } = await container.items.query(querySpec).fetchAll();
    const resource = resources[0];
    return resource;
  } catch(e) {
    console.error("Failed to get RecordById.", e);
  }
  
  return null;
}

export async function updateRecordById(containerName, id) {
  console.log("updateRecordById() called...");
  const client = await getClient();
  const container = await getContainer(client, containerName)

  const c = await container.item(id, id );

  const operations = [
      { op: 'incr', path: '/challege_incorrect_answer_count', value: 1},
      ];

  const r = await c.patch( operations );
  return r;
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
  //console.log("getApprovedUser() using container: ", container.id);
  // query to return all children in a family
  const querySpec = {
    "query": "SELECT u.id,u.email,u.password FROM u WHERE u.approved=true AND u.email=@email",
    "parameters": [
      {"name": "@email", "value": email},
    ]
  }
  try {
    const { resources } = await container.items.query(querySpec, { enableCrossPartitionQuery: true }).fetchAll();
    // console.log("Found: ", resources);
    return resources;
  } catch(e) {
    console.log("Failed: ", e);
    return null;
  }
  
}