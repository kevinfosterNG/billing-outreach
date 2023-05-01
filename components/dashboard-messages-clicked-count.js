'use client';
import React from 'react'

const DashboardMessagesClickedCount = (props) => {
  console.log("Props: ", props);
  let messages = []
  try {
    messages = props.messages.filter(click => click.isClicked === true).map((m) => m.cnt).reduce((a,b) => a+b,0);
  } catch(eClick) {
    console.error(eClick);
  }
  
  console.log("Total #: " , messages);

    return (
        <div className='dashboard-single-metric'>
          <div className='metric-label'>Messages clicked:</div>
          <div className='metric-value'>{messages}</div>
        </div>
  )
}

export default DashboardMessagesClickedCount