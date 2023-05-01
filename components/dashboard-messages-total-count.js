'use client';
import React from 'react'

const DashboardMessagesTotalCount = (props) => {
  let messages = props.messages.map((m) => m.cnt).reduce((a,b) => a+b,0);
  console.log("Total #: " , messages);

    return (
        <div className='dashboard-single-metric'>
          <div className='metric-label'>Messages sent:</div>
          <div className='metric-value'>{messages}</div>
        </div>
  )
}

export default DashboardMessagesTotalCount