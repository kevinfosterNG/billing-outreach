'use client';
import React from 'react'

const DashboardMessagesClickedCount = (props) => {
  let messages = props.messages.filter(click => click.isClicked === true).map((m) => m.cnt).reduce((a,b) => a+b,0);
  console.log("Total #: " , messages);

    return (
        <div>
          <div>Messages clicked:</div>
          <div>{messages}</div>
        </div>
  )
}

export default DashboardMessagesClickedCount