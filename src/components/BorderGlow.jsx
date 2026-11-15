import React, { useRef, useState, useEffect } from 'react';
import './BorderGlow.css';

/**
 * BorderGlow Component (React Bits)
 * Renders an interactive border glow that tracks cursor movement near card edges.
 * Supports multi-color gradients, custom glow radius/spread, edge sensitivity, and animated sweep.
 */
export default function BorderGlow({
  children,
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  className = '',
  style = {},
  ...rest
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [glowOpacity, setGlowOpacity] = useState(0);

  const handlePointerMove = (e) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check distance to edges
    const distLeft = x;
    const distRight = rect.width - x;
    const distTop = y;
    const distBottom = rect.height - y;
    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    setMousePos({ x, y });

    if (minDist <= edgeSensitivity || (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height)) {
      // Near edge or inside card
      const edgeFactor = minDist <= edgeSensitivity 
        ? 1.0 
        : Math.max(0.3, 1.0 - (minDist - edgeSensitivity) / 80);
      setGlowOpacity(glowIntensity * edgeFactor);
    } else {
      setGlowOpacity(0);
    }
  };

  const handlePointerLeave = () => {
    setGlowOpacity(0);
  };

  const gradientColors = colors.length > 0 
    ? colors.join(', ') 
    : '#c084fc, #f472b6, #38bdf8';

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-wrapper ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        ...style
      }}
      {...rest}
    >
      {/* Outer Glow Halo (Blur) */}
      <div
        className="border-glow-halo"
        style={{
          borderRadius: `${borderRadius}px`,
          opacity: glowOpacity,
          background: `radial-gradient(${glowRadius * 2.5}px circle at ${mousePos.x}px ${mousePos.y}px, ${colors[0] || '#c084fc'}, transparent 70%)`,
          filter: `blur(${glowRadius * 0.4}px)`
        }}
      />

      {/* Reactive Border Gradient Layer */}
      <div
        className={`border-glow-border ${animated ? 'border-glow-animated' : ''}`}
        style={{
          borderRadius: `${borderRadius}px`,
          opacity: animated ? glowIntensity : glowOpacity,
          background: animated
            ? `conic-gradient(from 0deg, ${gradientColors}, ${colors[0] || '#c084fc'})`
            : `radial-gradient(${glowRadius * 3}px circle at ${mousePos.x}px ${mousePos.y}px, ${gradientColors}, transparent 75%)`
        }}
      />

      {/* Inner Content Container */}
      <div
        className="border-glow-content"
        style={{
          borderRadius: `${Math.max(0, borderRadius - 1.5)}px`,
          backgroundColor: backgroundColor || '#120F17'
        }}
      >
        {children}
      </div>
    </div>
  );
}

