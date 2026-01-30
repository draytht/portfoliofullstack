import { useState, useEffect } from 'react';

const loadingStates = ['INITIALIZING', 'LOADING ASSETS', 'COMPILING', 'READY'];

export default function Loader({ onComplete }) {
  const [currentState, setCurrentState] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => {
        if (prev < loadingStates.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 400);

    const hideTimer = setTimeout(() => {
      setIsHidden(true);
      if (onComplete) onComplete();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  return (
    <div className={`loader ${isHidden ? 'hidden' : ''}`}>
      <span className="loader-text font-mono text-2xl text-accent-cyan">
        {loadingStates[currentState]}
      </span>
      <span className="font-mono text-sm text-text-muted mt-4">
        Loading portfolio...
      </span>
    </div>
  );
}
