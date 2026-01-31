import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// ✅ Import the GIF properly - this works in both dev and production
import charizardGif from '../assets/1.gif';

const stats = [
  { number: '8+', label: 'Projects Built' },
  { number: '5+', label: 'Research Papers' },
  { number: '1', label: 'Master Thesis' },
  { number: '2024', label: 'BA Graduation' },
  { number: '2026', label: 'MS Graduation' },
];

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" className="py-24 md:py-32 bg-primary-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Placeholder */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative">
              <div className="relative">
                {/* Border Decoration - Scaled down slightly for mobile */}
                <div className="absolute inset-0 border-2 border-accent-cyan rounded-lg translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 -z-10" />
                
                {/* Responsive GIF Container */}
                {/* 'aspect-video' or 'aspect-square' keeps it proportional on all screens */}
                <div className="w-full aspect-video md:aspect-[4/3] lg:aspect-square bg-gradient-to-br from-primary-card to-primary rounded-lg flex items-center justify-center relative overflow-hidden shadow-2xl">
                  
                  {/* Glow Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-accent-cyan/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-accent-purple/20 rounded-full blur-[100px]" />
                  </div>
                  
                  {/* ✅ The GIF - using imported variable */}
                  <img 
                    src={charizardGif} 
                    alt="Charizard Landing" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono text-sm text-accent-cyan block mb-4">
              // About Me
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              Building digital experiences with purpose
            </h2>

            <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
              <p>
                I'm an aspiring software developer currently pursuing my{' '}
                <span className="text-accent-cyan font-medium">
                  Master's in Computer Science
                </span>{' '}
                at Metropolitan State University. With a strong foundation in 
                full-stack development, I specialize in creating responsive, 
                user-centered applications.
              </p>
              <p>
                My experience spans from supporting 30+ students as a Teaching 
                Assistant. I thrive in collaborative environments and love turning complex 
                problems into elegant solutions.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, 
                working with AI/ML tools, or contributing to community tech 
                education through programs like MAIR WINGS.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <span className="text-3xl md:text-4xl font-extrabold gradient-text block">
                    {stat.number}
                  </span>
                  <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}