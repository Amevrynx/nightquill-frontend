import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const InkFlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const location = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // 12 layered ink strings
    const waves = Array.from({ length: 10 }, (_, i) => ({
      amp: 50 + Math.random() * 60,
      freq: 0.0009 + Math.random() * 0.0008,
      speed: 0.15 + Math.random() * 0.35,
      thickness: 1.0 + Math.random() * 2.5,
      color: `rgba(40, 30, 20, ${0.20 + Math.random() * 0.2})`,
      offset: Math.random() * 20000,
    }));

    let time = 0;
    let revealProgress = 0;
    let scrollFactor = 0;

    const draw = () => {
      // parchment base
      const gradientBg = ctx.createLinearGradient(0, 0, 0, height);
      gradientBg.addColorStop(0, "#f5f3ee");
      gradientBg.addColorStop(1, "#f1ede6");
      ctx.fillStyle = gradientBg;
      ctx.fillRect(0, 0, width, height);

      // smooth mouse tracking
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      // scroll-based ink tension
      const tension = 1 + scrollFactor * 0.0015;

      // left-to-right reveal
      if (revealProgress < width) revealProgress += width * 0.012;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, revealProgress, height);
      ctx.clip();

      // occupy 80% of the screen vertically
      const bandHeight = height * 0.8;
      const topMargin = (height - bandHeight) / 2;

      // draw all waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        const baseY =
          topMargin +
          bandHeight / 2 +
          Math.sin(time * 0.25 + index) * (15 + index * 2);

        for (let x = 0; x <= width; x += 2) {
          const y =
            baseY +
            Math.sin((x * wave.freq + time * wave.speed + wave.offset) * tension) *
              wave.amp +
            Math.sin(x * 0.001 + time * 0.6 + wave.offset * 0.3) * 12 +
            (mouse.current.y - height / 2) * 0.01 * Math.sin(x * 0.0012);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.3, wave.color);
        gradient.addColorStop(0.7, wave.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = wave.thickness;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      ctx.restore();

      // soft ink blending
      ctx.fillStyle = "rgba(107, 78, 46, 0.05)";
      ctx.globalCompositeOperation = "multiply";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      time += 0.015;
      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      revealProgress = 0; 
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;
    };

    const handleScroll = () => {
      scrollFactor = window.scrollY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
        mixBlendMode: "multiply",
      }}
    />
  );
};

export default InkFlowBackground;
