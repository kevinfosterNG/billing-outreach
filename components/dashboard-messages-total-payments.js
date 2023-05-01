'use client';
import React from 'react'

const DashboardMessagesPayments = (props) => {
  let payments = props.messages.map((m) => m.paid_amt).reduce((a,b) => a+b,0);
  console.log("payments: ", payments);

    return (
        <div className='dashboard-single-metric'>
          <div className='metric-label'>Payments received:</div>
          <div className='metric-value'>$ {payments}</div>
        </div>
  )
}

export default DashboardMessagesPayments