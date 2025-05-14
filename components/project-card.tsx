"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    tags: string[]
    image: string
    link: string
  }
  index: number
  isActive?: boolean
}

export default function ProjectCard({ project, index, isActive = false }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      <Card
        className={`transition-all hover:border-red-500/50 cursor-pointer ${
          isActive ? "border-red-500 bg-gray-900" : "bg-gray-800"
        }`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-retro text-red-500 glitch-text" data-text={project.title}>
            {project.title}
          </CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="border-red-500/50 text-red-400">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
