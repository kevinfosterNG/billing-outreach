import { Inter } from 'next/font/google'

import Hero from '@/components/hero'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <Hero/>
      <h3>Home page</h3>
      
    </div>
  )
}
