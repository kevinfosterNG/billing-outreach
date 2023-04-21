import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';

const callbackUrl = process.env.NEXT_PUBLIC_APP_URL + ":" + process.env.PORT + "/api/messages/clickMessage";
//const callbackUrl = process.env.NEXT_PUBLIC_APP_URL + "/api/messages/clickMessage";

//test the callback locally
export async function GET(req, res) {
    const sample_callback = '{\n'+
        '  event_type: "click",\n'+
        '  sms_sid: "SMxxx",\n'+
        '  to: "+11234567890",\n'+
        '  from: "+10987654321",\n'+
        '  link: "https://www.longlink.com/original_link",\n'+
        '  click_time: "2022-10-24T17:17:26.529Z",\n'+
        '  clicked_at: 1666631846,\n'+
        '  messaging_service_sid: "MGxxx",\n'+
        '  account_sid: "ACxxx",\n'+
        '  user_agent: "some_user_agent"\n'+
        '}';
        console.log("Example JSON:\n", sample_callback);
    
            console.log("posting to: ", callbackUrl);
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
    try {
        const body = await req.json();
        console.log("[POST] message", typeof(body));
        console.log("[POST] body: ", body);

        let data;
        try {
            data = JSON.parse( body );
        } catch(e) {
            //FROM: https://stackoverflow.com/questions/9637517/parsing-relaxed-json-without-eval
            data = JSON.parse( 
                body.replace(/\s*(['"])?([a-z0-9A-Z_\.]+)(['"])?\s*:([^,\}]+)(,)?/g, '"$2": $4$5')
                );
        }
        
        //console.log("event: ", data.event_type);
        //console.log("sms_sid: ", data.sms_sid);
        //const messageOptions = await getMessages("Messages") || [];
        upsertMessageClick("Messages", data);

        return data;
    } catch (e) {
        console.log("POST FAILURE: ",e);
    }
}

async function upsertMessageClick(containerName, data) {
    const client = await getCosmosClient();
    const container = await getCosmosContainer(client, containerName)
    const upsertStatus = await upsertContainerData(container, data)
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
  
  async function getContainerData(container){
    // query to return all items in a container
    const querySpec = {
      query: 'SELECT * FROM c ',
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  }

  //https://learn.microsoft.com/en-us/azure/cosmos-db/partial-document-update
  async function upsertContainerData(container, data) {
    const c = await container.item(data.sms_sid, data.sms_sid );
    const {resource} = await c.read();

    //console.log("Checking for click_count: ", resource);
    //console.log("Checking for click_count.message_clicks: ", resource.message_clicks);

    const operations = [
        { op: 'add',  path: '/message_clicks/isClicked', value: true},
        { op: 'incr', path: '/message_clicks/click_count', value: 1},
        { op: 'add',  path: '/message_clicks/click_times/-', value: data.click_time},   
        ];

    let init_operations = [];
    if (resource.message_clicks == undefined) {
        init_operations = [
        { op: 'add',  path: '/message_clicks', value: {}},
        { op: 'add',  path: '/message_clicks/click_times', value: []},
        ]
    }

    //const r = await container.item(data.sms_sid)
    const r = await c.patch( init_operations.concat(operations) );
    return r;
  }