'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap } from 'lucide-react';

const CallToAction = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    "Real-time market data",
    "Advanced analytics",
    "AI-powered insights",
    "Bank-grade security",
    "24/7 customer support",
    "Mobile & desktop access"
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0F0F0F] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main Content */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Transform
              </span>{' '}
              Your Trading?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join thousands of successful traders who have already made the switch to JustTrade. 
              Start your free trial today and experience the future of trading.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ delay: index * 0.1 }}
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>


          {/* Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-semibold">No Credit Card Required</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Setup in 2 Minutes</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </div>
    </section>
  );
};

export default CallToAction;
