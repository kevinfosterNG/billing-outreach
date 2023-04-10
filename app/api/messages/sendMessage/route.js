import twilio from 'twilio';        //https://www.twilio.com/docs/libraries/node

export async function POST(req) {
  console.log("[POST] /api/messages/sendMessage");
  // console.log("Request: ", req);
  //const body = JSON.parse(req.body);
  console.log("Body: ",JSON.stringify( req.body) );
  console.log("Req: " , JSON.stringify(req));

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;
  const messageService = process.env.TWILIO_MESSAGING_SERVICE_SID;

  const client = require('twilio')(accountSid, authToken);

  await client.messages
    .create({
      body: 'Dear Valued Customer, We are trying to reach you in regards to a delinquent account with NextCare Arizona, please click the following link to make your payment on our website (https://pay.instamed.com/Form/PaymentPortal/Default?id=nextcareuc&QuickPayCode=0001000001144742&email=kevinfoster@nextcare.com&patientFirstName=Kevin&PatientLastName=Testt) please contact us at 888-705-8558 before the end of the month to avoid going to collections Or you can contact us at 888-705-8558, representatives are available M-F 7am to 5pm MST to further discuss your account. We look forward to assisting you.',
      to: '+19014615931',
      from: fromPhone,
      messagingServiceSid: messageService, 
    })
    .then(message => console.log(message.sid));
  
    //return NextResponse.json(message.sid);
}