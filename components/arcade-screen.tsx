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
      material.emissiveIntensity = 0.2 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1
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
      {/* Screen base - less emissive */}
      <mesh ref={screenRef} position={[0, 1.3, 0.42]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.3, 1.0]} />
        <meshStandardMaterial color="#000000" emissive="#ff0000" emissiveIntensity={0.2} toneMapped={false} />
      </mesh>

      {/* Static noise overlay - adjusted to match size */}
      <mesh ref={staticRef} position={[0, 1.3, 0.421]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.29, 0.99]} />
        <shaderMaterial
          transparent={true}
          uniforms={{
            time: { value: 0 },
            opacity: { value: 0.05 },
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;
            uniform float opacity;
            varying vec2 vUv;
            
            float random(vec2 st) {
              return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }
            
            void main() {
              vec2 st = vUv;
              float noise = random(st * time);
              gl_FragColor = vec4(vec3(noise), opacity);
            }
          `}
        />
      </mesh>

      {/* Screen content */}
      <Html
        transform
        distanceFactor={0.5}
        position={[0, 1.3, 0.43]}
        style={{
          width: "300px", /* Increased size */
          height: "240px", /* Increased size */
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: "10px",
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
            color: "#ff5555",
            textShadow: "0 0 10px #ff0000, 0 0 15px #ff0000, 0 0 20px #ff0000, 0 0 25px #ff0000, 0 0 30px #ff0000", /* Enhanced glow */
            fontSize: "42px", /* Increased text size */
            fontFamily: "var(--font-retro)",
            letterSpacing: "1px",
            lineHeight: "1.5",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          CLICK HERE TO START
        </div>
      </Html>
    </group>
  )
}
