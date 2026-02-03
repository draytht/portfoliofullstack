import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#contact', label: 'Contact' },
  { href: '/blog', label: 'Blog', isRoute: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href) => {
    setIsMenuOpen(false);
    
    // Handle hash links on home page
    if (href.startsWith('/#') && location.pathname === '/') {
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled
          ? 'bg-primary/95 backdrop-blur-xl py-4'
          : 'bg-gradient-to-b from-primary to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-mono text-xl font-bold gradient-text">
          &lt;ThanhTran/&gt;
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.isRoute ? (
                <Link
                  to={link.href}
                  className={`nav-link font-mono text-sm transition-colors group ${
                    location.pathname === link.href 
                      ? 'text-accent-cyan' 
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  <span className="text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                    //
                  </span>
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="nav-link font-mono text-sm text-text-secondary hover:text-white transition-colors group"
                >
                  <span className="text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                    //
                  </span>
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 bg-primary flex flex-col items-center justify-center gap-8 transition-all duration-400 md:hidden ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-mono text-xl text-text-secondary hover:text-accent-cyan transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="font-mono text-xl text-text-secondary hover:text-accent-cyan transition-colors"
              >
                {link.label}
              </a>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}
