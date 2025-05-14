import { gsap } from "gsap"

export function createPixelTransition(onComplete: () => void) {
  // Create pixel transition effect
  const pixelSize = 30
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "0"
  container.style.left = "0"
  container.style.width = "100vw"
  container.style.height = "100vh"
  container.style.zIndex = "1000"
  container.style.pointerEvents = "none"
  document.body.appendChild(container)

  // Create pixel grid
  const width = Math.ceil(window.innerWidth / pixelSize)
  const height = Math.ceil(window.innerHeight / pixelSize)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = document.createElement("div")
      pixel.style.position = "absolute"
      pixel.style.width = `${pixelSize}px`
      pixel.style.height = `${pixelSize}px`
      pixel.style.top = `${y * pixelSize}px`
      pixel.style.left = `${x * pixelSize}px`
      pixel.style.backgroundColor = "#330000"
      pixel.style.boxShadow = "0 0 10px #ff0000"
      pixel.style.transformOrigin = "center"
      pixel.style.transform = "scale(0)"
      container.appendChild(pixel)

      // Animate each pixel
      gsap.to(pixel, {
        transform: "scale(1)",
        duration: 0.8,
        delay: 0.01 * (x + y),
        ease: "power2.inOut",
      })
    }
  }

  // Navigate to the next page after transition completes
  setTimeout(() => {
    onComplete()

    // Remove the transition container after navigation
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }, 500)
  }, 1500)
}
