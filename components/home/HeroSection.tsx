'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Shield, Zap } from 'lucide-react';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              Trade Smarter with{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                JustTrade
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Professional-grade trading platform with real-time market data, 
              advanced analytics, and AI-powered insights for modern investors.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: TrendingUp, text: "Real-time Data", color: "from-green-400 to-emerald-500" },
              { icon: BarChart3, text: "Advanced Analytics", color: "from-blue-400 to-cyan-500" },
              { icon: Shield, text: "Secure Trading", color: "from-purple-400 to-pink-500" },
              { icon: Zap, text: "Lightning Fast", color: "from-yellow-400 to-orange-500" }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 border border-white/10 backdrop-blur-sm`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <feature.icon className="w-4 h-4 text-white" />
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>


          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "10K+", label: "Active Traders" },
              { number: "$2.5B+", label: "Volume Traded" },
              { number: "99.9%", label: "Uptime" },
              { number: "50+", label: "Markets" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
