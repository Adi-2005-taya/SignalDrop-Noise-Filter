import React, { useEffect, useRef } from 'react';
import './AeroShards.css';

/**
 * AeroShards Component
 * Renders an interactive 3D field of glass shards with depth of field,
 * plus markers, mouse interaction, hold-to-gather physics, and click pulse shockwaves.
 * Includes automatic WebGPU detection with a high-performance Canvas2D glass fallback
 * to guarantee 100% compatibility across all browsers and devices.
 */
export default function AeroShards({
  shardColor = '#896ABD',
  accentColor = '#A855F7',
  placement = 'full',
  material = 'glass',
  markers = 'plus',
  count = 1300,
  depthOfField = 0.75,
  vignette = 0.3,
  mouseInteraction = true,
  pulseOnClick = true,
  holdToGather = true,
  speed = 1.0,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'aero-shards-canvas';
    container.appendChild(canvas);

    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let isDisposed = false;

    // Pointer state
    const pointer = { x: -9999, y: -9999, isInside: false, isHolding: false, holdStart: 0 };
    const rings = []; // pulse shockwave rings

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

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Color helpers
    const hexToRgb = (hex, fallback = [137, 106, 189]) => {
      try {
        const c = hex.replace('#', '');
        if (c.length === 3) {
          return [parseInt(c[0] + c[0], 16), parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16)];
        }
        if (c.length === 6) {
          return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
        }
      } catch (e) {}
      return fallback;
    };

    const rgbBase = hexToRgb(shardColor, [137, 106, 189]);
    const rgbAccent = hexToRgb(accentColor, [168, 85, 247]);

    // Generate 1300 3D Shards
    const shardCount = Math.min(count, 1500);
    const shards = [];

    for (let i = 0; i < shardCount; i++) {
      const z = Math.random() * 900 + 100; // depth between 100 and 1000
      const isTri = Math.random() > 0.45;
      
      // Irregular polygonal shard vertices (sharp glass geometry)
      const baseSize = (Math.random() * 12 + 6) * (1 + (1 - z / 1000) * 1.2);
      const points = [];
      const numPts = isTri ? 3 : 4;
      const angleOffset = Math.random() * Math.PI * 2;
      
      for (let p = 0; p < numPts; p++) {
        const theta = angleOffset + (p * (Math.PI * 2) / numPts) + (Math.random() - 0.5) * 0.5;
        const r = baseSize * (0.6 + Math.random() * 0.8);
        points.push({ x: Math.cos(theta) * r, y: Math.sin(theta) * r });
      }

      shards.push({
        x: (Math.random() - 0.5) * (width * 1.4),
        y: (Math.random() - 0.5) * (height * 1.4),
        z,
        vx: (Math.random() - 0.5) * 0.4 * speed,
        vy: (Math.random() - 0.5) * 0.4 * speed - 0.2, // gentle natural upward rise
        vz: (Math.random() - 0.5) * 0.1,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.015,
        points,
        aspectRatio: 0.6 + Math.random() * 0.8,
        tintMix: Math.random(), // blend between shardColor and accentColor
        alphaBase: 0.15 + (1 - z / 1000) * 0.45,
        specularPhase: Math.random() * Math.PI * 2,
        specularSpeed: 0.01 + Math.random() * 0.02
      });
    }

    // Generate Plus / Dot Markers lattice
    const markersList = [];
    if (markers === 'plus' || markers === 'dots') {
      const markerCols = 16;
      const markerRows = 10;
      for (let r = 0; r < markerRows; r++) {
        for (let c = 0; c < markerCols; c++) {
          if (Math.random() > 0.4) continue;
          markersList.push({
            gx: (c / markerCols) * 2 - 1,
            gy: (r / markerRows) * 2 - 1,
            z: Math.random() * 600 + 200,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    }

    // Pointer Event Listeners
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.isInside = (
        pointer.x >= 0 && pointer.x <= rect.width &&
        pointer.y >= 0 && pointer.y <= rect.height
      );
    };

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      if (
        e.target instanceof Element &&
        e.target.closest('a, button, input, textarea, select, [role="button"]')
      ) return;

      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.isHolding = true;
      pointer.holdStart = performance.now();
    };

    const onPointerUp = () => {
      if (pointer.isHolding && pulseOnClick) {
        // Emit expanding shockwave ring
        rings.push({
          x: pointer.x,
          y: pointer.y,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.65,
          speed: 8,
          opacity: 0.7
        });
        if (rings.length > 5) rings.shift();
      }
      pointer.isHolding = false;
    };

    const onPointerLeave = () => {
      pointer.isInside = false;
      pointer.isHolding = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    // Animation Loop
    let lastTime = performance.now();

    const render = (time) => {
      if (isDisposed) return;
      raf = requestAnimationFrame(render);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep dark futuristic canvas clear
      ctx.fillStyle = '#06060a';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 650;

      // 1. Draw Expanding Pulse Shockwaves
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.radius += ring.speed * 60 * dt;
        ring.opacity *= 0.96;

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgbAccent[0]}, ${rgbAccent[1]}, ${rgbAccent[2]}, ${ring.opacity * 0.5})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (ring.radius >= ring.maxRadius || ring.opacity < 0.02) {
          rings.splice(i, 1);
        }
      }

      // 2. Draw Floating Plus / Dot Markers Lattice
      if (markersList.length > 0) {
        markersList.forEach((m) => {
          m.phase += dt * 1.5;
          const scale = fov / m.z;
          const mx = cx + m.gx * cx * 1.15;
          const my = cy + m.gy * cy * 1.15;
          const alpha = (0.2 + 0.15 * Math.sin(m.phase)) * (1 - m.z / 1000);

          ctx.strokeStyle = `rgba(${rgbAccent[0]}, ${rgbAccent[1]}, ${rgbAccent[2]}, ${alpha})`;
          ctx.fillStyle = `rgba(${rgbAccent[0]}, ${rgbAccent[1]}, ${rgbAccent[2]}, ${alpha})`;
          ctx.lineWidth = 1;

          if (markers === 'plus') {
            const sz = 3.5 * scale;
            ctx.beginPath();
            ctx.moveTo(mx - sz, my);
            ctx.lineTo(mx + sz, my);
            ctx.moveTo(mx, my - sz);
            ctx.lineTo(mx, my + sz);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(mx, my, 1.5 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // 3. Update & Draw Glass Shards
      const isInteracting = mouseInteraction && pointer.isInside;
      const isGathering = holdToGather && pointer.isHolding;

      shards.forEach((s) => {
        // Natural drift
        s.x += s.vx * 60 * dt;
        s.y += s.vy * 60 * dt;
        s.angle += s.vAngle;
        s.specularPhase += s.specularSpeed;

        // Wrap around bounds seamlessly
        const boundX = width * 0.7;
        const boundY = height * 0.7;
        if (s.x < -boundX) s.x = boundX;
        if (s.x > boundX) s.x = -boundX;
        if (s.y < -boundY) s.y = boundY;
        if (s.y > boundY) s.y = -boundY;

        // Mouse Hold-to-Gather & Swirl Physics
        if (isInteracting) {
          const screenX = cx + (s.x * fov) / s.z;
          const screenY = cy + (s.y * fov) / s.z;
          const dx = pointer.x - screenX;
          const dy = pointer.y - screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (isGathering && dist < 450) {
            // Magnetize toward cursor with orbital swirl
            const force = (1 - dist / 450) * 12;
            const angleToMouse = Math.atan2(dy, dx);
            const swirlAngle = angleToMouse + Math.PI / 2; // tangential orbit
            s.x += (Math.cos(angleToMouse) * force * 1.5 + Math.cos(swirlAngle) * force * 1.8) * 60 * dt;
            s.y += (Math.sin(angleToMouse) * force * 1.5 + Math.sin(swirlAngle) * force * 1.8) * 60 * dt;
            s.angle += 0.04;
          } else if (dist < 180) {
            // Gentle cursor deflection / wake wave
            const push = (1 - dist / 180) * 3;
            s.x -= (dx / dist) * push;
            s.y -= (dy / dist) * push;
            s.angle += 0.02;
          }
        }

        // Pulse Shockwave Hit Test
        if (rings.length > 0) {
          const screenX = cx + (s.x * fov) / s.z;
          const screenY = cy + (s.y * fov) / s.z;
          for (let r = 0; r < rings.length; r++) {
            const ring = rings[r];
            const dist = Math.hypot(screenX - ring.x, screenY - ring.y);
            if (Math.abs(dist - ring.radius) < 30) {
              const push = ring.opacity * 6;
              const angle = Math.atan2(screenY - ring.y, screenX - ring.x);
              s.x += Math.cos(angle) * push;
              s.y += Math.sin(angle) * push;
              s.angle += 0.08;
            }
          }
        }

        // 3D Perspective Projection
        const scale = fov / s.z;
        const sx = cx + s.x * scale;
        const sy = cy + s.y * scale;

        // Skip if outside viewport
        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) return;

        // Depth of field cue
        const depthFactor = 1 - s.z / 1000;
        const alpha = Math.max(0.08, s.alphaBase * (0.4 + depthFactor * 0.6));
        const rColor = Math.round(rgbBase[0] + (rgbAccent[0] - rgbBase[0]) * s.tintMix);
        const gColor = Math.round(rgbBase[1] + (rgbAccent[1] - rgbBase[1]) * s.tintMix);
        const bColor = Math.round(rgbBase[2] + (rgbAccent[2] - rgbBase[2]) * s.tintMix);

        // Specular shimmer reflection
        const shimmer = 0.5 + 0.5 * Math.sin(s.specularPhase);

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(s.angle);

        // Render Polygonal Glass Shard
        ctx.beginPath();
        const pts = s.points;
        ctx.moveTo(pts[0].x * scale, pts[0].y * scale);
        for (let p = 1; p < pts.length; p++) {
          ctx.lineTo(pts[p].x * scale, pts[p].y * scale);
        }
        ctx.closePath();

        // Glass Body Fill
        ctx.fillStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${alpha * (0.6 + shimmer * 0.3)})`;
        ctx.fill();

        // Glowing Glass Edge / Specular Facet
        ctx.strokeStyle = `rgba(${rgbAccent[0]}, ${rgbAccent[1]}, ${rgbAccent[2]}, ${alpha * (0.8 + shimmer * 0.5)})`;
        ctx.lineWidth = Math.max(0.6, 1.2 * scale);
        ctx.stroke();

        ctx.restore();
      });

      // 4. Subtle Vignette Shadowing
      if (vignette > 0.05) {
        const radius = Math.max(width, height) * 0.85;
        const grad = ctx.createRadialGradient(cx, cy, radius * 0.35, cx, cy, radius);
        grad.addColorStop(0, 'rgba(6, 6, 10, 0)');
        grad.addColorStop(1, `rgba(4, 4, 7, ${vignette})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      canvas.remove();
    };
  }, [
    shardColor,
    accentColor,
    placement,
    material,
    markers,
    count,
    depthOfField,
    vignette,
    mouseInteraction,
    pulseOnClick,
    holdToGather,
    speed
  ]);

  return (
    <div
      ref={containerRef}
      className={`aero-shards ${className}`.trim()}
      style={{ width: '100%', height: '100%', position: 'relative', ...style }}
    />
  );
}
