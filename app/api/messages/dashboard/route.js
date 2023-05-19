import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';
import { Twilio } from "twilio";
export const dynamic = 'force-dynamic'

export async function GET(req) {
  const url = req.nextUrl;
  const params = url.searchParams;

  if ( params.get('refresh') == null || !params.get('refresh') )
  {
    console.log("[GET] /api/messages/dashboard    (from CosmosDB)");
    const messages = await getMessageOptions("Messages");
    //console.log("\t# of messages = ", messages.length);
    //console.log("API got data type: ", typeof( messages ));
  
    return NextResponse.json(messages);
  } else if ( (params.get('refresh'))) {
    //console.log("[GET] /api/messages/dashboard?refresh=true    (from Twilio and NGE)");
    let refresh = await fetchRefreshData("Messages");
    //console.log("refresh status: ", refresh);
    return NextResponse.json("success");
  } else {
    return NextResponse.json("failure");
  }
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
      query: "SELECT m.message_type, IS_DEFINED(m.message_clicks.isClicked) AS isClicked, COUNT(m.id) AS cnt, SUM(m.payments.paid_amt) AS paid_amt, SUM(m.cost) AS cost "+
      "FROM Messages m "+
      "WHERE m.id<>'SMxxx' "+
      "GROUP BY m.message_type, m.message_clicks.isClicked",
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  async function fetchRefreshData(containerName){
    const client = await getCosmosClient();
    const container = await getCosmosContainer(client, containerName)

    //get all Twilio messages
    // query to return all children in a family
    const querySpec = {
      query: "SELECT * FROM c "
        +"WHERE c.id<>'SMxxx' "
        +"AND NOT(IS_DEFINED(c.cost)) OR NOT(IS_DEFINED(c.payments))"
    }
    const { resources } = await container.items.query(querySpec).fetchAll();

    //get balance and cost of each message in database
    for(const msg of resources) {
      try {
      var twillioResponse = await getTwilioMessageCost(msg["id"]);
      //console.log("Twilio responded: ", twillioResponse);
      
      var nextgenResponse = await getNextGenPayment(msg["id"]);
      //console.log("nextgen response: ", nextgenResponse);

      upsertMessageValues(container, {
        "id": msg["id"],
        "trans_date": nextgenResponse["trans_date"] || null,
        "amt": nextgenResponse["amt"] || null,
        "cost":+ twillioResponse || null
      })
    } catch (e_upsertloop) {
      console.error("Failed to gather and upsert data for ", msg["id"]);
      console.error(e_upsertloop);
    }
    }
  }

  async function upsertMessageValues(container, data) {
    //console.log("Upserting data: ", data);
    const c = await container.item( data.id, data.id );
    const {resource} = await c.read();

    const operations = [{ op: 'add',  path: '/payments', value: {}}];

    if (data.cost != null && data.cost != undefined)
      operations.push(      { op: 'add',  path: '/cost', value: data.cost} );

    if(data.trans_date != null && data.trans_date != undefined)
      operations.push( { op: 'add',  path: '/payments/trans_date', value: data.trans_date} );

    if(data.amt != null && data.amt != undefined)
      operations.push( { op: 'add',  path: '/payments/paid_amt', value: data.amt} );
    
    const r = await c.patch( operations );
    return r;
  }

  async function getNextGenPayment(message_sid) {
    //placeholder NGE call:
    const balance_data = [
      //{"id":"SM0302fbc6203a66557b389fd1a63c5dc1","trans_date":"","amt":0.00}, //SM0302fbc6203a66557b389fd1a63c5dc1
    ];
    

    //console.log("looking up id: ", message_sid);
    return balance_data.filter( function(item) { 
      return item.id === message_sid;
    })[0] || {"id":message_sid,"trans_date":null,"amt":null};
  }

  async function getTwilioMessageCost(message_sid) {
    //console.log("looking up ID: " + message_sid);
    var _msg_api = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messages/${message_sid}`);
    const message = await _msg_api.json();
    //console.log("Price: ", message["price"]);
    return message["price"];
  }