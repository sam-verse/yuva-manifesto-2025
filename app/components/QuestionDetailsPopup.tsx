"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Award, Clock, Users, Star } from "lucide-react"
import Image from "next/image"

// Custom scrollbar styles for better visibility
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #909090;
  }
`

interface QuestionDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  details: string
  stats: string
  gradient: string
  emoji: string
  images: string[]
  statsColorClass: string
  experienced: boolean
  bgColor?: string
}

export default function QuestionDetailsPopup({
  isOpen,
  onClose,
  title,
  content,
  details,
  stats,
  gradient,
  emoji,
  images,
  statsColorClass,
  experienced,
  bgColor = 'blue'
}: QuestionDetailsPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  console.log("QuestionDetailsPopup - bgColor:", bgColor);

  // Enhanced color system with proper opacity and gradients
  const colorSystem = {
    header: {
      bg: `bg-gradient-to-br from-${bgColor}-600 to-${bgColor}-700`,
      border: `border-${bgColor}-400/30`,
      text: 'text-white'
    },
    content: {
      bg: `bg-gradient-to-br from-${bgColor}-50 to-${bgColor}-100`,
      border: `border-${bgColor}-200`,
      text: `text-${bgColor}-800`
    },
    card: {
      bg: `bg-gradient-to-br from-${bgColor}-500/10 to-${bgColor}-600/10`,
      border: `border-${bgColor}-200`,
      hover: `hover:bg-${bgColor}-100/50`
    },
    button: {
      bg: `bg-gradient-to-r from-${bgColor}-500 to-${bgColor}-600`,
      hover: `hover:from-${bgColor}-600 hover:to-${bgColor}-700`,
      text: 'text-white'
    },
    stats: {
      bg: `bg-${bgColor}-500/20`,
      text: `text-${bgColor}-700`,
      border: `border-${bgColor}-200`
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border ${colorSystem.content.border}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`relative p-4 sm:p-6 md:p-8 text-white border-b ${colorSystem.header.border} overflow-hidden rounded-t-xl sm:rounded-t-2xl ${
                bgColor === 'amber' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                bgColor === 'teal' ? 'bg-gradient-to-br from-teal-500 to-teal-600' :
                bgColor === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' :
                bgColor === 'rose' ? 'bg-gradient-to-br from-rose-500 to-rose-600' :
                bgColor === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                bgColor === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                bgColor === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                bgColor === 'pink' ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
                bgColor === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}>
                {/* Enhanced header background animation */}
                <motion.div
                  className={`absolute inset-0 ${
                    bgColor === 'amber' ? 'bg-amber-400/30' :
                    bgColor === 'teal' ? 'bg-teal-400/30' :
                    bgColor === 'indigo' ? 'bg-indigo-400/30' :
                    bgColor === 'rose' ? 'bg-rose-400/30' :
                    bgColor === 'blue' ? 'bg-blue-400/30' :
                    bgColor === 'green' ? 'bg-green-400/30' :
                    bgColor === 'purple' ? 'bg-purple-400/30' :
                    bgColor === 'pink' ? 'bg-pink-400/30' :
                    bgColor === 'orange' ? 'bg-orange-400/30' :
                    'bg-blue-400/30'
                  } to-transparent`}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative flex flex-col space-y-4 sm:space-y-5">
                  {/* Title and Close Button */}
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight pr-2 break-words text-white">
                        {title}
                      </h2>
                    </div>
                    <motion.button
                      onClick={onClose}
                      className="fixed top-4 right-4 z-[100] p-3 text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close"
                    >
                      <X size={18} className="w-4.5 h-4.5 text-white" />
                    </motion.button>
                  </div>

                  {/* Stats and Emoji Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {/* <div className="flex items-center gap-1.5 text-white/90">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">2 min read</span>
                      </div> */}
                    </div>
                    <span className="text-2xl sm:text-3xl md:text-4xl">
                      {emoji}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)] custom-scrollbar">
                {/* Stats Section */}
                <div className={`bg-white border-b ${colorSystem.content.border} p-4 sm:p-6 md:p-8`}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { icon: Award, label: "Experience", value: "5+ Years" },
                      { icon: Users, label: "Team Size", value: "10+ Members" },
                      { icon: Star, label: "Success Rate", value: "98%" },
                      { icon: Clock, label: "Duration", value: "2 Years" }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-gradient-to-br from-${bgColor}-500/10 to-${bgColor}-600/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border ${colorSystem.card.border} shadow-md hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${bgColor}-600`} />
                          <span className={`text-sm font-medium text-${bgColor}-700`}>{stat.label}</span>
                        </div>
                        <p className={`text-base sm:text-lg font-bold text-${bgColor}-700`}>{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Overview Section */}
                <div className={`bg-white border-b ${colorSystem.content.border}`}>
                  <div className="p-4 sm:p-6 md:p-8">
                    <h3 className={`text-base sm:text-lg font-semibold text-${bgColor}-700 mb-4 flex items-center gap-2`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                      Overview
                    </h3>
                    <p className={`text-${bgColor}-800 leading-relaxed text-sm sm:text-base`}>
                      {content}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                {details && (
                  <div className={`bg-white border-b ${colorSystem.content.border}`}>
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className={`text-base sm:text-lg font-semibold text-${bgColor}-700 mb-4 flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                        Details
                      </h3>
                      <p className={`text-${bgColor}-800 leading-relaxed text-sm sm:text-base`}>
                        {details}
                      </p>
                    </div>
                  </div>
                )}

                {/* Experience Timeline */}
                {experienced && (
                  <div className={`bg-white border-b ${colorSystem.content.border}`}>
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className={`text-base sm:text-lg font-semibold text-${bgColor}-700 mb-6 sm:mb-8 flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                        Experience Timeline
                      </h3>
                      <div className="relative">
                        <div className="space-y-6 sm:space-y-8">
                          {details.split('\n').map((line, index) => (
                            <motion.div 
                              key={index} 
                              className="relative group"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {index < details.split('\n').length - 1 && (
                                <div className="absolute left-4 sm:left-6 top-10 sm:top-12 bottom-0 w-[2px]">
                                  <div className={`absolute inset-0 bg-gradient-to-b from-${bgColor}-500/80 via-${bgColor}-400/80 to-${bgColor}-300/80 rounded-full`}></div>
                                  <div className={`absolute inset-0 bg-gradient-to-b from-${bgColor}-500/20 via-${bgColor}-400/20 to-${bgColor}-300/20 blur-[1px] rounded-full`}></div>
                                </div>
                              )}
                              
                              <div className="relative flex items-start gap-3 sm:gap-4">
                                <div className="relative z-10 flex-shrink-0">
                                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-${bgColor}-500 to-${bgColor}-600 flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                                    <span className="text-xs sm:text-sm font-bold text-white relative z-10">{index + 1}</span>
                                  </div>
                                  <div className={`absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-${bgColor}-500/30 blur-[3px] group-hover:blur-[4px] transition-all duration-300`}></div>
                                </div>
                                
                                <motion.div 
                                  whileHover={{ scale: 1.01 }}
                                  className={`flex-1 bg-gradient-to-br from-${bgColor}-500/10 to-${bgColor}-600/10 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border ${colorSystem.card.border} group-hover:shadow-lg transition-all duration-300`}
                                >
                                  <div className={`text-${bgColor}-800 text-sm sm:text-base`}>
                                    {line}
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Gallery */}
                {images && images.length > 0 && (
                  <div className={`bg-white border-b ${colorSystem.content.border}`}>
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className={`text-base sm:text-lg font-semibold text-${bgColor}-700 mb-4 sm:mb-6 flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                        Gallery
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {images.map((image, index) => (
                          <motion.div 
                            key={index} 
                            className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Image
                              src={image}
                              alt={`${title} - Image ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 sm:p-4">
                              <span className="text-white font-medium text-xs sm:text-sm bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                                View {index + 1}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`bg-white border-t ${colorSystem.content.border} p-3 sm:p-4 flex justify-end`}>
                <motion.button
                  onClick={onClose}
                  className={`bg-gradient-to-r from-${bgColor}-500 to-${bgColor}-600 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 hover:shadow-lg active:shadow-inner transition-all duration-300 flex items-center gap-1.5`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Close Details</span>
                  <X size={14} className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}