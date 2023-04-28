'use client';
import React from 'react'

const DashboardMessagesTotalCount = (props) => {
  let messages = props.messages.map((m) => m.cnt).reduce((a,b) => a+b,0);
  console.log("Total #: " , messages);

    return (
        <div>
          <div>Messages sent:</div>
          <div>{messages}</div>
        </div>
  )
}

export default DashboardMessagesTotalCount