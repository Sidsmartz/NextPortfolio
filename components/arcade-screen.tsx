"use client"

import { useRef, useState, useEffect } from "react"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { gsap } from "gsap"
import type * as THREE from "three"

export default function ArcadeScreen({
  onClick,
  visible = false,
}: {
  onClick: () => void
  visible: boolean
}) {
  const textRef = useRef<HTMLDivElement>(null)
  const [textVisible, setTextVisible] = useState(false)
  const screenRef = useRef<THREE.Mesh>(null)
  const staticRef = useRef<THREE.Mesh>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Animate text appearing from bottom when visible prop changes
  useEffect(() => {
    if (visible && textRef.current) {
      // Initially position text below the screen
      gsap.set(textRef.current, {
        y: 50,
        opacity: 0,
      })

      // Animate text coming up
      gsap.to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        onComplete: () => setTextVisible(true),
      })
    }
  }, [visible])

  // Blinking effect for the text
  useFrame((state) => {
    if (textRef.current && textVisible) {
      const blink = Math.sin(state.clock.getElapsedTime() * 3) > 0
      textRef.current.style.opacity = blink ? "1" : "0.7"
    }

    // Make the screen glow with a very subtle pulsing effect
    if (screenRef.current && screenRef.current.material) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05
    }

    // Update static noise effect
    if (staticRef.current && staticRef.current.material) {
      const material = staticRef.current.material as THREE.ShaderMaterial
      if (material.uniforms && material.uniforms.time) {
        material.uniforms.time.value = state.clock.getElapsedTime()
      }
    }
  })

  return (
    <group>
      {/* Screen base - even less emissive */}

      {/* Static noise overlay - adjusted to match size */}

      {/* Screen content */}
      <Html
        transform
        distanceFactor={isMobile ? 0.6 : 0.5} // Adjust distance factor on mobile
        position={[0, 1.3, 0.43]}
        style={{
          width: isMobile ? "280px" : "320px", /* Adjust width for mobile */
          height: isMobile ? "240px" : "260px", /* Adjust height for mobile */
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: isMobile ? "15px 5px" : "20px 10px", /* Reduced padding on mobile */
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 0.5s ease",
        }}
      >
        <div
          ref={textRef}
          onClick={onClick}
          className="cursor-pointer text-center"
          style={{
            color: "#ff6666",
            textShadow: "0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000, 0 0 20px #ff0000, 0 0 25px #ff0000", /* Enhanced glow but same color */
            fontSize: isMobile ? "36px" : "42px", /* Smaller font on mobile */
            fontFamily: "var(--font-retro)",
            letterSpacing: isMobile ? "0px" : "1px", /* Reduced letter spacing on mobile */
            lineHeight: "1.2", /* Reduced line height to fit better */
            textTransform: "uppercase",
            fontWeight: "bold",
            width: "100%", /* Ensure it takes full width of container */
            margin: "0", /* Remove any margin that might cause issues */
          }}
        >
          CLICK HERE TO START
        </div>
      </Html>
    </group>
  )
}
