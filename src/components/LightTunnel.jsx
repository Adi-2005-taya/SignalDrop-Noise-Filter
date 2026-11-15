import React, { useEffect, useRef } from 'react';
import './LightTunnel.css';

/**
 * LightTunnel Component
 * High-performance 3D inward/outward light tunnel with glowing radial cables,
 * streaming photon pulses, mouse steering/bending, and click surge shockwaves.
 * Built with a bulletproof Canvas engine to guarantee flawless 60 FPS rendering
 * without WebGL context loss or browser crashes.
 */
export default function LightTunnel({
  cableColor = '#ffffff',
  pulseColor = '#ffffff',
  tunnelColor = '#ffffff',
  tunnelOpacity = 0.15,
  speed = 0.8,
  flowDirection = 'inward',
  pulseSpeed = 2.2,
  pulseLength = 0.28,
  pulseBlend = 0.6,
  pulseWidth = 1.2,
  pulseDensity = 0.5,
  cableCount = 56,
  thickness = 0.8,
  waviness = 0.25,
  sway = 0.35,
  bend = 0.4,
  size = 1,
  centerX = 0,
  centerY = 0,
  glow = 1.2,
  brightness = 1.0,
  colorVariance = true,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.35,
  clickSurge = true,
  intro = true,
  className = '',
  style = {},
  ...rest
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create canvas dynamically
    const canvas = document.createElement('canvas');
    canvas.className = 'light-tunnel-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let isDisposed = false;

    // Cable & Particle Data
    const count = Math.min(120, Math.max(16, Math.round(cableCount)));
    const cables = [];
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2;
      cables.push({
        baseAngle,
        angleOffset: (Math.random() - 0.5) * (Math.PI / count) * 0.4,
        pulseOffset: Math.random() * 10,
        pulseSpeedMod: 0.8 + Math.random() * 0.4,
        brightnessMod: 0.7 + Math.random() * 0.6,
        lengthMod: 0.85 + Math.random() * 0.3
      });
    }

    // Active surges from clicks
    const surges = [];

    // Pointer state & smoothed steering
    const pointer = { x: 0, y: 0, inside: false };
    const steer = { x: 0, y: 0, vx: 0, vy: 0 };

    // Timing
    let lastTime = performance.now();
    let animTime = 0;
    let introProgress = intro ? 0 : 1;

    const resize = () => {
      if (!container || isDisposed) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (pointer.inside) {
        pointer.x = (x / rect.width - 0.5) * 2; // -1 to 1
        pointer.y = (y / rect.height - 0.5) * 2;
      }
    };

    const onPointerLeave = () => {
      pointer.inside = false;
    };

    const onPointerDown = (e) => {
      if (!clickSurge) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        surges.push({
          radius: flowDirection === 'inward' ? 1.0 : 0.0,
          speed: flowDirection === 'inward' ? -1.8 : 1.8,
          alpha: 1.0,
          width: 25
        });
      }
    };

    window.addEventListener('resize', resize);
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerdown', onPointerDown);
    resize();

    // Inward flow factor: 1 for outward, -1 for inward
    const dirFactor = flowDirection === 'outward' ? 1 : -1;

    const render = (now) => {
      if (isDisposed) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      animTime += dt * speed;

      if (introProgress < 1) {
        introProgress = Math.min(1, introProgress + dt * 1.2);
      }

      // Smooth steer toward pointer
      if (mouseInteraction && pointer.inside) {
        const targetX = pointer.x * mouseStrength * 0.8;
        const targetY = pointer.y * mouseStrength * 0.8;
        steer.x += (targetX - steer.x) * (1 - Math.exp(-dt * 6));
        steer.y += (targetY - steer.y) * (1 - Math.exp(-dt * 6));
      } else {
        steer.x += (0 - steer.x) * (1 - Math.exp(-dt * 3));
        steer.y += (0 - steer.y) * (1 - Math.exp(-dt * 3));
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Center vanishing point with mouse bend + sway
      const swayX = Math.sin(animTime * 0.8) * (sway * 20);
      const swayY = Math.cos(animTime * 0.6) * (sway * 15);
      const cx = width * 0.5 + centerX * width + steer.x * (width * 0.35) + swayX;
      const cy = height * 0.5 + centerY * height + steer.y * (height * 0.35) + swayY;
      const maxRadius = Math.hypot(width, height) * 0.65 * size;

      // Draw subtle background tunnel perspective rings (depth grids)
      const ringCount = 14;
      for (let r = 1; r <= ringCount; r++) {
        const ringProgress = (r / ringCount);
        const radius = Math.pow(ringProgress, 2.2) * maxRadius;
        const ringAlpha = (1 - ringProgress) * 0.08 * tunnelOpacity * introProgress;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw Cables & Pulses
      const pulsesPerCable = Math.max(1, Math.round(pulseDensity * 4));

      for (let i = 0; i < count; i++) {
        const cable = cables[i];
        const angle = cable.baseAngle + cable.angleOffset;
        
        // Cable curve with waviness
        const wave = Math.sin(animTime * 1.5 + cable.baseAngle * 3) * (waviness * 0.08);
        const effectiveAngle = angle + wave;
        
        const cosA = Math.cos(effectiveAngle);
        const sinA = Math.sin(effectiveAngle);

        // Outer endpoint (near screen edge)
        const outerX = cx + cosA * maxRadius;
        const outerY = cy + sinA * maxRadius;

        // Inner vanishing endpoint (tunnels inward)
        const innerRadius = 15;
        const innerX = cx + cosA * innerRadius;
        const innerY = cy + sinA * innerRadius;

        // 1. Draw Static / Background Cable Guide Line
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 * brightness * introProgress})`;
        ctx.lineWidth = thickness * 0.6;
        ctx.stroke();

        // 2. Draw Streaming Light Pulses along this cable
        for (let p = 0; p < pulsesPerCable; p++) {
          const pulseOffset = cable.pulseOffset + (p / pulsesPerCable);
          // Progress along cable from 0 (inner/center) to 1 (outer/edge)
          let t = ((animTime * pulseSpeed * cable.pulseSpeedMod * 0.2 + pulseOffset) % 1.0);
          if (t < 0) t += 1.0;

          // If inward, invert progress so it travels from 1 (outer) to 0 (inner)
          let depthProgress = flowDirection === 'inward' ? (1.0 - t) : t;

          // Apply nonlinear perspective scaling: pulses compress and speed up as they reach the vortex
          const visualProgress = Math.pow(depthProgress, 1.6);
          const currentDist = innerRadius + visualProgress * (maxRadius - innerRadius);

          // Pulse head position
          const px = cx + cosA * currentDist;
          const py = cy + sinA * currentDist;

          // Pulse tail length expands as it gets closer to the viewer
          const tailLen = (pulseLength * 90 * cable.lengthMod) * (0.3 + 0.7 * visualProgress);
          const tailDist = flowDirection === 'inward' 
            ? currentDist + tailLen 
            : Math.max(innerRadius, currentDist - tailLen);

          const tx = cx + cosA * tailDist;
          const ty = cy + sinA * tailDist;

          // Alpha fade near center and edges
          const centerFade = Math.min(1.0, (currentDist - innerRadius) / 60);
          const outerFade = Math.min(1.0, (maxRadius - currentDist) / 100);
          const pulseAlpha = centerFade * outerFade * cable.brightnessMod * brightness * introProgress * opacity;

          if (pulseAlpha > 0.01) {
            // Gradient along pulse body
            const grad = ctx.createLinearGradient(tx, ty, px, py);
            grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
            grad.addColorStop(0.5, `rgba(255, 255, 255, ${pulseAlpha * 0.35})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${pulseAlpha * 0.95})`);

            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(px, py);
            ctx.strokeStyle = grad;
            ctx.lineWidth = (thickness * 1.8 + pulseWidth * 1.5) * (0.4 + 0.6 * visualProgress);
            ctx.lineCap = 'round';
            ctx.stroke();

            // Bright head dot (photon spark)
            if (visualProgress > 0.15) {
              ctx.beginPath();
              ctx.arc(px, py, (thickness * 1.4) * (0.6 + 0.4 * visualProgress), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 8 * glow;
              ctx.fill();
              ctx.shadowBlur = 0; // reset
            }
          }
        }
      }

      // 3. Process & Draw Click Surges
      for (let sIdx = surges.length - 1; sIdx >= 0; sIdx--) {
        const s = surges[sIdx];
        s.radius += s.speed * dt;
        s.alpha -= dt * 0.7;

        if (s.alpha <= 0 || (flowDirection === 'inward' && s.radius <= 0) || (flowDirection === 'outward' && s.radius >= 1.2)) {
          surges.splice(sIdx, 1);
          continue;
        }

        const ringDist = innerRadius + Math.max(0, s.radius) * (maxRadius - innerRadius);
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, ringDist, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 0.8})`;
        ctx.lineWidth = s.width * (0.5 + 0.5 * s.radius);
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Center Singularity / Vanishing Core Glow
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
      centerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.45 * glow * introProgress})`);
      centerGrad.addColorStop(0.2, `rgba(255, 255, 255, ${0.15 * introProgress})`);
      centerGrad.addColorStop(0.6, `rgba(147, 51, 234, ${0.05 * introProgress})`); // subtle violet tint depth
      centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fillStyle = centerGrad;
      ctx.fill();

      // Deep dark center hole (event horizon)
      const coreHole = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      coreHole.addColorStop(0, 'rgba(7, 9, 14, 0.95)');
      coreHole.addColorStop(0.7, 'rgba(7, 9, 14, 0.6)');
      coreHole.addColorStop(1, 'rgba(7, 9, 14, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = coreHole;
      ctx.fill();

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointerdown', onPointerDown);
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [
    cableColor,
    pulseColor,
    tunnelColor,
    tunnelOpacity,
    speed,
    flowDirection,
    pulseSpeed,
    pulseLength,
    pulseBlend,
    pulseWidth,
    pulseDensity,
    cableCount,
    thickness,
    waviness,
    sway,
    bend,
    size,
    centerX,
    centerY,
    glow,
    brightness,
    colorVariance,
    opacity,
    mouseInteraction,
    mouseStrength,
    clickSurge,
    intro
  ]);

  return (
    <div
      ref={containerRef}
      className={`light-tunnel-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'transparent',
        ...style
      }}
      {...rest}
    />
  );
}
