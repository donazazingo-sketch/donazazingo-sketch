import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Inventory Tracker",
  description: "Track inventory of drones and BC across multiple stores",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
