"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import type { Group, Mesh, MeshStandardMaterial } from "three"

export default function RetroArcadeMachine({ ...props }) {
  const arcadeRef = useRef<Group>(null)
  const screenRef = useRef<Mesh>(null)
  
  // Load textures
  const textures = useTexture({
    roughness: '/textures/arcade_roughness.jpg',
  })

  // Create a simple arcade machine since we don't have the actual model
  useFrame((state) => {
    if (arcadeRef.current) {
      // Add subtle floating animation
      arcadeRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
    }

    // Make the screen glow with a very subtle pulsing effect
    if (screenRef.current && screenRef.current.material) {
      const material = screenRef.current.material as MeshStandardMaterial
      material.emissiveIntensity = 0.15 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05
    }
  })

  return (
    <group ref={arcadeRef} {...props}>
      {/* Arcade Cabinet - slightly larger to accommodate bigger screen */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.6, 0.8]} />
        <meshStandardMaterial 
          color="#222222" 
          roughnessMap={textures.roughness} 
          roughness={.1} 
          metalness={1}
        />
      </mesh>

      {/* Screen - with reduced emission */}
      <mesh ref={screenRef} position={[0, 1.3, 0.41]}>
        <boxGeometry args={[1.4, 1.0, 0.05]} />
        <meshStandardMaterial 
          color="#111111" 
          emissive="#ff0000" 
          emissiveIntensity={0.15}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Control Panel */}
      <mesh position={[0, 0.4, 0.3]} rotation={[Math.PI * 0.15, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.6, 0.4]} />
        <meshStandardMaterial 
          color="#111111" 
          roughnessMap={textures.roughness}
          metalnessMap={textures.metalness}
          roughness={0.6} 
          metalness={0.4}
        />
      </mesh>

      {/* Joystick */}
      <mesh position={[-0.4, 0.5, 0.5]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.1, 16]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Buttons */}
      {[0, 0.2, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0.5]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial 
            color={["#ff0000", "#00ff00", "#0000ff"][i]} 
            emissive={["#ff0000", "#00ff00", "#0000ff"][i]}
            emissiveIntensity={0.1}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      ))}

      {/* Cabinet Base */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.5, 0.8]} />
        <meshStandardMaterial 
          color="#222222" 
          roughnessMap={textures.roughness}
          metalnessMap={textures.metalness}
          roughness={0.7} 
          metalness={0.3}
        />
      </mesh>
    </group>
  )
}
