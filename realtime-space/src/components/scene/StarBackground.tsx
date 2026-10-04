// src/components/scene/StarField.tsx
import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // depth, controls speed + size (parallax)
  radius: number;
}

interface StarBackgroundProps {
  starCount?: number;
  speed?: number; // pixels per frame at closest depth
}

export function StarBackground({ starCount = 400, speed = 0.15 }: StarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1 + 0.2, // depth 0.2–1.2
      radius: Math.random() * 1.2 + 0.3,
    }));

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#000010';
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        // slow drift, deeper stars move slower (parallax)
        star.x += speed * star.z;
        if (star.x > width) star.x = 0;

        // gentle twinkle
        const twinkle = 0.6 + Math.sin(Date.now() * 0.002 + star.x) * 0.4;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        display: 'block',
      }}
    />
  );
}