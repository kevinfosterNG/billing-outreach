'use client';
import React from 'react'
import {number_with_thousands_seperator} from '@/utils/numbers.js';

const DashboardMessagesClickedCount = (props) => {
  //console.log("Props: ", props);
  let messages = []
  try {
    messages = props.messages.filter(click => click.isClicked === true).map((m) => m.cnt).reduce((a,b) => a+b,0);
  } catch(eClick) {
    console.error(eClick);
  }
  
  //console.log("Total #: " , messages);

    return (
        <div className='dashboard-single-metric'>
          <div className='metric-label'>Messages clicked:</div>
          <div className='metric-value'>{ number_with_thousands_seperator(messages) }</div>
        </div>
  )
}

export default DashboardMessagesClickedCount