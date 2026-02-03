import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from './components/Loader';
import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { wakeUpServer } from './services/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wake up the Render server on page load
    wakeUpServer();
  }, []);

  return (
    <>
      {/* Loader */}
      <Loader onComplete={() => setIsLoading(false)} />

      {/* Cursor Glow Effect */}
      <CursorGlow />

      {/* Main Content */}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
