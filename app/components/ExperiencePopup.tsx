"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, Maximize2, Minimize2, Image as ImageIcon, Building2, ZoomIn, ZoomOut, X as CloseIcon } from "lucide-react";
import { wrap } from "framer-motion";
import Image from "next/image";
import { ExperienceItem } from "../types";

interface ExperiencePopupProps {
  experience: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExperiencePopup({ experience, isOpen, onClose }: ExperiencePopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle close with animation
  const handleClose = useCallback(() => {
    onClose();
    setCurrentImageIndex(0);
    setIsFullscreen(false);
  }, [onClose]);

  // Navigation functions with wrap for infinite loop
  const imageCount = experience?.images?.length || 0;
  
  const nextImage = useCallback(() => {
    if (!experience?.images) return;
    setImageIndex(prev => (prev + 1) % imageCount);
  }, [experience, imageCount]);

  const prevImage = useCallback(() => {
    if (!experience?.images) return;
    setImageIndex(prev => (prev - 1 + imageCount) % imageCount);
  }, [experience, imageCount]);
  
  const goToImage = useCallback((index: number) => {
    setImageIndex(index);
  }, []);
  
  const openLightbox = useCallback((index: number) => {
    setImageIndex(index);
    setViewerIsOpen(true);
    setIsZoomed(false);
  }, []);
  
  const closeLightbox = useCallback(() => {
    setViewerIsOpen(false);
    setIsZoomed(false);
  }, []);
  
  // Handle keyboard navigation in lightbox
  useEffect(() => {
    if (!viewerIsOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'z' || e.key === 'Z') {
        setIsZoomed(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerIsOpen, nextImage, prevImage, closeLightbox]);

  // Handle click outside to close
  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isFullscreen && !viewerIsOpen) {
      handleClose();
    }
  }, [handleClose, isFullscreen, viewerIsOpen]);

  // Handle keyboard events for the main popup
  useEffect(() => {
    if (!isOpen || viewerIsOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          handleClose();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(!isFullscreen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, isFullscreen, viewerIsOpen]);

  // Set mounted state and handle body scroll
  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Don't render on server or if not open
  if (!isMounted || !isOpen || !experience) return null;

  // Render the lightbox
  const renderLightbox = () => (
    <AnimatePresence>
      {viewerIsOpen && experience?.images && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
          
          {/* Zoom button */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          >
            {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
          </button>
          
          {/* Main image */}
          <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center">
            <motion.div
              className="relative w-full h-full max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {experience.images[imageIndex] && (
                <Image
                  src={experience.images[imageIndex]}
                  alt={`${experience.title} - Image ${imageIndex + 1}`}
                  fill
                  className={`object-contain ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  priority
                />
              )}
            </motion.div>
            
            {/* Navigation arrows */}
            {experience.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Thumbnails */}
            {experience.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {experience.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === imageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {experience.images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto transition-all duration-300 ${isFullscreen ? 'p-0' : ''}`}
        onClick={handleClickOutside}
        style={{ 
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          width: isFullscreen ? '100%' : '100%',
          maxWidth: isFullscreen ? '100%' : 'min(90vw, 90rem)',
          height: isFullscreen ? '100%' : 'auto',
          maxHeight: isFullscreen ? '100%' : '90vh'
        }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 350,
          mass: 0.5
        }}
        className={`relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col border border-white/20 backdrop-blur-sm ${isFullscreen ? 'rounded-none' : 'my-8'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className={`flex items-center justify-between p-5 border-b ${isFullscreen ? 'border-gray-800' : 'border-gray-100/50'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                {experience.title}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{experience.company}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50"
              aria-label={isFullscreen ? 'Minimize' : 'Maximize'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button> */}
            <button
              onClick={handleClose}
              className="p-2.5 rounded-xl bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100 hover:border-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`flex ${isFullscreen ? 'h-[calc(100%-76px)]' : 'max-h-[70vh]'}`}>
          {/* Main Content */}
          <div className={`overflow-y-auto flex-1 p-6 ${isFullscreen ? 'w-1/2' : 'w-full'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{experience.company}</p>
                    <p className="text-sm text-blue-600 font-medium">{experience.date}</p>
                  </div>
                </div>
                {experience.tags && experience.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {experience.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-white text-blue-700 rounded-full border border-blue-100 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {experience.links?.github && (
                  <a
                    href={experience.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-900 text-gray-700 hover:text-white rounded-lg border border-gray-200 hover:border-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label="View on GitHub"
                  >
                    <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                )}
                {experience.links?.live && (
                  <a
                    href={experience.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg border border-blue-500/20 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    aria-label="View live project"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Gallery Section */}
              {experience.images && experience.images.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center">
                    <div className="h-0.5 w-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      Gallery
                    </h3>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-3"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {experience.images.map((image, index) => (
                      <motion.div
                        key={index}
                        ref={el => {
                          if (el) {
                            imageRefs.current[index] = el;
                          }
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3,
                          delay: 0.2 + (index * 0.05)
                        }}
                        whileHover={{ scale: 1.02, zIndex: 1 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(index)}
                      >
                        {image && (
                          <Image
                            src={image}
                            alt={`${experience.title} - Image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/50 p-6 rounded-xl border border-gray-100 shadow-sm backdrop-blur-sm"
              >
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center">
                  <span className="w-4 h-0.5 bg-blue-400 mr-2"></span>
                  About the Project
                </h3>
                <p className="text-gray-700 leading-relaxed">{experience.description}</p>
              </motion.div>
              
              {experience.highlights && experience.highlights.length > 0 && (
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center"
                  >
                    <div className="h-0.5 w-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      Key Highlights
                    </h3>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-3"></div>
                  </motion.div>
                  <ul className="space-y-3">
                    {experience.highlights.map((highlight, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <span className="flex-shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium mr-2">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                          {highlight}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.skills && experience.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-1.5 h-5 bg-purple-500 rounded-full mr-2"></span>
                    Skills Learned
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, idx) => (
                      <motion.span 
                        key={idx}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-100 hover:shadow-sm transition-all"
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          {experience.images && experience.images.length > 0 && (
            <div className={`relative ${isFullscreen ? 'w-1/2' : 'hidden'} bg-gray-900 flex flex-col`}>
              <div className="flex-1 relative overflow-hidden">
                <Image
                  src={experience.images[currentImageIndex]}
                  alt={`${experience.title} - ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
                
                {/* Navigation Arrows */}
                {experience.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              <div className="h-24 bg-gray-900 border-t border-gray-800 p-2 overflow-x-auto">
                <div className="flex space-x-2 h-full">
                  {experience.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-full aspect-video rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-gray-600'}`}
                    >
                      <div className="w-full h-full relative">
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Image Counter */}
              {experience.images.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {experience.images.length}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
    {renderLightbox()}
    </>
  );
}
