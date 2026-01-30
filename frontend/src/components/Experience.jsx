import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const experiences = [
  {
    date: 'Jan 2025',
    title: 'Volunteer',
    company: 'MAIR WINGS Program',
    description: [
      'Collaborated with a team to create and present informational sessions for high school students about careers in tech',
      'Inspired the next generation of developers through mentorship and guidance',
    ],
  },
  {
    date: 'Aug 2021 - May 2022',
    title: 'Pass Leader | Teaching Assistant',
    company: 'Normandale Community College — Bloomington, MN',
    description: [
      'Supported faculty and 30+ students weekly across classroom systems and online learning platforms',
      'Improved overall participation and efficiency during group activities',
    ],
  },
  {
    date: 'Oct 2020 - Apr 2021',
    title: 'Team Member',
    company: 'Normandale STEM Club — Minnesota Space Grant Consortium',
    description: [
      'Designed and implemented a microcontroller-based sensor system in C, optimizing memory and performance for embedded environments',
      'Built Python data pipelines enabling real-time data transfer between sensors.',
      'Collaborated with a 6-member engineering team on data collection, validation, and system integration',
    ],
  },
];

const education = [
  {
    degree: 'Master of Science, Computer Science',
    school: 'Metropolitan State University — Saint Paul, Minnesota',
    date: 'Expected May 2026',
    coursework: 'Web Development, Cloud Computing, Human-Centered Design',
  },
  {
    degree: 'Bachelor of Science, Computer Science',
    school: 'Metropolitan State University — Saint Paul, Minnesota',
    date: 'Graduated May 2024',
  },
];

export default function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Experience Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-mono text-sm text-accent-cyan block mb-4">
            // Career Path
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Work Experience
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="timeline-item relative pb-12"
            >
              <span className="font-mono text-sm text-accent-cyan block mb-2">
                {exp.date}
              </span>
              <h3 className="text-xl md:text-2xl font-semibold mb-1">
                {exp.title}
              </h3>
              <p className="text-text-secondary text-lg mb-4">{exp.company}</p>
              <ul className="space-y-2">
                {exp.description.map((item, i) => (
                  <li
                    key={i}
                    className="text-text-muted leading-relaxed pl-6 relative"
                  >
                    <span className="absolute left-0 text-accent-cyan">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24"
        >
          <span className="font-mono text-sm text-accent-cyan block mb-4">
            // Academic Background
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12">
            Education
          </h2>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-primary-card rounded-xl p-8 relative overflow-hidden"
              >
                {/* Left Border Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-cyan to-accent-blue" />

                <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                <p className="font-mono text-accent-cyan text-sm mb-1">
                  {edu.school}
                </p>
                <p className="text-text-muted text-sm mb-4">{edu.date}</p>
                {edu.coursework && (
                  <p className="text-text-secondary">
                    <span className="text-white font-medium">
                      Relevant Coursework:{' '}
                    </span>
                    {edu.coursework}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
