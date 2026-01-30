import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const skillCategories = [
  {
    title: 'Programming Languages',
    gradient: 'gradient-1',
    skills: ['Python', 'JavaScript', 'Java', 'C/C++', 'SQL', 'PHP', 'HTML/CSS'],
  },
  {
    title: 'Frontend & Frameworks',
    gradient: 'gradient-2',
    skills: ['React', 'Node.js', 'Flask', 'REST APIs', 'Responsive Design'],
  },
  {
    title: 'Cloud & DevOps',
    gradient: 'gradient-3',
    skills: ['AWS Lambda', 'AWS Amplify', 'API Gateway', 'Git', 'Jenkins', 'Docker'],
  },
  {
    title: 'AI & Data',
    gradient: 'gradient-4',
    skills: ['OpenAI API', 'Machine Learning', 'Data Analysis', 'Generative AI', 'Postman'],
  },
  {
    title: 'UX/UI Design',
    gradient: 'gradient-1',
    skills: ['Figma', 'User Research', 'Usability Testing', 'Wireframing', 'Prototyping'],
  },
  {
    title: 'Systems & Tools',
    gradient: 'gradient-2',
    skills: ['Linux', 'Windows', 'macOS', 'VS Code', 'Agile/Scrum'],
  },
];

export default function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-mono text-sm text-accent-cyan block mb-4">
            // My Arsenal
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Skills & Technologies
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`skill-card ${category.gradient}`}
            >
              <h3 className="font-mono text-accent-cyan mb-6 flex items-center gap-2">
                <span className="text-text-muted">&gt;</span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded font-mono text-sm text-text-secondary hover:bg-accent-cyan/10 hover:border-accent-cyan hover:text-accent-cyan transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
