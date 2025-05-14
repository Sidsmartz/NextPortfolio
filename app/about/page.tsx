"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import MatrixTextEffect from "@/components/matrix-text-effect"
import LoadingScreen from "@/components/loading-screen"

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(true)

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
    document.addEventListener("mouseleave", () => setCursorVisible(false))
    document.addEventListener("mouseenter", () => setCursorVisible(true))

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      document.removeEventListener("mouseleave", () => setCursorVisible(false))
      document.removeEventListener("mouseenter", () => setCursorVisible(true))
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
    <div className="page-container">
      <div className="page-header">
        <MatrixTextEffect
          phrases={["ABOUT ME", "WHO AM I?", "MY STORY", "BACKGROUND", "IDENTITY"]}
          className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-6"
        />
      </div>

      <div className="page-content">
        <div className="grid-layout-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 p-6 rounded-lg border border-red-500/30"
          >
            <h2 className="text-2xl font-retro text-red-500 mb-4">TS SIDDHARTH</h2>
            <h3 className="text-xl mb-4">Computer Science Student & Tech Enthusiast</h3>
            <p className="mb-4 text-gray-300">
              I'm a passionate Computer Science student with expertise in web development, machine learning, and
              application design. Currently pursuing my B.Tech in Computer Science and Engineering (IT) at MLR Institute
              of Technology with a CGPA of 8.71.
            </p>
            <p className="text-gray-300">
              As a Project Mentor at the Center for Innovation and Entrepreneurship, I help students develop innovative
              solutions using cutting-edge technologies.
            </p>

            <div className="flex gap-4 mt-6">
              <button
                className="arcade-button px-4 py-2 rounded"
                onClick={() => window.open("https://github.com/Sidsmartz", "_blank")}
              >
                GitHub
              </button>
              <button
                className="arcade-button px-4 py-2 rounded"
                onClick={() => window.open("https://linkedin.com/in/SiddharthTS", "_blank")}
              >
                LinkedIn
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900 p-6 rounded-lg border border-red-500/30"
          >
            <h2 className="text-2xl font-retro text-red-500 mb-4">EXPERIENCE</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl">Project Mentor</h3>
                <p className="text-sm text-red-500 mb-2">
                  Center for Innovation and Entrepreneurship, MLRIT • August 2024 - Present
                </p>
                <p className="text-gray-300">
                  Mentoring students in developing AR/VR, IoT, Web and Mobile Applications using agile workflows.
                </p>
              </div>

              <div>
                <h3 className="text-xl">Technical Intern</h3>
                <p className="text-sm text-red-500 mb-2">
                  Centre for Innovation & Entrepreneurship, MLRIT • August 2024 - Present
                </p>
                <p className="text-gray-300">
                  Developing web applications and supporting technical setup for innovation challenges.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-gray-900 p-6 rounded-lg border border-red-500/30"
        >
          <h2 className="text-2xl font-retro text-red-500 mb-4">MY JOURNEY</h2>
          <p className="text-gray-300 mb-4">
            My journey in technology began with a fascination for creating digital experiences that solve real-world
            problems. As a student at MLR Institute of Technology, I've had the opportunity to work on various projects
            ranging from competitive coding platforms to AI-powered traffic management systems.
          </p>
          <p className="text-gray-300 mb-4">
            I'm particularly passionate about the intersection of design and technology, using tools like React,
            Next.js, and Three.js to create immersive user experiences. My work as a Project Mentor has allowed me to
            share this passion with other students, helping them develop their own innovative solutions.
          </p>
          <p className="text-gray-300">
            Currently, I'm focused on expanding my knowledge in machine learning and artificial intelligence, with a
            particular interest in their applications in web and mobile development. I'm always looking for new
            challenges and opportunities to learn and grow as a developer.
          </p>
        </motion.div>
      </div>

      {/* CRT and scanline effects */}
      <div className="crt-effect"></div>
      <div className="scanlines"></div>
    </div>
  )
}
