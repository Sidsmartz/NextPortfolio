"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import emailjs from "@emailjs/browser"

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Use EmailJS to send the email
    if (formRef.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
          formRef.current,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY",
        )
        .then(() => {
          setIsSubmitting(false)
          setIsSubmitted(true)
          setFormState({ name: "", email: "", message: "" })

          // Reset submission status after 3 seconds
          setTimeout(() => {
            setIsSubmitted(false)
          }, 3000)
        })
        .catch((err) => {
          console.error("Email sending failed:", err)
          setIsSubmitting(false)
          setError("Failed to send message. Please try again later.")
        })
    }
  }

  return (
    <Card className="bg-gray-900/90 border-red-500/30 relative z-10">
      <CardHeader>
        <CardTitle className="font-retro text-red-500">SEND MESSAGE</CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-md text-center"
          >
            Message sent successfully! I'll get back to you soon.
          </motion.div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="name"
                placeholder="Your Name"
                value={formState.name}
                onChange={handleChange}
                required
                className="bg-gray-800 border-red-500/30 focus:border-red-500"
              />
            </div>
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={formState.email}
                onChange={handleChange}
                required
                className="bg-gray-800 border-red-500/30 focus:border-red-500"
              />
            </div>
            <div>
              <Textarea
                name="message"
                placeholder="Your Message"
                value={formState.message}
                onChange={handleChange}
                required
                className="bg-gray-800 border-red-500/30 focus:border-red-500 min-h-[120px]"
              />
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-2 rounded-md text-center text-sm">
                {error}
              </div>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full arcade-button">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
