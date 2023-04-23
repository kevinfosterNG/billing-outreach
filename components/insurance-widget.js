import React from 'react'
import Image from 'next/image'

import '@/styles/widget.css';
import Link from 'next/link';

const widgetPage = "/submit/insurance";

export default function  InsuranceWidget() {
  return (
    <div>
      <Link href={widgetPage} className='widget-button' >Submit your insurance information</Link>
    </div>
  )
}