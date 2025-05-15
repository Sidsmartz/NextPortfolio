"use client"

// Audio utility for managing sound effects

// Function to preload audio files
let cachedAudio: Record<string, HTMLAudioElement> = {}

export function preloadAudio(src: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    try {
      // Check if already cached
      if (cachedAudio[src]) {
        resolve(cachedAudio[src])
        return
      }

      // Create new audio element
      const audio = new Audio(src)
      audio.preload = "auto"

      // Set up event listeners
      audio.addEventListener("canplaythrough", () => {
        cachedAudio[src] = audio
        resolve(audio)
      }, { once: true })

      audio.addEventListener("error", (err) => {
        console.error(`Error loading audio file ${src}:`, err)
        reject(err)
      })

      // Start loading
      audio.load()
    } catch (error) {
      reject(error)
    }
  })
}

// Function to play a sound with volume control
export function playSound(
  src: string, 
  options: { 
    volume?: number; 
    loop?: boolean; 
    fadeIn?: boolean;
    fadeOut?: boolean;
    onEnded?: () => void;
  } = {}
): { audio: HTMLAudioElement; stop: () => void } {
  
  const { 
    volume = 0.5, 
    loop = false, 
    fadeIn = false,
    fadeOut = false,
    onEnded = () => {} 
  } = options

  let audio: HTMLAudioElement

  // Check if already loaded
  if (cachedAudio[src]) {
    audio = cachedAudio[src]
    
    // If the audio is already playing, create a new instance
    if (!audio.paused) {
      audio = new Audio(src)
    }
  } else {
    // Create and cache for future use
    audio = new Audio(src)
    cachedAudio[src] = audio
  }

  // Reset and set properties
  audio.currentTime = 0
  audio.loop = loop
  
  // Handle fade in effect
  if (fadeIn) {
    audio.volume = 0
    const fadeInDuration = 500 // ms
    const fadeInStep = volume / (fadeInDuration / 50)
    
    const fadeInInterval = setInterval(() => {
      if (audio.volume < volume) {
        audio.volume = Math.min(volume, audio.volume + fadeInStep)
      } else {
        clearInterval(fadeInInterval)
      }
    }, 50)
  } else {
    audio.volume = volume
  }

  // Set up ended callback
  audio.addEventListener("ended", () => {
    if (!loop) {
      onEnded()
    }
  }, { once: true })

  // Start playback
  const playPromise = audio.play()
  
  // Handle promise rejection (browsers that require user interaction)
  if (playPromise !== undefined) {
    playPromise.catch(err => {
      console.warn("Audio play prevented by browser:", err)
    })
  }

  // Return the audio element and a stop function
  return { 
    audio,
    stop: () => {
      if (fadeOut) {
        const fadeOutDuration = 500 // ms
        const fadeOutStep = audio.volume / (fadeOutDuration / 50)
        const fadeOutInterval = setInterval(() => {
          if (audio.volume > 0.05) {
            audio.volume = Math.max(0, audio.volume - fadeOutStep)
          } else {
            clearInterval(fadeOutInterval)
            audio.pause()
            audio.currentTime = 0
          }
        }, 50)
      } else {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }
}

// Specific project sounds
export const projectSounds = {
  ambient: "/audio/ambient.mp3",
  typing: "/audio/typing.mp3",
  complete: "/audio/complete.mp3",
  switch: "/audio/switch.mp3",
  
  // Project-specific sounds could be added here
  project1: {
    background: "/audio/project1_bg.mp3",
  },
  project2: {
    background: "/audio/project2_bg.mp3",
  },
}

// Initialize all audio files
export async function initializeAudio(): Promise<void> {
  try {
    // Preload commonly used audio files
    await Promise.all([
      preloadAudio(projectSounds.ambient),
      preloadAudio(projectSounds.typing),
      preloadAudio(projectSounds.complete),
      preloadAudio(projectSounds.switch),
    ])
    console.log("Audio files preloaded successfully")
  } catch (error) {
    console.error("Failed to preload audio files:", error)
  }
} 