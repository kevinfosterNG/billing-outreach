import Link from 'next/link';
import DashboardMessagesBarChart from '@/components/dashboard-messages-barchart';
import DashboardMessagesPaymentsBarChart from '@/components/dashboard-messages-payments-barchart.js';
import DashboardMessagesCost from '@/components/dashboard-messages-cost';
import DashboardMessagesTotalCount from '@/components/dashboard-messages-total-count';
import DashboardMessagesClickedCount from '@/components/dashboard-messages-clicked-count';
import DashboardMessagesPayments from '@/components/dashboard-messages-total-payments';

export const dynamic = 'force-dynamic'
export const revalidate = 60;

const messagesAPIUrl = process.env.NEXT_PUBLIC_APP_URL + "/api/messages/dashboard";
async function getMessagesSummary() {

  const res  = await fetch( messagesAPIUrl , {
    headers: { 'Content-Type': 'application/json' },
    next: {revalidate: 60},
  });
  const messages = await res.json();
  //console.log("getMessagesSummary() got data: " + messages.length);

  return messages;
}

async function getTime() {
  const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Chicago');
  const _time = await res.json();
  return _time;
}

export default async function MessagesPage() {
  const dashboardData = await getMessagesSummary() || {};
  //console.log("dashboardData = ", dashboardData);
  const _time = await getTime() || {};

  return (
      <div>
        <h3>
          Dashboard
          
        </h3>
        <hr/>
        <DashboardMessagesClickedCount messages={dashboardData} />
        <DashboardMessagesTotalCount messages={dashboardData} />
        <DashboardMessagesCost messages={dashboardData} />
        <DashboardMessagesPayments messages={dashboardData} />
        <hr/>
        <DashboardMessagesBarChart messages={dashboardData} />
        <hr/>
        <DashboardMessagesPaymentsBarChart messages={dashboardData} />
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