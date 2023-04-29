'use client';
import React from 'react'

const DashboardMessagesPayments = (props) => {
  let payments = props.messages.map((m) => m.paid_amt).reduce((a,b) => a+b,0);
  console.log("payments: ", payments);

    return (
        <div>
          <div>Payments received:</div>
          <div>$ {payments}</div>
        </div>
  )
}

export default DashboardMessagesPayments