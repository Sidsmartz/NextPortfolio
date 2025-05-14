"use client"

import { useRef, useState, useEffect, Suspense, useMemo } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { EffectComposer, Bloom, Noise, Vignette, Scanline, DepthOfField } from "@react-three/postprocessing"
import { BlendFunction, KernelSize } from "postprocessing"
import RetroArcadeMachine from "@/components/retro-arcade-machine"
import ArcadeScreen from "@/components/arcade-screen"
import LoadingScreen from "@/components/loading-screen"
import { useArcadeSounds } from "@/hooks/use-arcade-sounds"
import { useRouter } from "next/navigation"
import { createPixelTransition } from "@/lib/transition-effect"
import AudioPlayer from "@/components/audio-player"
import * as THREE from "three"

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
            <spotLight 
              position={[10, 10, 10]} 
              angle={0.15} 
              penumbra={1} 
              intensity={1.5} 
              castShadow
            />
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

            {/* Floor grid with stronger glow */}
            {isMounted && <FloorGrid enhanced={true} />}

            {/* Vertical grid behind arcade machine with stronger glow */}
            {isMounted && <VerticalGrid enhanced={true} />}

            {/* Add particle system for ambient particles */}
            {isMounted && !isMobile && <ParticleSystem />}

            {/* Always render ArcadeScreen but control visibility with opacity */}
            {isMounted && <ArcadeScreen onClick={handleStartClick} visible={showStartButton} />}

            {/* Enhanced post-processing effects with enhanced bloom */}
            <EffectComposer enabled={true}>
              <DepthOfField 
                focusDistance={0} 
                focalLength={0.02} 
                bokehScale={2} 
                height={480} 
              />
              <Bloom 
                intensity={isMobile ? 1.5 : 2.5}
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9}
                height={isMobile ? 200 : 400}
                kernelSize={KernelSize.HUGE}
              />
              <Noise opacity={isMobile ? 0.07 : 0.09} blendFunction={BlendFunction.OVERLAY} />
              <Scanline density={2} opacity={isMobile ? 0.1 : 0.15} blendFunction={BlendFunction.OVERLAY} />
              <Vignette eskil={false} offset={0.1} darkness={0.8} blendFunction={BlendFunction.NORMAL} />
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
function FloorGrid({ enhanced = false }: { enhanced?: boolean }) {
  const gridRef = useRef<THREE.Mesh>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useFrame((state) => {
    if (gridRef.current && gridRef.current.material) {
      const material = gridRef.current.material as THREE.MeshStandardMaterial
      // Increased animation intensity for enhanced mode
      const animationIntensity = enhanced ? (isMobile ? 0.25 : 0.4) : (isMobile ? 0.1 : 0.2)
      material.emissiveIntensity = 0.7 + Math.sin(state.clock.getElapsedTime() * 0.5) * animationIntensity
    }
  })

  // Reduce grid divisions on mobile for better performance
  const gridDivisions = isMobile ? 25 : (enhanced ? 60 : 50)

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50, gridDivisions, gridDivisions]} />
      <meshStandardMaterial
        color="#ff0000"
        emissive="#ff3333"
        emissiveIntensity={enhanced ? 0.8 : 0.5}
        wireframe
        transparent
        opacity={isMobile ? 0.2 : 0.3} // Reduce opacity on mobile
      />
    </mesh>
  )
}

// Vertical grid component
function VerticalGrid({ enhanced = false }: { enhanced?: boolean }) {
  const gridRef = useRef<THREE.Mesh>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useFrame((state) => {
    if (gridRef.current && gridRef.current.material) {
      const material = gridRef.current.material as THREE.MeshStandardMaterial
      // Increased animation intensity for enhanced mode
      const animationIntensity = enhanced ? (isMobile ? 0.25 : 0.4) : (isMobile ? 0.1 : 0.2)
      material.emissiveIntensity = 0.7 + Math.sin(state.clock.getElapsedTime() * 0.5) * animationIntensity
    }
  })

  // Reduce grid divisions on mobile for better performance
  const gridDivisions = isMobile ? 25 : (enhanced ? 120 : 100)

  return (
    <mesh ref={gridRef} position={[0, 0, -10]} rotation={[0, 0, 0]}>
      <planeGeometry args={[100, 50, gridDivisions, gridDivisions / 2]} />
      <meshStandardMaterial
        color="#ff0000"
        emissive="#ff3333"
        emissiveIntensity={enhanced ? 0.8 : 0.5}
        wireframe
        transparent
        opacity={isMobile ? 0.15 : 0.2} // Reduce opacity on mobile
      />
    </mesh>
  )
}

// Simple particle system for desktop only
function ParticleSystem() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  // Generate random particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = Math.random() * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [particleCount]);
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.001;
      const positions = (points.current.geometry as THREE.BufferGeometry).attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.getElapsedTime() * 0.2 + i * 0.1) * 0.01;
      }
      
      (points.current.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[particlePositions, 3]}
          count={particleCount} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ff3333"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
