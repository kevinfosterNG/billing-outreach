'use client';
import React from 'react'
import {number_with_thousands_seperator} from '@/utils/numbers.js';

const DashboardMessagesTotalCount = (props) => {
  let messages = props.messages.map((m) => m.cnt).reduce((a,b) => a+b,0);
  //console.log("Total #: " , messages);

    return (
        <div className='dashboard-single-metric'>
          <div className='metric-label'>Messages sent:</div>
          <div className='metric-value'>{ number_with_thousands_seperator(messages) }</div>
        </div>
  )
}

export default DashboardMessagesTotalCount