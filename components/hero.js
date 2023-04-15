import React from 'react'
import Image from 'next/image'
import '@/styles/hero.css'

function hero() {
  return (
    <Image src="/images/hero.svg" alt="hero" className="hero-image" width={800} height={300}  />
  )
}

export default hero