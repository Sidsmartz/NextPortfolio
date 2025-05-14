"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export default function RetroGrid() {
  const gridRef = useRef<THREE.Group>(null)

  // Create a retro grid effect
  useFrame((state) => {
    if (gridRef.current) {
      // Subtle rotation for a more dynamic feel
      gridRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.02
    }
  })

  return (
    <group ref={gridRef}>
      {/* Floor grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <planeGeometry args={[40, 40, 40, 40]} />
        <meshBasicMaterial color="#ff0000" wireframe={true} transparent={true} opacity={0.3} />
      </mesh>

      {/* Simple cube grid surrounding the arcade machine */}
      <SimpleCubeGrid />
    </group>
  )
}

function SimpleCubeGrid() {
  const cubeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (cubeRef.current) {
      // Subtle pulse effect
      cubeRef.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02
      cubeRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02
      cubeRef.current.scale.z = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02
    }
  })

  return (
    <mesh ref={cubeRef} position={[0, 1, 0]}>
      <boxGeometry args={[8, 8, 8]} />
      <meshBasicMaterial color="#ff0000" wireframe={true} transparent={true} opacity={0.3} />
    </mesh>
  )
}
