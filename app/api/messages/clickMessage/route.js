import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';

const callbackUrl = process.env.NEXT_PUBLIC_APP_URL+":"+process.env.PORT + "/api/messages/clickMessage";

//test the callback locally
export async function GET(req, res) {
    const sample_callback = '{'+
        '  "event_type": "click",'+
        '  "sms_sid": "SMxxx",'+
        '  "to": "+11234567890",'+
        '  "from": "+10987654321",'+
        '  "link": "https://www.longlink.com/original_link",'+
        '  "click_time": "2022-10-24T17:17:26.529Z",'+
        '  "clicked_at": 1666631846,'+
        '  "messaging_service_sid": "MGxxx",'+
        '  "account_sid": "ACxxx",'+
        '  "user_agent": "some_user_agent"'+
        '}';
        console.log("Example JSON:\n", sample_callback);
    
            console.log("handleFormInputAsync....");
            const response = await fetch(callbackUrl, {
              method: 'POST',
              body: JSON.stringify( sample_callback ),
              headers: {
                'Content-type': 'application/json; charset=utf8',
              },
            })
            //.then((response) => response.json())
            //.then((json) => console.log(json))

                    
            return NextResponse.json(res);
          

}

export async function POST(req,res) {
    
    const body = await req.json();
    const data = JSON.parse(body);
    console.log("[POST] message", typeof(body));
    console.log("[POST] body: ", body);
    console.log("event: ", data.event_type);
    console.log("sms_sid: ", data.sms_sid);
    //const messageOptions = await getMessages("Messages") || [];
    upsertMessageClick("Messages", data);

    return data;
  
}

async function upsertMessageClick(containerName, data) {
    const client = await getCosmosClient();
    const container = await getCosmosContainer(client, containerName)
    const upsertStatus = await upsertContainerData(container, data)
    return upsertStatus;
}

async function getMessages(containerName) {
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
    // query to return all items in a container
    const querySpec = {
      query: 'SELECT * FROM c ',
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  async function upsertContainerData(container, data) {
    const r = await container.items.create(data);
    return r;
  }