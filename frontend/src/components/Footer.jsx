export default function Footer() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <p className="font-mono text-sm text-text-muted">
          Made with <span className="text-accent-red">♥</span> by Dat Thanh Tran.
          © {new Date().getFullYear()}
        </p>
        <p className="font-mono text-xs text-text-muted mt-2">
          Built with MERN Stack & Vite
        </p>
      </div>
    </footer>
  );
}
