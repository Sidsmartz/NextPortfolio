"use client"

import { useState, useEffect, useCallback } from "react"
import MatrixTextEffect from "@/components/matrix-text-effect"
import LoadingScreen from "@/components/loading-screen"
import { Terminal } from "@/components/terminal/terminal"
import ProjectCard from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { TerminalIcon, ExternalLink } from "lucide-react"

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeProject, setActiveProject] = useState("project1")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null)
  const [showProjectImage, setShowProjectImage] = useState(false)

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
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      clearTimeout(timer)
    }
  }, [progressInterval])

  const startDemo = useCallback(() => {
    setIsRunning(true)
    setProgress(0)
    setShowProjectImage(false)

    // Clear any existing interval
    if (progressInterval) {
      clearInterval(progressInterval)
    }

    // Create new interval - faster execution
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          setShowProjectImage(true)
          return 100
        }
        return prev + 1 // Faster progress
      })
    }, 30) // Shorter interval

    // Store the interval ID
    setProgressInterval(interval)
  }, [progressInterval])

  // Auto-run the first project demo when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isRunning && !showProjectImage) {
        startDemo()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoading, isRunning, showProjectImage, startDemo])

  const projects = [
    {
      id: "project1",
      title: "Codesense",
      description: "A competitive coding leaderboard app aggregating data across platforms with 600+ active users.",
      tags: ["React", "Next.js", "AWS", "MongoDB"],
      image: "/codesense.png",
      link: "https://github.com/KeEbEe123/CodeSense",
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
      image: "/fishy.png",
      link: "https://github.com/Sidsmartz/Fishy_MGIT_HackSavvy",
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
        "",
        "# Creating Chrome Extension manifest.json",
        "{",
        '  "name": "Fishy - Phishing Detector",',
        '  "version": "1.0",',
        '  "description": "Detect phishing links and deepfake content",',
        '  "permissions": ["activeTab", "storage", "tabs"],',
        '  "background": {',
        '    "scripts": ["background.js"],',
        '    "persistent": false',
        "  },",
        '  "browser_action": {',
        '    "default_popup": "popup.html",',
        '    "default_icon": "icon.png"',
        "  },",
        '  "manifest_version": 2',
        "}",
        "",
        "# Deploying to AWS",
        "aws ecr create-repository --repository-name fishy-backend",
        "docker build -t fishy-backend .",
        "docker tag fishy-backend:latest AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/fishy-backend:latest",
        "docker push AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/fishy-backend:latest",
      ],
    },
    {
      id: "project3",
      title: "Smart Traffic Management System",
      description: "A real-time smart lane management model using object detection and ML Classification techniques.",
      tags: ["TensorFlow", "Unity", "PyTorch", "Python"],
      image: "/trafficml.png",
      link: "https://github.com/Sidsmartz/SIH---Traffic-Management-System",
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
        "",
        "# Lane management algorithm",
        "def optimize_traffic_signals(lane_loads):",
        "    total_load = sum(lane_loads)",
        "    if total_load == 0:",
        "        return [25, 25, 25, 25]  # Equal time for all lanes",
        "    ",
        "    # Allocate time proportional to load",
        "    time_allocations = [int((load / total_load) * 100) for load in lane_loads]",
        "    ",
        "    # Ensure minimum green time",
        "    for i in range(len(time_allocations)):",
        "        if time_allocations[i] < 15 and time_allocations[i] > 0:",
        "            time_allocations[i] = 15",
        "    ",
        "    return time_allocations",
        "",
        "# Simulation results",
        "print('Simulation complete!')",
        "print('Traffic reduction: 54% in peak hours')",
        "print('Average wait time reduced by 47%')",
        "print('Selected for Smart India Hackathon 2024')",
      ],
    },
    {
      id: "project4",
      title: "HosteLite",
      description: "A digital hostel management tool streamlining attendance, out-pass tracking and admin approvals.",
      tags: ["React", "Node.js", "Real-time Database", "MongoDB"],
      image: "",
      link: "https://github.com/Sidsmartz/HosteLite-RTP",
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
        "",
        "const OutpassSchema = new mongoose.Schema({",
        "  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },",
        "  reason: { type: String, required: true },",
        "  fromDate: { type: Date, required: true },",
        "  toDate: { type: Date, required: true },",
        "  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },",
        "  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },",
        "  createdAt: { type: Date, default: Date.now }",
        "});",
        "",
        "# Setting up real-time updates with Socket.io",
        "const http = require('http');",
        "const socketIo = require('socket.io');",
        "const server = http.createServer(app);",
        "const io = socketIo(server);",
        "",
        "io.on('connection', (socket) => {",
        "  console.log('New client connected');",
        "  ",
        "  socket.on('joinRoom', (roomId) => {",
        "    socket.join(roomId);",
        "  });",
        "  ",
        "  socket.on('outpassUpdate', (data) => {",
        "    io.to(data.studentId).emit('outpassStatusChanged', data);",
        "  });",
        "  ",
        "  socket.on('disconnect', () => {",
        "    console.log('Client disconnected');",
        "  });",
        "});",
        "",
        "# Project efficiency metrics",
        "console.log('Manual intervention reduced by 70%')",
        "console.log('Administrative efficiency increased by 85%')",
        "console.log('User satisfaction rating: 4.8/5')",
      ],
    },
  ]

  if (isLoading) {
    return <LoadingScreen />
  }

  const activeProjectData = projects.find((p) => p.id === activeProject)

  return (
    <div className="page-container">
      <div className="page-header">
        <MatrixTextEffect
          phrases={["PROJECTS", "MY WORK", "PORTFOLIO", "CREATIONS", "INNOVATIONS"]}
          className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-6"
        />
      </div>

      <div className="page-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {projects.map((project, index) => (
            <div key={project.id} className="cursor-pointer" onClick={() => setActiveProject(project.id)}>
              <ProjectCard project={project} index={index} isActive={activeProject === project.id} />
            </div>
          ))}
        </div>

        {/* Project Details Section */}
        <div className="bg-gray-900 rounded-lg border border-red-500/30 overflow-hidden mb-8">
          <div className="border-b border-red-500/30 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-retro text-red-500">{activeProjectData?.title}</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-900/20"
              onClick={() => window.open(activeProjectData?.link, "_blank")}
            >
              View Project <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {showProjectImage && !isRunning && progress === 100 ? (
            <div className="p-4 flex justify-center">
              <div className="w-full max-w-4xl">
                <img
                  src={activeProjectData?.image}
                  alt={activeProjectData?.title}
                  className="w-full h-auto rounded-md border border-red-500/30 object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="p-4">
            <p className="text-gray-300 mb-4">{activeProjectData?.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {activeProjectData?.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-md border border-red-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal Section */}
        <div className="bg-gray-900 rounded-lg border border-red-500/30 overflow-hidden">
          <div className="border-b border-red-500/30 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <TerminalIcon className="mr-2 h-5 w-5 text-red-500" />
              <h3 className="font-retro text-red-500">Code Demo</h3>
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

          <div className="p-0 h-[400px] overflow-auto custom-scrollbar">
            <Terminal commands={activeProjectData?.commands || []} isRunning={isRunning} progress={progress} />
          </div>

          <div className="border-t border-red-500/30 p-4 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {progress === 100 ? "Demo completed" : isRunning ? "Running demo..." : "Ready to run"}
            </div>
          </div>
        </div>
      </div>

      {/* CRT and scanline effects */}
      <div className="crt-effect"></div>
      <div className="scanlines"></div>
    </div>
  )
}
