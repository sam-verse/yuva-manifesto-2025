"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { Github, Linkedin, Mail, Instagram } from "lucide-react"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const isBrowser = typeof window !== "undefined"
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    if (isBrowser) {
      const scrollPosition = window.scrollY + 100
      // ... rest of scroll handling code
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isBrowser) {
      // ... mouse move handling code
    }
  }

  // Update the initial positions
  const [floatingElements] = useState(() => 
    Array.from({ length: 20 }, () => ({
      x: Math.random() * (isBrowser ? window.innerWidth : 1200),
      y: Math.random() * (isBrowser ? window.innerHeight : 800),
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 10 + 10
    }))
  )

  // Update scroll to top button
  const scrollToTop = () => {
    if (isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Update any other window references
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isBrowser) {
      // ... key down handling code
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />
    </main>
  )
}
