import { NextResponse } from 'next/server';

export async function GET(request, {params}) {
  console.log("[GET] /api/messages/[:id]");
  console.log("Params: ", params);

  const _id = params["id"];
  console.log("looking up ID: " + _id);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;
  const client = require('twilio')(accountSid, authToken);
  const res = await client.messages.get(_id).fetch();

  console.log("API got data type: ", typeof( res ));
  return NextResponse.json(res);
    //.get("SMc1d2410fbe6cb342cf87c3071f070a34")
    //.fetch()
    //.then((message) => console.log(message));
}