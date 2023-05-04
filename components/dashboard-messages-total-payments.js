'use client';
import React from 'react'
import {dollars_with_thousands_seperator} from '@/utils/numbers.js';

const DashboardMessagesPayments = (props) => {
  let payments = props.messages.map((m) => m.paid_amt).reduce((a,b) => a+b,0);
  console.log("payments: ", payments);

    return (
        <div className='dashboard-single-metric'>
          <div className='metric-label'>Payments received:</div>
          <div className='metric-value'>{dollars_with_thousands_seperator(payments)} </div>
        </div>
  )
}

export default DashboardMessagesPayments