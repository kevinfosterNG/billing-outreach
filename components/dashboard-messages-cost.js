'use client';
import React from 'react'

const DashboardMessagesCost = (props) => {
  let messages = props.messages.map((m) => m.cost).reduce((a,b) => a+b,0) || "-";
  console.log("Total #: " , parseFloat( messages ).toFixed(2));
    return (
      <div className='dashboard-single-metric'>
      <div className='metric-label'>Messages cost:</div>
      <div className='metric-value'>$ {parseFloat( messages ).toFixed(2)}</div>
    </div>
  )
}

export default DashboardMessagesCost