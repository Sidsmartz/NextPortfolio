"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SkillCardProps {
  skill: {
    title: string
    description: string
    icon: React.ReactNode
  }
  index: number
}

export default function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="bg-gray-900 border-red-500/30 hover:border-red-500/70 transition-all skill-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-md text-red-500">{skill.icon}</div>
            <CardTitle className="font-retro text-red-500 glitch-text" data-text={skill.title}>
              {skill.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </motion.div>
  )
}
