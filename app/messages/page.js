import Link from 'next/link';
export const dynamic = 'force-dynamic'

let messagesAPIUrl = process.env.NEXT_PUBLIC_APP_URL+":"+process.env.PORT + "/api/messages";
async function getMessages() {
  //await new Promise(r => setTimeout(r, 2000));

  if (messagesAPIUrl.includes("railway.app"))
    messagesAPIUrl = messagesAPIUrl.replace(":80","");

  const res  = await fetch( messagesAPIUrl , {
    headers: { 'Content-Type': 'application/json' },
  });
  const messages = await res.json();
  console.log("getMessages() got data: " + messages.length);

  return messages;
}

async function getTime() {
  const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Chicago');
  const _time = await res.json();
  return _time;
}

export default async function MessagesPage() {
  const messages = await getMessages() || {};
  const _time = await getTime() || {};

  return (
      <div>
        <h3>
          Messages
        </h3>
        <hr/>
        <table>
            <thead>
              <tr>
                <th>Sent At:</th>
                <th>To:</th>
                <th>Status: <InfoTwilioStatus/></th>
                <th>Practice #</th>
                <th>Enc #:</th>
                <th>Clicked?</th>
                <th>Click Count</th>
                <th>Clicked At</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => <MessageRow key={m.id} message={m} />)}
            </tbody>
        </table>
        <hr/>
        <h4>Footer timestamps:</h4>
        <div className='bottom-date'>
          {_time.dateTime} {_time.timeZone}
        </div>
        <div className='bottom-ip'>
          {_time.client_ip}
        </div>
      </div>
  )
}

function InfoTwilioStatus() {
  return (
    <Link href="https://www.twilio.com/docs/sms/api/message-resource#appendix">ⓘ</Link>
  )
}

function MessageRow( {message} ) {
  const {id, to, date_created, enc_nbr, practice_id, message_clicks} = message || {};
  return (
    <tr className=''>
      <td><Link href={`/messages/${id}`}>{date_created}</Link></td>
      <td></td>{/*to*/}
      <td></td>{/*status*/}
      <td><Link href={`/messages/${id}`}>{practice_id}</Link></td>
      <td><Link href={`/messages/${id}`}>{enc_nbr}</Link></td>
      {/* <td><Link href={`/messages/${sid}`}>{ truncateString(body,60) }</Link></td> */}
      <td><Link href={`/messages/${id}`}>{message_clicks?.isClicked ? "Y" : "N"}</Link></td>
      <td><Link href={`/messages/${id}`}>{message_clicks?.click_count || 0}</Link></td>
      <td><Link href={`/messages/${id}`}>{message_clicks?.click_times[0] }</Link></td>
    </tr>
  )
}

function truncateString( str, n) {
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}