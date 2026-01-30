import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, PlayCircle, Calendar, Clock } from 'lucide-react';

const blogs = [
  {
    title: 'Modern Web Performance in 2026',
    excerpt: 'Exploring the latest trends in Vite and React Server Components...',
    type: 'article',
    date: 'Jan 28, 2026',
    readTime: '5 min read',
    content: 'Full article text goes here...',
    thumbnail: 'from-[#740A03] to-[#280905]', // Using your palette
    link: '#'
  },
  {
    title: 'Deep Learning with Python - Video Tutorial',
    excerpt: 'A walk-through of my Music Generation neural network project.',
    type: 'video',
    date: 'Jan 25, 2026',
    videoUrl: 'https://youtube.com/your-video-link',
    thumbnail: 'from-[#E6501B] to-[#C3110C]',
    link: '#'
  }
];

export default function Blogs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="blog" className="py-24 bg-[#280905]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16"
        >
          <span className="font-mono text-sm text-[#E6501B] block mb-4">// Insights & Tutorials</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Latest Posts</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="group bg-[#740A03]/20 border border-[#740A03] rounded-xl overflow-hidden hover:border-[#E6501B] transition-all"
            >
              {/* Thumbnail Area */}
              <div className={`h-48 bg-gradient-to-br ${post.thumbnail} flex items-center justify-center relative`}>
                {post.type === 'video' ? <PlayCircle size={48} className="text-white opacity-80" /> : <BookOpen size={48} className="text-white opacity-80" />}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded text-xs text-white">
                  {post.type.toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-[#E6501B] mb-3 font-mono">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {post.date}</span>
                  {post.type === 'article' && <span className="flex items-center gap-1"><Clock size={14}/> {post.readTime}</span>}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E6501B] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{post.excerpt}</p>
                <a href={post.link} className="text-sm font-bold text-white uppercase tracking-widest border-b-2 border-[#E6501B] pb-1 hover:bg-[#E6501B] hover:text-white transition-all">
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}