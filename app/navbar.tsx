"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { createPixelTransition } from "@/lib/transition-effect"
import { useRouter } from "next/navigation"
import PageTransition from "@/components/page-transition"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleNavigation = (path: string) => {
    setIsOpen(false)
    createPixelTransition(() => {
      router.push(path)
    })
  }

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "SKILLS", path: "/skills" },
    { name: "PROJECTS", path: "/projects" },
    { name: "CV", path: "/cv" },
    { name: "CONTACT", path: "/contact" },
  ]

  if (!isMounted) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-red-500/30 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault()
            handleNavigation("/")
          }}
          className="text-xl md:text-2xl font-retro text-red-500 hover:text-red-400 transition-colors"
        >
          ARCADE PORTFOLIO
        </Link>

        {/* Desktop Navigation with Pixel Transition */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <PageTransition 
              key={item.path}
              href={item.path}
              label={item.name}
              className="text-sm"
            />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-red-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-black/95 border-b border-red-500/30"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation(item.path)
                  }}
                  className={`font-retro text-sm py-2 px-4 rounded ${
                    pathname === item.path
                      ? "bg-red-900/30 text-red-500 border border-red-500/50"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  )
}
