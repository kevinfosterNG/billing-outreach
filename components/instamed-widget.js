import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import '@/styles/widget.css'

const widgetPage = "https://pay.instamed.com/Form/PaymentPortal/Default?id=NEXTCAREUC";

//const InstamedWidget = () => {
export default function InstamedWidget() {
  return (<Link href={widgetPage} className='widget-button'>
    Submit your payment
  </Link>
  )
}

//export default InstamedWidget