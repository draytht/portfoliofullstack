import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Background Effects */}
      <div className="hero-bg" />
      <div className="hero-grid" />

      {/* Content */}
      <div className="text-center z-10 max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-mono text-accent-cyan block mb-6"
        >
          # Hello, Guys!
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
        >
          I'm <span className="gradient-text">Thanh Dat Tran</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-xl md:text-2xl text-text-secondary font-light mb-4"
        >
          Software Developer | <span className="text-accent-red">Full-Stack</span> Enthusiast
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-text-muted max-w-2xl mx-auto mb-10"
        >
          MS Computer Science candidate crafting responsive applications with Python, 
          JavaScript, React, Node.js, and cloud technologies. Passionate about building 
          elegant solutions and great user experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#projects" className="btn-primary">
            View My Work →
          </a>
          <a href="#contact" className="btn-secondary">
            Get In Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-text-muted uppercase tracking-widest">
          Scroll
        </span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
}
