import Link from 'next/link';
const appUrl = process.env.NEXT_PUBLIC_APP_URL
async function getMessages() {
  //await new Promise(r => setTimeout(r, 2000));
  const res  = await fetch(`${appUrl}/api/messages`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const messages = await res.json();
  //console.log("getMessages() got data: " + messages.length);

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
                <th>Date:</th>
                <th>To:</th>
                <th>Status: <InfoTwilioStatus/></th>
                <th>Body:</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => <MessageRow key={m.sid} message={m} />)}
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
  const {sid, to, dateSent, body, status} = message || {};
  return (
    <tr className=''>
      <td><Link href={`/messages/${sid}`}>{dateSent}</Link></td>
      <td><Link href={`/messages/${sid}`}>{to}</Link></td>
      <td><Link href={`/messages/${sid}`}>{status}</Link></td>
      <td><Link href={`/messages/${sid}`}>{ truncateString(body,60) }</Link></td>
    </tr>
  )
}

function truncateString( str, n) {
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}