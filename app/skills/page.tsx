"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import LoadingScreen from "@/components/loading-screen"
import { PromptingIsAllYouNeed } from "@/components/prompting-is-all-you-need"
import MatrixTextEffect from "@/components/matrix-text-effect"
import AudioPlayer from "@/components/audio-player"
import { Code, Gamepad2, Brain, Layers } from "lucide-react"

export default function SkillsPage() {
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

  const skills = [
    {
      title: "Machine Learning",
      description: "TensorFlow, PyTorch, Scikit-learn, Computer Vision, NLP",
      icon: <Brain className="h-8 w-8 text-red-500" />,
    },
    {
      title: "3D Development",
      description: "Three.js, React Three Fiber, Blender, WebGL, Unity",
      icon: <Layers className="h-8 w-8 text-red-500" />,
    },
    {
      title: "Web Development",
      description: "React, Next.js, TypeScript, Node.js, Tailwind CSS",
      icon: <Code className="h-8 w-8 text-red-500" />,
    },
    {
      title: "App Development",
      description: "React Native, Flutter, Firebase, AWS, Google Cloud",
      icon: <Gamepad2 className="h-8 w-8 text-red-500" />,
    },
  ]

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <MatrixTextEffect
          phrases={["SKILLS", "EXPERTISE", "ABILITIES", "PROFICIENCY", "TALENTS"]}
          className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-6"
        />
      </div>

      <div className="page-content">
        {/* Interactive Skills Animation */}
        <div className="mb-12 bg-gray-900 p-6 rounded-lg border border-red-500/30">
          <div className="h-[500px] w-full relative">
            <PromptingIsAllYouNeed />
            {/* No need for additional heading here since we have the matrix text effect above */}
          </div>
        </div>

        <div className="grid-layout-1">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 border-red-500/30 hover:border-red-500/70 transition-all p-6 rounded-lg border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-500/20 p-2 rounded-md text-red-500">{skill.icon}</div>
                <h2 className="font-retro text-red-500">{skill.title}</h2>
              </div>
              <p className="text-gray-300">{skill.description}</p>

              {/* Animated skill level indicator */}
              <div className="mt-4">
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${70 + Math.random() * 30}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-gray-900 p-6 rounded-lg border border-red-500/30"
        >
          <h2 className="text-2xl font-retro text-red-500 mb-4">TECHNICAL PROFICIENCY</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Machine Learning</span>
                <span>90%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 1 }}
                  className="bg-red-500 h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>3D Development</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-red-500 h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Web Development</span>
                <span>95%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="bg-red-500 h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>App Development</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "80%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-red-500 h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Audio player */}
      <div className="fixed bottom-4 right-4 z-50">
        <AudioPlayer src="/sounds/arcade-beep.mp3" autoPlay={false} loop={false} volume={0.3} />
      </div>

      {/* CRT and scanline effects */}
      <div className="crt-effect"></div>
      <div className="scanlines"></div>
    </div>
  )
}
