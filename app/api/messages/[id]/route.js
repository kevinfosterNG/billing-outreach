import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';
import { Twilio } from "twilio";
export const dynamic = 'force-dynamic'

export async function GET(request, {params}) {
  console.log("[GET] /api/messages/[:id]");
  //console.log("Params: ", params);

  const _id = params["id"];
  //console.log("looking up ID: " + _id);
  
  try {
    const twilio_message = await getTwilioMessage(_id)//.then((r)=>console.log("twilio_message: ",r));
    const cosmos_message = await getCosmosMessage(_id).then((r)=>r[0])//.then((r)=>console.log("cosmos_message: ",r));
    let merged_messages = {};

    try {
       merged_messages = {
         twilio_message,
         cosmos_message,
       };
    } catch(emerge) {
      console.error("Merge failed: ", emerge);
    }
    return NextResponse.json(merged_messages);
  } catch(e) {
    console.error("API failed. ", e);
    return NextResponse.json({});
  }
}

async function getCosmosMessage(id) {
  let containerName = "Messages";
  const client = await getCosmosClient();
  const container = await getCosmosContainer(client, containerName)
  const data = await getContainerData(container, id)
  return data;
}
async function getTwilioMessage(id) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
  const res = await client.messages.get(id).fetch();
  return res;
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

async function getContainerData(container, id){
      
  // query to return all children in a family
  const querySpec = {
    query: "SELECT m.practice_id, m.enc_nbr, m.id, m.date_created, m.message_type FROM Messages m WHERE m.id = '@id' ",
     "parameters": [
      {"name": "@id", "value": id},
     ]

  }
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;

}