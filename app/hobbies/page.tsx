"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import MatrixTextEffect from "@/components/matrix-text-effect"
import LoadingScreen from "@/components/loading-screen"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad, Music, Book, Camera } from "lucide-react"
import AsteroidsGame from "@/components/asteroids-game"
import AudioPlayer from "@/components/audio-player"

export default function HobbiesPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Initialize cursor effect
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    document.body.appendChild(cursor)

    const cursorTrail = document.createElement("div")
    cursorTrail.className = "cursor-trail"
    document.body.appendChild(cursorTrail)

    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`

      setTimeout(() => {
        cursorTrail.style.left = `${e.clientX}px`
        cursorTrail.style.top = `${e.clientY}px`
      }, 100)
    }

    document.addEventListener("mousemove", updateCursor)

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor)
      }
      if (document.body.contains(cursorTrail)) {
        document.body.removeChild(cursorTrail)
      }
      clearTimeout(timer)
    }
  }, [])

  const hobbies = [
    {
      id: "gaming",
      title: "Gaming",
      icon: <Gamepad className="h-5 w-5" />,
      description:
        "I'm an avid gamer with a passion for both retro classics and modern titles. From arcade games to immersive RPGs, gaming has always been a creative outlet and source of inspiration for my development work.",
      items: [
        {
          title: "Favorite Genres",
          content: "RPGs, Strategy, Roguelikes, Retro Arcade",
        },
        {
          title: "Current Obsessions",
          content: "Elden Ring, Hades, Baldur's Gate 3, Retro Emulation",
        },
        {
          title: "Game Development",
          content:
            "I occasionally develop small game prototypes using Unity and Godot. Check out my Asteroids clone below!",
        },
      ],
    },
    {
      id: "music",
      title: "Music Production",
      icon: <Music className="h-5 w-5" />,
      description:
        "Music has always been a significant part of my life. I produce electronic music and experiment with synthesizers in my free time, often creating soundtracks for my development projects.",
      items: [
        {
          title: "Genres",
          content: "Synthwave, Ambient, Chiptune, Electronic",
        },
        {
          title: "Equipment",
          content: "Ableton Live, Various MIDI controllers, Analog synthesizers",
        },
        {
          title: "Projects",
          content:
            "I've composed music for indie games and created interactive audio experiences for web applications.",
        },
      ],
    },
    {
      id: "photography",
      title: "Photography",
      icon: <Camera className="h-5 w-5" />,
      description:
        "Photography allows me to capture moments and perspectives that inspire my creative work. I particularly enjoy urban photography and capturing technology in unusual contexts.",
      items: [
        {
          title: "Style",
          content: "Urban landscapes, Technology, Night photography, Minimalism",
        },
        {
          title: "Equipment",
          content: "Sony Alpha, Various prime lenses, Vintage film cameras",
        },
        {
          title: "Projects",
          content:
            "I've exhibited my work in local galleries and use my photography in many of my web design projects.",
        },
      ],
    },
    {
      id: "reading",
      title: "Reading",
      icon: <Book className="h-5 w-5" />,
      description:
        "Books have always been a source of knowledge and inspiration. I enjoy science fiction, technical literature, and philosophy that challenges my perspective on technology and society.",
      items: [
        {
          title: "Favorite Genres",
          content: "Science Fiction, Technical non-fiction, Philosophy of technology",
        },
        {
          title: "Recent Reads",
          content: "Snow Crash, The Pragmatic Programmer, Superintelligence",
        },
        {
          title: "Reading List",
          content: "I maintain a public reading list and technical book reviews on my blog.",
        },
      ],
    },
  ]

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <MatrixTextEffect
          phrases={["HOBBIES", "INTERESTS", "PASTIMES", "LEISURE", "FUN STUFF"]}
          className="text-3xl md:text-4xl lg:text-5xl text-red-500 mb-6"
        />
      </div>

      <div className="page-content">
        <Tabs defaultValue="gaming" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 font-retro">
            {hobbies.map((hobby) => (
              <TabsTrigger
                key={hobby.id}
                value={hobby.id}
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                {hobby.icon}
                <span className="ml-2">{hobby.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {hobbies.map((hobby) => (
            <TabsContent key={hobby.id} value={hobby.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <Card className="bg-gray-900 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="font-retro text-red-500 flex items-center gap-2">
                      {hobby.icon}
                      {hobby.title}
                    </CardTitle>
                    <CardDescription>{hobby.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {hobby.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 p-4 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all"
                        >
                          <h3 className="text-red-400 font-medium mb-2">{item.title}</h3>
                          <p className="text-gray-300 text-sm">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {hobby.id === "gaming" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-retro text-red-500">Play Asteroids</h2>
                    <div className="bg-gray-900 border border-red-500/30 rounded-lg p-4 h-[600px]">
                      <AsteroidsGame />
                    </div>
                    <div className="text-center text-gray-400 text-sm">
                      <p>Use arrow keys or WASD to move, SPACE to shoot</p>
                    </div>
                  </div>
                )}

                {hobby.id === "music" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-retro text-red-500">My Tracks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-900 border border-red-500/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Synthwave Dreams</h3>
                          <AudioPlayer src="/sounds/arcade-ambient.mp3" />
                        </div>
                        <div className="h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                          <div className="w-full px-4">
                            <div className="h-12 flex items-center space-x-1">
                              {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-red-500"
                                  style={{
                                    height: `${Math.max(15, Math.random() * 100)}%`,
                                    opacity: Math.random() * 0.5 + 0.5,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900 border border-red-500/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Arcade Memories</h3>
                          <AudioPlayer src="/sounds/arcade-start.mp3" />
                        </div>
                        <div className="h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                          <div className="w-full px-4">
                            <div className="h-12 flex items-center space-x-1">
                              {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-red-500"
                                  style={{
                                    height: `${Math.max(15, Math.random() * 100)}%`,
                                    opacity: Math.random() * 0.5 + 0.5,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {hobby.id === "photography" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-retro text-red-500">Photo Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-red-500/30 hover:border-red-500/60 transition-all"
                        >
                          <img
                            src={`/placeholder.svg?height=300&width=300&text=Photo ${i + 1}`}
                            alt={`Gallery photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Button className="arcade-button">View Full Gallery</Button>
                    </div>
                  </div>
                )}

                {hobby.id === "reading" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-retro text-red-500">Reading List</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Snow Crash",
                          author: "Neal Stephenson",
                          genre: "Science Fiction",
                          rating: 5,
                        },
                        {
                          title: "The Pragmatic Programmer",
                          author: "Dave Thomas & Andy Hunt",
                          genre: "Technical",
                          rating: 5,
                        },
                        {
                          title: "Neuromancer",
                          author: "William Gibson",
                          genre: "Science Fiction",
                          rating: 4,
                        },
                        {
                          title: "Clean Code",
                          author: "Robert C. Martin",
                          genre: "Technical",
                          rating: 4,
                        },
                      ].map((book, i) => (
                        <div key={i} className="bg-gray-900 border border-red-500/30 rounded-lg p-4 flex gap-4">
                          <div className="w-24 h-32 bg-gray-800 rounded flex items-center justify-center border border-red-500/20">
                            <span className="text-red-500 text-xs">COVER</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-red-400">{book.title}</h3>
                            <p className="text-gray-300 text-sm">{book.author}</p>
                            <p className="text-gray-400 text-xs mt-1">{book.genre}</p>
                            <div className="mt-2 flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < book.rating ? "text-red-500" : "text-gray-600"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* CRT and scanline effects */}
      <div className="crt-effect"></div>
      <div className="scanlines"></div>
    </div>
  )
}
