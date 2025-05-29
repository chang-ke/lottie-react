"use client";
import { useEffect, useRef, useState } from "react";

// We'll import lottie-web directly here since it's a dependency of lottie-react
declare const lottie: any;

export default function LottieWebPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [properties, setProperties] = useState<{
    name?: string;
    totalFrames?: number;
    frameRate?: number;
    duration?: number;
    isPaused?: boolean;
    renderer?: string;
    direction?: number;
    speed?: number;
  }>({});

  useEffect(() => {
    // Dynamically import lottie-web to avoid SSR issues
    const loadLottie = async () => {
      const lottieWeb = await import('lottie-web');
      
      if (containerRef.current) {
        // Clear any existing animation
        if (animationRef.current) {
          animationRef.current.destroy();
        }

        // Create new animation
        animationRef.current = lottieWeb.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/assets/groovyWalk.json' // We'll need to add this to public folder
        });

        // Set up event listeners to track properties
        animationRef.current.addEventListener('config_ready', () => {
          const anim = animationRef.current;
          setTotalFrames(anim.totalFrames);
          setProperties({
            name: anim.name || 'Untitled',
            totalFrames: anim.totalFrames,
            frameRate: anim.frameRate,
            duration: anim.getDuration(),
            isPaused: anim.isPaused,
            renderer: anim.renderer?.rendererType || 'svg',
            direction: anim.playDirection,
            speed: anim.playSpeed
          });
        });

        animationRef.current.addEventListener('enterFrame', () => {
          setCurrentFrame(Math.round(animationRef.current.currentFrame));
        });

        animationRef.current.addEventListener('complete', () => {
          console.log('Animation completed');
        });
      }
    };

    loadLottie();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (animationRef.current) {
      if (isPlaying) {
        animationRef.current.pause();
      } else {
        animationRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const setSpeed = (speed: number) => {
    if (animationRef.current) {
      animationRef.current.setSpeed(speed);
      setProperties(prev => ({ ...prev, speed }));
    }
  };

  const goToFrame = (frame: number) => {
    if (animationRef.current) {
      animationRef.current.goToAndStop(frame, true);
      setCurrentFrame(frame);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#28a745' }}>🎬 Lottie Web (Raw Implementation)</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
        This page demonstrates direct usage of lottie-web library. Use this as a baseline 
        to understand the underlying behavior and properties.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Animation Display */}
        <div>
          <h2>Animation Display</h2>
          <div 
            ref={containerRef}
            style={{ 
              width: '400px', 
              height: '400px', 
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}
          />
          
          {/* Controls */}
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={togglePlayPause}
              style={{
                padding: '0.5rem 1rem',
                marginRight: '0.5rem',
                backgroundColor: isPlaying ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            
            <button 
              onClick={() => setSpeed(0.5)}
              style={{ padding: '0.5rem', marginRight: '0.5rem', cursor: 'pointer' }}
            >
              0.5x
            </button>
            <button 
              onClick={() => setSpeed(1)}
              style={{ padding: '0.5rem', marginRight: '0.5rem', cursor: 'pointer' }}
            >
              1x
            </button>
            <button 
              onClick={() => setSpeed(2)}
              style={{ padding: '0.5rem', marginRight: '0.5rem', cursor: 'pointer' }}
            >
              2x
            </button>
          </div>

          {/* Frame Scrubber */}
          <div style={{ marginTop: '1rem' }}>
            <label>Frame: {currentFrame} / {totalFrames}</label>
            <input
              type="range"
              min="0"
              max={totalFrames}
              value={currentFrame}
              onChange={(e) => goToFrame(parseInt(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </div>
        </div>

        {/* Properties Panel */}
        <div>
          <h2>Animation Properties</h2>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(properties, null, 2)}
            </pre>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Raw lottie-web API Examples:</h3>
          <div style={{ 
            backgroundColor: '#f1f3f4', 
            padding: '1rem', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.8rem'
          }}>
            <p><strong>Load Animation:</strong></p>
            <code>
              {`lottie.loadAnimation({
  container: element,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'animation.json'
})`}
            </code>
            
            <p style={{ marginTop: '1rem' }}><strong>Control Methods:</strong></p>
            <code>
              {`animation.play()
animation.pause()
animation.stop()
animation.setSpeed(speed)
animation.goToAndStop(frame, isFrame)
animation.goToAndPlay(frame, isFrame)`}
            </code>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '3rem', 
        padding: '1rem', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '4px',
        border: '1px solid #b3d9ff'
      }}>
        <h3>🔍 What to observe:</h3>
        <ul>
          <li><strong>Performance:</strong> Monitor frame rate and smoothness</li>
          <li><strong>Memory Usage:</strong> Check browser dev tools</li>
          <li><strong>API Surface:</strong> Note the available properties and methods</li>
          <li><strong>Events:</strong> See console for animation events</li>
        </ul>
      </div>
    </div>
  );
}