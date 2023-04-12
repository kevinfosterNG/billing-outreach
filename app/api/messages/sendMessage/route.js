import twilio from 'twilio';        //https://www.twilio.com/docs/libraries/node
import { redirect } from 'next/navigation'
import { headers } from 'next/headers';


export async function POST(req,res) {
  console.log(`[${req.method}] /api/messages/sendMessage`);
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

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;
  const messageService = process.env.TWILIO_MESSAGING_SERVICE_SID;

  //send form submission to twilio
  const client = require('twilio')(accountSid, authToken);
  await client.messages
    .create({
      body: _message,
      to: _to,
      from: fromPhone,
      messagingServiceSid: messageService, 
      shortenUrls: true,
    })
    .then(message => redirect(`/messages/${message.sid}`))
    .then(message => console.log(message.sid))
  
}