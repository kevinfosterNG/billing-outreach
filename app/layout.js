import '@/styles/globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: {
    default: "NextCare Billing",
    template: `%s | NextCare Billing`,
  },
  description: "NextCare Billing Messing App",
  keywords: [
    "NextCare",
    "NextCare Holdings",
    "NextCare Urgent Care",
    "Urgent Care",
    "NextCare Billing",
    "Billing",
    "Bill pay",
    "Instamed",
  ],
  authors: [
    {
      name: "Kevin Foster",
      url: "https://fostes.org",
    },
    {
      name: "Robbie Sollie",
      url: "https://github.com/robbiesollie",
    },
  ],
  creator: "shadcn",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${process.env.NEXT_PUBLIC_APP_URL}/site.webmanifest`,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={"bg-white font-sans text-slate-900 antialiased"}>
      <head />
      <body className="min-h-screen">
        <main>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  )
}
