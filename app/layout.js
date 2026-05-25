import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata = {
  title: "Start'Ease — Les meilleures offres d'alternance",
  description: "Découvrez chaque jour les meilleures offres d'alternance sélectionnées pour vous.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="bg-jungle-bg text-jungle-text font-body antialiased">
        {children}
      </body>
    </html>
  )
}
