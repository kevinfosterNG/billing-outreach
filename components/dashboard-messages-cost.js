'use client';
import React from 'react'

const DashboardMessagesCost = (props) => {
  let messages = props.messages.map((m) => m.cost).reduce((a,b) => a+b,0) || "-";
  console.log("Total #: " , messages);
    return (
      <div>
      <div>Messages cost:</div>
      <div>$ {messages}</div>
    </div>
  )
}

export default DashboardMessagesCost