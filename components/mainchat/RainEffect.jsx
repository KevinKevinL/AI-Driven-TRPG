import React, { useEffect, useRef } from 'react';

const RainEffect = ({ intensity = 1, color = '#CCE6FF', speed = 15 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Rain drop class
    class Drop {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.speed = 4 + Math.random() * speed;
        this.length = 10 + Math.random() * 20;
        this.opacity = 0.1 + Math.random() * 0.4;
      }

      update() {
        this.y += this.speed;
        
        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }

    // Create rain drops
    const drops = Array(Math.floor(100 * intensity))
      .fill()
      .map(() => new Drop());

    // Animation loop
    let animationFrameId;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drops.forEach(drop => {
        drop.update();
        drop.draw();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, color, speed]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default RainEffect;