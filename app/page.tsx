"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion"
import { 
  Trophy, Code, Award, Calendar, Lightbulb, Users, Rocket, Globe, Linkedin, Instagram, Facebook, 
  Menu, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Star, Target, Heart, Zap, MessageSquare, 
  TrendingUp, BarChart2, Cpu, Database, Server, Wifi, Shield, Clock, CheckCircle, Users as UsersIcon, 
  ArrowUpRight, Sparkles, X, ArrowRight, ChevronDown, ChevronUp, ExternalLink, Github, Twitter
} from "lucide-react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ImageCarousel } from "./components/ImageCarousel"

// Dynamically import components that use browser APIs
const QuestionDetailsPopup = dynamic(() => import('./components/QuestionDetailsPopup'), { ssr: false })
const ExperiencePopup = dynamic(() => import('./components/ExperiencePopup'), { ssr: false })

// Dynamic Background Component
const DynamicBackground = () => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.8, 0.6, 0.3])

  return (
    <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ opacity }}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient-xy" />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 border border-blue-200/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-lg"
        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-green-200/30 rotate-45"
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

// Enhanced Card Component
const EnhancedCard = ({ children, className = "", delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`backdrop-blur-md bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

interface ExperienceItem {
  title: string;
  date: string;
  company: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  stats: string;
  images: string[];
  tags: string[];
  details?: string;
  skills?: string[];
  highlights?: string[];
}

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("home")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const sections = ["home", "about", "experience", "questions", "skills", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const ExperienceModal = ({ experience, onClose }: { experience: ExperienceItem | null, onClose: () => void }) => {
    if (!experience) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-8 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="flex items-center justify-center min-h-full">
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100/20"
              ref={modalRef}
            >
              {/* Header with gradient */}
              <div className={`relative ${experience.bgColor} p-6 text-white`}>
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                          <experience.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                          {experience.company}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mt-2">{experience.title}</h3>
                      <div className="flex items-center mt-2 text-sm text-white/90">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>{experience.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 -mr-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Main Image with Parallax */}
                {experience.images?.[0] && (
                  <motion.div 
                    className="relative h-64 md:h-80 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Image
                      src={experience.images[0]}
                      alt={experience.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </motion.div>
                )}

                <div className="p-6 md:p-8 space-y-8">
                  {/* Description */}
                  <motion.div 
                    className="prose max-w-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                      {experience.details || experience.description}
                    </p>
                  </motion.div>

                  {/* Highlights */}
                  {experience.highlights && experience.highlights.length > 0 && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center">
                        <div className={`h-0.5 flex-1 ${experience.bgColor}`}></div>
                        <h4 className="px-4 text-lg md:text-xl font-bold text-gray-900 whitespace-nowrap">
                          Key Highlights
                        </h4>
                        <div className={`h-0.5 flex-1 ${experience.bgColor}`}></div>
                      </div>
                      <ul className="grid gap-3 md:grid-cols-2">
                        {experience.highlights.map((highlight, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start group"
                            whileHover={{ x: 4 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <div className={`p-1 mr-3 rounded-full ${experience.bgColor} text-white`}>
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="text-gray-700">{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Skills */}
                  {experience.skills && experience.skills.length > 0 && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-lg font-semibold text-gray-900">
                        Skills & Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            whileHover={{ y: -2, boxShadow: '0 4px 12px -2px rgba(59, 130, 246, 0.3)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Image Gallery */}
                  {experience.images && experience.images.length > 1 && (
                    <motion.div 
                      className="mt-8 space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h4 className="text-lg font-semibold text-gray-900">
                        Project Gallery
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {experience.images.slice(1).map((img, i) => (
                          <motion.div 
                            key={i} 
                            className="relative h-32 md:h-40 rounded-xl overflow-hidden border border-gray-100 group"
                            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          >
                            <Image
                              src={img}
                              alt={`${experience.title} ${i + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-medium text-sm bg-black/50 px-3 py-1.5 rounded-full">
                                View {i + 1}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {experience.tags?.map((tag, i) => (
                      <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mr-2 mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Add this to your global CSS or in a style tag
  const styles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;

  // Mobile menu component
  const MobileMenu = ({ onClose }: { onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg p-6 overflow-y-auto"
    >
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="p-2 -m-2">
          <X size={24} className="text-gray-700" />
        </button>
      </div>
      <nav className="flex flex-col space-y-6">
        {['Home', 'About', 'Experience', 'Projects', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={onClose}
            className="text-2xl font-medium text-gray-800 hover:text-blue-600 transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>
    </motion.div>
  )

  if (!mounted) {
    return null // or a loading state
  }

  return (
    <main className="relative min-h-screen bg-white">
      <DynamicBackground />
      <AnimatePresence mode="wait">
        {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>
      
      {/* Question Details Popup */}
      <AnimatePresence>
        {selectedQuestion && (
          <QuestionDetailsPopup
            isOpen={!!selectedQuestion}
            onClose={() => setSelectedQuestion(null)}
            title={selectedQuestion.title}
            content={selectedQuestion.content}
            details={selectedQuestion.details || selectedQuestion.content}
            stats={selectedQuestion.stats}
            gradient={selectedQuestion.gradient}
            emoji={selectedQuestion.emoji}
            images={selectedQuestion.images}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedExperience && (
          <ExperiencePopup 
            experience={selectedExperience}
            isOpen={!!selectedExperience}
            onClose={() => setSelectedExperience(null)}
          />
        )}
      </AnimatePresence>
      {/* Dynamic Background */}
      <DynamicBackground />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Custom Cursor Effect */}
      <motion.div
        className="fixed w-6 h-6 bg-blue-500/30 rounded-full pointer-events-none z-40 mix-blend-multiply"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Navigation */}
      <AnimatePresence>
        {!selectedQuestion && !selectedExperience && (
      <motion.nav
        className="fixed top-0 w-full bg-white/10 backdrop-blur-2xl z-50 border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
            exit={{ y: -100 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Abraham Samuel E
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {["Home", "About", "Experience", "Questions", "Skills", "Contact"].map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`relative text-sm font-medium transition-all duration-300 ${
                    activeSection === item.toLowerCase() ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                      layoutId="activeSection"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            </div>
            </div>
          </motion.nav>
                )}
              </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-white/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 sm:px-6 py-6 space-y-4">
                {["Home", "About", "Experience", "Questions", "Skills", "Contact"].map((item, index) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.button>
                ))}
                <div className="flex justify-center space-x-6 pt-4 border-t border-gray-200/50">
                  {[
                    { icon: Linkedin, href: "#", color: "text-blue-600" },
                    { icon: Instagram, href: "#", color: "text-pink-600" },
                    { icon: Facebook, href: "#", color: "text-blue-700" },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={social.color}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon size={24} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Home Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          >
            {/* Floating Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-medium text-blue-700"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="mr-2" size={16} />
              Yi-YUVA-REC Senior Council Candidate
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="block">"Leadership is not about</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                position, it's about purpose."
              </span>
            </motion.h1>

            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Abraham Samuel E</h2>
              <p className="text-lg sm:text-xl text-blue-600 font-medium">
                Driving Change Through Purpose & Innovation
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                onClick={() => scrollToSection("about")}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Discover My Journey
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </Button>

              <Button
                variant="outline"
                onClick={() => scrollToSection("contact")}
                className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full text-lg font-medium backdrop-blur-md bg-white/50 transition-all duration-300"
              >
                Let's Connect
                <MessageSquare className="ml-2 group-hover:scale-110 transition-transform" size={20} />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Elements */}
        <motion.div
          className="absolute top-20 left-4 sm:left-10 text-blue-400/60"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <Star size={32} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-4 sm:right-10 text-purple-400/60"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        >
          <Target size={40} />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-4 text-green-400/40"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        >
          <Zap size={28} />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-medium text-purple-700"
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="mr-2" size={16} />
              About Me
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              The Leader Behind the Vision
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <EnhancedCard delay={0.2} className="order-2 lg:order-1 rounded-3xl p-0 overflow-hidden">
              <div className="relative h-80 sm:h-96 lg:h-[650px] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                <motion.div
                  className="w-full h-full relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/Abraham_Samuel_Img.jpg"
                    alt="Abraham Samuel"
                    fill
                    className="object-cover object-[center_20%]"
                    priority
                  />
                </motion.div>
                {/* <motion.div
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Users size={24} />
                </motion.div> */}
                {/* <motion.div
                  className="absolute -top-4 -left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-xl"
                  whileHover={{ scale: 1.2, rotate: -15 }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Rocket size={20} />
                </motion.div> */}
              </div>
            </EnhancedCard>

            <div className="order-1 lg:order-2 space-y-8">
              {[
                {
                  title: "Who Am I?",
                  content:
                    "I'm Abraham Samuel E, a passionate advocate for youth empowerment and road safety. As an aspiring Senior Council member, I believe in leading by example and creating meaningful impact through collaborative efforts and innovative solutions.",
                  icon: Users,
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  title: "Why Yi-YUVA?",
                  content:
                    "Yi-YUVA isn't just an organization for me—it's a platform where dreams meet action. The values of coordination, empathy, and impact-driven planning that I've gained here have shaped my leadership philosophy.",
                  icon: Heart,
                  gradient: "from-red-500 to-pink-600",
                },
                {
                  title: "Vision Ahead",
                  content:
                    "If elected, I envision a Yi-YUVA that's more connected, innovative, and impactful. Through strategic planning and enhanced member engagement, we can amplify our reach and create lasting change.",
                  icon: Lightbulb,
                  gradient: "from-yellow-500 to-orange-600",
                },
              ].map((item, index) => (
                <EnhancedCard
                  key={index}
                  delay={0.4 + index * 0.2}
                  className="rounded-2xl p-6 sm:p-8 group cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className={`bg-gradient-to-r ${item.gradient} text-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <item.icon size={24} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.content}</p>
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {/* Experience Section - Modern Creative Layout */}
      <section id="experience" className="py-16 sm:py-24 relative z-10 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-purple-50/80 to-transparent -z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-blue-700 bg-blue-100 mb-4">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Professional Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Career Path</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Key milestones and experiences that shaped my professional journey
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Decorative Timeline Curve */}
            <svg className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full" viewBox="0 0 20 100" preserveAspectRatio="none">
              <path 
                d="M10,0 C15,20 5,40 10,60 C15,80 5,100 10,100" 
                stroke="url(#timeline-gradient)" 
                strokeWidth="0.5" 
                fill="none"
              />
              <defs>
                <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            <div className="grid gap-y-12 lg:grid-cols-2 lg:gap-x-16">
              {[
                {
                  title: "MIS Team Lead",
                  date: "2023 - Present",
                  company: "Yi-YUVA",
                  description: "Led the Management Information Systems team, streamlining data processes and improving organizational efficiency through innovative digital solutions.",
                  details: "As the MIS Team Lead at Yi-YUVA, I spearheaded the digital transformation initiatives that revolutionized our data management systems. I led a cross-functional team to implement cutting-edge solutions that improved data accuracy by 45% and reduced reporting time by 60%. My role involved strategic planning, system architecture design, and stakeholder management to ensure seamless integration of new technologies.",
                  icon: Code,
                  color: "from-blue-500 to-blue-600",
                  bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
                  stats: "Improved efficiency by 40%",
                  images: [
                    "/images/Abraham_Samuel_Img.jpg",
                    "/images/Abraham_Samuel_img_2.jpg"
                  ],
                  tags: ["Leadership", "Data Management", "Process Improvement"],
                  skills: ["Project Management", "Data Analytics", "System Architecture", "Team Leadership", "Process Optimization"],
                  highlights: [
                    "Led a team of 8 developers and analysts to deliver complex projects on time",
                    "Reduced data processing time by 60% through automation",
                    "Implemented new reporting system that improved decision-making accuracy by 45%",
                    "Mentored junior team members, improving team productivity by 30%"
                  ]
                },
                {
                  title: "Co-Chair - Road Safety",
                  date: "2022 - 2023",
                  company: "Yi-YUVA",
                  description: "Spearheaded road safety initiatives, organizing awareness campaigns and educational programs that reached over 5000+ community members.",
                  details: "As Co-Chair of the Road Safety initiative, I led a comprehensive program that significantly improved road safety awareness in our community. I collaborated with local authorities, schools, and businesses to implement safety measures and educational programs. Our initiatives included community workshops, school programs, and public awareness campaigns that resulted in a 30% reduction in road accidents in our target areas.",
                  icon: Award,
                  color: "from-green-500 to-green-600",
                  bgColor: "bg-gradient-to-br from-green-500 to-green-600",
                  stats: "5000+ people impacted",
                  images: [
                    "/images/Abraham_Samuel_img_2.jpg",
                    "/images/Abraham_Samuel_Img.jpg"
                  ],
                  tags: ["Community Engagement", "Public Safety", "Leadership"],
                  skills: ["Public Speaking", "Community Outreach", "Program Management", "Stakeholder Engagement", "Event Planning"],
                  highlights: [
                    "Organized 15+ community workshops on road safety",
                    "Reduced road accidents by 30% in target areas",
                    "Established partnerships with 10+ local organizations",
                    "Developed educational materials used by 20+ schools"
                  ]
                },
                {
                  title: "Road Revive 1.0",
                  date: "2021 - 2022",
                  company: "Yi-YUVA",
                  description: "Actively participated in this flagship event, contributing to innovative road safety awareness strategies and community engagement initiatives.",
                  details: "Road Revive 1.0 was a landmark event that brought together experts, community leaders, and citizens to address road safety challenges. As a key organizer, I was responsible for program development, speaker coordination, and participant engagement. The event featured interactive workshops, expert panels, and practical demonstrations that educated attendees on safe driving practices and pedestrian safety.",
                  icon: Calendar,
                  color: "from-purple-500 to-purple-600",
                  bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
                  stats: "Major event success",
                  images: [
                    "/images/Abraham_Samuel_Img.jpg"
                  ],
                  tags: ["Event Management", "Workshops", "Community Outreach"],
                  skills: ["Event Planning", "Public Speaking", "Workshop Facilitation", "Community Engagement", "Logistics Management"],
                  highlights: [
                    "Coordinated a successful event with 500+ attendees",
                    "Facilitated 8 interactive workshops",
                    "Secured sponsorship from 5 major organizations",
                    "Received positive feedback from 95% of participants"
                  ]
                },
                {
                  title: "Enlighten the Enroute 1.0",
                  date: "2020 - 2021",
                  company: "Yi-YUVA",
                  description: "Led the organization and execution of this educational initiative, creating lasting impact through structured learning and awareness programs.",
                  details: "Enlighten the Enroute was an educational initiative aimed at promoting road safety awareness among school children and young adults. As the program lead, I developed the curriculum, trained volunteers, and coordinated with educational institutions. The program combined classroom learning with practical activities, reaching over 1000 students across 15 schools in its first year.",
                  icon: Lightbulb,
                  color: "from-orange-500 to-orange-600",
                  bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
                  stats: "1000+ participants",
                  images: [
                    "/images/Abraham_Samuel_img_2.jpg"
                  ],
                  tags: ["Education", "Training", "Program Development"],
                  skills: ["Curriculum Development", "Training Delivery", "Program Design", "Educational Content Creation", "Volunteer Management"],
                  highlights: [
                    "Developed comprehensive road safety curriculum",
                    "Trained 50+ volunteers as program facilitators",
                    "Expanded program to 15 schools in first year",
                    "Achieved 92% satisfaction rate from participants"
                  ]
                },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className={`relative group ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 right-0 top-6 flex justify-center -mt-1 z-10 lg:left-1/2 lg:-ml-4 lg:right-auto">
                    <motion.div 
                      className={`w-8 h-8 rounded-full bg-white border-4 flex items-center justify-center shadow-lg ${index % 2 === 0 ? 'border-blue-500' : 'border-purple-500'}`}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className={`mt-10 relative ${index % 2 === 0 ? 'lg:pr-6' : 'lg:pl-6'}`}>
                    <motion.div 
                      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl h-full flex flex-col group/card"
                      whileHover={{ y: -5 }}
                    >
                      {/* Decorative Accent */}
                      <div className={`h-1.5 w-full ${item.bgColor}`}></div>
                      
                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col h-full">
                        {/* Header with Icon */}
                        <div className="flex items-start mb-4">
                          <div className={`p-2.5 rounded-xl shadow-sm mr-4 flex-shrink-0 ${item.bgColor} text-white`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {item.title}
                              </h3>
                              <span className="text-xs font-medium text-gray-500">
                                {item.company}
                              </span>
                            </div>
                            <div className={`mt-1 text-sm font-medium ${index % 2 === 0 ? 'text-blue-600' : 'text-purple-600'}`}>
                              {item.date}
                            </div>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 line-clamp-3">
                          {item.description}
                        </p>
                        
                        {/* Image Carousel */}
                        {item.images && item.images.length > 0 && (
                          <div className="mt-auto mb-4 rounded-xl overflow-hidden border border-gray-100">
                            <div className="relative h-40 w-full">
                              <ImageCarousel images={item.images} alt={item.title} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map((tag, tagIndex) => (
                                <motion.span 
                                  key={tagIndex}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                                  whileHover={{ 
                                    scale: 1.05, 
                                    backgroundColor: index % 2 === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'
                                  }}
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Stats & CTA */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            {item.stats}
                          </span>
                          <div className="flex items-center space-x-2">
                           
                            <motion.button 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedExperience(item);
                              }}
                              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              View Details <ArrowRight className="ml-1 w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Questions Section - Enhanced Grid Layout */}
      <section id="questions" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30 animate-rotate">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" style={{ '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to, rgb(99 102 241 / 0)) 70%' }}></div>
          </div>
          <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" style={{ '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to, rgb(168 85 247 / 0)) 70%' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-2.5 mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 backdrop-blur-lg border border-white/20 rounded-full text-sm font-medium text-white shadow-lg shadow-indigo-500/20"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgb(99 102 241 / 0.5)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <MessageSquare className="mr-2" size={18} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">Key Insights</span>
            </motion.div>
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Know Me <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Better
                <svg className="absolute -bottom-1 left-0 w-full h-2.5 text-blue-500" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 15C50 15 100 5 200 10" stroke="url(#better-underline)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9" />
                  <defs>
                    <linearGradient id="better-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Explore my journey through a <span className="font-semibold text-gray-800">collection of insights</span> that shape my vision and leadership approach.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Personal Summary as Junior Council Member",
                content: "As a Junior Council member, I focused on building strong foundations in teamwork, communication, and project management.",
                details: "During my tenure as a Junior Council member, I was deeply involved in various initiatives that helped me develop essential leadership skills. I learned the importance of active listening, effective communication, and collaborative problem-solving. My experience in organizing community events and managing team dynamics has been invaluable in shaping my approach to leadership. I was particularly proud of our team's ability to work together to overcome challenges and achieve our collective goals.",
                icon: Users,
                gradient: "from-blue-500 via-blue-600 to-blue-500",
                stats: "2+ Years Experience",
                emoji: "🌟",
                images: [
                  "/images/Abraham_Samuel_Img.jpg",
                  "/images/Abraham_Samuel_img_2.jpg"
                ]
              },
              {
                title: "Summary as Co-Chair & MIS Lead",
                content: "Leading the MIS team and serving as Co-Chair for Road Safety taught me the balance between technical expertise and people management.",
                details: "As Co-Chair and MIS Lead, I successfully streamlined our organization's data management processes while fostering a positive team environment. I implemented new project management tools that improved our efficiency by 40% and reduced response times for data requests. My role required me to bridge the gap between technical and non-technical team members, ensuring smooth communication and understanding across all levels of the organization. I'm particularly proud of how our team came together to overcome challenges and deliver exceptional results.",
                icon: Award,
                gradient: "from-green-500 via-green-600 to-green-500",
                stats: "Team of 15+",
                emoji: "🚀",
                images: [
                  "/images/Abraham_Samuel_Img.jpg",
                  "/images/Abraham_Samuel_img_2.jpg"
                ]
              },
              {
                title: "Treasured Memory in Yi-YUVA",
                content: "My most treasured memory is seeing the impact of our Road Revive 1.0 event on local communities.",
                details: "The Road Revive 1.0 event stands out as a defining moment in my Yi-YUVA journey. Witnessing firsthand how our efforts translated into real behavioral changes in road safety practices was incredibly rewarding. The event brought together community members, local authorities, and our team in a collaborative effort to make our roads safer. The positive feedback we received from participants and the visible impact on road safety awareness in the following months reinforced my commitment to this cause.",
                icon: Heart,
                gradient: "from-rose-500 via-rose-600 to-rose-500",
                stats: "Life-changing",
                emoji: "💖",
                images: [
                  "/images/Abraham_Samuel_Img.jpg"
                ]
              },
              {
                title: "Takeaways from Current Council",
                content: "The current council has shown me the power of collaborative leadership and strategic thinking.",
                details: "Serving on the current council has been an incredible learning experience that has shaped my leadership philosophy. I've come to understand that effective governance requires a delicate balance between vision and execution. The importance of data-driven decision making, transparent communication, and continuous engagement with all stakeholders cannot be overstated. I've also learned valuable lessons about conflict resolution, team motivation, and the power of diverse perspectives in problem-solving.",
                icon: Lightbulb,
                gradient: "from-amber-400 via-amber-500 to-amber-400",
                stats: "Key Learnings",
                emoji: "💡",
                images: []
              },
              {
                title: "Contributions Made",
                content: "Technical leadership in MIS, strategic planning for road safety campaigns, and mentoring newer members.",
                details: "My contributions to Yi-YUVA have been diverse and impactful. As MIS Lead, I've overseen the digital transformation of our data management systems, resulting in improved efficiency and accessibility. I've played a key role in strategic planning for our road safety campaigns, ensuring they're both impactful and measurable. Mentoring newer members has been particularly rewarding, as I've been able to share my knowledge while learning from fresh perspectives. Each contribution has been a building block in strengthening our organization's capacity to serve the community.",
                icon: Star,
                gradient: "from-purple-500 via-purple-600 to-purple-500",
                stats: "Multi-faceted",
                emoji: "✨",
                images: [
                  "/images/Abraham_Samuel_Img.jpg",
                  "/images/Abraham_Samuel_img_2.jpg"
                ]
              },
              {
                title: "Vision & Goals for Upcoming Council",
                content: "I envision a more digitally integrated Yi-YUVA with enhanced member engagement platforms.",
                details: "Looking ahead, I'm excited about the potential to transform Yi-YUVA into a more digitally integrated organization. My vision includes implementing member engagement platforms that facilitate better communication and collaboration. I aim to expand our community outreach programs, making them more accessible through technology. Another key focus will be on developing innovative approaches to road safety education that leverage emerging technologies. My goal is to create sustainable programs that continue to deliver value long after my term ends.",
                icon: Target,
                gradient: "from-indigo-500 via-indigo-600 to-indigo-500",
                stats: "Future Vision",
                emoji: "🎯",
                images: []
              },
              {
                title: "Creative Event Ideas",
                content: "Interactive road safety simulations using VR, community art projects, and gamified learning experiences.",
                details: "I'm passionate about bringing innovative approaches to road safety education. Some of the creative event ideas I'd love to implement include immersive VR simulations that give participants a first-hand experience of road safety scenarios. Community art projects could transform public spaces while spreading important safety messages. I'm also excited about developing a youth ambassador program that empowers young leaders to champion road safety in their communities. These initiatives would be complemented by gamified learning experiences that make safety education engaging and memorable.",
                icon: Zap,
                gradient: "from-pink-500 via-pink-600 to-pink-500",
                stats: "Innovation",
                emoji: "⚡",
                images: []
              },
              {
                title: "Preferred Council Role",
                content: "As Senior Council member, I aim to bridge strategic planning and ground-level execution.",
                details: "In a Senior Council role, I see myself as a bridge between strategic vision and practical implementation. My focus would be on member development, ensuring that every team member has the tools and support they need to succeed. I'm particularly interested in driving technological innovation within our organization to improve efficiency and impact. Sustainability would be at the heart of all our initiatives, with a focus on creating programs that deliver lasting value. My approach would be collaborative, inclusive, and always aligned with our core mission.",
                icon: Trophy,
                gradient: "from-orange-500 via-orange-600 to-orange-500",
                stats: "Leadership",
                emoji: "🏆",
                images: [
                  "/images/Abraham_Samuel_Img.jpg"
                ]
              },
              {
                title: "Complete YUVA Contribution List",
                content: "MIS Team Leadership, Road Safety Co-Chair, and strategic planning across projects.",
                details: "My journey with Yi-YUVA has been marked by diverse and meaningful contributions. As MIS Team Lead, I've overseen our digital transformation and data management strategies. My role as Road Safety Co-Chair allowed me to lead impactful community initiatives. I've been actively involved in major events like Road Revive 1.0 and Enlighten the Enroute 1.0. Beyond specific roles, I've contributed to process optimization, member mentoring, and strategic planning across multiple projects. Each experience has been a valuable learning opportunity and a chance to give back to the community.",
                icon: MessageSquare,
                gradient: "from-teal-500 via-teal-600 to-teal-500",
                stats: "Full Portfolio",
                emoji: "📋",
                images: [
                  "/images/Abraham_Samuel_Img.jpg",
                  "/images/Abraham_Samuel_img_2.jpg"
                ]
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300 group-hover:duration-200" style={{
                  backgroundImage: `linear-gradient(45deg, ${item.gradient.includes('from-') ? '#' + item.gradient.split('from-')[1].split(' ')[0] : '#3b82f6'}, ${item.gradient.includes('via-') ? '#' + item.gradient.split('via-')[1].split(' ')[0] : '#8b5cf6'}, ${item.gradient.includes('to-') ? '#' + item.gradient.split('to-')[1].split(' ')[0] : '#6366f1'})`
                }}></div>
                <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl p-0.5 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
                  <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_0%_0%,#ffffff40_0%,#ffffff00_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative h-full bg-white rounded-2xl p-6 sm:p-8 flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <motion.div 
                        className={`bg-gradient-to-r ${item.gradient} text-white p-3 rounded-xl shadow-lg shadow-${item.gradient.split(' ')[1].replace('from-', '')}-500/20`}
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon size={22} className="text-white/90" />
                      </motion.div>
                      <span className="text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-full border border-gray-100 shadow-sm">
                        {item.stats}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-4 leading-tight transition-all duration-300 group-hover:translate-x-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-grow transition-all duration-300 group-hover:text-gray-700">
                      {item.content}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuestion(item);
                        }}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group/readmore"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <span>Read more</span>
                        <ArrowRight size={16} className="ml-1.5 mt-0.5 transition-transform group-hover/readmore:translate-x-1" />
                      </motion.button>
                      <span className="text-2xl opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" role="img" aria-hidden="true">
                        {item.emoji}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section - Enhanced */}
      <section id="skills" className="py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-medium text-emerald-700"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="mr-2" size={16} />
              Skills & Expertise
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Technical Excellence & Leadership
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A powerful combination of cutting-edge technical skills and proven leadership capabilities that drive
              innovation and team success.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Tech Stack */}
            <EnhancedCard delay={0.2} className="rounded-3xl p-8 sm:p-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <motion.div
                  className="mr-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Code size={28} />
                </motion.div>
                Tech Stack
              </h3>
              <div className="space-y-6">
                {[
                  { name: "Kotlin", level: 90, color: "from-purple-500 to-purple-600", icon: "🎯" },
                  { name: "Firebase", level: 85, color: "from-orange-500 to-red-500", icon: "🔥" },
                  { name: "Room DB", level: 80, color: "from-green-500 to-emerald-500", icon: "💾" },
                  { name: "Google Maps API", level: 75, color: "from-blue-500 to-cyan-500", icon: "🗺️" },
                  { name: "Coroutines", level: 85, color: "from-indigo-500 to-purple-500", icon: "⚡" },
                  // { name: "Retrofit", level: 80, color: "from-red-500 to-pink-500", icon: "🌐" },
                ].map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{skill.icon}</span>
                        <span className="font-semibold text-gray-800 text-lg">{skill.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-3 rounded-full bg-gradient-to-r ${skill.color} shadow-lg`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </EnhancedCard>

            {/* Soft Skills */}
            <EnhancedCard delay={0.4} className="rounded-3xl p-8 sm:p-10">
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <motion.div
                  className="mr-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Users size={28} />
                </motion.div>
                Leadership Skills

              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Leadership", icon: Award, color: "text-violet-400 bg-violet-700 border-violet-200", rating: 5 },
                  {
                    name: "Public Speaking",
                    icon: MessageSquare,
                    color: "text-emerald-400 bg-emerald-700 border-emerald-200",
                    rating: 4,
                  },
                  { name: "Teamwork", icon: Users, color: "text-fuchsia-400 bg-fuchsia-700 border-fuchsia-200", rating: 5 },
                  {
                    name: "Event Coordination",
                    icon: Calendar,
                    color: "text-rose-400 bg-rose-700 border-rose-200",
                    rating: 4,
                  },
                  // { name: "Empathy", icon: Heart, color: "text-pink-400 bg-pink-500/30 border-pink-200/30", rating: 5 },
                  {
                    name: "Strategic Planning",
                    icon: Target,
                    color: "text-orange-400 bg-orange-700 border-orange-200",
                    rating: 4,
                  },
                ].map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className={`p-6 rounded-2xl border-2 ${skill.color} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <skill.icon
                        className={`${skill.color.split(" ")[0]} group-hover:scale-110 transition-transform`}
                        size={24}
                      />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${i < skill.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="font-semibold text-white text-sm group-hover:text-opacity-80 transition-colors">
                      {skill.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </EnhancedCard>
          </div>
        </div>
      </section>

   

      {/* Enhanced Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-12 md:pt-20 md:pb-16">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
                "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(139,92,246,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 80%, rgba(236,72,153,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 70%, rgba(16,185,129,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 30%, rgba(245,158,11,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 60% 60%, rgba(244,63,94,0.2) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
          />
          
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
          <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0,
              }}
              animate={{
                y: [0, -200],
                opacity: [0, 1, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Animated shapes */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`shape-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
              initial={{
                x: Math.random() * 120 - 60,
                y: Math.random() * 100,
                width: `clamp(120px, ${Math.random() * 300 + 100}px, 500px)`,
                height: `clamp(120px, ${Math.random() * 300 + 100}px, 500px)`,
                opacity: 0.08,
                filter: 'blur(20px)',
                rotate: Math.random() * 360,
              }}
              animate={{
                y: [0, Math.random() * 40 + 20, 0],
                x: [null, Math.random() * 40 - 20],
                rotate: [0, Math.random() * 360],
                scale: [1, 1.1, 1],
                opacity: [0.08, 0.12, 0.08],
              }}
              transition={{
                duration: Math.random() * 30 + 30,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Animated lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
              initial={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100,
                width: `${Math.random() * 200 + 100}px`,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                x: [null, Math.random() * 40 - 20],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}

          {/* Animated dots */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          <motion.div
            className="text-center space-y-8 md:space-y-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.1
              }
            }}
            viewport={{ once: true, margin: "-50px 0px" }}
          >
            {/* Enhanced Logo/Name with animation */}
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-300%"
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ 
                  backgroundPosition: '200% 50%',
                }}
                transition={{
                  duration: 12,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "linear"
                }}
              >
                Abraham Samuel E
              </motion.h2>
              <motion.div 
                className="h-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 mt-4 mx-auto rounded-full"
                initial={{ width: '0%' }}
                whileInView={{ width: '80%' }}
                transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              />
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 md:mt-10 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }}
              viewport={{ once: true }}
            >
              {[
                { name: 'linkedin', icon: <Linkedin className="w-5 h-5" />, color: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700', glowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]', url: 'https://linkedin.com/in/abraham-raj' },
                { name: 'github', icon: <Github className="w-5 h-5" />, color: 'from-gray-700 to-gray-800', hoverColor: 'hover:from-gray-800 hover:to-gray-900', glowColor: 'shadow-[0_0_15px_rgba(31,41,55,0.3)]', url: 'https://github.com/abraham-raj' },
                { name: 'mail', icon: <Mail className="w-5 h-5" />, color: 'from-amber-400 to-amber-500', hoverColor: 'hover:from-amber-500 hover:to-amber-600', glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]', url: 'mailto:abrahamraj@gmail.com' },
                { name: 'instagram', icon: <Instagram className="w-5 h-5" />, color: 'from-pink-500 to-rose-500', hoverColor: 'hover:from-pink-600 hover:to-rose-600', glowColor: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]', url: 'https://instagram.com/abraham_raj' },
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${social.color} ${social.hoverColor} ${social.glowColor} transition-all duration-300 overflow-hidden`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <span className="text-white font-medium text-sm">{social.icon}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Enhanced Copyright text */}
            <motion.div 
              className="mt-10 md:mt-12 space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              viewport={{ once: true, margin: "-20px" }}
            >
              <p className="text-sm sm:text-base text-gray-400 font-medium">
                © {new Date().getFullYear()} Abraham Samuel E. All rights reserved.
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Built with ❤️ for Yi-YUVA-REC · Crafted with Next.js & Framer Motion
              </p>
            </motion.div>

            {/* Enhanced Animated quote */}
            <motion.div
              className="mt-8 md:mt-10 relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              viewport={{ once: true, margin: "-30px" }}
            >
              <div className="relative z-10">
                <svg 
                  className="w-8 h-8 md:w-10 md:h-10 text-blue-400/30 absolute -left-2 -top-3 md:-left-3 md:-top-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609.393-1.396-.759-2.233-1.458-1.204-4.5 5.484-6.8 8.46-6.8 13.689v7.515h-10.742v-8.52s6.53-1.052 10.017-8.513v-7.467h-10.975v8.49s5.204 1.18 6.976 8.51z" />
                </svg>
                <motion.p 
                  className="text-base sm:text-lg md:text-xl font-medium text-gray-300 italic relative z-10 px-8 py-4 sm:px-10 sm:py-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg"
                  initial={{ scale: 0.98, opacity: 0 }}
                  whileInView={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: { 
                      delay: 0.2,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }}
                  viewport={{ once: true }}
                >
                  <span className="relative">
                    <span className="absolute -left-1 -top-2 text-blue-400 text-2xl"></span>
                    <span className="relative px-1">
                      Together, we build tomorrow.
                      <span className="absolute -right-3 -bottom-3 text-blue-400 text-2xl"></span>
                    </span>
                  </span>
                </motion.p>
                <svg 
                  className="w-8 h-8 md:w-10 md:h-10 text-blue-400/30 absolute -right-2 -bottom-3 md:-right-3 md:-bottom-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ transform: 'scaleX(-1) rotate(180deg)' }}
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609.393-1.396-.759-2.233-1.458-1.204-4.5 5.484-6.8 8.46-6.8 13.689v7.515h-10.742v-8.52s6.53-1.052 10.017-8.513v-7.467h-10.975v8.49s5.204 1.18 6.976 8.51z" />
                </svg>
              </div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1, 0.8],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              />
            </motion.div>

            {/* Enhanced Scroll to top button */}
            <motion.div
              className="mt-10 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.4,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group relative px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto overflow-hidden"
                whileHover={{ 
                  y: -2,
                  boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.6)',
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  <span>Back to Top</span>
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ 
                      y: [0, -2, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut'
                    }}
                  >
                    <svg 
                      className="w-4 h-4 sm:w-5 sm:h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </motion.span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0"
                  animate={{
                    opacity: [0, 0.7, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                {/* Enhanced border glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-white/20"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(99, 102, 241, 0)',
                      '0 0 0 3px rgba(99, 102, 241, 0.4)',
                      '0 0 0 0 rgba(99, 102, 241, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                />
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(99, 102, 241, 0.6)',
                      '0 0 0 15px rgba(99, 102, 241, 0)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeOut',
                  }}
                />
                {/* Gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Decorative bottom border */}
        <motion.div 
          className="relative mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }
          }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/20 via-30% to-transparent w-full"></div>
          <motion.div 
            className="h-[1px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent absolute top-0 left-0 right-0"
            initial={{ width: '0%' }}
            whileInView={{ 
              width: '100%',
              transition: { 
                duration: 1.8,
                ease: [0.65, 0, 0.35, 1],
                delay: 0.3
              }
            }}
            viewport={{ once: true }}
          />
        </motion.div>
      </footer>
    </main>
  );
}
