"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { EffectComposer, Bloom, Noise, Vignette, Scanline } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import RetroArcadeMachine from "@/components/retro-arcade-machine"
import ArcadeScreen from "@/components/arcade-screen"
import LoadingScreen from "@/components/loading-screen"
import { useArcadeSounds } from "@/hooks/use-arcade-sounds"
import { useRouter } from "next/navigation"
import { createPixelTransition } from "@/lib/transition-effect"
import AudioPlayer from "@/components/audio-player"
import type * as THREE from "three"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showStartButton, setShowStartButton] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Initialize sound effects
  const { playAmbient, playBeep, playStart } = useArcadeSounds()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
      setIsMobile(window.innerWidth < 768)

      // Listen for window resizes to update mobile status
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768)
      }
      window.addEventListener('resize', handleResize)

      // Start ambient sound when component mounts
      playAmbient()

      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false)
        
        // Show start button immediately after loading is complete
        setTimeout(() => {
          setShowStartButton(true)
          playBeep()
        }, 1000)
      }, 3000)

      const handleScroll = () => {
        if (!containerRef.current) return

        const scrollY = window.scrollY
        const windowHeight = window.innerHeight
        const documentHeight = document.body.scrollHeight - windowHeight

        // Calculate scroll progress (0 to 1)
        const progress = Math.min(scrollY / documentHeight, 1)
        setScrollProgress(progress)

        // Gradually fade out scroll indicator based on scroll progress
        const fadeOutStart = 0.1 // Start fading at 10% scroll
        const fadeOutEnd = 0.5 // Completely faded at 50% scroll

        if (progress > fadeOutStart) {
          const opacity = Math.max(0, 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart))
          setScrollIndicatorOpacity(opacity)
          if (opacity < 0.05) setShowScrollIndicator(false)
        } else {
          setScrollIndicatorOpacity(1)
          setShowScrollIndicator(true)
        }
      }

      window.addEventListener("scroll", handleScroll)
      return () => {
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener('resize', handleResize)
        clearTimeout(timer)
      }
    }
  }, [showStartButton, playAmbient, playBeep])

  const handleStartClick = () => {
    console.log("Start button clicked, initiating transition")

    // Use a try-catch block to handle potential audio errors
    try {
      playStart() // Play start sound
    } catch (error) {
      console.error("Could not play start sound:", error)
    }

    // Create pixel transition effect with red glow
    createPixelTransition(() => {
      router.push("/about")
    })
  }

  // Initialize cursor effect
  useEffect(() => {
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
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div
      ref={containerRef}
      className="bg-black text-white min-h-[300vh]" // Make page scrollable
    >
      {/* Fixed position canvas that stays in view while scrolling */}
      <div className="fixed inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={1.5} 
              castShadow 
              shadow-mapSize-width={isMobile ? 512 : 1024}
              shadow-mapSize-height={isMobile ? 512 : 1024}
            />
            <Environment preset="city" />

            {isMounted && <CameraController scrollProgress={scrollProgress} isMobile={isMobile} />}

            {isMounted && <RetroArcadeMachine position={[0, 0, 0]} rotation={[0, 0, 0]} />}

            {/* Floor grid */}
            {isMounted && <FloorGrid />}

            {/* Vertical grid behind arcade machine - made larger */}
            {isMounted && <VerticalGrid />}

            {/* Always render ArcadeScreen but control visibility with opacity */}
            {isMounted && <ArcadeScreen onClick={handleStartClick} visible={showStartButton} />}

            {/* Enhanced post-processing effects with UnrealBloomPass-like bloom */}
            <EffectComposer enabled={!isMobile}>
              <Bloom 
                intensity={isMobile ? 0.8 : 1.2}
                luminanceThreshold={0.6}
                luminanceSmoothing={0.9}
                height={isMobile ? 150 : 300}
                kernelSize={isMobile ? 3 : 5}
              />
              <Noise opacity={isMobile ? 0.08 : 0.12} blendFunction={BlendFunction.OVERLAY} />
              <Scanline density={isMobile ? 1.5 : 2.5} opacity={isMobile ? 0.15 : 0.2} blendFunction={BlendFunction.OVERLAY} />
              <Vignette eskil={false} offset={0.1} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced CRT and scanline effects - reduce opacity on mobile */}
      <div className="crt-effect" style={{ opacity: isMobile ? 0.5 : 1 }}></div>
      <div className="scanlines" style={{ opacity: isMobile ? 0.3 : 0.4 }}></div>

      {/* Audio player */}
      <div className="fixed bottom-4 right-4 z-50">
        <AudioPlayer src="/sounds/arcade-ambient.mp3" autoPlay loop volume={0.2} controls={false} />
      </div>

      {/* Scroll indicator - improved positioning and persistence with opacity transition */}
      {showScrollIndicator && (
        <div
          className="fixed bottom-10 left-0 right-0 flex justify-center items-center animate-bounce z-20"
          style={{ opacity: scrollIndicatorOpacity, transition: "opacity 0.5s ease-in-out" }}
        >
          <div className="flex flex-col items-center">
            <div className="w-6 h-10 rounded-full border-2 border-red-500 flex justify-center">
              <div className="w-1 h-3 bg-red-500 rounded-full mt-1 animate-pulse"></div>
            </div>
            <p className="text-red-500 font-retro text-xs mt-2">SCROLL TO CONTINUE</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Component to control camera based on scroll
function CameraController({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  const cameraRef = useRef({
    position: { x: 5, y: 1, z: 5 },
    lookAt: { x: 0, y: 1, z: 0 },
  })

  useEffect(() => {
    // Initial setup happens in useThree
  }, [])

  // Adjust camera position for mobile to ensure arcade machine is centered
  const mobileXOffset = isMobile ? 0.5 : 0 // Move slightly to the left on mobile
  const mobileZDistance = isMobile ? 6 : 5 // Start further back on mobile

  return (
    <PerspectiveCamera
      makeDefault
      position={[
        mobileXOffset + (5 - scrollProgress * 5), // Move from x=5 to x=0, adjusted for mobile
        1 + scrollProgress * 0.3, // Move from y=1 to y=1.3
        mobileZDistance - scrollProgress * (isMobile ? 4 : 3.5), // Adjusted distance based on device
      ]}
      fov={isMobile ? 35 : 30} // Wider field of view on mobile
      near={0.1}
      far={100}
      lookAt={[0, 1.3, 0]} // Always look at the arcade screen
    />
  )
}

// Custom PerspectiveCamera component
function PerspectiveCamera({
  position,
  lookAt,
  fov,
  near,
  far,
  makeDefault = false,
}: {
  position: [number, number, number]
  lookAt: [number, number, number]
  fov: number
  near: number
  far: number
  makeDefault?: boolean
}) {
  const { camera, set } = useThree()

  useEffect(() => {
    if (makeDefault) {
      // Set camera properties
      camera.position.set(...position)
      camera.lookAt(...lookAt)
      
      // Fix for typecasting since we know this is a PerspectiveCamera
      if ('fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = fov;
        (camera as THREE.PerspectiveCamera).near = near;
        (camera as THREE.PerspectiveCamera).far = far;
        camera.updateProjectionMatrix();
      }

      // Make this the default camera
      set({ camera })
    }
  }, [camera, position, lookAt, fov, near, far, set, makeDefault])

  return null
}

// Floor grid component
function FloorGrid() {
  const gridRef = useRef<THREE.Mesh>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useFrame((state) => {
    if (gridRef.current && gridRef.current.material) {
      const material = gridRef.current.material as THREE.MeshStandardMaterial
      // Reduce animation intensity on mobile for better performance
      const animationIntensity = isMobile ? 0.1 : 0.2
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 0.5) * animationIntensity
    }
  })

  // Reduce grid divisions on mobile for better performance
  const gridDivisions = isMobile ? 25 : 50

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50, gridDivisions, gridDivisions]} />
      <meshStandardMaterial
        color="#ff0000"
        emissive="#ff0000"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={isMobile ? 0.2 : 0.3} // Reduce opacity on mobile
      />
    </mesh>
  )
}

// Vertical grid component
function VerticalGrid() {
  const gridRef = useRef<THREE.Mesh>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useFrame((state) => {
    if (gridRef.current && gridRef.current.material) {
      const material = gridRef.current.material as THREE.MeshStandardMaterial
      // Reduce animation intensity on mobile for better performance
      const animationIntensity = isMobile ? 0.1 : 0.2
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 0.5) * animationIntensity
    }
  })

  // Reduce grid divisions on mobile for better performance
  const gridDivisions = isMobile ? 25 : 100

  return (
    <mesh ref={gridRef} position={[0, 0, -10]} rotation={[0, 0, 0]}>
      <planeGeometry args={[100, 50, gridDivisions, gridDivisions / 2]} /> {/* Made grid wider and taller, but fewer divisions on mobile */}
      <meshStandardMaterial
        color="#ff0000"
        emissive="#ff0000"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={isMobile ? 0.15 : 0.2} // Reduce opacity on mobile
      />
    </mesh>
  )
}
