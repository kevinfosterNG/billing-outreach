import Link from 'next/link';
import DashboardBarMessages from '@/components/dashboard-bar-messages';
export const dynamic = 'force-dynamic'
export const revalidate = 60;


const messagesAPIUrl = process.env.NEXT_PUBLIC_APP_URL + "/api/messages/dashboard";
async function getMessagesSummary() {

  const res  = await fetch( messagesAPIUrl , {
    headers: { 'Content-Type': 'application/json' },
    next: {revalidate: 60},
  });
  const messages = await res.json();
  console.log("getMessagesSummary() got data: " + messages.length);

  return messages;
}

async function getTime() {
  const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Chicago');
  const _time = await res.json();
  return _time;
}

export default async function MessagesPage() {
  const dashboardData = await getMessagesSummary() || {};
  console.log("dashboardData = ", dashboardData);
  const _time = await getTime() || {};

  return (
      <div>
        <h3>
          Dashboard
        </h3>
        <hr/>
        <DashboardBarMessages messages={dashboardData} />
        <hr/>
        <table>
          <thead>
            <tr>
              <th>Message Type</th>
              <th>Clicked?</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.map((m) => <MessageRow key={m.sid} message={m} />)}
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

function MessageRow( {message} ) {
  const {cnt, isClicked, message_type} = message || {};
  return (
    <tr className=''>
      <td>{message_type}</td>
      <td>{isClicked ? "Y" : "N"}</td>
      <td>{cnt}</td>
    </tr>
  )
}

function truncateString( str, n) {
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}