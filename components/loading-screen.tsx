"use client"

import { useEffect, useState } from "react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("LOADING")

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.floor(Math.random() * 10) + 1
      })
    }, 200)

    // Animate loading text
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "LOADING...") return "LOADING"
        if (prev === "LOADING..") return "LOADING..."
        if (prev === "LOADING.") return "LOADING.."
        return "LOADING."
      })
    }, 300)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-4">
        {/* Retro loading animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-red-500 animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-red-500 rotate-45"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-red-500 text-2xl font-retro text-center mb-8">{loadingText}</div>

        {/* Progress bar */}
        <div className="w-full h-6 border-2 border-red-500 mb-4">
          <div className="h-full bg-red-500" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Progress percentage */}
        <div className="text-red-500 font-retro text-center">{progress}%</div>

        {/* CRT and scanline effects */}
        <div className="crt-effect"></div>
        <div className="scanlines"></div>
      </div>
    </div>
  )
}
