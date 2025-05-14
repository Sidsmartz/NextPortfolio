"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  volume?: number
  className?: string
  controls?: boolean
}

export default function AudioPlayer({
  src,
  autoPlay = false,
  loop = true,
  volume = 0.3,
  className = "",
  controls = true,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [audioError, setAudioError] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Check if audio file exists first
        fetch(src)
          .then((response) => {
            if (!response.ok) {
              console.warn(`Audio file not found: ${src}`)
              setAudioError(true)
              return
            }

            const audio = new Audio(src)
            audioRef.current = audio
            audio.loop = loop
            audio.volume = volume
            audio.preload = "auto"

            audio.addEventListener("canplaythrough", () => {
              setAudioLoaded(true)
              if (autoPlay) {
                playAudio()
              }
            })

            audio.addEventListener("error", (e) => {
              console.error("Audio error:", e)
              setAudioError(true)
            })

            audio.addEventListener("ended", () => {
              if (!loop) {
                setIsPlaying(false)
              }
            })
          })
          .catch((error) => {
            console.error("Error fetching audio:", error)
            setAudioError(true)
          })
      } catch (error) {
        console.error("Error setting up audio:", error)
        setAudioError(true)
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ""
        }
      }
    }
  }, [src, autoPlay, loop, volume])

  const playAudio = () => {
    if (audioRef.current && audioLoaded && !audioError) {
      try {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.log("Audio playback prevented by browser:", error)
            })
        }
      } catch (error) {
        console.error("Error playing audio:", error)
      }
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        setIsPlaying(false)
      } catch (error) {
        console.error("Error pausing audio:", error)
      }
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      try {
        audioRef.current.muted = !audioRef.current.muted
        setIsMuted(!isMuted)
      } catch (error) {
        console.error("Error toggling mute:", error)
      }
    }
  }

  if (!controls || audioError) return null

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={toggleMute}
        className="p-2 rounded-full bg-gray-900/50 border border-red-500/30 text-red-500 hover:bg-red-900/20"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  )
}
