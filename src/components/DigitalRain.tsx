'use client';

import { useEffect, useRef } from 'react';

export default function DigitalRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      containerRef.current.appendChild(canvas);
      canvasRef.current = canvas;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for the digital rain
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    // Column settings
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track the y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    function draw() {
      // Set a semi-transparent black background to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set the text color and font
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      // Draw the characters
      for (let i = 0; i < drops.length; i++) {
        // Get a random character
        const text = characters.charAt(Math.floor(Math.random() * characters.length));

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Move the drop down
        drops[i]++;

        // If the drop has reached the bottom, reset it to the top with some randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newColumns = Math.floor(canvas.width / fontSize);

      // Update drops array if needed
      if (newColumns > columns) {
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Run the animation
    const interval = setInterval(draw, 50);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={containerRef} className="digital-rain"></div>;
}
