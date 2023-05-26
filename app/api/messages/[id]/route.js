import { CosmosClient, Database, Container } from "@azure/cosmos";
import { getRecordById } from "@/utils/DatabaseWrapper";
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
    const cosmos_message = await getRecordById("Messages", _id)//.then((r)=>console.log("cosmos_message: ",r));
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

async function getTwilioMessage(id) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
  const res = await client.messages.get(id).fetch();
  return res;
}