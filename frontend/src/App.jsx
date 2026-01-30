import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a25',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#00ffaa',
              secondary: '#1a1a25',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#1a1a25',
            },
          },
        }}
      />

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
