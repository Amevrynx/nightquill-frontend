import React, { useEffect, useRef } from 'react';

const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speedX: number;
      speedY: number;
    }[] = [];

    const PARTICLE_COUNT = 45;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
          p.x,
          p.y,
          0,
          p.x,
        );
        gradient.addColorStop(0, `rgba(35, 25, 15, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(35, 25, 15, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // movement
        p.x += p.speedX;
        p.y += p.speedY;

        // gentle drifting
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        opacity: 0.25,
      }}
    />
  );
};

export default BackgroundParticles;
