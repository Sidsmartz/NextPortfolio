import { gsap } from "gsap"

export function createPixelTransition(onComplete: () => void) {
  // Create pixel transition effect
  const isMobile = window.innerWidth < 768
  // Use larger pixels on mobile for better performance
  const pixelSize = isMobile ? 50 : 30
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "0"
  container.style.left = "0"
  container.style.width = "100vw"
  container.style.height = "100vh"
  container.style.zIndex = "1000"
  container.style.pointerEvents = "none"
  document.body.appendChild(container)

  // Create pixel grid with fewer pixels
  const width = Math.ceil(window.innerWidth / pixelSize)
  const height = Math.ceil(window.innerHeight / pixelSize)
  const maxPixels = isMobile ? 300 : 1000 // Limit total pixel count based on device

  // Calculate how many pixels to skip to stay under maxPixels
  // Skip more pixels on mobile
  const totalPixels = width * height
  const skipFactor = Math.max(1, Math.ceil(totalPixels / maxPixels))

  let pixelCount = 0
  for (let y = 0; y < height; y += (isMobile ? 2 : 1)) { // Skip rows on mobile
    for (let x = 0; x < width; x += skipFactor) {
      if (pixelCount >= maxPixels) break

      const pixel = document.createElement("div")
      pixel.style.position = "absolute"
      pixel.style.width = `${pixelSize}px`
      pixel.style.height = `${pixelSize}px`
      pixel.style.top = `${y * pixelSize}px`
      pixel.style.left = `${x * pixelSize}px`
      pixel.style.backgroundColor = "#330000"
      // Reduce shadow intensity for better performance
      pixel.style.boxShadow = isMobile ? "0 0 5px #ff0000" : "0 0 10px #ff0000"
      pixel.style.transformOrigin = "center"
      pixel.style.transform = "scale(0)"
      container.appendChild(pixel)
      pixelCount++

      // Animate each pixel
      gsap.to(pixel, {
        transform: "scale(1)",
        duration: 0.6, // Reduced duration for faster transition
        delay: 0.01 * (Math.floor(x/skipFactor) + Math.floor(y/skipFactor)), // Adjust delay calculation for skipped pixels
        ease: "power2.inOut",
      })
    }
  }

  // Navigate to the next page after transition completes
  // Reduced delay for faster navigation
  setTimeout(() => {
    onComplete()

    // Remove the transition container after navigation
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }, 500)
  }, isMobile ? 1000 : 1500) // Shorter wait on mobile
}
