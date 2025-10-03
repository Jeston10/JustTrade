'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Globe, Shield, Zap } from 'lucide-react';

const StatsSection = () => {
  const [counts, setCounts] = useState({
    traders: 0,
    volume: 0,
    uptime: 0,
    markets: 0,
    security: 0,
    speed: 0
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const stats = [
    {
      icon: Users,
      value: 25000,
      suffix: '+',
      label: 'Active Traders',
      color: 'from-blue-400 to-cyan-500',
      description: 'Growing community of professional traders'
    },
    {
      icon: DollarSign,
      value: 2.5,
      suffix: 'B+',
      prefix: '$',
      label: 'Volume Traded',
      color: 'from-green-400 to-emerald-500',
      description: 'Total trading volume processed'
    },
    {
      icon: Shield,
      value: 99.9,
      suffix: '%',
      label: 'Uptime',
      color: 'from-purple-400 to-pink-500',
      description: 'Reliable platform availability'
    },
    {
      icon: Globe,
      value: 50,
      suffix: '+',
      label: 'Global Markets',
      color: 'from-yellow-400 to-orange-500',
      description: 'Markets and exchanges covered'
    },
    {
      icon: Shield,
      value: 256,
      suffix: '-bit',
      label: 'Encryption',
      color: 'from-indigo-400 to-purple-500',
      description: 'Bank-grade security standard'
    },
    {
      icon: Zap,
      value: 0.1,
      suffix: 'ms',
      label: 'Latency',
      color: 'from-red-400 to-pink-500',
      description: 'Ultra-low latency execution'
    }
  ];

  const animateCount = (target: number, key: string, duration: number = 2000) => {
    const startTime = Date.now();
    const startValue = counts[key as keyof typeof counts];
    
    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (target - startValue) * easeOutCubic;
      
      setCounts(prev => ({ ...prev, [key]: currentValue }));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        setTimeout(() => {
          animateCount(stat.value, Object.keys(counts)[index], 2000);
        }, index * 200);
      });
    }
  }, [isInView]);

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

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0F0F0F] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
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
            Trusted by{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the community of successful traders who trust JustTrade for their investment needs
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group relative"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center"></div>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 relative z-10`}>
                  {React.createElement(stat.icon, { className: "w-8 h-8 text-white" })}
                </div>

                {/* Animated Counter */}
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.prefix}
                    {stat.value === 0.1 ? '0.1' : 
                     stat.value === 2.5 ? '2.5' :
                     stat.value === 99.9 ? '99.9' :
                     stat.value === 256 ? '256' :
                     Math.floor(counts[Object.keys(counts)[index] as keyof typeof counts])}
                    {stat.suffix}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {stat.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default StatsSection;
