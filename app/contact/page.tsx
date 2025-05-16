"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import MatrixTextEffect from "@/components/matrix-text-effect"
import LoadingScreen from "@/components/loading-screen"
import ContactForm from "@/components/contact-form"
import Squares from "@/components/squares"
import { Github, Linkedin, Instagram, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Initialize cursor effect
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    document.body.appendChild(cursor)

    const cursorTrail = document.createElement("div")
    cursorTrail.className = "cursor-trail"
    document.body.appendChild(cursorTrail)

    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`

      setTimeout(() => {
        cursorTrail.style.left = `${e.clientX}px`
        cursorTrail.style.top = `${e.clientY}px`
      }, 100)
    }

    document.addEventListener("mousemove", updateCursor)

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor)
      }
      if (document.body.contains(cursorTrail)) {
        document.body.removeChild(cursorTrail)
      }
      clearTimeout(timer)
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="page-container relative">
      <div className="absolute inset-0 -z-10">
        <Squares direction="diagonal" speed={0.5} borderColor="#ff0000" squareSize={30} hoverFillColor="#330000" />
      </div>

      <div className="page-header">
        <MatrixTextEffect
          phrases={["CONTACT ME", "GET IN TOUCH", "REACH OUT", "CONNECT", "COMMUNICATE"]}
          className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-6"
        />
      </div>

      <div className="page-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-red-500/30"
          >
            <h3 className="text-xl font-retro text-red-500 mb-4">GET IN TOUCH</h3>
            <p className="mb-6 text-gray-300 font-mono">
              Interested in working together? Have a project in mind? Feel free to reach out and let's create something
              amazing.
            </p>

            <div className="flex gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-red-500 text-red-500 hover:bg-red-900/20"
                onClick={() => window.open("https://github.com/Sidsmartz", "_blank")}
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-red-500 text-red-500 hover:bg-red-900/20"
                onClick={() => window.open("https://www.linkedin.com/in/siddharth-t-s-a76655248/", "_blank")}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-red-500 text-red-500 hover:bg-red-900/20"
                onClick={() => window.open("https://www.instagram.com/sidsmartz._.gamez", "_blank")}
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-red-500 text-red-500 hover:bg-red-900/20"
                onClick={() => {
                  navigator.clipboard.writeText("Sidsmartz");
                  alert("Discord username copied to clipboard: Sidsmartz");
                }}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2 text-gray-300">
              <p>📍 Hyderabad, India</p>
              <p>📧 siddhartht4206@gmail.com</p>
              <p>📱 Instagram: sidsmartz._.gamez</p>
              <p>💬 Discord: Sidsmartz</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>

      {/* CRT and scanline effects */}
      <div className="crt-effect"></div>
      <div className="scanlines"></div>
    </div>
  )
}
