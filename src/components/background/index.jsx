import React, { useEffect, useRef } from 'react';
import './css/styles.scss';

const Background = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef([]);
  const animationId = useRef(null);

  // ADD MORE SHAPES HERE (hexagon, star, etc.)
  const SHAPES = ['circle', 'triangle', 'square', 'hexagon', 'star', 'cross'];
  
  // Theme configurations
  const THEMES = {
    dark: {
      bgGradient: ['#0f0c29', '#302b63', '#24243e'],
      particleColors: [
        'rgba(100, 200, 255, 0.7)',
        'rgba(150, 120, 255, 0.7)',
        'rgba(200, 180, 255, 0.7)'
      ],
      particleCount: 60
    },
    light: {
      bgGradient: ['#E0EAFC', '#CFDEF3'],
      particleColors: [
        'rgba(80, 120, 200, 0.7)',
        'rgba(120, 80, 200, 0.7)',
        'rgba(150, 150, 255, 0.7)'
      ],
      particleCount: 40
    }
  };

  class Particle {
    constructor(canvas, theme) {
      this.canvas = canvas;
      this.theme = theme;
      this.reset(true);
      this.velocity = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      };
    }

    reset(initial = false) {
      this.size = Math.random() * 15 + 5;
      this.x = initial ? Math.random() * this.canvas.width : 
             (Math.random() > 0.5 ? -this.size : this.canvas.width + this.size);
      this.y = Math.random() * this.canvas.height;
      this.color = this.theme.particleColors[
        Math.floor(Math.random() * this.theme.particleColors.length)
      ];
      this.alpha = 0.1 + Math.random() * 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      this.type = SHAPES[Math.floor(Math.random() * SHAPES.length)]; // Random shape
      this.mass = this.size * 0.1;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;

      switch(this.type) {
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.lineTo(this.size, this.size);
          ctx.lineTo(-this.size, this.size);
          break;
          
        case 'square':
          ctx.beginPath();
          ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
          break;
          
        case 'hexagon':
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6;
            ctx.lineTo(
              this.size * Math.cos(angle),
              this.size * Math.sin(angle)
            );
          }
          break;
          
        case 'star':
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i * 2 * Math.PI) / 10;
            const radius = i % 2 === 0 ? this.size : this.size * 0.5;
            ctx.lineTo(
              radius * Math.cos(angle),
              radius * Math.sin(angle)
            );
          }
          break;
          
        case 'cross':
          ctx.beginPath();
          ctx.rect(-this.size/6, -this.size/2, this.size/3, this.size);
          ctx.rect(-this.size/2, -this.size/6, this.size, this.size/3);
          break;
          
        default: // circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    update(ctx, mouse) {
      // Mouse interaction
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 50;
          const angle = Math.atan2(dy, dx);
          this.velocity.x -= Math.cos(angle) * force * 0.1;
          this.velocity.y -= Math.sin(angle) * force * 0.1;
        }
      }

      // Update position
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.rotation += this.rotationSpeed;

      // Boundary check with bounce
      if (this.x < -this.size*2 || this.x > this.canvas.width + this.size*2) {
        this.reset();
      }
      if (this.y < -this.size*2 || this.y > this.canvas.height + this.size*2) {
        this.reset();
      }

      this.draw(ctx);
    }
  }

  const init = (themeName = 'dark') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const theme = THEMES[themeName];
    particlesRef.current = Array(theme.particleCount).fill().map(() => new Particle(canvas, theme));
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient
    const themeName = document.body.getAttribute('data-theme') || 'dark';
    const theme = THEMES[themeName];
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    theme.bgGradient.forEach((color, i) => 
      gradient.addColorStop(i / (theme.bgGradient.length - 1), color)
    );
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update particles
    particlesRef.current.forEach(p => p.update(ctx, mousePos.current));

    animationId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Initialize with current theme
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    init(currentTheme);
    animate();

    // Theme observer
    const themeObserver = new MutationObserver(() => {
      const newTheme = document.body.getAttribute('data-theme') || 'dark';
      init(newTheme);
    });
    themeObserver.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    });

    // Event listeners
    const handleResize = () => init();
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId.current);
      themeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="background-container">
      <canvas ref={canvasRef} className="background-canvas" />
    </div>
  );
};

export default Background;