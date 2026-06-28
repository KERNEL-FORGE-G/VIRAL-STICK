import React, { useEffect, useState, useRef } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const progressRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);
  const duration = 5000; // 5 seconds

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      progressRef.current = newProgress;
      
      // Force a re-render
      window.dispatchEvent(new CustomEvent('loadingProgress', { detail: newProgress }));
      
      if (newProgress >= 100) {
        if (onComplete) {
          onComplete();
        }
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete]);

  // Use local state for UI updates
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleProgressUpdate = (e) => {
      setProgress(e.detail);
    };
    
    window.addEventListener('loadingProgress', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('loadingProgress', handleProgressUpdate);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.flames}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            style={{
              ...styles.flame,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              width: `${20 + Math.random() * 40}px`,
              height: `${40 + Math.random() * 80}px`,
              bottom: `${Math.random() * 100}px`
            }} 
          />
        ))}
      </div>
      
      <div style={styles.logoContainer}>
        <img 
          src="/asset/logo/logo_sans_fond.png" 
          alt="Viral Stick Logo" 
          style={styles.logo}
        />
      </div>

      <div style={styles.progressContainer}>
        <div style={{
          ...styles.progressBar, 
          width: `${progress}%`,
          transition: 'width 0.016s linear' // 60fps
        }}/>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    overflow: 'hidden',
  },
  
  flames: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '300px',
  },
  
  flame: {
    position: 'absolute',
    background: 'linear-gradient(to top, #ff6b35, #f7c531, transparent)',
    borderRadius: '50% 50% 0 0',
    transformOrigin: 'bottom center',
    animation: 'flame 1s ease-in-out infinite alternate',
  },
  
  logoContainer: {
    zIndex: 10,
    marginBottom: '60px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  
  logo: {
    width: '200px',
    height: 'auto',
  },
  
  progressContainer: {
    width: '60%',
    maxWidth: '400px',
    height: '8px',
    backgroundColor: '#333333',
    borderRadius: '4px',
    overflow: 'hidden',
    zIndex: 10,
  },
  
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff6b35, #f7c531, #58cc02, #1cb0f6)',
    borderRadius: '4px',
  },
};

// Add animations via style tag
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes flame {
    0% { transform: scaleY(1) translateY(0); opacity: 1; }
    50% { transform: scaleY(1.3) translateY(-10px); opacity: 0.8; }
    100% { transform: scaleY(1.1) translateY(-5px); opacity: 0.7; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
if (!document.head.querySelector('style[data-loading-animations]')) {
  styleTag.setAttribute('data-loading-animations', 'true');
  document.head.appendChild(styleTag);
}

export default LoadingScreen;
