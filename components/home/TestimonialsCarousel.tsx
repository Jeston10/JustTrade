'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Portfolio Manager",
      company: "Goldman Sachs",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "JustTrade has revolutionized how I manage my portfolio. The real-time analytics and AI insights have helped me increase my returns by 40% this year alone.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      name: "Michael Rodriguez",
      role: "Day Trader",
      company: "Independent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The lightning-fast execution and advanced charting tools are unmatched. I've been able to catch opportunities I would have missed with other platforms.",
      color: "from-green-400 to-emerald-500"
    },
    {
      name: "Emily Watson",
      role: "Investment Analyst",
      company: "BlackRock",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The security features and compliance tools give me confidence when handling large trades. It's the most secure platform I've used in my 10-year career.",
      color: "from-purple-400 to-pink-500"
    },
    {
      name: "David Kim",
      role: "Hedge Fund Manager",
      company: "Bridgewater Associates",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The AI-powered market analysis has given us a significant edge. We've seen a 25% improvement in our trading strategies since switching to JustTrade.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      name: "Lisa Thompson",
      role: "Quantitative Analyst",
      company: "Renaissance Technologies",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The API integration and data feeds are incredibly reliable. We can process millions of data points in real-time without any latency issues.",
      color: "from-indigo-400 to-purple-500"
    },
    {
      name: "James Wilson",
      role: "Retail Investor",
      company: "Self-Employed",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "As a retail investor, JustTrade has leveled the playing field for me. The professional-grade tools are accessible and easy to use.",
      color: "from-red-400 to-pink-500"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            What Our{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Traders Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from the professionals who trust JustTrade
          </p>
        </motion.div>

        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="relative h-96 mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: -15 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className={`h-full bg-gradient-to-br ${testimonials[currentIndex].color} bg-opacity-10 rounded-3xl border border-white/10 backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center"></div>
                  </div>

                  {/* Quote Icon */}
                  <motion.div
                    className="absolute top-8 left-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    <Quote className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="relative z-10 max-w-4xl"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
                      "{testimonials[currentIndex].content}"
                    </p>

                    {/* Rating */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-center gap-4">
                      <motion.div
                        className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={testimonials[currentIndex].avatar}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="text-left">
                        <h4 className="text-xl font-bold text-white">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-gray-300">
                          {testimonials[currentIndex].role}
                        </p>
                        <p className="text-sm text-gray-400">
                          {testimonials[currentIndex].company}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-gray-600/50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-gray-600/50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mb-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-purple-400 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Testimonial Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.name}
                onClick={() => goToTestimonial(index)}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  index === currentIndex
                    ? `bg-gradient-to-r ${testimonial.color} bg-opacity-20 border-white/20`
                    : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 mb-3 mx-auto">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-semibold text-white text-center mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-gray-400 text-center">
                  {testimonial.role}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
