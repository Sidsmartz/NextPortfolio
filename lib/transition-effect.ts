import { gsap } from "gsap"

export function createPixelTransition(onComplete: () => void) {
  // Create pixel transition effect
  const isMobile = window.innerWidth < 768
  
  // Create a container for the transition
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.top = "0"
  container.style.left = "0"
  container.style.width = "100vw"
  container.style.height = "100vh"
  container.style.zIndex = "1000"
  container.style.pointerEvents = "none"
  container.style.backgroundColor = "transparent"
  document.body.appendChild(container)
  
  // Determine grid size - fewer on mobile for performance
  const gridSize = isMobile ? 12 : 20
  
  // Create pixel grid
  const pixels: HTMLDivElement[] = []
  
  // Calculate pixel dimensions
  const pixelWidth = 100 / gridSize
  const pixelHeight = 100 / gridSize
  
  // Create all pixels
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pixel = document.createElement("div")
      pixel.style.position = "absolute"
      pixel.style.width = `${pixelWidth}vw`
      pixel.style.height = `${pixelHeight}vh`
      pixel.style.top = `${y * pixelHeight}vh`
      pixel.style.left = `${x * pixelWidth}vw`
      pixel.style.backgroundColor = "#330000"
      pixel.style.boxShadow = "0 0 8px #ff0000 inset"
      pixel.style.opacity = "0"
      
      container.appendChild(pixel)
      pixels.push(pixel)
    }
  }
  
  // Shuffle pixels for random animation order
  pixels.sort(() => Math.random() - 0.5)
  
  // Animation timeline for first phase (appear)
  const timeline = gsap.timeline({
    onComplete: () => {
      // Trigger page transition when first phase is complete
      onComplete()
      
      // Start second phase (disappear) after a short delay
      setTimeout(() => {
        gsap.to(pixels, {
          opacity: 0,
          duration: 0.01,
          stagger: {
            each: 0.005,
            from: "random",
            onComplete: function(this: any) {
              // Remove the element when its animation completes
              // 'this' context in GSAP callbacks refers to the animation instance
              if (this.targets && typeof this.targets === 'function') {
                const targets = this.targets();
                if (targets && targets[0]) {
                  const pixel = targets[0] as HTMLElement;
                  if (pixel.parentNode) {
                    pixel.parentNode.removeChild(pixel);
                  }
                }
              }
            }
          },
          onComplete: () => {
            // Remove container when all animations complete
            if (document.body.contains(container)) {
              document.body.removeChild(container)
            }
          }
        })
      }, 300) // Short delay before starting to remove pixels
    }
  })
  
  // First phase - make pixels appear in random order
  timeline.to(pixels, {
    opacity: 1,
    duration: 0.01,
    stagger: {
      each: 0.005,
      from: "random",
    }
  })
}
