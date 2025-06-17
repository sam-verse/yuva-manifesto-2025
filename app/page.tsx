"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion"
import { 
  Trophy, Code, Award, Calendar, Lightbulb, Users, Rocket, Globe, Linkedin, Instagram, Facebook, 
  Menu, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Star, Target, Heart, Zap, MessageSquare, 
  TrendingUp, BarChart2, Cpu, Database, Server, Wifi, Shield, Clock, CheckCircle, Users as UsersIcon, 
  ArrowUpRight, Sparkles, X, ArrowRight, ChevronDown, ChevronUp, ExternalLink, Github, Twitter, 
  FileText, Tags, Image as ImageIcon, Wallet
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
interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  [key: string]: any;
}
const EnhancedCard: React.FC<EnhancedCardProps> = ({ children, className = "", delay = 0, ...props }) => (
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

    // Get color variations based on the experience's bgColor
    const getColorVariations = (bgColor: string) => {
      const colorMap: { [key: string]: { 
        light: string, 
        dark: string, 
        border: string, 
        text: string, 
        icon: string,
        button: string,
        buttonHover: string,
        header: string,
        gradient: string
      }} = {
        'bg-blue-600': {
          light: 'from-blue-50 to-blue-100',
          dark: 'from-blue-900/20 to-blue-800/20',
          border: 'border-blue-100 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400',
          button: 'bg-blue-600',
          buttonHover: 'hover:bg-blue-700',
          header: 'bg-blue-600',
          gradient: 'from-blue-600 to-blue-700'
        },
        'bg-purple-600': {
          light: 'from-purple-50 to-purple-100',
          dark: 'from-purple-900/20 to-purple-800/20',
          border: 'border-purple-100 dark:border-purple-800',
          text: 'text-purple-700 dark:text-purple-300',
          icon: 'text-purple-600 dark:text-purple-400',
          button: 'bg-purple-600',
          buttonHover: 'hover:bg-purple-700',
          header: 'bg-purple-600',
          gradient: 'from-purple-600 to-purple-700'
        },
        'bg-green-600': {
          light: 'from-green-50 to-green-100',
          dark: 'from-green-900/20 to-green-800/20',
          border: 'border-green-100 dark:border-green-800',
          text: 'text-green-700 dark:text-green-300',
          icon: 'text-green-600 dark:text-green-400',
          button: 'bg-green-600',
          buttonHover: 'hover:bg-green-700',
          header: 'bg-green-600',
          gradient: 'from-green-600 to-green-700'
        },
        'bg-pink-600': {
          light: 'from-pink-50 to-pink-100',
          dark: 'from-pink-900/20 to-pink-800/20',
          border: 'border-pink-100 dark:border-pink-800',
          text: 'text-pink-700 dark:text-pink-300',
          icon: 'text-pink-600 dark:text-pink-400',
          button: 'bg-pink-600',
          buttonHover: 'hover:bg-pink-700',
          header: 'bg-pink-600',
          gradient: 'from-pink-600 to-pink-700'
        },
        'bg-orange-600': {
          light: 'from-orange-50 to-orange-100',
          dark: 'from-orange-900/20 to-orange-800/20',
          border: 'border-orange-100 dark:border-orange-800',
          text: 'text-orange-700 dark:text-orange-300',
          icon: 'text-orange-600 dark:text-orange-400',
          button: 'bg-orange-600',
          buttonHover: 'hover:bg-orange-700',
          header: 'bg-orange-600',
          gradient: 'from-orange-600 to-orange-700'
        }
      };
      return colorMap[bgColor] || colorMap['bg-blue-600'];
    };

    const colors = getColorVariations(experience.bgColor);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
        >
          {/* Header with Gradient */}
          <div className={`h-2 w-full bg-gradient-to-r ${colors.gradient}`}></div>

          <div className="p-6 sm:p-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full ${colors.button} ${colors.buttonHover} text-white transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Section */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-xl shadow-sm ${colors.header} text-white`}>
                <experience.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {experience.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{experience.company}</span>
                  <span>•</span>
                  <span>{experience.date}</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${colors.light} dark:${colors.dark} border ${colors.border}`}>
              <div className={`flex items-center gap-2 ${colors.text}`}>
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">{experience.stats}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className={`w-5 h-5 ${colors.icon}`} />
                Overview
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {experience.details}
              </p>
            </div>

            {/* Skills Section */}
            {experience.skills && experience.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Code className={`w-5 h-5 ${colors.icon}`} />
                  Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {experience.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${colors.light} dark:${colors.dark} ${colors.text} border ${colors.border}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights Section */}
            {experience.highlights && experience.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award className={`w-5 h-5 ${colors.icon}`} />
                  Key Achievements
                </h3>
                <ul className="space-y-2">
                  {experience.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                      <CheckCircle className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Image Gallery */}
            {experience.images && experience.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <ImageIcon className={`w-5 h-5 ${colors.icon}`} />
                  Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {experience.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={image}
                        alt={`${experience.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Section */}
            {experience.tags && experience.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tags className={`w-5 h-5 ${colors.icon}`} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {experience.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${colors.light} dark:${colors.dark} ${colors.text} border ${colors.border}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
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
            details={selectedQuestion.details}
            stats={selectedQuestion.statsText}
            gradient={selectedQuestion.gradient}
            emoji={selectedQuestion.emoji}
            images={selectedQuestion.images}
            statsColorClass={selectedQuestion.statsColorClass || "text-blue-600 dark:text-blue-400"}
            experienced={selectedQuestion.experienced || false}
            bgColor={selectedQuestion.bgColor || selectedQuestion.cardColor?.split(' ')[0]?.replace('bg-', '').split('-')[0] || 'blue'}
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
              <span className="block">"Turning blank pages into blueprints</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
              and blueprints into breakthroughs."
              </span>
            </motion.h1>

            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-lora">Abraham Samuel E</h2> */}
              <h2 className="text-2xl sm:text-3xl text-blue-600 font-bold">
                Abraham Samuel E
              </h2>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                onClick={() => scrollToSection("about")}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-full text-lg font-medium shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                My Journey
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ChevronDown size={30} />
                </motion.div>
              </Button>
{/* 
              <Button
                variant="outline"
                onClick={() => scrollToSection("contact")}
                className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full text-lg font-medium backdrop-blur-md bg-white/50 transition-all duration-300"
              >
                Let's Connect
                <MessageSquare className="ml-2 group-hover:scale-110 transition-transform" size={20} />
              </Button> */}
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
          {/* <Star size={32} /> */}
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-4 sm:right-10 text-purple-400/60"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* <Target size={40} /> */}
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-4 text-green-400/40"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* <Zap size={28} /> */}
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
            Mind Behind the Movement
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
                    "I'm Abraham Samuel E — a purpose-driven individual who believes in leading with clarity, curiosity, and compassion. I find energy in solving problems, building connections, and turning ideas into outcomes. Leadership, to me, is not about holding a title — it's about creating value and inspiring action.",
                  icon: Users,
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  title: "Why Yi-YUVA?",
                  content:
                    "YUVA is more than an organization — it's a launchpad for growth, collaboration, and real-world impact. It's where I've learned the power of teamwork, strategic thinking, and value-based leadership. Every experience here has shaped not just what I do, but how I lead.",
                  icon: Heart,
                  gradient: "from-red-500 to-pink-600",
                },
                {
                  title: "Vision Ahead",
                  content:
                    "I envision a YUVA REC driven by innovation, where technology meets purpose and ideas become action. A space that nurtures collaboration, entrepreneurial thinking, and bold problem-solving.",
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

      {/* Experience Section - Vertical Timeline */}
      <section id="experience" className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#6366f110,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,#6366f105,transparent_80%)] animate-pulse-slow"></div>
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30 animate-rotate">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
          </div>
          <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            {/* Enhanced Timeline Line with Dynamic Animations */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 transform -translate-x-1/2 hidden lg:block">
              {/* Main Timeline Line with Enhanced Gradient Flow */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                transition={{ 
                  duration: 1.8,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.3
                }}
                viewport={{ 
                  once: true, 
                  margin: "-50px 0px -50px 0px",
                  amount: 0.1
                }}
              >
                {/* Enhanced Animated Gradient Flow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"
                  animate={{
                    backgroundPosition: ['0% 0%', '0% 100%'],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '100% 200%',
                  }}
                />
                {/* Enhanced Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 blur-2xl"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.08, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Additional Pulsing Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Energy Flow Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ['0% 0%', '0% 100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    backgroundSize: '100% 200%',
                  }}
                />
                {/* Sparkle Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 70%)',
                    backgroundSize: '100% 200%',
                  }}
                />
              </motion.div>
            </div>

            {/* Enhanced Mobile Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 lg:hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                transition={{ 
                  duration: 1.5,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.2
                }}
                viewport={{ 
                  once: true, 
                  margin: "-30px 0px -30px 0px",
                  amount: 0.1
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"
                  animate={{
                    backgroundPosition: ['0% 0%', '0% 100%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '100% 200%',
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 blur-xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Additional Pulsing Effect for Mobile */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Energy Flow Effect for Mobile */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ['0% 0%', '0% 100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                    backgroundSize: '100% 200%',
                  }}
                />
              </motion.div>
            </div>

            <div className="space-y-16">
              {[
               {
                title: "Co-Chair – Road Safety",
                date: "2024 – 2025",
                company: "Yi-YUVA REC",
                description: "Led impactful road safety campaigns reaching over 200+ people, combining strategic outreach with community-centered education.",
                details: "As Co-Chair of the Road Safety vertical at Yi-YUVA REC, I designed and executed large-scale awareness programs using data-driven planning and local partnerships. I worked closely with authorities and groups to roll out targeted interventions including rally, digital surveys.",
                icon: Award,
                color: "from-green-500 to-green-600",
                bgColor: "bg-gradient-to-br from-green-500 to-green-600",
                stats: "200+ lives impacted",
                images: [
                  "/images/img1/e2.JPG",
                  "/images/img1/e1.jpeg",
                  "/images/Abraham_Samuel_img_2.jpg",
                  "/images/img1/e3.JPG"
                ],
                tags: [
                  "Leadership",
                  "Community Impact"
                ],
                skills: [
                  "Program Strategy",
                  "Stakeholder Engagement",
                  "People Handling"
                ],
                highlights: [
                  "Led a Survey for Yi-Chennai Chapter Road-Safety Vertical",
                  "Conducted a Road Rally for spreading the awarness on Underage Driving and it's Cons "
                  // "Created educational resources used by 20+ schools"
                ]
              },
              
               {
  title: "MIS Team Lead",
  date: "2023 – Present",
  company: "Yi-YUVA",
  description: "Led the MIS team to improve how we collect, manage, and use data and manage the Club's Website— making things faster, clearer, and smarter for everyone.",
  details: "At Yi-YUVAREC, I led a team of 3 to simplify and upgrade our digital systems. My work focused on making processes smoother, building better, Eye-Catching Visuals by code and  make decisions with the right information at the right time. I initiated and developed engaging event websites for Route Cause, Her Rhythm Within, and e-cycle, significantly boosting event registrations through user-friendly interfaces and compelling visual design with my team.",
  icon: Code,
  color: "from-blue-500 to-blue-600",
  bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
  stats: "70% efficiency Increased",
  images: [
    "/images/img1/e2.JPG",
                  "/images/img1/e4.png",
                  // "/images/img1/e3.JPG",
                  "/images/img1/e5.png",
                  "/images/img1/e6.png"

  ],
  tags: [
    "Leadership",
    "Data Managment",
    "Innovative Thinking",
    "Web Development"
  ],
  skills: [
    "Team Leadership",
    "Problem Solving",
    "AI Tools",
    "Project Planning",
    "Automation",
    "Web Development",
    "UI/UX Design"
  ],
  highlights: [
    "Led a team of 3 to deliver digital upgrades on time",
    "Made reporting 70% faster with AI tools",
    "Developed engaging event websites that increased registrations with the team",
    "Trained team members, boosting overall productivity by 50%"
  ]
},

                
              {
  title: "Route Cause – Underage Driving Awarness Rally",
  date: "May 11, 2025",
  company: "Yi-YUVA",
  description: "Led Route Cause, a silent awareness rally to stand against underage driving, bringing together citizens, youth, and local authorities in a powerful community movement.",
  details: "On May 11th, 2025, Yi-YUVA organized 'Route Cause' at Edward Elliot's Beach — a rally that united people to raise their voice against underage driving. Starting near Murugan Idli Shop, participants walked in silence, holding placards with strong messages. Their quiet presence created a loud impact. The event ended with heartfelt pledges, signatures on a pledge wall, and support from the local police. Reflective stickers were shared as a symbol of safety and awareness. It was more than a rally — it was a reminder that road safety starts with responsibility.",
  icon: Calendar,
  color: "from-red-500 to-red-600",
  bgColor: "bg-gradient-to-br from-red-500 to-red-600",
  stats: "150+ citizens engaged",
  images: [
    "/images/img1/e7.JPG",
    "/images/img1/e8.jpg",
    "/images/img1/e9.jpg",
    "/images/img1/e10.jpg",
  ],
  tags: ["Awareness Campaign", "Community Action", "Youth Leadership"],
  skills: ["Event Planning", "Public Engagement"],
  highlights: [
    "Organized a community rally with strong local participation",
    "Collaborated with police and civic leaders for outreach",
    "Led public pledge against underage driving",
    "Distributed safety materials like Reflective Stickers to promote responsible driving"
  ]
},

                {
  title: "FinFluent",
  date: "28th March 2025",
  company: "Yi-YUVA",
  description: "Organized a personal finance workshop that helped college students understand money management and future wealth planning in a simple, relatable way.",
  details: "FinFluent was an interactive offline session focused on helping students take control of their personal finances. Held at Rajalakshmi Engineering College, the workshop featured Dr. M. Pattabiraman, a personal finance expert from IIT Madras. He broke down key financial concepts and shared practical advice on building wealth, automating investments, and making smart money decisions. The session titled 'How to Become a Crorepati on Auto-Pilot?' attracted 200+ students and ended with a lively Q&A where participants got answers to their real-life financial questions. The event gave students the tools and motivation to start thinking seriously about their financial future.",
  icon: Wallet,
  color: "from-yellow-500 to-yellow-600",
  bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-600",
  stats: "120+ students empowered",
  images: [
    "/images/img1/e11.JPG",
    "/images/img1/e12.jpg",
    "/images/img1/e13.jpg",
    "/images/img1/e14.jpg",
  ],
  tags: ["Finance", "Education", "Student Development"],
  skills: ["Financial Literacy", "Event Planning", "Public Engagement", "Workshop Facilitation", "Student Outreach"],
  highlights: [
    "Hosted a workshop attended by 120+ students",
    "Featured expert speaker from IIT Madras",
    "Delivered actionable strategies for personal wealth building",
    "Helped students understand the basics of investing and automation"
  ]
},

{
  title: "Yi Chennai Annual Day 2024",
  date: "7th December 2024",
  company: "Yi-YUVA",
  description: "Celebrated a year of impact and innovation at Yi Chennai's Annual Day, where I was honored with the Yi YUVA Champion Award for leading the Digital Safety Audit initiative taken by 600+ users nationwide.",
  details: "Held at The Westin, Velachery, the Annual Day recognized outstanding contributions from Yi members. The event included the annual report presentation, introduction of the new Executive Council, and awards ceremony. Our college received recognition for impactful activities, particularly for the Digital Safety Audit — a project aimed at promoting safer online spaces. I was honored with the Yi YUVA Champion Award for my key role in developing and scaling the platform, which was completed by over 600 users across India. The night celebrated leadership, collaboration, and innovation in action.",
  icon: Award,
  color: "from-indigo-500 to-indigo-700",
  bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
  stats: "600+ individuals reached",
  images: [
    "/images/img1/e19.png",
    "/images/img1/e16.jpg",
    "/images/img1/e18.png",
    "/images/img1/e17.png",
  ],
  tags: ["Award", "Technology", "Cyber Safety", "Youth Leadership"],
  skills: ["Digital Innovation", "Project Leadership", "Tech for Good", "Community Engagement"],
  highlights: [
    "Awarded Yi YUVA Champion for leading the Digital Safety Audit project",
    "Audit completed by 600+ people nationwide",
    "Recognized for building a platform that fosters safer digital environments",
    "Represented my college in a high-impact, nationally acknowledged initiative"
  ]
},

{
  title: "Volunteering in YUVA Events",
  date: "2024 – 2025",
  company: "Yi-YUVA REC",
  description: "Actively led, volunteered, and collaborated in impactful YUVAREC events that blended creativity, tech, social change, and community growth.",
  details: "Across the 2024–25 term, I was deeply involved in multiple Yi YUVA flagship events — from leading boards to coordinating on-ground efforts. I contributed to Varies Events like 'Her Rhythm Within', 'Smash 3.0', 'Akshaya Patra 4.0', 'Chennai Got Talent 5.0'. These events shaped my journey in leadership, teamwork, innovation, and purpose-driven action.",
  icon: Users,
  color: "from-rose-500 to-pink-600",
  bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
  stats: "Events Volunteering",
  images: [
    "/images/img1/e20.png",
    "/images/img1/e21.png",
    "/images/img1/e22.jpg",
    // "/images/img1/e14.jpg",
  ],
  tags: ["Leadership", "Volunteering", "Youth Empowerment", "Innovation", "Social Impact"],
  skills: ["Team Leadership", "Community Building", "Event Coordination", "Purposeful Collaboration", "Public Engagement"],
  highlights: [
    "Volunteered in 4 flagship Yi YUVA events across 10 months",
    "Enabled outreach to 500+ individuals through wellness, culture, and sustainability efforts",
    "Blended creativity, compassion, and collaboration to create meaningful impact",
    "Supported large-scale execution of Chennai Got Talent with 65 volunteers"
  ]
}




              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }}
                  className={`relative ${index % 2 === 0 ? 'lg:pr-1/2' : 'lg:pl-1/2 lg:ml-auto'} ${index % 2 === 0 ? 'lg:mr-auto' : ''}`}
                >
                  {/* Desktop Timeline Dot with Enhanced Effects */}
                  <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10 lg:block hidden">
                    <motion.div 
                      className={`w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center shadow-lg ${
                        index % 2 === 0 ? 'border-blue-500' : 'border-purple-500'
                      } relative`}
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.3 }}
                    >
                      {/* Inner Dot */}
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color}`}></div>
                      {/* Enhanced Glow Effect */}
                      <motion.div 
                        className={`absolute inset-0 rounded-full ${
                          index % 2 === 0 ? 'bg-blue-500/30' : 'bg-purple-500/30'
                        } blur-md`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      {/* Pulsing Ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-full border-2 ${
                          index % 2 === 0 ? 'border-blue-500' : 'border-purple-500'
                        }`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Mobile Timeline Dot with Enhanced Effects */}
                  <div className="absolute left-4 top-8 -translate-x-1/2 z-10 lg:hidden">
                    <motion.div 
                      className={`w-8 h-8 rounded-full bg-white border-3 flex items-center justify-center shadow-lg ${
                        index % 2 === 0 ? 'border-blue-500' : 'border-purple-500'
                      } relative`}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.3 }}
                    >
                      {/* Inner Dot */}
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                      {/* Enhanced Glow Effect */}
                      <motion.div 
                        className={`absolute inset-0 rounded-full ${
                          index % 2 === 0 ? 'bg-blue-500/30' : 'bg-purple-500/30'
                        } blur-md`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      {/* Pulsing Ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-full border-2 ${
                          index % 2 === 0 ? 'border-blue-500' : 'border-purple-500'
                        }`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Content Card - Responsive Layout */}
                  <div className={`relative w-full lg:w-[calc(50%-2rem)] ${
                    index % 2 === 0 
                      ? 'lg:mr-auto lg:pr-16' 
                      : 'lg:ml-auto lg:pl-16'
                  } pl-12 lg:pl-0`}>
                    <motion.div 
                      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl"
                      whileHover={{ y: -5, scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        duration: 0.5,
                        delay: index * 0.1 + 0.2
                      }}
                    >
                      {/* Card Header with Gradient */}
                      <div className={`h-2 w-full ${item.bgColor}`}></div>
                      
                      <div className="p-4 sm:p-6">
                        {/* Header with Icon */}
                        <motion.div 
                          className="flex items-start mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            duration: 0.5,
                            delay: index * 0.1 + 0.3
                          }}
                        >
                          <div className={`p-2.5 rounded-xl shadow-sm mr-4 flex-shrink-0 ${item.bgColor} text-white`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                                {item.title}
                              </h3>
                              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                                {item.company}
                              </span>
                            </div>
                            <div className={`mt-1 text-sm font-medium ${index % 2 === 0 ? 'text-blue-600' : 'text-purple-600'}`}>
                              {item.date}
                            </div>
                          </div>
                        </motion.div>

                        {/* Description with Fade In */}
                        <motion.p 
                          className="text-gray-600 text-sm leading-relaxed mb-4"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            duration: 0.5,
                            delay: index * 0.1 + 0.4
                          }}
                        >
                          {item.description}
                        </motion.p>

                        {/* Image Gallery with Slide In - Responsive Grid */}
                        {item.images && item.images.length > 0 && (
                          <motion.div 
                            className="mb-4 rounded-xl overflow-hidden border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 100,
                              damping: 20,
                              duration: 0.5,
                              delay: index * 0.1 + 0.5
                            }}
                          >
                            <div className="relative h-40 sm:h-48 w-full">
                              <ImageCarousel images={item.images} alt={item.title} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                            </div>
                          </motion.div>
                        )}

                        {/* Tags with Stagger - Responsive Layout */}
                        {item.tags && item.tags.length > 0 && (
                          <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 100,
                              damping: 20,
                              duration: 0.5,
                              delay: index * 0.1 + 0.6
                            }}
                          >
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map((tag, tagIndex) => (
                                <motion.span 
                                  key={tagIndex}
                                  className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  transition={{ 
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 10,
                                    duration: 0.3,
                                    delay: index * 0.1 + 0.6 + tagIndex * 0.1
                                  }}
                                  whileHover={{ 
                                    scale: 1.05, 
                                    backgroundColor: index % 2 === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'
                                  }}
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Stats & CTA with Fade In - Responsive Layout */}
                        <motion.div 
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            duration: 0.5,
                            delay: index * 0.1 + 0.7
                          }}
                        >
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            {item.stats}
                          </span>
                          <motion.button 
                            onClick={() => setSelectedExperience(item)}
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            View Details <ArrowRight className="ml-1 w-4 h-4" />
                          </motion.button>
                        </motion.div>
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
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
          </div>
          <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
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
                cardColor: "bg-blue-100/70 border-blue-300",
                iconColor: "bg-blue-500",
                statsColor: "bg-blue-50 text-blue-700 border-blue-200",
                statsText: "2+ Years Experience",
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
                cardColor: "bg-green-100/70 border-green-300",
                iconColor: "bg-green-500",
                statsColor: "bg-green-50 text-green-700 border-green-200",
                statsText: "Team of 15+",
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
                // gradient: "from-rose-500 via-rose-600 to-rose-500",
                // cardColor: "bg-rose-100/70 border-rose-300",
                // iconColor: "bg-rose-500",
                gradient: "from-rose-500 via-rose-600 to-rose-500",
                cardColor: "bg-rose-100/70 border-rose-300",
                iconColor: "bg-rose-500",
                statsColor: "bg-rose-50 text-rose-700 border-rose-200",
                statsText: "Life-changing",
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
                cardColor: "bg-amber-100/70 border-amber-300",
                iconColor: "bg-amber-400",
                statsColor: "bg-amber-50 text-amber-700 border-amber-200",
                statsText: "Key Learnings",
                emoji: "💡",
                bgColor: "amber",
                images: []
              },
              {
                title: "Contributions Made",
                content: "Technical leadership in MIS, strategic planning for road safety campaigns, and mentoring newer members.",
                details: "My contributions to Yi-YUVA have been diverse and impactful. As MIS Lead, I've overseen the digital transformation of our data management systems, resulting in improved efficiency and accessibility. I've played a key role in strategic planning for our road safety campaigns, ensuring they're both impactful and measurable. Mentoring newer members has been particularly rewarding, as I've been able to share my knowledge while learning from fresh perspectives. Each contribution has been a building block in strengthening our organization's capacity to serve the community.",
                icon: Star,
                gradient: "from-purple-500 via-purple-600 to-purple-500",
                cardColor: "bg-purple-100/70 border-purple-300",
                iconColor: "bg-purple-500",
                statsColor: "bg-purple-50 text-purple-700 border-purple-200",
                statsText: "Multi-faceted",
                emoji: "✨",
                images: [
                  "/images/Abraham_Samuel_Img.jpg",
                  "/images/Abraham_Samuel_img_2.jpg"
                ]
              },
              {
                title: "Vision & Goals for Upcoming Council",
                content: "I envision a more digitally integrated Yi-YUVA REC with enhanced member engagement platforms.",
                details: "Looking ahead, I'm excited about the potential to transform Yi-YUVA into a more digitally integrated organization. My vision includes implementing member engagement platforms that facilitate better communication and collaboration. I aim to expand our community outreach programs, making them more accessible through technology. Another key focus will be on developing innovative approaches to road safety education that leverage emerging technologies. My goal is to create sustainable programs that continue to deliver value long after my term ends.",
                icon: Target,
                gradient: "from-indigo-500 via-indigo-600 to-indigo-500",
                cardColor: "bg-indigo-100/70 border-indigo-300",
                iconColor: "bg-indigo-500",
                statsColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
                statsText: "Future Vision",
                emoji: "🎯",
                images: []
              },
              {
                title: "Creative Event Ideas",
                content: "Interactive road safety simulations using VR, community art projects, and gamified learning experiences.",
                details: "I'm passionate about bringing innovative approaches to road safety education. Some of the creative event ideas I'd love to implement include immersive VR simulations that give participants a first-hand experience of road safety scenarios. Community art projects could transform public spaces while spreading important safety messages. I'm also excited about developing a youth ambassador program that empowers young leaders to champion road safety in their communities. These initiatives would be complemented by gamified learning experiences that make safety education engaging and memorable.",
                icon: Zap,
                gradient: "from-pink-500 via-pink-600 to-pink-500",
                cardColor: "bg-pink-100/70 border-pink-300",
                iconColor: "bg-pink-500",
                statsColor: "bg-pink-50 text-pink-700 border-pink-200",
                statsText: "Innovation",
                emoji: "⚡",
                images: []
              },
              {
                title: "Preferred Council Role",
                content: "As Senior Council member, I aim to bridge strategic planning and ground-level execution.",
                details: "In a Senior Council role, I see myself as a bridge between strategic vision and practical implementation. My focus would be on member development, ensuring that every team member has the tools and support they need to succeed. I'm particularly interested in driving technological innovation within our organization to improve efficiency and impact. Sustainability would be at the heart of all our initiatives, with a focus on creating programs that deliver lasting value. My approach would be collaborative, inclusive, and always aligned with our core mission.",
                icon: Trophy,
                gradient: "from-orange-500 via-orange-600 to-orange-500",
                cardColor: "bg-orange-100/70 border-orange-300",
                iconColor: "bg-orange-500",
                statsColor: "bg-orange-50 text-orange-700 border-orange-200",
                statsText: "Leadership",
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
                cardColor: "bg-teal-100/70 border-teal-300",
                iconColor: "bg-teal-500",
                statsColor: "bg-teal-50 text-teal-700 border-teal-200",
                statsText: "Full Portfolio",
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
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -12, scale: 1.04 }}
                className={`group relative ${item.cardColor} border-2 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden`}
                style={{
                  boxShadow: `0 4px 32px 0 ${item.cardColor.includes('blue') ? 'rgba(59,130,246,0.15)' : item.cardColor.includes('green') ? 'rgba(34,197,94,0.15)' : item.cardColor.includes('rose') ? 'rgba(244,63,94,0.15)' : item.cardColor.includes('amber') ? 'rgba(251,191,36,0.15)' : item.cardColor.includes('purple') ? 'rgba(139,92,246,0.15)' : item.cardColor.includes('indigo') ? 'rgba(99,102,241,0.15)' : item.cardColor.includes('pink') ? 'rgba(236,72,153,0.15)' : item.cardColor.includes('orange') ? 'rgba(251,146,60,0.15)' : item.cardColor.includes('teal') ? 'rgba(20,184,166,0.15)' : 'rgba(0,0,0,0.10)'}`
                }}
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute -inset-1 rounded-[2rem] pointer-events-none z-0"
                  animate={{
                    background: [
                      `conic-gradient(from 0deg at var(--x,50%) var(--y,50%), #fff 0deg, ${item.cardColor.split(' ')[0].replace('bg-','').replace('-100/70','')} 90deg, #fff 180deg, ${item.cardColor.split(' ')[0].replace('bg-','').replace('-100/70','')} 270deg, #fff 360deg)`
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ filter: 'blur(8px)', opacity: 0.7 }}
                />
                
                {/* Interactive particles */}
                <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="relative h-full rounded-[2rem] p-0.5 overflow-hidden transition-all duration-500">
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-[2rem]"></div>
                  <div className="relative h-full rounded-[2rem] p-6 sm:p-8 flex flex-col z-10">
                    <div className="flex items-start justify-between mb-6">
                      {/* Enhanced floating icon */}
                      <motion.div 
                        className={`p-4 rounded-2xl shadow-lg ${item.iconColor} text-white`}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      >
                        <item.icon size={28} className="text-white/90 drop-shadow-lg" />
                      </motion.div>
                      <span className={`text-xs font-bold px-4 py-2 rounded-full border shadow-md ${item.statsColor} transform group-hover:scale-105 transition-transform duration-300`}>
                        {item.statsText}
                      </span>
                    </div>
                    
                    {/* Enhanced typography */}
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-4 leading-tight transition-all duration-500 group-hover:translate-x-2 group-hover:scale-105 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed mb-6 flex-grow transition-all duration-500 group-hover:text-gray-900 font-medium group-hover:translate-x-2">
                      {item.content}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-200/50 flex items-center justify-between">
                      {/* Enhanced button with shine */}
                      <motion.button    
                        onClick={(e) => {
                          e.stopPropagation();
                          // console.log("Setting selectedQuestion with statsText:", item.statsText);
                          setSelectedQuestion(item);
                        }}
                        className="flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 px-5 py-2 rounded-xl hover:bg-blue-100/80 transition-all duration-500 group/readmore hover:shadow-lg relative overflow-hidden"
                        initial={{ x: 0 }}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <span>Read more</span>
                        <ArrowRight size={20} className="ml-2 mt-0.5 transition-transform group-hover/readmore:translate-x-4" />
                        {/* Enhanced shine effect */}
                        <motion.span
                          className="absolute left-0 top-0 h-full w-1/3 bg-white/60 blur-xl opacity-0 group-hover:opacity-100"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
                        />
                      </motion.button>
                      
                      {/* Enhanced emoji */}
                      <motion.span 
                        className="text-3xl opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500" 
                        role="img" 
                        aria-hidden="true"
                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.emoji}
                      </motion.span>
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
            <h3 className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto italic">
              Honing technical and soft skills as a YUVA Junior Council member.
            </h3>
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
                  { name: "WEB DEV Stacks", level: 80, color: "from-purple-500 to-indigo-600", icon: "📈" },
                  { name: "Google Sheets", level: 90, color: "from-green-500 to-green-600", icon: "📊" },
                  { name: "Git/Github", level: 80, color: "from-blue-500 to-cyan-500", icon: "🗄️" },
                  { name: "Ai&Automation Tools", level: 85, color: "from-orange-500 to-red-500", icon: "🔗" },
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
                  { name: "Leadership", icon: Award, color: "text-violet-400 bg-violet-700 border-violet-200", rating: 4 },
                  { name: "Teamwork", icon: Users, color: "text-fuchsia-400 bg-fuchsia-700 border-fuchsia-200", rating: 4 },
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
                { name: 'linkedin', icon: <Linkedin className="w-5 h-5" />, color: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700', glowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]', url: 'https://linkedin.com/in/abraham-samuel-e' },
                { name: 'github', icon: <Github className="w-5 h-5" />, color: 'from-gray-700 to-gray-800', hoverColor: 'hover:from-gray-800 hover:to-gray-900', glowColor: 'shadow-[0_0_15px_rgba(31,41,55,0.3)]', url: 'https://github.com/sam-verse' },
                { name: 'mail', icon: <Mail className="w-5 h-5" />, color: 'from-amber-400 to-amber-500', hoverColor: 'hover:from-amber-500 hover:to-amber-600', glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]', url: 'mailto:abrahamsamuel562004@gmail.com' },
                { name: 'instagram', icon: <Instagram className="w-5 h-5" />, color: 'from-pink-500 to-rose-500', hoverColor: 'hover:from-pink-600 hover:to-rose-600', glowColor: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]', url: 'https://instagram.com/abraham._.samuel' },
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
