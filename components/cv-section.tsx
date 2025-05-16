"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Briefcase, GraduationCap, Award } from "lucide-react"

export default function CVSection() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)

    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false)

      // Create download link for resume-siddharth.pdf
      const link = document.createElement("a")
      link.href = "/resume-siddharth.pdf" // Actual CV file path
      link.download = "resume-siddharth.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-retro text-red-500 glitch-text">CURRICULUM VITAE</h2>
        <Button onClick={handleDownload} disabled={isDownloading} className="arcade-button">
          {isDownloading ? "Downloading..." : "Download CV"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-retro text-red-500">
              <Briefcase className="h-5 w-5" /> WORK EXPERIENCE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-lg font-mono font-bold">Project Mentor</h3>
              <p className="text-sm text-red-500">
                Center for Innovation and Entrepreneurship, MLRIT • August 2024 - Present
              </p>
              <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                <li>Mentored 180+ students in developing AR/VR, IoT, Web and Mobile Applications</li>
                <li>Led 5+ Teams to success in hackathons and expos</li>
                <li>Spearheaded 20+ Teams to build real-time user-centric applications</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-lg font-mono font-bold">Technical Intern</h3>
              <p className="text-sm text-red-500">
                Centre for Innovation & Entrepreneurship, MLRIT • August 2024 - Present
              </p>
              <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                <li>Developed web applications for campus wide usage</li>
                <li>Supported technical setup for innovation challenges and tech fairs</li>
                <li>Created 5+ functional Web and Mobile Applications</li>
              </ul>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-retro text-red-500">
              <GraduationCap className="h-5 w-5" /> EDUCATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-lg font-mono font-bold">Bachelor of Technology</h3>
              <p className="text-sm text-red-500">MLR Institute of Technology • 2023 - 2027</p>
              <p className="mt-2 text-sm text-gray-300">Computer Science and Engineering (Information Technology)</p>
              <p className="text-sm text-gray-300">CGPA: 8.71</p>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-retro text-red-500">
              <Award className="h-5 w-5" /> ACHIEVEMENTS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="text-lg font-mono font-bold">Certifications</h3>
              <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                <li>National Cadet Corps - NCC A Certificate Holder</li>
                <li>C# Fundamentals - Microsoft, FreeCodeCamp</li>
                <li>Google Cloud Platform Certifications in Generative AI, Machine Learning</li>
                <li>Tensorflow 2 - Deep Learning and Artificial Intelligence 2025 - Udemy</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-lg font-mono font-bold">Awards</h3>
              <ul className="mt-2 text-sm text-gray-300 list-disc list-inside">
                <li>Multiple Gold/Silver Medals in International Olympiads in Maths, Science and English - SOF</li>
                <li>Selected for Smart India Hackathon 2024</li>
                <li>Ready Tensor CV Expo 2024</li>
                <li>IASF 2024 Exhibitions</li>
              </ul>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-retro text-red-500">
            <FileText className="h-5 w-5" /> SKILLS
          </CardTitle>
          <CardDescription>Technical Expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-md">
              <h4 className="text-lg font-mono font-bold text-red-400 mb-2">Programming Languages</h4>
              <p className="text-sm text-gray-300">Python, Java, JavaScript, C#, C++, SQL</p>
            </div>

            <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-md">
              <h4 className="text-lg font-mono font-bold text-red-400 mb-2">Web/App Development</h4>
              <p className="text-sm text-gray-300">React, Next.js, TailwindCSS, Node.js, Unity, Flutter, Wordpress</p>
            </div>

            <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-md">
              <h4 className="text-lg font-mono font-bold text-red-400 mb-2">Design</h4>
              <p className="text-sm text-gray-300">User Experience (UX) Design, Figma, Canva, Spline, Three.js</p>
            </div>

            <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-md">
              <h4 className="text-lg font-mono font-bold text-red-400 mb-2">DevOps & Cloud</h4>
              <p className="text-sm text-gray-300">AWS, Docker, Hostinger, CyberPanel</p>
            </div>

            <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-md">
              <h4 className="text-lg font-mono font-bold text-red-400 mb-2">ML & AI</h4>
              <p className="text-sm text-gray-300">Tensorflow, Pytorch, huggingface, GCP, Unity-MLAgents</p>
            </div>

            <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-md">
              <h4 className="text-lg font-mono font-bold text-red-400 mb-2">Tools</h4>
              <p className="text-sm text-gray-300">
                Postman, Git & GitHub, VSCode, Unity, Notion, Cursor, Fusion360, Blender
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-red-900/10 border border-red-500/30 rounded-md">
            <h4 className="text-lg font-mono font-bold text-red-400 mb-2">Soft Skills</h4>
            <p className="text-sm text-gray-300">Project Management, Design Thinking, Mentoring, Creativity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
