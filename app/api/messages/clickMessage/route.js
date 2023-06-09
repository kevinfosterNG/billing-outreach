import { headers } from 'next/headers';
import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';

const callbackUrl = process.env.NEXT_PUBLIC_APP_URL + ":" + process.env.PORT + "/api/messages/clickMessage";

//test the callback locally
export async function GET(req, res) {
    const sample_callback = new Object( {
        event_type: "click",
        sms_sid: "SMxxx",
        to: "+11234567890",
        from: "+10987654321",
        link: "https://www.longlink.com/original_link",
        click_time: "2022-10-24T17:17:26.529Z",
        clicked_at: 1666631846,
        messaging_service_sid: "MGxxx",
        account_sid: "ACxxx",
        user_agent: "some_user_agent"
    });
    console.log("Example JSON:\n", sample_callback);
    
    console.log("posting to: ", callbackUrl);
    const response = await fetch(callbackUrl, {
        method: 'POST',
        body: JSON.stringify( sample_callback ),
        headers: {
        'Content-type': 'application/json; charset=utf8',
        },
    })

    return NextResponse.json(res);
}

export async function POST(req,res) {
    try {
        const body = await req.json();
        console.log(`[POST] ${callbackUrl}`);

        let data;
        try {
            data = JSON.parse( JSON.stringify(body) );
        } catch(e) {
            //FROM: https://stackoverflow.com/questions/9637517/parsing-relaxed-json-without-eval
            data = JSON.parse( body.replace(/\s*(['"])?([a-z0-9A-Z_\.]+)(['"])?\s*:([^,\}]+)(,)?/g, '"$2": $4$5') );
        }
        
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
  
  //https://learn.microsoft.com/en-us/azure/cosmos-db/partial-document-update
  async function upsertContainerData(container, data) {
    const c = await container.item(data.sms_sid, data.sms_sid );
    const {resource} = await c.read();

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