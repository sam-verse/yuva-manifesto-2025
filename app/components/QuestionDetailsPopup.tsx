"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Custom scrollbar styles for better visibility
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px; /* Slightly thinner scrollbar */
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f0f0f0; /* Lighter track */
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c0c0c0; /* Softer thumb */
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #909090; /* Gentle hover */
  }
`

interface QuestionDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  stats: string
  gradient: string
  emoji: string
  details: string
  images?: string[]
  icon?: React.ComponentType<{ className?: string }>
  statsColorClass: string;
  experienced: string;
}

export default function QuestionDetailsPopup({
  isOpen,
  onClose,
  title,
  stats,
  emoji,
  icon,
  statsColorClass,
  experienced,
}: QuestionDetailsPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const bgColor = statsColorClass.split('-')[1];
  const bgGradient = `bg-gradient-to-br from-${bgColor}-500 to-${bgColor}-600`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`relative ${bgGradient} p-8 sm:p-9 md:p-10 text-white border-b border-gray-300 overflow-hidden rounded-t-xl sm:rounded-t-2xl`}>
                {/* Subtle header background animation */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br from-${bgColor}-500/20 to-transparent`}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative flex flex-col space-y-5 sm:space-y-6">
                  {/* Title and Close Button */}
                  <div className="flex justify-between items-center gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <h2 
                        className={`text-base sm:text-lg md:text-xl font-bold leading-tight pr-2 break-words text-white`}
                      >
                        {title}
                      </h2>
                    </div>
                    <motion.button
                      onClick={onClose}
                      className={`p-3.5 text-white hover:text-white transition-colors bg-white/40 hover:bg-white/60 active:bg-white/70 rounded-full backdrop-blur-lg border border-white/50 shadow-sm`}
                      whileHover={{ scale: 1.05, rotate: 45 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close"
                    >
                      <X size={10} />
                    </motion.button>
                  </div>

                  {/* Stats and Emoji Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-400 text-[10px] sm:text-xs font-bold px-5 sm:px-4 py-1 sm:py-2 rounded-full border shadow-md max-w-[calc(100vw-120px)] overflow-hidden text-ellipsis">
                        <span className="text-black">
                          {stats || "DEBUG: NO STATS"}
                        </span>
                      </div>
                      {icon && (
                        <div className={`${statsColorClass} w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border shadow-md`}>
                          {React.createElement(icon, { className: "w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" })}
                        </div>
                      )}
                    </div>
                    <span className="text-xl sm:text-2xl md:text-3xl">
                      {emoji}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* My Career Path Section */}
                <div className="bg-white border-b border-gray-200">
                  <div className="p-6 sm:p-7 md:p-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-8">
                      My Career Path
                    </h3>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2"></div>
                      
                      {/* Timeline items */}
                      <div className="space-y-12">
                        {/* 2023 */}
                        <div className="relative">
                          <div className="flex items-center">
                            <div className="w-1/2 pr-8 text-right">
                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 sm:p-5 shadow-lg transform hover:scale-105 transition-transform duration-200">
                                <h4 className="text-sm sm:text-base font-semibold text-white mb-2">Senior Software Engineer</h4>
                                <p className="text-sm text-white/90">Leading development of enterprise applications and mentoring junior developers.</p>
                              </div>
                            </div>
                            <div className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                              <span className="text-xs font-bold text-white">2023</span>
                            </div>
                            <div className="w-1/2 pl-8"></div>
                          </div>
                        </div>

                        {/* 2021 */}
                        <div className="relative">
                          <div className="flex items-center">
                            <div className="w-1/2 pr-8"></div>
                            <div className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                              <span className="text-xs font-bold text-white">2021</span>
                            </div>
                            <div className="w-1/2 pl-8">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 sm:p-5 shadow-lg transform hover:scale-105 transition-transform duration-200">
                                <h4 className="text-sm sm:text-base font-semibold text-white mb-2">Software Engineer</h4>
                                <p className="text-sm text-white/90">Full-stack development and implementation of scalable solutions.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2019 */}
                        <div className="relative">
                          <div className="flex items-center">
                            <div className="w-1/2 pr-8 text-right">
                              <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-4 sm:p-5 shadow-lg transform hover:scale-105 transition-transform duration-200">
                                <h4 className="text-sm sm:text-base font-semibold text-white mb-2">Junior Developer</h4>
                                <p className="text-sm text-white/90">Started career in software development, focusing on frontend technologies.</p>
                              </div>
                            </div>
                            <div className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                              <span className="text-xs font-bold text-white">2019</span>
                            </div>
                            <div className="w-1/2 pl-8"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experienced Section */}
                <div className="bg-white border-b border-gray-200">
                  <div className="p-6 sm:p-7 md:p-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-8">
                      Experienced
                    </h3>
                    <div className="relative">
                      {/* Timeline items */}
                      <div className="space-y-8">
                        {experienced.split('\n').map((line, index) => (
                          <div key={index} className="relative group">
                            {/* Connection line with gradient and glow effect */}
                            {index < experienced.split('\n').length - 1 && (
                              <div className="absolute left-6 top-12 bottom-0 w-[2px]">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/80 via-purple-500/80 to-pink-500/80 rounded-full"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-[1px] rounded-full"></div>
                              </div>
                            )}
                            
                            {/* Content card */}
                            <div className="relative flex items-start gap-4">
                              {/* Icon circle with glow effect */}
                              <div className="relative z-10 flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                                  index % 3 === 0 ? 'from-blue-500 to-purple-500' : 
                                  index % 3 === 1 ? 'from-purple-500 to-pink-500' : 
                                  'from-pink-500 to-red-500'
                                } flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300 relative`}>
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                                  <span className="text-sm font-bold text-white relative z-10">{index + 1}</span>
                                </div>
                                {/* Glow effect */}
                                <div className={`absolute inset-0 w-10 h-10 rounded-full ${
                                  index % 3 === 0 ? 'bg-blue-500/20' : 
                                  index % 3 === 1 ? 'bg-purple-500/20' : 
                                  'bg-pink-500/20'
                                } blur-[2px] group-hover:blur-[3px] transition-all duration-300`}></div>
                              </div>
                              
                              {/* Content */}
                              <div className={`flex-1 bg-gradient-to-r ${
                                index % 3 === 0 ? 'from-blue-500/5 to-purple-500/5' : 
                                index % 3 === 1 ? 'from-purple-500/5 to-pink-500/5' : 
                                'from-pink-500/5 to-red-500/5'
                              } rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300`}>
                                <div className="text-gray-800">
                                  {line}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-5 flex justify-end">
                <motion.button
                  onClick={onClose}
                  className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-800 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-700 active:bg-gray-600 transition-colors shadow-md flex items-center group relative overflow-hidden touch-manipulation`}
                  whileHover={{ scale: 1.01, boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span>Close Details</span>
                  <span className="ml-1.5">
                    <X size={14} className="w-3.5 h-3.5" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}