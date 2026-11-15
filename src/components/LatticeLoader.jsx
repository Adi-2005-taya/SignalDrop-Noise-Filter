import React, { useState, useEffect, useRef } from 'react';
import './LatticeLoader.css';

/**
 * LatticeLoader Component (React Bits)
 * Renders an animated matrix of cells (orbit, pulse, wave) with live elapsed timer
 * and status transitions ('working' -> 'done' | 'error').
 */
export default function LatticeLoader({
  status = 'working', // 'working' | 'done' | 'error'
  label = 'Thinking',
  doneLabel = 'Done in',
  errorLabel = 'Failed after',
  pattern = 'orbit', // 'orbit' | 'pulse' | 'wave' | 'spiral'
  grid = 3,
  shape = 'round', // 'round' | 'square'
  activeColor = '#ffffff',
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  cellSize = 6,
  gap = 2,
  fontSize = 14,
  step = 90,
  idleOpacity = 0.15,
  glow = false,
  glowColor = '',
  showTimer = true,
  className = '',
  style = {}
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef(performance.now());
  const finalTimeRef = useRef(0);
  const prevStatusRef = useRef(status);

  const totalCells = grid * grid;

  // Orbit sequence for 3x3 or NxN perimeter
  const orbitSequence = useRef([]);
  useEffect(() => {
    if (grid === 3) {
      orbitSequence.current = [0, 1, 2, 5, 8, 7, 6, 3];
    } else {
      // General perimeter calculation
      const seq = [];
      for (let c = 0; c < grid; c++) seq.push(c); // top row
      for (let r = 1; r < grid; r++) seq.push(r * grid + (grid - 1)); // right col
      for (let c = grid - 2; c >= 0; c--) seq.push((grid - 1) * grid + c); // bottom row
      for (let r = grid - 2; r > 0; r--) seq.push(r * grid); // left col
      orbitSequence.current = seq;
    }
  }, [grid]);

  // Handle status transitions & timer
  useEffect(() => {
    if (status === 'working' && prevStatusRef.current !== 'working') {
      startTimeRef.current = performance.now();
      setElapsedMs(0);
    } else if (status !== 'working' && prevStatusRef.current === 'working') {
      finalTimeRef.current = performance.now() - startTimeRef.current;
      setElapsedMs(finalTimeRef.current);
    }
    prevStatusRef.current = status;
  }, [status]);

  // Timer ticker while working
  useEffect(() => {
    if (status !== 'working') return;
    const interval = setInterval(() => {
      setElapsedMs(performance.now() - startTimeRef.current);
    }, 50);
    return () => clearInterval(interval);
  }, [status]);

  // Cell animation stepper while working
  useEffect(() => {
    if (status !== 'working') return;
    const interval = setInterval(() => {
      setActiveStep((prev) => prev + 1);
    }, step);
    return () => clearInterval(interval);
  }, [status, step]);

  // Determine individual cell opacities
  const getCellOpacity = (index) => {
    if (status === 'done' || status === 'error') {
      return 1;
    }

    if (pattern === 'orbit') {
      const seq = orbitSequence.current;
      const seqLen = seq.length || 8;
      const currentIndex = seq[activeStep % seqLen];
      const prev1Index = seq[(activeStep - 1 + seqLen) % seqLen];
      const prev2Index = seq[(activeStep - 2 + seqLen) % seqLen];

      if (index === currentIndex) return 1.0;
      if (index === prev1Index) return 0.65;
      if (index === prev2Index) return 0.35;
      return idleOpacity;
    }

    if (pattern === 'pulse') {
      const center = Math.floor(grid / 2);
      const row = Math.floor(index / grid);
      const col = index % grid;
      const dist = Math.hypot(row - center, col - center);
      const phase = (activeStep * 0.4 - dist) % 3;
      return Math.max(idleOpacity, Math.sin(phase) * 0.5 + 0.5);
    }

    // Default sequential
    const current = activeStep % totalCells;
    if (index === current) return 1.0;
    if (index === (current - 1 + totalCells) % totalCells) return 0.5;
    return idleOpacity;
  };

  // Color determination
  const currentColor =
    status === 'done'
      ? doneColor
      : status === 'error'
      ? errorColor
      : activeColor;

  const currentGlow = glowColor || currentColor;

  // Text formatting
  const secondsFormatted = (elapsedMs / 1000).toFixed(1) + 's';
  const displayLabel =
    status === 'done'
      ? doneLabel
      : status === 'error'
      ? errorLabel
      : label;

  return (
    <div
      className={`lattice-loader-root ${className}`}
      style={{
        fontSize: `${fontSize}px`,
        ...style
      }}
    >
      {/* Matrix Grid */}
      <div
        className="lattice-grid"
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${grid}, ${cellSize}px)`,
          gap: `${gap}px`,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-hidden="true"
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          const opacity = getCellOpacity(i);
          return (
            <span
              key={i}
              className={`lattice-cell ${status === 'done' ? 'lattice-cell-done' : ''}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                borderRadius: shape === 'round' ? '50%' : '2px',
                backgroundColor: currentColor,
                opacity,
                boxShadow:
                  glow && opacity > 0.5
                    ? `0 0 8px ${currentGlow}`
                    : 'none',
                transition: status === 'working' ? 'opacity 0.08s ease' : 'all 0.25s ease'
              }}
            />
          );
        })}
      </div>

      {/* Label and Timer */}
      <div className="lattice-content">
        <span
          className="lattice-label"
          style={{
            color:
              status === 'done'
                ? doneColor
                : status === 'error'
                ? errorColor
                : 'inherit'
          }}
        >
          {displayLabel}
        </span>

        {showTimer && (
          <span className="lattice-timer">
            {secondsFormatted}
          </span>
        )}
      </div>
    </div>
  );
}

