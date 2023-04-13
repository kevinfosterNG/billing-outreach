import { NextResponse } from 'next/server';

export async function GET() {
  console.log("[GET] /api/messages/");
  //await new Promise(r => setTimeout(r, 2000));
  // const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;
  const messageService = process.env.TWILIO_MESSAGING_SERVICE_SID;

  const client = require('twilio')(accountSid, authToken);
  const res = await client.messages.list({
    limit:200,
    from: fromPhone,
    //to: "+19014615931",
    messagingServiceSid: messageService,
  });
  console.log("API got data type: ", typeof( res ));
  return NextResponse.json(res);
    //.get("SMc1d2410fbe6cb342cf87c3071f070a34")
    //.fetch()
    //.then((message) => console.log(message));

  const data = await res.json();
  console.log("API got data: ", data.length);
  console.log("API got data type: ", typeof( data ));
  return NextResponse.json(data);
}
  
export async function POST(req, res) {
  console.log("[POST] /api/messages/");
  //console.log(req);

  const { name, message } = req.body;
  try {
    await handleFormInputAsync({ name, message });
    //console.log("now to redirect");
    res.redirect(307, '/')
  } catch (err) {
    console.log(err);
    //res.status(500).send({ error: 'failed to fetch data' })
  }
}

function handleFormInputAsync(name,message) {
  console.log("handleFormInputAsync....");
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      body: 'bar',
      userId: 1,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => response.json())
  .then((json) => console.log(json))
}