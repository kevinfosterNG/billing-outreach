import './globals.css';
import Navbar from './Navbar';

export const metadata = {
  title: 'NextCare Billing Messaging App',
  description: 'Created by NextCare AppDev',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          <Navbar />
          <div>
          {children}
          </div>
        </main>
      </body>
    </html>
  )
}
