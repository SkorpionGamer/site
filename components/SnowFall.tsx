import React, { useEffect, useRef } from 'react';

interface SnowProps {
  density?: number;
  speed?: number;
}

const SnowFall: React.FC<SnowProps> = ({ density = 100, speed = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; r: number; d: number }[] = [];

    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1, // radius
        d: Math.random() * density, // density factor for movement
      });
    }

    let animationFrameId: number;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();

      for (let i = 0; i < density; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    const update = () => {
      // Significantly slower change in wind direction
      angle += 0.001; 
      
      for (let i = 0; i < density; i++) {
        const p = particles[i];
        // Movement
        // Vertical fall with slight variation based on particle density factor
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        
        // Horizontal sway: reduced amplitude and slower frequency due to angle increment change
        p.x += Math.sin(angle) * 0.5;

        // Reset if out of view
        if (p.x > width + 5 || p.x < -5 || p.y > height) {
          if (i % 3 > 0) {
            particles[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d };
          } else {
            // If the flake exits from the right
            if (Math.sin(angle) > 0) {
              particles[i] = { x: -5, y: Math.random() * height, r: p.r, d: p.d };
            } else {
              particles[i] = { x: width + 5, y: Math.random() * height, r: p.r, d: p.d };
            }
          }
        }
      }
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      // Lower z-index so it sits behind the main content (which will be z-20)
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
};

export default SnowFall;