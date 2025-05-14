"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Asteroid {
  x: number
  y: number
  size: number
  speed: number
  angle: number
  rotation: number
  rotationSpeed: number
  vertices: { x: number; y: number }[]
}

interface Bullet {
  x: number
  y: number
  angle: number
  speed: number
  life: number
}

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  angle: number
  life: number
  maxLife: number
  color: string
}

export default function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Game state
    const ship = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 15,
      angle: 0,
      thrust: false,
      thrustPower: 0.1,
      velocity: { x: 0, y: 0 },
      friction: 0.99,
      rotationSpeed: 0.1,
      invulnerable: false,
      invulnerableTime: 0,
    }

    let asteroids: Asteroid[] = []
    const bullets: Bullet[] = []
    const particles: Particle[] = []
    const keys: { [key: string]: boolean } = {}
    let lastTime = 0
    let gameActive = false

    // Create random asteroid vertices
    const createAsteroidVertices = (size: number) => {
      const vertices = []
      const numVertices = Math.floor(Math.random() * 3) + 7 // 7-10 vertices
      for (let i = 0; i < numVertices; i++) {
        const angle = (i * 2 * Math.PI) / numVertices
        const variance = Math.random() * 0.4 + 0.8 // 0.8 to 1.2
        const distance = size * variance
        vertices.push({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        })
      }
      return vertices
    }

    // Create a new asteroid
    const createAsteroid = (x?: number, y?: number, size?: number) => {
      const newSize = size || Math.random() * 30 + 20
      let newX, newY

      if (x !== undefined && y !== undefined) {
        newX = x
        newY = y
      } else {
        // Position asteroid away from the ship
        do {
          newX = Math.random() * canvas.width
          newY = Math.random() * canvas.height
        } while (
          Math.sqrt((newX - ship.x) ** 2 + (newY - ship.y) ** 2) < 200 // Keep asteroids away from ship
        )
      }

      return {
        x: newX,
        y: newY,
        size: newSize,
        speed: Math.random() * 1 + 0.5,
        angle: Math.random() * Math.PI * 2,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        vertices: createAsteroidVertices(newSize),
      }
    }

    // Initialize asteroids
    const initAsteroids = (count: number) => {
      asteroids = []
      for (let i = 0; i < count; i++) {
        asteroids.push(createAsteroid())
      }
    }

    // Reset ship position
    const resetShip = () => {
      ship.x = canvas.width / 2
      ship.y = canvas.height / 2
      ship.velocity = { x: 0, y: 0 }
      ship.angle = 0
      ship.thrust = false
      ship.invulnerable = true
      ship.invulnerableTime = 180 // 3 seconds at 60fps
    }

    // Create explosion particles
    const createExplosion = (x: number, y: number, color: string, count: number, size: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          size: Math.random() * size + 1,
          speed: Math.random() * 3 + 0.5,
          angle: Math.random() * Math.PI * 2,
          life: Math.random() * 60 + 30, // 0.5 - 1.5 seconds at 60fps
          maxLife: Math.random() * 60 + 30,
          color,
        })
      }
    }

    // Draw ship
    const drawShip = () => {
      if (!ctx) return

      ctx.save()
      ctx.translate(ship.x, ship.y)
      ctx.rotate(ship.angle)

      // Draw ship body
      ctx.strokeStyle = ship.invulnerable && Math.floor(Date.now() / 100) % 2 === 0 ? "#666" : "#fff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -ship.radius)
      ctx.lineTo(ship.radius, ship.radius)
      ctx.lineTo(0, ship.radius / 2)
      ctx.lineTo(-ship.radius, ship.radius)
      ctx.closePath()
      ctx.stroke()

      // Draw thrust
      if (ship.thrust) {
        ctx.strokeStyle = "#f00"
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(-ship.radius / 2, ship.radius / 2)
        ctx.lineTo(0, ship.radius + Math.random() * 10)
        ctx.lineTo(ship.radius / 2, ship.radius / 2)
        ctx.stroke()
      }

      ctx.restore()
    }

    // Draw asteroid
    const drawAsteroid = (asteroid: Asteroid) => {
      if (!ctx) return

      ctx.save()
      ctx.translate(asteroid.x, asteroid.y)
      ctx.rotate(asteroid.rotation)
      ctx.strokeStyle = "#ff0000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y)
      for (let i = 1; i < asteroid.vertices.length; i++) {
        ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y)
      }
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    }

    // Draw bullet
    const drawBullet = (bullet: Bullet) => {
      if (!ctx) return

      ctx.fillStyle = "#ff0000"
      ctx.beginPath()
      ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw particle
    const drawParticle = (particle: Particle) => {
      if (!ctx) return

      const alpha = particle.life / particle.maxLife
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Update ship position
    const updateShip = () => {
      // Apply thrust
      if (ship.thrust) {
        ship.velocity.x += Math.cos(ship.angle) * ship.thrustPower
        ship.velocity.y += Math.sin(ship.angle) * ship.thrustPower
      }

      // Apply friction
      ship.velocity.x *= ship.friction
      ship.velocity.y *= ship.friction

      // Update position
      ship.x += ship.velocity.x
      ship.y += ship.velocity.y

      // Wrap around screen
      if (ship.x < 0) ship.x = canvas.width
      if (ship.x > canvas.width) ship.x = 0
      if (ship.y < 0) ship.y = canvas.height
      if (ship.y > canvas.height) ship.y = 0

      // Update invulnerability
      if (ship.invulnerable) {
        ship.invulnerableTime--
        if (ship.invulnerableTime <= 0) {
          ship.invulnerable = false
        }
      }
    }

    // Update asteroid positions
    const updateAsteroids = () => {
      for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i]
        asteroid.x += Math.cos(asteroid.angle) * asteroid.speed
        asteroid.y += Math.sin(asteroid.angle) * asteroid.speed
        asteroid.rotation += asteroid.rotationSpeed

        // Wrap around screen
        if (asteroid.x < -asteroid.size) asteroid.x = canvas.width + asteroid.size
        if (asteroid.x > canvas.width + asteroid.size) asteroid.x = -asteroid.size
        if (asteroid.y < -asteroid.size) asteroid.y = canvas.height + asteroid.size
        if (asteroid.y > canvas.height + asteroid.size) asteroid.y = -asteroid.size

        // Check collision with ship
        if (!ship.invulnerable) {
          const dx = ship.x - asteroid.x
          const dy = ship.y - asteroid.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < ship.radius + asteroid.size * 0.8) {
            // Ship hit by asteroid
            createExplosion(ship.x, ship.y, "#ff0000", 30, 3)
            setLives((prev) => {
              const newLives = prev - 1
              if (newLives <= 0) {
                gameActive = false
                setGameOver(true)
              } else {
                resetShip()
              }
              return newLives
            })
          }
        }
      }
    }

    // Update bullets
    const updateBullets = () => {
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]
        bullet.x += Math.cos(bullet.angle) * bullet.speed
        bullet.y += Math.sin(bullet.angle) * bullet.speed
        bullet.life--

        // Remove bullet if it's off screen or expired
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height || bullet.life <= 0) {
          bullets.splice(i, 1)
          continue
        }

        // Check collision with asteroids
        for (let j = asteroids.length - 1; j >= 0; j--) {
          const asteroid = asteroids[j]
          const dx = bullet.x - asteroid.x
          const dy = bullet.y - asteroid.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < asteroid.size) {
            // Bullet hit asteroid
            bullets.splice(i, 1)
            createExplosion(asteroid.x, asteroid.y, "#ff0000", 20, 2)

            // Split asteroid or remove it
            if (asteroid.size > 20) {
              // Split into two smaller asteroids
              for (let k = 0; k < 2; k++) {
                asteroids.push(createAsteroid(asteroid.x, asteroid.y, asteroid.size / 2))
              }
            }

            // Remove the hit asteroid
            asteroids.splice(j, 1)
            setScore((prev) => prev + 100)

            // If all asteroids are destroyed, create more
            if (asteroids.length === 0) {
              setTimeout(() => {
                initAsteroids(Math.min(10, Math.floor(score / 1000) + 3))
              }, 1000)
            }

            break
          }
        }
      }
    }

    // Update particles
    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.x += Math.cos(particle.angle) * particle.speed
        particle.y += Math.sin(particle.angle) * particle.speed
        particle.life--

        if (particle.life <= 0) {
          particles.splice(i, 1)
        }
      }
    }

    // Fire bullet
    const fireBullet = () => {
      if (bullets.length < 5) {
        // Limit bullets on screen
        bullets.push({
          x: ship.x + Math.cos(ship.angle) * ship.radius,
          y: ship.y + Math.sin(ship.angle) * ship.radius,
          angle: ship.angle,
          speed: 7,
          life: 60, // 1 second at 60fps
        })
      }
    }

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true
      if (e.key === " " || e.key === "f") {
        fireBullet()
      }
      if (e.key === "Enter" && !gameActive) {
        startGame()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false
    }

    // Game loop
    const gameLoop = (timestamp: number) => {
      // Calculate delta time
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      // Clear canvas
      if (ctx) {
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      if (gameActive) {
        // Handle input
        if (keys["ArrowLeft"] || keys["a"]) {
          ship.angle -= ship.rotationSpeed * (deltaTime || 16)
        }
        if (keys["ArrowRight"] || keys["d"]) {
          ship.angle += ship.rotationSpeed * (deltaTime || 16)
        }
        ship.thrust = keys["ArrowUp"] || keys["w"] || false

        // Update game objects
        updateShip()
        updateAsteroids()
        updateBullets()
        updateParticles()

        // Draw game objects
        drawShip()
        asteroids.forEach(drawAsteroid)
        bullets.forEach(drawBullet)
        particles.forEach(drawParticle)

        // Draw HUD
        if (ctx) {
          ctx.fillStyle = "#ff0000"
          ctx.font = "20px 'Press Start 2P', monospace"
          ctx.textAlign = "left"
          ctx.fillText(`SCORE: ${score}`, 20, 30)

          ctx.textAlign = "right"
          ctx.fillText(`LIVES: ${lives}`, canvas.width - 20, 30)
        }
      } else {
        // Draw game over or start screen
        if (ctx) {
          ctx.fillStyle = "#ff0000"
          ctx.font = "24px 'Press Start 2P', monospace"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          if (gameOver) {
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40)
            ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2)
            ctx.font = "16px 'Press Start 2P', monospace"
            ctx.fillText("PRESS ENTER TO RESTART", canvas.width / 2, canvas.height / 2 + 60)
          } else {
            ctx.fillText("ASTEROIDS", canvas.width / 2, canvas.height / 2 - 60)
            ctx.font = "16px 'Press Start 2P', monospace"
            ctx.fillText("PRESS ENTER TO START", canvas.width / 2, canvas.height / 2)
            ctx.fillText("ARROWS/WASD TO MOVE", canvas.width / 2, canvas.height / 2 + 40)
            ctx.fillText("SPACE/F TO SHOOT", canvas.width / 2, canvas.height / 2 + 70)
          }
        }
      }

      requestAnimationFrame(gameLoop)
    }

    // Start game
    const startGame = () => {
      setScore(0)
      setLives(3)
      setGameOver(false)
      setGameStarted(true)
      resetShip()
      initAsteroids(3)
      gameActive = true
    }

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Start game loop
    requestAnimationFrame(gameLoop)

    // Add touch controls for mobile
    const addTouchControls = () => {
      const leftBtn = document.createElement("button")
      leftBtn.innerText = "←"
      leftBtn.className =
        "absolute bottom-4 left-4 w-16 h-16 bg-red-900/50 text-red-500 border border-red-500 rounded-full text-2xl"
      leftBtn.addEventListener("touchstart", () => (keys["ArrowLeft"] = true))
      leftBtn.addEventListener("touchend", () => (keys["ArrowLeft"] = false))

      const rightBtn = document.createElement("button")
      rightBtn.innerText = "→"
      rightBtn.className =
        "absolute bottom-4 left-24 w-16 h-16 bg-red-900/50 text-red-500 border border-red-500 rounded-full text-2xl"
      rightBtn.addEventListener("touchstart", () => (keys["ArrowRight"] = true))
      rightBtn.addEventListener("touchend", () => (keys["ArrowRight"] = false))

      const thrustBtn = document.createElement("button")
      thrustBtn.innerText = "▲"
      thrustBtn.className =
        "absolute bottom-4 right-24 w-16 h-16 bg-red-900/50 text-red-500 border border-red-500 rounded-full text-2xl"
      thrustBtn.addEventListener("touchstart", () => (keys["ArrowUp"] = true))
      thrustBtn.addEventListener("touchend", () => (keys["ArrowUp"] = false))

      const fireBtn = document.createElement("button")
      fireBtn.innerText = "🔥"
      fireBtn.className =
        "absolute bottom-4 right-4 w-16 h-16 bg-red-900/50 text-red-500 border border-red-500 rounded-full text-2xl"
      fireBtn.addEventListener("touchstart", fireBullet)

      const startBtn = document.createElement("button")
      startBtn.innerText = "START"
      startBtn.className =
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-red-900/50 text-red-500 border border-red-500 rounded-md text-xl"
      startBtn.style.display = gameStarted ? "none" : "block"
      startBtn.addEventListener("click", startGame)

      const container = canvas.parentElement
      if (container) {
        container.appendChild(leftBtn)
        container.appendChild(rightBtn)
        container.appendChild(thrustBtn)
        container.appendChild(fireBtn)
        container.appendChild(startBtn)
      }

      return () => {
        if (container) {
          container.removeChild(leftBtn)
          container.removeChild(rightBtn)
          container.removeChild(thrustBtn)
          container.removeChild(fireBtn)
          if (container.contains(startBtn)) {
            container.removeChild(startBtn)
          }
        }
      }
    }

    const removeTouchControls = addTouchControls()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      removeTouchControls()
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[500px] bg-black rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ touchAction: "none" }} aria-label="Asteroids Game" />
      {!gameStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none"
        >
          <h2 className="text-3xl font-retro text-red-500 mb-8">ASTEROIDS</h2>
          <p className="text-red-400 mb-4">Press ENTER to start</p>
          <p className="text-red-400">Arrow keys to move, Space to shoot</p>
        </motion.div>
      )}
    </div>
  )
}
