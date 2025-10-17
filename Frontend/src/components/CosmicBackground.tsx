import { useEffect, useRef } from 'react';

export const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Star layers for parallax
    const stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    // Nebula particles
    const nebula: Array<{ x: number; y: number; radius: number; color: string; speed: number }> = [];
    for (let i = 0; i < 30; i++) {
      nebula.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 50,
        color: Math.random() > 0.5 ? 'rgba(147, 51, 234, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        speed: Math.random() * 0.2 + 0.05,
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = 'hsl(250, 60%, 8%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula with parallax
      nebula.forEach((n) => {
        const offsetX = (mouseX - canvas.width / 2) * n.speed * 0.05;
        const offsetY = (mouseY - canvas.height / 2) * n.speed * 0.05;

        const gradient = ctx.createRadialGradient(
          n.x + offsetX,
          n.y + offsetY,
          0,
          n.x + offsetX,
          n.y + offsetY,
          n.radius
        );
        gradient.addColorStop(0, n.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        n.y -= n.speed;
        if (n.y + n.radius < 0) n.y = canvas.height + n.radius;
      });

      // Draw stars with parallax
      stars.forEach((star) => {
        const offsetX = (mouseX - canvas.width / 2) * star.speed * 0.02;
        const offsetY = (mouseY - canvas.height / 2) * star.speed * 0.02;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow to brighter stars
        if (star.opacity > 0.8) {
          ctx.fillStyle = `rgba(59, 130, 246, ${star.opacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(star.x + offsetX, star.y + offsetY, star.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        star.y += star.speed * 0.5;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ filter: 'blur(1px)' }}
    />
  );
};
