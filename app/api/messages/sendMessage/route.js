import twilio from 'twilio';        //https://www.twilio.com/docs/libraries/node
import { CosmosClient, Database, Container } from "@azure/cosmos";
import { redirect } from 'next/navigation'
import { headers } from 'next/headers';


export async function POST(req,res) {
  console.log(`[${req.method}] /api/messages/sendMessage`);
  console.log("Req type: ", req.toString());
  const body = await req.body;
  
  const headersList = headers();
  const c = headersList.get("Content-Type");
  console.log("Headers: ", c);

  try{console.log("req (type) = ", typeof( body ) )} catch(e) {console.error(e);}
  try{console.log("req = ", body )} catch(e) {console.error(e);}
  

  //Get the form encoded parameters
  //#todo default value because NextRequest is returning weird ReadableStream
  const _to = await body.to || "+19014615931";    
  const _message = await body.to || process.env.BILLING_MESSAGE_OPTIONS_TEST;
  const _enc_nbr = await body.enc_nbr || 16042440;
  const _practice_id = await body.practice_id || "0001";

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;
  const messageService = process.env.TWILIO_MESSAGING_SERVICE_SID;

  //send form submission to twilio
  const client = require('twilio')(accountSid, authToken);
  let newMessage = await client.messages
    .create({
      body: _message,
      to: _to,
      from: fromPhone,
      messagingServiceSid: messageService, 
      shortenUrls: true,
    })
    //.then(message => console.log(message.sid))
    //.then(message => redirect(`/messages/${message.sid}`))
    
    newMessage.enc_nbr = _enc_nbr;
    newMessage.practice_id = _practice_id;

    storeMessage("Messages", newMessage);

    redirect(`/messages/${newMessage.sid}`);
  
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
    date_created : data.dateCreated,
    enc_nbr : data.enc_nbr,
    practice_id : data.practice_id
  };
  
  const r = await container.items.create(_message );
  return r;
}