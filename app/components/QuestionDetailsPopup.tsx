"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Custom scrollbar styles for better visibility
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
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
}

export default function QuestionDetailsPopup({
  isOpen,
  onClose,
  title,
  content,
  stats,
  gradient,
  emoji,
  details,
  images = [],
  icon,
}: QuestionDetailsPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null

  // Extract gradient colors for background
  const gradientColors = gradient.split(' ').filter(c => c.startsWith('from-') || c.startsWith('to-') || c.startsWith('via-'));
  const bgGradient = gradientColors.join(' ');
  const bgColor = gradientColors[0].replace('from-', 'bg-').split('-')[0];
  
  // Determine text color based on gradient
  const isDarkGradient = gradient.includes('gray-') || gradient.includes('blue-') || gradient.includes('indigo-') || gradient.includes('purple-');
  const textColor = isDarkGradient ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkGradient ? 'border-white/20' : 'border-gray-200';
  const iconBgColor = isDarkGradient ? 'bg-white/20' : 'bg-white/80';
  
  const handleImageClick = (img: string, index: number) => {
    setSelectedImage(img);
    setCurrentImageIndex(index);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const handleClosePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-pink-600/40"
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.1, 1],
                rotate: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/60"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              className="bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-white/20"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`relative ${bgGradient} p-4 sm:p-5 ${textColor} border-b ${borderColor} overflow-hidden`}>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br from-${bgColor}-200/40 via-${bgColor}-100/20 to-transparent`}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className={`absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-transparent via-${bgColor}-200/30 to-transparent`}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="relative flex flex-col space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <motion.h2 
                        className="text-lg sm:text-xl font-bold leading-tight drop-shadow-lg pr-2 break-words bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {title}
                      </motion.h2>
                    </div>
                    <motion.button
                      onClick={onClose}
                      className={`p-2 -m-2 ${isDarkGradient ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-all ${isDarkGradient ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'} rounded-xl backdrop-blur-sm touch-manipulation`}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close"
                    >
                      <X size={18} className="w-4.5 h-4.5" />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.span 
                      className={`${isDarkGradient ? 'bg-black/20' : 'bg-black/10'} backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium ${isDarkGradient ? 'border border-white/20' : 'border-black/10'} flex items-center shadow-md`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {stats}
                    </motion.span>
                    {icon && (
                      <motion.div 
                        className={`${iconBgColor} w-7 h-7 rounded-xl flex items-center justify-center shadow-md backdrop-blur-md`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {React.createElement(icon, { className: `w-3.5 h-3.5 ${textColor}` })}
                      </motion.div>
                    )}
                    <motion.span 
                      className="text-lg sm:text-xl drop-shadow-md ml-auto"
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut"
                      }}
                    >
                      {emoji}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 sm:space-y-5 bg-gradient-to-b from-white/95 to-white/90">
                {/* Summary */}
                <motion.div 
                  className={`bg-gradient-to-br from-${bgColor}-50/80 to-white/90 rounded-xl p-4 border border-${bgColor}-100/50 shadow-md backdrop-blur-sm relative overflow-hidden`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-${bgColor}-200/30 to-transparent`}
                    animate={{
                      opacity: [0.2, 0.3, 0.2],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className={`absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-transparent via-${bgColor}-200/20 to-transparent`}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <div className="relative flex items-center mb-3">
                    <motion.div 
                      className={`w-1.5 h-5 rounded-full bg-gradient-to-b from-${bgColor}-500 to-${bgColor}-400 mr-2.5 flex-shrink-0`}
                      animate={{ height: [20, 24, 20] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <h3 className={`text-sm font-semibold text-${bgColor}-800`}>Summary</h3>
                  </div>
                  <div className={`prose prose-sm max-w-none text-${bgColor}-900/90 pl-3.5`}>
                    <p className="leading-relaxed text-sm">{content}</p>
                  </div>
                </motion.div>

                {/* Detailed Content */}
                <motion.div 
                  className={`bg-gradient-to-br from-${bgColor}-50/60 to-white/90 backdrop-blur-sm rounded-xl p-4 border border-${bgColor}-100/50 shadow-md relative overflow-hidden`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-${bgColor}-200/30 to-transparent`}
                    animate={{
                      opacity: [0.2, 0.3, 0.2],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className={`absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-transparent via-${bgColor}-200/20 to-transparent`}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <div className="relative flex items-center mb-3">
                    <motion.div 
                      className={`w-1.5 h-5 rounded-full bg-gradient-to-b from-${bgColor}-500 to-${bgColor}-400 mr-2.5 flex-shrink-0`}
                      animate={{ height: [20, 24, 20] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <h3 className={`text-sm font-semibold text-${bgColor}-800`}>Detailed Insights</h3>
                  </div>
                  <div className={`prose prose-sm max-w-none text-${bgColor}-900/90 pl-3.5`}>
                    <div className="space-y-3">
                      {(details || content).split('\n\n').map((paragraph, i) => (
                        <motion.p 
                          key={i} 
                          className="leading-relaxed text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Image Preview Popup */}
                <AnimatePresence>
                  {selectedImage && (
                    <motion.div
                      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleClosePreview}
                    >
                      <motion.div
                        className="relative w-full h-full flex items-center justify-center p-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close Button */}
                        <motion.button
                          onClick={handleClosePreview}
                          className="absolute top-4 right-4 p-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all z-50"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X size={24} />
                        </motion.button>

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                          <>
                            <motion.button
                              onClick={handlePrevImage}
                              className="absolute left-4 p-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all z-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ChevronLeft size={24} />
                            </motion.button>
                            <motion.button
                              onClick={handleNextImage}
                              className="absolute right-4 p-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all z-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ChevronRight size={24} />
                            </motion.button>
                          </>
                        )}

                        {/* Image */}
                        <div className="relative w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden">
                          <Image
                            src={selectedImage}
                            alt={`${title} ${currentImageIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm z-50">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gallery */}
                {images && images.length > 0 && (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className={`w-1.5 h-5 rounded-full bg-gradient-to-b from-${bgColor}-500 to-${bgColor}-400 mr-2.5 flex-shrink-0`}
                        animate={{ height: [20, 24, 20] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <h3 className={`text-sm font-semibold text-${bgColor}-800`}>Gallery</h3>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                      {images.map((img, i) => (
                        <motion.div 
                          key={i} 
                          className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-${bgColor}-50/80 to-white/90 group border border-${bgColor}-100/50 shadow-md cursor-pointer`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: `0 15px 30px -10px ${isDarkGradient ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
                            transition: { type: 'spring', stiffness: 300, damping: 20 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleImageClick(img, i)}
                        >
                          <Image
                            src={img}
                            alt={`${title} ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, 25vw"
                            priority={i < 2}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-${bgColor}-900/60 via-${bgColor}-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3`}>
                            <span className={`text-white text-xs font-medium bg-gradient-to-r ${gradient} backdrop-blur-md px-3 py-1.5 rounded-full shadow-md`}>
                              Image {i + 1}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className={`border-t ${borderColor} p-4 bg-${bgColor}-50/50 backdrop-blur-sm relative overflow-hidden`}>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br from-${bgColor}-200/30 to-transparent`}
                  animate={{
                    opacity: [0.2, 0.3, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className={`absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-transparent via-${bgColor}-200/20 to-transparent`}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="relative flex justify-end">
                  <motion.button
                    onClick={onClose}
                    className={`px-5 py-2 bg-gradient-to-r ${gradient} text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-lg flex items-center group touch-manipulation relative overflow-hidden`}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: `0 8px 20px -4px ${isDarkGradient ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`,
                      transition: { type: 'spring', stiffness: 300, damping: 20 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                    <span>Close</span>
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <X size={16} className="w-4 h-4" />
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
