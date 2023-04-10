import Link from 'next/link';

const messageUrl = 'http://localhost:3000/api/messages';

async function getMessages() {
  //await new Promise(r => setTimeout(r, 2000));
  const res  = await fetch(messageUrl, {
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
  const messages = await getMessages();
  const _time = await getTime();

  return (
      <div>
        <h3>
          Messages
        </h3>
        <hr/>
        <div>
            <table>
                <thead>
                  <tr>
                    <th>To:</th>
                    <th>Date:</th>
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
      </div>
  )
}

function MessageRow( {message} ) {
  const {sid, to, dateSent, body} = message || {};
  return (
    <tr className=''>
    
      <td><Link href={`/messages/${sid}`}>{to}</Link></td>
      <td><Link href={`/messages/${sid}`}>{dateSent}</Link></td>
      <td><Link href={`/messages/${sid}`}>{body}</Link></td>
      
    </tr>
    
  )
}