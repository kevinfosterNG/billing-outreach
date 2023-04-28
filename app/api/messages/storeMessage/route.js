import twilio from 'twilio';        //https://www.twilio.com/docs/libraries/node
import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation'
import { headers } from 'next/headers';


export async function POST(req,res) {
  console.log(`[${req.method}] /api/messages/storeMessage`);
  let r = await req;
  try{console.log("r (type) = ", typeof( r ) )} catch(e) {console.error(e);}
  try{console.log("r = ", r )} catch(e) {console.error(e);}

  const url = req.nextUrl;
  const params = url.searchParams;
  //try{console.log("params = ", url.searchParams )} catch(e) {console.error(e);}
  //try{console.log("sid = ", params.get('sid') )} catch(e) {console.error(e);}

  //const body = await req.body;
  //try{console.log("req.body (type) = ", typeof( body ) )} catch(e) {console.error(e);}
  //try{console.log("req = ", body )} catch(e) {console.error(e);}
  
  const headersList = headers();
  const c = headersList.get("Content-Type");
  //console.log("Headers: ", c);

  //Get the form encoded parameters
  //#todo default value because NextRequest is returning weird ReadableStream
  //const _to = await body.to || "+19014615931";    
  //const _message = await body.to || process.env.BILLING_MESSAGE_OPTIONS_TEST;
  const _sid = params.get('sid') || "SMzzz";
  const _date = params.get('date_created') || "Thu, 27 Apr 2023 14:11:23 GMT";
  const _enc_nbr = params.get('enc_nbr') || 167777777;
  const _practice_id = params.get('practice_id') || "4444";
  const _message_type = params.get('message_type') || "Undefined";

  let newMessage = {
    sid : _sid,
    date_created : _date,
    enc_nbr : _enc_nbr,
    practice_id : _practice_id,
    message_type: _message_type
  };
  //console.log("Storing message: ", newMessage);

  storeMessage("Messages", newMessage);

  //redirect(`/messages/${newMessage.sid}`);
  redirect(`/`);
}

async function storeMessage(containerName, data) {
  const client = await getCosmosClient();
  const container = await getCosmosContainer(client, containerName)
  const upsertStatus = await insertContainerData(container, data)
  return upsertStatus;
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

async function insertContainerData(container, data) {
  let _message = {
    id : data.sid,
    date_created : data.date_created,
    enc_nbr : data.enc_nbr,
    practice_id : data.practice_id,
    message_type: data.message_type
  };
  
  const r = await container.items.create( _message );
  return r;
}