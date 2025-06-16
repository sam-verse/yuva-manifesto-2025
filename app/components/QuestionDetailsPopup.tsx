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
  statsColorClass,
}: QuestionDetailsPopupProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log("Stats prop in QuestionDetailsPopup:", stats);

  if (!isOpen) return null

  // Extract gradient colors for background
  const gradientColors = gradient.split(' ').filter(c => c.startsWith('from-') || c.startsWith('to-') || c.startsWith('via-'));
  const bgGradient = gradientColors.join(' ');
  const bgColor = gradientColors[0].replace('from-', 'bg-').split('-')[0];
  
  // Set scrollbar colors based on theme
  React.useEffect(() => {
    document.documentElement.style.setProperty('--scrollbar-track', `#f0f0f0`);
    document.documentElement.style.setProperty('--scrollbar-thumb', `#c0c0c0`);
    document.documentElement.style.setProperty('--scrollbar-thumb-hover', `#909090`);
  }, []);

  // Determine text color based on gradient
  const isDarkGradient = gradient.includes('gray-') || gradient.includes('blue-') || gradient.includes('indigo-') || gradient.includes('purple-');
  const textColor = isDarkGradient ? 'text-gray-900' : 'text-gray-900'; // Keep text dark for professionalism
  const borderColor = isDarkGradient ? 'border-gray-200' : 'border-gray-200'; // Consistent border
  const iconBgColor = isDarkGradient ? 'bg-gray-100' : 'bg-gray-100'; // Consistent light icon background
  
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Subtle radial gradient animation */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4">
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl w-[85%] sm:w-[90%] md:w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[94vh] sm:max-h-[95vh] flex flex-col overflow-hidden border border-gray-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
                    <div className="flex items-center gap-4">
                      <div className={`${statsColorClass} text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-full border shadow-md`}>
                        <span className="text-white">
                          {stats}
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
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 md:space-y-4 bg-white/90 rounded-b-xl sm:rounded-b-2xl">
                {/* Summary */}
                <motion.div 
                  className={`bg-white rounded-lg p-2.5 sm:p-3 md:p-4 border border-gray-200 shadow-sm relative overflow-hidden`}
                  whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="relative flex items-center mb-2 sm:mb-2.5">
                    <div 
                      className={`w-1 h-3 rounded-full ${bgGradient.split(' ')[0].replace('from-', 'bg-')} mr-1.5 flex-shrink-0`}
                    />
                    <h3 className={`text-xs sm:text-sm font-semibold text-gray-800`}>Summary</h3>
                  </div>
                  <div className={`max-w-none pl-2.5`}>
                    <p className={`leading-relaxed text-xs sm:text-sm text-gray-700`}>{content}</p>
                  </div>
                </motion.div>

                {/* Detailed Content */}
                <motion.div 
                  className={`bg-white rounded-lg p-2.5 sm:p-3 md:p-4 border border-gray-200 shadow-sm relative overflow-hidden`}
                  whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="relative flex items-center mb-2 sm:mb-2.5">
                    <div 
                      className={`w-1 h-3 rounded-full ${bgGradient.split(' ')[0].replace('from-', 'bg-')} mr-1.5 flex-shrink-0`}
                    />
                    <h3 className={`text-xs sm:text-sm font-semibold text-gray-800`}>Detailed Insights</h3>
                  </div>
                  <div className={`max-w-none pl-2.5`}>
                    <div className="space-y-1.5 sm:space-y-2">
                      {(details || content).split('\n\n').map((paragraph, i) => (
                        <p 
                          key={i} 
                          className={`leading-relaxed text-xs sm:text-sm text-gray-700`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Image Preview Popup */}
                <AnimatePresence>
                  {selectedImage && (
                    <motion.div
                      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleClosePreview}
                    >
                      <motion.div
                        className="relative w-full h-full flex items-center justify-center p-1.5 sm:p-2 md:p-4"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close Button */}
                        <motion.button
                          onClick={handleClosePreview}
                          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 text-red/90 hover:text-white active:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg backdrop-blur-sm transition-colors z-50 touch-manipulation"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X size={16} />
                        </motion.button>

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                          <>
                            <motion.button
                              onClick={handlePrevImage}
                              className="absolute left-1.5 sm:left-2 p-1.5 text-white/90 hover:text-white active:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg backdrop-blur-sm transition-colors z-50 touch-manipulation"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ChevronLeft size={16} />
                            </motion.button>
                            <motion.button
                              onClick={handleNextImage}
                              className="absolute right-1.5 sm:right-2 p-1.5 text-white/90 hover:text-white active:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg backdrop-blur-sm transition-colors z-50 touch-manipulation"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ChevronRight size={16} />
                            </motion.button>
                          </>
                        )}

                        {/* Image */}
                        <div className="relative w-full max-w-[95%] sm:max-w-2xl h-[50vh] sm:h-[60vh] rounded-lg overflow-hidden border border-gray-300">
                          <Image
                            src={selectedImage}
                            alt={`${title} ${currentImageIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[10px] sm:text-xs z-50">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gallery */}
                {images && images.length > 0 && (
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-center">
                      <div 
                        className={`w-1 h-3 rounded-full ${bgGradient.split(' ')[0].replace('from-', 'bg-')} mr-1.5 flex-shrink-0`}
                      />
                      <h3 className={`text-xs sm:text-sm font-semibold text-gray-800`}>Gallery</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                      {images.map((img, i) => (
                        <motion.div 
                          key={i} 
                          className={`relative aspect-[3/2] rounded-lg overflow-hidden bg-white group border border-gray-200 shadow-sm cursor-pointer transition-transform duration-200 hover:scale-[1.01] hover:shadow-md active:scale-[0.99] touch-manipulation`}
                          onClick={() => handleImageClick(img, i)}
                          whileHover={{ scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Image
                            src={img}
                            alt={`${title} ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.05]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={i < 2}
                          />
                          <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5 sm:p-2`}>
                            <span className={`text-white text-[10px] sm:text-xs font-medium bg-black/50 px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm`}>
                              Image {i + 1}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`border-t border-gray-200 p-2.5 sm:p-3 md:p-4 bg-gray-50 overflow-hidden rounded-b-xl sm:rounded-b-2xl`}>
                <div className="relative flex justify-end">
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
