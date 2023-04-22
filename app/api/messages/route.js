import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';

export async function GET() {
  console.log("[GET] /api/messages/    (from CosmosDB)");

  const messages = await getMessageOptions("Messages");
  //console.log("API got data type: ", typeof( messages ));

  return NextResponse.json(messages, {headers: {'Cache-Control':'no-store'}});
}

async function getMessageOptions(containerName) {
  const client = await getCosmosClient();
  const container = await getCosmosContainer(client, containerName)
  const data = await getContainerData(container)
  return data;
}

async function getCosmosClient() {
  return new CosmosClient({
    key: process.env.COSMOSDB_KEY,
    endpoint: process.env.COSMOSDB_ENDPOINT,
  });
}

async function getCosmosContainer(client, container) {
  return client
  .database(process.env.COSMOSDB_DATABASE)
  .container(container);
}

async function getContainerData(container){
  // query to return all children in a family
  const querySpec = {
    query: 'SELECT * FROM c ',
  }
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;

}