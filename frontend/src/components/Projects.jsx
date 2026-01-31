import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink, Play } from 'lucide-react';
import danceGif from '../assets/2.gif';
import yogaGif from '../assets/3.gif';


const projects = [
  {
    title: 'mespace — Digital Wellness App',
    description:
      'A UX/UI case study featuring a responsive, mobile-first interface for digital wellness. Conducted user research and usability testing, iterating on layouts and interaction flows.',
    tags: ['Figma', 'UX/UI', 'Prototyping'],
    icon: <img src={yogaGif} alt="Meditation" className="w-20 h-20"/>,
    gradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    links: { demo: 'https://www.figma.com/proto/TIcINfP03e3LMl6nBeeRge/DumpSpace?node-id=0-1&t=k8Q0gcNJyH3yehjM-1' },
  },
  {
    title: 'Cloud-Based To-Do List',
    description:
      'Full-stack web application with responsive frontend and AWS cloud backend. Implemented secure APIs using Lambda, API Gateway, and Amplify for scalable data operations.',
    tags: ['JavaScript', 'Python', 'AWS', 'APIs', 'DynamoDB', 'HTML/CSS'],
    icon: '📋☁️',
    gradient: 'from-[#2d132c] via-[#801336] to-[#c72c41]',
    links: { github: 'https://github.com/draytht/todolist-Cloud-Based-Web-Application' },
  },
  {
    title: 'Music Creation with Deep Learning',
    description:
      'Developed and trained a Python-based neural network to generate musical sequences. Applied data preprocessing, model tuning, and statistical evaluation to enhance prediction accuracy.',
    tags: ['Python', 'Deep Learning', 'Neural Networks'],
    icon: '🎶',
    gradient: 'from-[#0a3d62] via-[#38ada9] to-[#78e08f]',
    links: { github: 'https://github.com/draytht/Music-Generation-with-Deep-Learning' },
  },
  {
    title: 'Web Application for Dances',
    description:
      'Built a responsive web application using JavaScript and backend APIs. Integrated third-party APIs for dynamic, real-time features with accessible, responsive UI components.',
    tags: ['PHP', 'HTML/CSS', 'APIs','JQuery tables', 'Open API'],
    icon: <img src={danceGif} alt="Chicken Dancing" className="w-20 h-20"/>,
    gradient: 'from-[#2c2c54] via-[#474787] to-[#706fd3]',
    links: { github: 'https://github.com/draytht/tandana' },
  },

  {
    title: 'Car Hub Shop',
    description:
      "CarHub attempts to solve this problem with an easy-to-use application in which sellers can list their vehicles and buyers can browse those listings. The listings include relevant information about the vehicle and the seller's contact information, so they can then get in contact with each other directly, and the sale of the vehicle can be conducted on their own terms. Sellers can get their vehicles in front of potential buyers, and buyers can avoid the used car lot grind. Created using Java, JavaFX/FXML/CSS, and MySQL.",
    tags: ['Grad;e', 'HTML/CSS', 'JavaFx', 'MySQL', 'Java'],
    icon: '🚗',
    gradient: 'from-[#2c2c54] via-[#474787] to-[#706fd3]',
    links: { github: 'https://github.com/draytht/Car-Hub-Shop' },
  },
  
  {
    title: 'Quadcopter Sensor Suite',
    description:
      'Engineered a microcontroller-based sensor system for the Minnesota Space Grant Consortium. Built Python data pipelines for real-time sensor-to-cloud communication using REST APIs.',
    tags: ['C', 'Python', 'Arduino', 'Auto CAD', '3d printing'],
    icon: '🚁',
    gradient: 'from-[#1e3799] via-[#0c2461] to-[#0a3d62]',
    links: {},
  },
];

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="py-24 md:py-32 bg-primary-light">
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
            // Featured Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Selected Projects
          </h2>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="project-card group"
            >
              {/* Project Image/Icon */}
              <div className="h-56 relative overflow-hidden flex items-center justify-center">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-80`}
                />
                <span className="text-6xl z-10 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {project.icon}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-card to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-3 py-1 bg-accent-cyan/10 text-accent-cyan rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex gap-6">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-text-muted hover:text-accent-cyan transition-colors flex items-center gap-2"
                    >
                      <Github size={18} />
                      GitHub
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-text-muted hover:text-accent-cyan transition-colors flex items-center gap-2"
                    >
                      <ExternalLink size={18} />
                      View Prototype
                    </a>
                  )}
                  {Object.keys(project.links).length === 0 && (
                    <span className="font-mono text-sm text-text-muted flex items-center gap-2">
                      <Play size={18} />
                      Team Project
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
