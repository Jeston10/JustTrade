'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Zap, 
  Eye, 
  Target,
  Globe,
  Smartphone,
  Database,
  Cpu,
  Lock,
  Activity
} from 'lucide-react';

const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Market Data",
      description: "Get instant access to live market data, stock prices, and trading volumes from global exchanges with millisecond precision.",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-400/10 to-emerald-500/10",
      borderColor: "border-green-400/20"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive technical analysis tools, custom indicators, and AI-powered market insights to make informed decisions.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-400/10 to-cyan-500/10",
      borderColor: "border-blue-400/20"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Military-grade encryption, two-factor authentication, and secure cloud infrastructure to protect your investments.",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-400/10 to-pink-500/10",
      borderColor: "border-purple-400/20"
    },
    {
      icon: Zap,
      title: "Lightning Fast Execution",
      description: "Ultra-low latency trading with direct market access and advanced order routing for optimal execution speeds.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-400/10 to-orange-500/10",
      borderColor: "border-yellow-400/20"
    },
    {
      icon: Eye,
      title: "Portfolio Tracking",
      description: "Monitor your investments with real-time portfolio analytics, performance metrics, and risk assessment tools.",
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-400/10 to-purple-500/10",
      borderColor: "border-indigo-400/20"
    },
    {
      icon: Target,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms analyze market patterns and provide personalized trading recommendations and alerts.",
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-400/10 to-pink-500/10",
      borderColor: "border-red-400/20"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Modern Traders
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to succeed in today's fast-paced financial markets
          </p>
        </motion.div>

        <div className="relative">
          {/* Main Feature Card */}
          <div className="relative h-96 mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -45 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className={`h-full bg-gradient-to-br ${features[currentIndex].bgColor} rounded-3xl border ${features[currentIndex].borderColor} backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center"></div>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${features[currentIndex].color} flex items-center justify-center mb-6 relative z-10`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {React.createElement(features[currentIndex].icon, { className: "w-10 h-10 text-white" })}
                  </motion.div>

                  {/* Content */}
                  <motion.h3
                    className="text-3xl font-bold text-white mb-4 relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {features[currentIndex].title}
                  </motion.h3>
                  
                  <motion.p
                    className="text-lg text-gray-300 max-w-2xl relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {features[currentIndex].description}
                  </motion.p>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl"
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
                    className="absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full blur-xl"
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
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-gray-600/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-gray-600/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mb-12">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-yellow-400 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={feature.title}
                onClick={() => goToSlide(index)}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  index === currentIndex
                    ? `${feature.bgColor} ${feature.borderColor} border-2`
                    : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 mx-auto`}>
                  {React.createElement(feature.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h4 className="text-sm font-semibold text-white text-center">
                  {feature.title}
                </h4>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCarousel;
