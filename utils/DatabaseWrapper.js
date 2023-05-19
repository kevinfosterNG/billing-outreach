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