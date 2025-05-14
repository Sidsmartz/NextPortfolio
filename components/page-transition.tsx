"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import PixelTransition from "./pixel-transition"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  href: string
  label: string
  className?: string
}

export default function PageTransition({ href, label, className = "" }: PageTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Check if current link is active
  const isActive = pathname === href
  
  const handleTransition = () => {
    if (isTransitioning || isActive) return
    
    setIsTransitioning(true)
    
    // Navigate after transition completes
    setTimeout(() => {
      router.push(href)
      setIsTransitioning(false)
    }, 500) // This should match the total transition duration
  }
  
  return (
    <div 
      className={`relative cursor-pointer transition-transform ${className} ${
        isActive ? "scale-110 text-red-500" : "hover:scale-105"
      }`}
      onClick={handleTransition}
    >
      <PixelTransition
        firstContent={<span className="font-retro text-white">{label}</span>}
        secondContent={<span className="font-retro text-red-500">{label}</span>}
        gridSize={8}
        pixelColor="#ff0000"
        animationStepDuration={0.3}
        style={{ 
          backgroundColor: "transparent", 
          border: "none", 
          width: "auto", 
          minWidth: "100px",
          textAlign: "center" 
        }}
      />
    </div>
  )
} 