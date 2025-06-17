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
  experienced
}: QuestionDetailsPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const bgColor = statsColorClass.split('-')[1];
  const bgGradient = `bg-gradient-to-br from-${bgColor}-500 to-${bgColor}-600`;
  const lightBgGradient = `bg-gradient-to-br from-${bgColor}-50 to-${bgColor}-100`;
  const borderColor = `border-${bgColor}-200`;
  const textColor = `text-${bgColor}-700`;
  const hoverColor = `hover:bg-${bgColor}-100`;

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
              className={`relative w-full max-w-3xl max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border ${borderColor}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`relative ${bgGradient} p-8 sm:p-9 md:p-10 text-white border-b border-${bgColor}-400/30 overflow-hidden rounded-t-xl sm:rounded-t-2xl`}>
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
                      <h2 className="text-base sm:text-lg md:text-xl font-bold leading-tight pr-2 break-words text-white">
                        {title}
                      </h2>
                    </div>
                    <motion.button
                      onClick={onClose}
                      className="p-3.5 text-white hover:text-white transition-colors bg-white/40 hover:bg-white/60 active:bg-white/70 rounded-full backdrop-blur-lg border border-white/50 shadow-sm"
                      whileHover={{ scale: 1.05, rotate: 45 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close"
                    >
                      <X size={10} />
                    </motion.button>
                  </div>

                  {/* Stats and Emoji Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${statsColorClass} bg-white/20 text-[10px] sm:text-xs font-bold px-5 sm:px-4 py-1 sm:py-2 rounded-full border shadow-md max-w-[calc(100vw-120px)] overflow-hidden text-ellipsis`}>
                        <span className="text-white">
                          {stats}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">2 min read</span>
                      </div>
                    </div>
                    <span className="text-xl sm:text-2xl md:text-3xl">
                      {emoji}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
                {/* Stats Section */}
                <div className={`${lightBgGradient} border-b ${borderColor} p-6 sm:p-7 md:p-8`}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border ${borderColor} shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className={`w-4 h-4 ${textColor}`} />
                        <span className={`text-xs font-medium ${textColor}`}>Experience</span>
                      </div>
                      <p className={`text-lg font-bold ${textColor}`}>5+ Years</p>
                    </div>
                    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border ${borderColor} shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className={`w-4 h-4 ${textColor}`} />
                        <span className={`text-xs font-medium ${textColor}`}>Team Size</span>
                      </div>
                      <p className={`text-lg font-bold ${textColor}`}>10+ Members</p>
                    </div>
                    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border ${borderColor} shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className={`w-4 h-4 ${textColor}`} />
                        <span className={`text-xs font-medium ${textColor}`}>Success Rate</span>
                      </div>
                      <p className={`text-lg font-bold ${textColor}`}>98%</p>
                    </div>
                    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border ${borderColor} shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className={`w-4 h-4 ${textColor}`} />
                        <span className={`text-xs font-medium ${textColor}`}>Duration</span>
                      </div>
                      <p className={`text-lg font-bold ${textColor}`}>2 Years</p>
                    </div>
                  </div>
                </div>

                {/* Overview Section */}
                <div className={`bg-white border-b ${borderColor}`}>
                  <div className="p-6 sm:p-7 md:p-8">
                    <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                      Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {content}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                {details && (
                  <div className={`bg-white border-b ${borderColor}`}>
                    <div className="p-6 sm:p-7 md:p-8">
                      <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                        Details
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {details}
                      </p>
                    </div>
                  </div>
                )}

                {/* Experience Timeline */}
                {experienced && (
                  <div className={`bg-white border-b ${borderColor}`}>
                    <div className="p-6 sm:p-7 md:p-8">
                      <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-8 flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                        Experience Timeline
                      </h3>
                      <div className="relative">
                        {/* Timeline items */}
                        <div className="space-y-8">
                          {details.split('\n').map((line, index) => (
                            <div key={index} className="relative group">
                              {/* Connection line with gradient and glow effect */}
                              {index < details.split('\n').length - 1 && (
                                <div className="absolute left-6 top-12 bottom-0 w-[2px]">
                                  <div className={`absolute inset-0 bg-gradient-to-b from-${bgColor}-500/80 via-${bgColor}-400/80 to-${bgColor}-300/80 rounded-full`}></div>
                                  <div className={`absolute inset-0 bg-gradient-to-b from-${bgColor}-500/20 via-${bgColor}-400/20 to-${bgColor}-300/20 blur-[1px] rounded-full`}></div>
                                </div>
                              )}
                              
                              {/* Content card */}
                              <div className="relative flex items-start gap-4">
                                {/* Icon circle with glow effect */}
                                <div className="relative z-10 flex-shrink-0">
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-${bgColor}-500 to-${bgColor}-600 flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300 relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                                    <span className="text-sm font-bold text-white relative z-10">{index + 1}</span>
                                  </div>
                                  {/* Glow effect */}
                                  <div className={`absolute inset-0 w-10 h-10 rounded-full bg-${bgColor}-500/20 blur-[2px] group-hover:blur-[3px] transition-all duration-300`}></div>
                                </div>
                                
                                {/* Content */}
                                <div className={`flex-1 bg-gradient-to-r from-${bgColor}-500/5 to-${bgColor}-600/5 rounded-xl p-4 sm:p-5 shadow-sm border ${borderColor} group-hover:shadow-md transition-all duration-300`}>
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
                )}

                {/* Image Gallery */}
                {images && images.length > 0 && (
                  <div className={`bg-white border-b ${borderColor}`}>
                    <div className="p-6 sm:p-7 md:p-8">
                      <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-6 flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-${bgColor}-500`}></span>
                        Gallery
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                            <Image
                              src={image}
                              alt={`${title} - Image ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-medium text-sm bg-black/50 px-3 py-1.5 rounded-full">
                                View {index + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`bg-${bgColor}-50 border-t ${borderColor} p-4 sm:p-5 flex justify-end`}>
                <motion.button
                  onClick={onClose}
                  className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-${bgColor}-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-${bgColor}-700 active:bg-${bgColor}-800 transition-colors shadow-md flex items-center group relative overflow-hidden touch-manipulation`}
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