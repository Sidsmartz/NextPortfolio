"use client"

import { useRef, useEffect, useCallback } from "react"

export function useArcadeSounds() {
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const beepRef = useRef<HTMLAudioElement | null>(null)
  const startRef = useRef<HTMLAudioElement | null>(null)
  const soundsLoaded = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined" && !soundsLoaded.current) {
      try {
        // Create audio elements with fallback handling
        const createAudio = (src: string) => {
          try {
            // Check if the file exists first
            fetch(src)
              .then((response) => {
                if (!response.ok) {
                  console.warn(`Sound file ${src} not found, using silent audio`)
                  return null
                }

                const audio = new Audio()
                audio.src = src
                return audio
              })
              .catch((error) => {
                console.error(`Error fetching sound file ${src}:`, error)
                return null
              })

            // Create a placeholder audio element while we check
            const audio = new Audio()

            // Check if the file exists by setting a dummy src and listening for error
            audio.addEventListener("error", () => {
              console.warn(`Sound file ${src} not found, using silent audio`)
            })

            return audio
          } catch (e) {
            console.error(`Error creating audio for ${src}:`, e)
            return null
          }
        }

        // Try to load sounds, but don't fail if they don't exist
        ambientRef.current = createAudio("/sounds/arcade-ambient.mp3")
        beepRef.current = createAudio("/sounds/arcade-beep.mp3")
        startRef.current = createAudio("/sounds/arcade-start.mp3")

        // Configure ambient sound
        if (ambientRef.current) {
          ambientRef.current.loop = true
          ambientRef.current.volume = 0.3
        }

        soundsLoaded.current = true
      } catch (e) {
        console.error("Error initializing sounds:", e)
      }

      // Clean up
      return () => {
        try {
          if (ambientRef.current) ambientRef.current.pause()
          if (beepRef.current) beepRef.current.pause()
          if (startRef.current) startRef.current.pause()
        } catch (e) {
          console.error("Error cleaning up sounds:", e)
        }
      }
    }
  }, [])

  const playAmbient = useCallback(() => {
    if (ambientRef.current) {
      try {
        // Some browsers require user interaction before playing audio
        const playPromise = ambientRef.current.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Ambient sound playback prevented by browser. Waiting for user interaction.")
          })
        }
      } catch (e) {
        console.error("Error playing ambient sound:", e)
      }
    }
  }, [])

  const playBeep = useCallback(() => {
    if (beepRef.current) {
      try {
        beepRef.current.currentTime = 0
        beepRef.current.play().catch((e) => console.warn("Could not play beep sound"))
      } catch (e) {
        console.error("Error playing beep sound:", e)
      }
    }
  }, [])

  const playStart = useCallback(() => {
    if (startRef.current) {
      try {
        startRef.current.currentTime = 0
        startRef.current.play().catch((e) => console.warn("Could not play start sound"))
      } catch (e) {
        console.error("Error playing start sound:", e)
      }
    }
  }, [])

  return { playAmbient, playBeep, playStart }
}
