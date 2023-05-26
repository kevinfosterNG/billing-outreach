import Link from 'next/link'
import '@/styles/widget.css'

export default function ChallengeFailed() {
    return (
    <div>
        <h2>We're sorry, but we are unable to verify your identity.</h2>
        <div>
            <p>Please contact our billing office for further assistance.</p>
            <p>1-888-381-4858</p>
        </div>
        <br/>
        <div>
            <p>Or register for our mobile app to access all of your healthcare records.</p>
            <br/>
            <Link className='widget-button' href="https://nextcare.com/nextcare-app/">Download the NextCare App</Link>
        </div>
        
    </div>
)}