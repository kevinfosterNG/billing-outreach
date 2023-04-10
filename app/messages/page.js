import Link from 'next/link';

//const messageUrl = 'http://localhost:3000/api/messages';
const messageUrl = 'https://jsonplaceholder.typicode.com/posts';

async function getMessages() {
  //await new Promise(r => setTimeout(r, 2000));
  const data  = await fetch(messageUrl);
  const messages = await data.json();
  //console.log(messages[0]);

  return messages;
}



export default async function MessagesPage() {
  const messages = await getMessages();
  //console.log(messages[0]);

  //const res = await fetch('http://worldtimeapi.org/api/timezone/America/Chicago');
  const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Chicago');
  const _time = await res.json();
  
  
  //const messagesData = await fetch('https://jsonplaceholder.typicode.com/posts');
  // const messages = await messagesData.json();
  

  return (
      <div>
        <h3>
          Messages
        </h3>
        <div>{typeof(messages)}</div>
        <div>{messages.length}</div>
        <div>
          {messages[0].title} <br/>
        </div>
        <hr/>

        <div>
            <table>
                <thead>
                  <tr>
                    <th>UserID</th>
                    <th>Subject</th>
                    <th>Body</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                      <td>
                      <Link href="./messages/a">a</Link>
                      </td>
                      <td>
                        <Link href="./messages/b">b</Link>
                      </td>
                      <td>
                      <Link href="/messages/c">c</Link>
                      </td>
                      </tr>

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
      </div>
  )
}



function MessageRow( {message} ) {
  const {userId, id, title, body} = message || {};
  return (
    <tr className=''>
    
      <td><Link href={`/messages/${id}`}>{userId}</Link></td>
      <td><Link href={`/messages/${id}`}>{title}</Link></td>
      <td><Link href={`/messages/${id}`}>{body}</Link></td>
      
    </tr>
    
  )
}