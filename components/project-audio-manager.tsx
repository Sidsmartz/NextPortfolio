"use client"

import { useState, useEffect, useRef } from "react"
import { playSound, projectSounds, initializeAudio } from "@/lib/audio"

interface ProjectAudioManagerProps {
  activeProject: string
  isRunning: boolean
  progress: number
}

export default function ProjectAudioManager({ activeProject, isRunning, progress }: ProjectAudioManagerProps) {
  const [initialized, setInitialized] = useState(false)
  const ambientSoundRef = useRef<{ stop: () => void } | null>(null)
  const typingSoundRef = useRef<{ stop: () => void } | null>(null)
  const prevActiveProjectRef = useRef<string>(activeProject)
  
  // Initialize audio on mount
  useEffect(() => {
    initializeAudio().then(() => {
      setInitialized(true)
    })
    
    return () => {
      // Cleanup sounds on unmount
      if (ambientSoundRef.current) {
        ambientSoundRef.current.stop()
      }
      if (typingSoundRef.current) {
        typingSoundRef.current.stop()
      }
    }
  }, [])
  
  // Handle ambient background music
  useEffect(() => {
    if (!initialized) return
    
    // Start ambient sound if not already playing
    if (!ambientSoundRef.current) {
      ambientSoundRef.current = playSound(projectSounds.ambient, {
        volume: 0.2,
        loop: true,
        fadeIn: true
      })
    }
    
    return () => {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.stop()
        ambientSoundRef.current = null
      }
    }
  }, [initialized])
  
  // Handle typing sound effect
  useEffect(() => {
    if (!initialized) return
    
    if (isRunning && progress > 0 && progress < 100) {
      // Start typing sound if not already playing
      if (!typingSoundRef.current) {
        typingSoundRef.current = playSound(projectSounds.typing, {
          volume: 0.3,
          loop: true
        })
      }
    } else {
      // Stop typing sound
      if (typingSoundRef.current) {
        typingSoundRef.current.stop()
        typingSoundRef.current = null
      }
    }
    
    return () => {
      if (typingSoundRef.current) {
        typingSoundRef.current.stop()
        typingSoundRef.current = null
      }
    }
  }, [isRunning, progress, initialized])
  
  // Handle completion sound effect
  useEffect(() => {
    if (!initialized) return
    
    if (progress === 100 && isRunning === false) {
      // Play completion sound
      playSound(projectSounds.complete, {
        volume: 0.5,
        loop: false
      })
    }
  }, [progress, isRunning, initialized])
  
  // Handle project switch sound effect
  useEffect(() => {
    if (!initialized) return
    
    if (activeProject !== prevActiveProjectRef.current && prevActiveProjectRef.current !== "") {
      // Play switch sound
      playSound(projectSounds.switch, {
        volume: 0.4,
        loop: false
      })
    }
    
    prevActiveProjectRef.current = activeProject
  }, [activeProject, initialized])
  
  return null // This component doesn't render anything visible
} 