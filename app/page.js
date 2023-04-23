import { Inter } from 'next/font/google'

import Hero from '@/components/hero'
import InsuranceWidget from '@/components/insurance-widget';
import InstamedWidget from '@/components/instamed-widget';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='content'>
      <Hero/>
      <div className='widget-wrapper'>
        <InsuranceWidget />
        <InstamedWidget />
      </div>
    </div>
  )
}
