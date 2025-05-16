import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P, JetBrains_Mono } from "next/font/google"
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

// Use JetBrains Mono for non-pixel text with multiple weights
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Siddharth's Portfolio",
  description: "Siddharth T S - Developer Portfolio | Interactive arcade-themed portfolio showcasing my skills, projects, and experience",
  generator: 'Next.js',
  keywords: ["developer", "portfolio", "software engineer", "web developer", "coding", "arcade", "retro", "Siddharth T S"],
  authors: [{ name: "Siddharth T S" }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${retroFont.variable} ${jetbrainsMono.variable} font-sans bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navbar />
          <div className="pt-16">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
