"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Terminal } from "@/components/terminal/terminal"
import ProjectCard from "@/components/project-card"
import SkillCard from "@/components/skill-card"
import ContactForm from "@/components/contact-form"
import CVSection from "@/components/cv-section"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Squares from "@/components/squares"
import { PromptingIsAllYouNeed } from "@/components/prompting-is-all-you-need"
import { createPixelTransition } from "@/lib/transition-effect"
import LoadingScreen from "@/components/loading-screen"
import {
  Code,
  Gamepad2,
  Brain,
  Layers,
  Github,
  Linkedin,
  TerminalIcon,
  User,
  Briefcase,
  Wrench,
  Send,
  FileText,
  ExternalLink,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [activeProject, setActiveProject] = useState("project1")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("about")
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showProjectImage, setShowProjectImage] = useState(false)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const cursorTrailRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Initialize cursor effect
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    document.body.appendChild(cursor)
    cursorRef.current = cursor

    const cursorTrail = document.createElement("div")
    cursorTrail.className = "cursor-trail"
    document.body.appendChild(cursorTrail)
    cursorTrailRef.current = cursorTrail

    const updateCursor = (e: MouseEvent) => {
      if (cursor && cursorTrail) {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top = `${e.clientY}px`

        setTimeout(() => {
          cursorTrail.style.left = `${e.clientX}px`
          cursorTrail.style.top = `${e.clientY}px`
        }, 100)
      }
    }

    document.addEventListener("mousemove", updateCursor)

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      if (cursorRef.current && document.body.contains(cursorRef.current)) {
        document.body.removeChild(cursorRef.current)
      }
      if (cursorTrailRef.current && document.body.contains(cursorTrailRef.current)) {
        document.body.removeChild(cursorTrailRef.current)
      }
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      clearTimeout(timer)
    }
  }, [])

  // Clean up intervals when component unmounts or tab changes
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [progressInterval, activeTab])

  const projects = [
    {
      id: "project1",
      title: "Codesense",
      description: "A competitive coding leaderboard app aggregating data across platforms with 600+ active users.",
      tags: ["React", "Next.js", "AWS", "MongoDB"],
      image: "/placeholder.svg?height=300&width=500",
      link: "#",
      commands: [
        "# Codesense - Competitive Coding Leaderboard",
        "# Initializing Next.js application...",
        "npx create-next-app codesense --typescript",
        "cd codesense",
        "",
        "# Installing dependencies",
        "npm install axios mongoose next-auth chart.js react-chartjs-2 tailwindcss",
        "",
        "# Setting up MongoDB connection",
        "import mongoose from 'mongoose';",
        "",
        "const connectDB = async () => {",
        "  try {",
        "    await mongoose.connect(process.env.MONGODB_URI);",
        "    console.log('MongoDB connected successfully');",
        "  } catch (error) {",
        "    console.error('MongoDB connection error:', error);",
        "    process.exit(1);",
        "  }",
        "};",
        "",
        "# Creating user schema",
        "const UserSchema = new mongoose.Schema({",
        "  username: { type: String, required: true, unique: true },",
        "  email: { type: String, required: true, unique: true },",
        "  platforms: {",
        "    leetcode: { username: String, problems: Number, rating: Number },",
        "    codeforces: { username: String, problems: Number, rating: Number },",
        "    hackerrank: { username: String, problems: Number, rating: Number },",
        "    codechef: { username: String, problems: Number, rating: Number }",
        "  },",
        "  totalScore: { type: Number, default: 0 },",
        "  rank: { type: Number }",
        "});",
        "",
        "# Fetching data from competitive coding platforms",
        "async function fetchUserData(username) {",
        "  const leetcodeData = await axios.get(`https://leetcode-api.com/user/${username}`);",
        "  const codeforcesData = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);",
        "  // Process and aggregate data",
        "  return { leetcode: leetcodeData, codeforces: codeforcesData };",
        "}",
        "",
        "# Deploying to AWS",
        "aws s3 sync .next s3://codesense-app/",
        'aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"',
        "",
        "# Application deployed successfully!",
        "# 600+ active users and growing",
      ],
    },
    {
      id: "project2",
      title: "Fishy",
      description:
        "A Chrome Extension to detect phishing links and deepfake content using NLP and HuggingFace Transformers.",
      tags: ["Flask", "Chrome Extension", "HuggingFace", "AWS"],
      image: "/placeholder.svg?height=300&width=500",
      link: "#",
      commands: [
        "# Fishy - Phishing & Deepfake Detection",
        "# Setting up Flask backend...",
        "from flask import Flask, request, jsonify",
        "from flask_cors import CORS",
        "import torch",
        "from transformers import AutoModelForSequenceClassification, AutoTokenizer",
        "",
        "app = Flask(__name__)",
        "CORS(app)",
        "",
        "# Load HuggingFace model for phishing detection",
        "tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')",
        "model = AutoModelForSequenceClassification.from_pretrained('phishing-detection-model')",
        "model.eval()",
        "",
        "# API endpoint for phishing detection",
        "@app.route('/api/check-url', methods=['POST'])",
        "def check_url():",
        "    data = request.json",
        "    url = data.get('url')",
        "    ",
        "    # Tokenize and predict",
        "    inputs = tokenizer(url, return_tensors='pt', truncation=True, padding=True)",
        "    with torch.no_grad():",
        "        outputs = model(**inputs)",
        "    ",
        "    # Process results",
        "    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)",
        "    phishing_score = probabilities[0][1].item()",
        "    ",
        "    # Log to database",
        "    log_to_database(url, phishing_score)",
        "    ",
        "    return jsonify({",
        "        'url': url,",
        "        'is_phishing': phishing_score > 0.7,",
        "        'confidence': phishing_score",
        "    })",
      ],
    },
    {
      id: "project3",
      title: "Smart Traffic Management System",
      description: "A real-time smart lane management model using object detection and ML Classification techniques.",
      tags: ["TensorFlow", "Unity", "PyTorch", "Python"],
      image: "/placeholder.svg?height=300&width=500",
      link: "#",
      commands: [
        "# Smart Traffic Management System",
        "# Importing libraries...",
        "import tensorflow as tf",
        "import numpy as np",
        "import cv2",
        "from tensorflow.keras.applications import MobileNetV2",
        "from tensorflow.keras.layers import Dense, GlobalAveragePooling2D",
        "from tensorflow.keras.models import Model",
        "",
        "# Setting up object detection model",
        "def create_model():",
        "    base_model = MobileNetV2(weights='imagenet', include_top=False)",
        "    x = base_model.output",
        "    x = GlobalAveragePooling2D()(x)",
        "    x = Dense(1024, activation='relu')(x)",
        "    predictions = Dense(4, activation='softmax')(x)  # car, bus, truck, motorcycle",
        "    model = Model(inputs=base_model.input, outputs=predictions)",
        "    return model",
        "",
        "# Traffic density calculation function",
        "def calculate_traffic_density(frame):",
        "    # Preprocess frame",
        "    resized = cv2.resize(frame, (224, 224))",
        "    normalized = resized / 255.0",
        "    batch = np.expand_dims(normalized, axis=0)",
        "    ",
        "    # Detect vehicles",
        "    predictions = model.predict(batch)",
        "    ",
        "    # Count vehicles by type",
        "    vehicle_counts = {",
        "        'car': int(predictions[0][0] * 100),",
        "        'bus': int(predictions[0][1] * 100),",
        "        'truck': int(predictions[0][2] * 100),",
        "        'motorcycle': int(predictions[0][3] * 100)",
        "    }",
        "    ",
        "    # Calculate lane load",
        "    total_load = (vehicle_counts['car'] + ",
        "                 vehicle_counts['motorcycle'] * 0.5 + ",
        "                 vehicle_counts['bus'] * 2.5 + ",
        "                 vehicle_counts['truck'] * 3.0)",
        "    ",
        "    return total_load, vehicle_counts",
      ],
    },
    {
      id: "project4",
      title: "HosteLite",
      description: "A digital hostel management tool streamlining attendance, out-pass tracking and admin approvals.",
      tags: ["React", "Node.js", "Real-time Database", "MongoDB"],
      image: "/placeholder.svg?height=300&width=500",
      link: "#",
      commands: [
        "# HosteLite - Hostel Management System",
        "# Setting up React frontend...",
        "npx create-react-app hostelite",
        "cd hostelite",
        "",
        "# Installing dependencies",
        "npm install @material-ui/core @material-ui/icons axios firebase react-router-dom",
        "",
        "# Setting up Node.js backend",
        "mkdir backend",
        "cd backend",
        "npm init -y",
        "npm install express mongoose cors jsonwebtoken bcrypt dotenv",
        "",
        "# Creating MongoDB schemas",
        "const mongoose = require('mongoose');",
        "",
        "const StudentSchema = new mongoose.Schema({",
        "  name: { type: String, required: true },",
        "  rollNumber: { type: String, required: true, unique: true },",
        "  room: { type: String, required: true },",
        "  block: { type: String, required: true },",
        "  contact: { type: String, required: true },",
        "  parentContact: { type: String, required: true },",
        "  attendance: [{ date: Date, present: Boolean }],",
        "  outpasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outpass' }]",
        "});",
      ],
    },
  ]

  const skills = [
    {
      title: "Web Development",
      description: "React, Next.js, TailwindCSS, Node.js, WordPress",
      icon: <Code className="h-8 w-8 text-red-500" />,
    },
    {
      title: "App Development",
      description: "Flutter, Unity, React Native, Mobile UI/UX",
      icon: <Gamepad2 className="h-8 w-8 text-red-500" />,
    },
    {
      title: "Machine Learning",
      description: "TensorFlow, PyTorch, huggingface, Computer Vision",
      icon: <Brain className="h-8 w-8 text-red-500" />,
    },
    {
      title: "Design",
      description: "UX Design, Figma, Canva, Spline, Three.js",
      icon: <Layers className="h-8 w-8 text-red-500" />,
    },
  ]

  const activeCommands = projects.find((project) => project.id === activeProject)?.commands || []
  const activeProjectData = projects.find((project) => project.id === activeProject)

  const startDemo = () => {
    setIsRunning(true)
    setProgress(0)
    setShowProjectImage(false)

    // Clear any existing interval
    if (progressInterval) {
      clearInterval(progressInterval)
    }

    // Create new interval - slower execution
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          setShowProjectImage(true)
          return 100
        }
        return prev + 0.5 // Slower progress
      })
    }, 50)

    // Store the interval ID
    setProgressInterval(interval)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Reset project demo state when switching tabs
    if (value !== "projects" && isRunning) {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setIsRunning(false)
      setProgress(0)
      setShowProjectImage(false)
    }
  }

  const handleReturnToArcade = () => {
    createPixelTransition(() => {
      router.push("/")
    })
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-red-500/30 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-retro text-red-500">ARCADE PORTFOLIO</h1>
          <Button onClick={handleReturnToArcade} className="arcade-button">
            Return to Arcade
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="about" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-5 mb-8 font-retro">
            <TabsTrigger value="about" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <User className="mr-2 h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Wrench className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="cv" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <FileText className="mr-2 h-4 w-4" />
              CV
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Send className="mr-2 h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* About Section */}
          <TabsContent value="about" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-gray-900 p-6 rounded-lg border border-red-500/30">
                <h2 className="text-2xl font-retro text-red-500 mb-4 glitch-text">TS SIDDHARTH</h2>
                <h3 className="text-xl mb-4">Computer Science Student & Tech Enthusiast</h3>
                <p className="mb-4 text-gray-300 font-mono">
                  I'm a passionate Computer Science student with expertise in web development, machine learning, and
                  application design. Currently pursuing my B.Tech in Computer Science and Engineering (IT) at MLR
                  Institute of Technology with a CGPA of 8.71.
                </p>
                <p className="text-gray-300 font-mono">
                  As a Project Mentor at the Center for Innovation and Entrepreneurship, I help students develop
                  innovative solutions using cutting-edge technologies.
                </p>

                <div className="flex gap-4 mt-6">
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
                    onClick={() => window.open("https://linkedin.com/in/SiddharthTS", "_blank")}
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg border border-red-500/30">
                <h2 className="text-2xl font-retro text-red-500 mb-4 glitch-text">EXPERIENCE</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl">Project Mentor</h3>
                    <p className="text-sm text-red-500 mb-2">
                      Center for Innovation and Entrepreneurship, MLRIT • August 2024 - Present
                    </p>
                    <p className="text-gray-300">
                      Mentoring 180+ students in developing AR/VR, IoT, Web and Mobile Applications using agile
                      workflows.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl">Technical Intern</h3>
                    <p className="text-sm text-red-500 mb-2">
                      Centre for Innovation & Entrepreneurship, MLRIT • August 2024 - Present
                    </p>
                    <p className="text-gray-300">
                      Developing web applications for campus wide usage and supporting technical setup for innovation
                      challenges.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-retro text-red-500 text-center mb-8 glitch-text">&lt; MY SKILLS /&gt;</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {skills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} index={index} />
                ))}
              </div>

              <div className="bg-gray-900 p-6 rounded-lg border border-red-500/30 mt-8">
                <h3 className="text-xl font-retro text-red-500 mb-4 glitch-text">TECHNICAL PROFICIENCY</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Programming Languages</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Web/App Development</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Design</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>ML & AI</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Skills Animation */}
              <div className="mt-12 bg-gray-900 p-6 rounded-lg border border-red-500/30">
                <h3 className="text-xl font-retro text-red-500 mb-4 glitch-text">INTERACTIVE SKILLS DEMO</h3>
                <div className="h-[400px] w-full">
                  <PromptingIsAllYouNeed />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Projects Section */}
          <TabsContent value="projects">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-retro text-red-500 text-center mb-8 glitch-text">[PROJECTS]</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div key={project.id} className="cursor-pointer" onClick={() => setActiveProject(project.id)}>
                        <ProjectCard project={project} index={index} isActive={activeProject === project.id} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-gray-900 rounded-lg border border-red-500/30 overflow-hidden">
                    <div className="border-b border-red-500/30 p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <TerminalIcon className="mr-2 h-5 w-5 text-red-500" />
                        <h3 className="font-retro text-red-500">
                          {projects.find((p) => p.id === activeProject)?.title} Demo
                        </h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startDemo}
                        disabled={isRunning}
                        className="border-red-500 text-red-500 hover:bg-red-900/20"
                      >
                        Run Demo
                      </Button>
                    </div>

                    {showProjectImage && !isRunning && progress === 100 ? (
                      <div className="p-4 h-[400px] flex flex-col items-center justify-center">
                        <div className="relative w-full max-w-md">
                          <img
                            src={activeProjectData?.image || "/placeholder.svg"}
                            alt={activeProjectData?.title}
                            className="w-full h-auto rounded-md border border-red-500/30"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4">
                            <Button
                              className="arcade-button"
                              onClick={() => window.open(activeProjectData?.link, "_blank")}
                            >
                              View Project Live <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-0 h-[400px] overflow-auto custom-scrollbar">
                        <Terminal commands={activeCommands} isRunning={isRunning} progress={progress} />
                      </div>
                    )}

                    <div className="border-t border-red-500/30 p-4 flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        {progress === 100 ? "Demo completed" : isRunning ? "Running demo..." : "Ready to run"}
                      </div>
                      {!showProjectImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-900/20"
                          onClick={() => window.open(projects.find((p) => p.id === activeProject)?.link, "_blank")}
                        >
                          View Project <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* CV Section */}
          <TabsContent value="cv">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <CVSection />
            </motion.div>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 relative"
            >
              <h2 className="text-3xl font-retro text-red-500 text-center mb-8 glitch-text">// CONTACT ME</h2>

              <div className="absolute inset-0 -z-10 opacity-50">
                <Squares direction="diagonal" speed={0.5} borderColor="#ff0000" hoverFillColor="#330000" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-red-500/30">
                  <h3 className="text-xl font-retro text-red-500 mb-4">GET IN TOUCH</h3>
                  <p className="mb-6 text-gray-300">
                    Interested in working together? Have a project in mind? Feel free to reach out and let's create
                    something amazing.
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
                      onClick={() => window.open("https://linkedin.com/in/SiddharthTS", "_blank")}
                    >
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-gray-300">
                    <p>📍 Hyderabad, India</p>
                    <p>📧 siddhartht4206@gmail.com</p>
                  </div>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-sm">
                  <ContactForm />
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-red-500/30 text-center text-gray-400 mt-8">
        <div className="container mx-auto">
          <p className="font-retro">
            &copy; {new Date().getFullYear()} TS Siddharth | Designed with <span className="text-red-500">❤</span> and
            code
          </p>
          <p className="text-xs mt-2 text-gray-500">Built with Next.js, Three.js, and Framer Motion</p>
        </div>
      </footer>

      {/* CRT and scanline effects */}
      <div className="crt-effect"></div>
      <div className="scanlines"></div>
    </div>
  )
}
