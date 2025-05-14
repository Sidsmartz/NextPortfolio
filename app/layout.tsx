import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"

// Use Press Start 2P as our retro font
const retroFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-retro",
})

export const metadata: Metadata = {
  title: "Arcade Experience",
  description: "An immersive arcade experience with 3D and transitions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${retroFont.variable} font-sans bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navbar />
          <div className="pt-16">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
