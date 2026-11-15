import React, { useRef, useState, useCallback } from 'react';
import './MagicBento.css';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ArrowUpRight, 
  Sparkles,
  Download,
  Terminal,
  Activity
} from 'lucide-react';

export function MagicBentoCard({
  children,
  colSpan = 1,
  rowSpan = 1,
  radius = 20,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  clickEffect = true,
  className = '',
  style = {},
  onClick
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  }, []);

  const handleClick = (e) => {
    if (clickEffect && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleId = Date.now() + Math.random();
      setRipples(prev => [...prev, { id: rippleId, x, y }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== rippleId));
      }, 750);
    }
    if (onClick) onClick(e);
  };

  const dynamicStyle = {
    borderRadius: `${radius}px`,
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
    '--mouse-x': `${mousePos.x}px`,
    '--mouse-y': `${mousePos.y}px`,
    '--spotlight-radius': `${spotlightRadius}px`,
    ...style
  };

  return (
    <div
      ref={cardRef}
      className={`magic-bento-card ${className}`}
      style={dynamicStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Dynamic Cursor Spotlight */}
      {enableSpotlight && isHovered && (
        <div
          className="magic-bento-spotlight"
          style={{
            opacity: 1,
            background: `radial-gradient(${spotlightRadius}px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.18), transparent 75%)`
          }}
        />
      )}

      {/* Reactive Border Glow */}
      {enableBorderGlow && (
        <div className="magic-bento-border-glow" />
      )}

      {/* Click Ripples */}
      {clickEffect && ripples.map(r => (
        <span
          key={r.id}
          className="magic-bento-ripple"
          style={{ left: `${r.x}px`, top: `${r.y}px` }}
        />
      ))}

      {/* Bento Item Children */}
      <div className="magic-bento-content">
        {children}
      </div>
    </div>
  );
}

export default function MagicBento({
  columns = 4,
  rowHeight = 200,
  gap = 12,
  radius = 20,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  clickEffect = true,
  children,
  className = '',
  style = {},
  // Optional telemetry props if used as an intelligence dashboard
  stats = null,
  onOpenIngest = null,
  onOpenDigest = null,
  onDownloadSample = null,
  onToggleSpam = null
}) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridAutoRows: rowHeight ? `${rowHeight}px` : 'auto',
    gap: `${gap}px`,
    ...style
  };

  return (
    <div className={`magic-bento-grid ${className}`} style={gridStyle}>
      {children ? (
        children
      ) : (
        /* Default Rich SignalDrop Bento Cells */
        <>
          {/* Card 1: Agent Pipeline Telemetry (2 cols) */}
          <MagicBentoCard
            colSpan={2}
            rowSpan={1}
            radius={radius}
            enableBorderGlow={enableBorderGlow}
            enableSpotlight={enableSpotlight}
            spotlightRadius={spotlightRadius}
            clickEffect={clickEffect}
            className="p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-xs font-mono font-semibold text-purple-400 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  Step 1 • Chat Cleaner
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  Multi-Signal Active
                </span>
              </div>
              <h4 className="text-white text-base font-bold font-mono tracking-tight">
                Pattern Matching &amp; Date Extraction
              </h4>
              <p className="text-xs text-zinc-400 font-sans mt-1 line-clamp-2">
                Detects complex announcements with due dates and categorizes them into both Deadlines and Official Notices without dropping details.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Rule-Based Accuracy
              </span>
              <span>•</span>
              <span className="text-zinc-300">Speed: &lt; 1s</span>
            </div>
          </MagicBentoCard>

          {/* Card 2: Noise Filtration Engine (1 col) */}
          <MagicBentoCard
            colSpan={1}
            rowSpan={1}
            radius={radius}
            enableBorderGlow={enableBorderGlow}
            enableSpotlight={enableSpotlight}
            spotlightRadius={spotlightRadius}
            clickEffect={clickEffect}
            className="p-5 flex flex-col justify-between"
            onClick={onToggleSpam}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Noise Stripped</span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {stats?.noisePercentage ?? 0}%
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {stats?.noiseFiltered ?? 0} chatter messages isolated
              </p>
            </div>
            <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
              <span>View Vault</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </MagicBentoCard>

          {/* Card 3: Time Saved & Productivity (1 col) */}
          <MagicBentoCard
            colSpan={1}
            rowSpan={1}
            radius={radius}
            enableBorderGlow={enableBorderGlow}
            enableSpotlight={enableSpotlight}
            spotlightRadius={spotlightRadius}
            clickEffect={clickEffect}
            className="p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Focus Saved</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                ~{stats?.timeSavedMinutes ?? 1}m
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Saved reading scrolling chat
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1">
              <span>{stats?.signalCount ?? 0} High-Value Signals</span>
            </div>
          </MagicBentoCard>

          {/* Card 4: Quick Action - Fake Chat .txt (1 col) */}
          <MagicBentoCard
            colSpan={1}
            rowSpan={1}
            radius={radius}
            enableBorderGlow={enableBorderGlow}
            enableSpotlight={enableSpotlight}
            spotlightRadius={spotlightRadius}
            clickEffect={clickEffect}
            className="p-5 flex flex-col justify-between cursor-pointer group"
            onClick={onDownloadSample}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Sample Test Data</span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                <Download className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono group-hover:text-sky-300 transition">
                Fake Chat .txt
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                Download ready-to-test WhatsApp sample with deadlines & resources
              </p>
            </div>
            <div className="text-[11px] font-mono text-sky-400 flex items-center gap-1">
              <span>Click to download</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </MagicBentoCard>

          {/* Card 5: Ingest Chat Button (1 col) */}
          <MagicBentoCard
            colSpan={1}
            rowSpan={1}
            radius={radius}
            enableBorderGlow={enableBorderGlow}
            enableSpotlight={enableSpotlight}
            spotlightRadius={spotlightRadius}
            clickEffect={clickEffect}
            className="p-5 flex flex-col justify-between cursor-pointer group"
            onClick={onOpenIngest}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Forward or Paste</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono group-hover:text-emerald-300 transition">
                Import WhatsApp Chat
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">
                Drop your raw .txt export or paste text directly
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span>Open modal</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          </MagicBentoCard>

          {/* Card 6: WhatsApp Clean Digest Generator (2 cols) */}
          <MagicBentoCard
            colSpan={2}
            rowSpan={1}
            radius={radius}
            enableBorderGlow={enableBorderGlow}
            enableSpotlight={enableSpotlight}
            spotlightRadius={spotlightRadius}
            clickEffect={clickEffect}
            className="p-5 flex flex-col justify-between cursor-pointer group"
            onClick={onOpenDigest}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-mono text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                1-Click Student Broadcast
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-purple-300 group-hover:translate-x-0.5 transition">
                <span>Generate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h4 className="text-white text-base font-bold font-mono tracking-tight group-hover:text-purple-200 transition">
                Export Formatted WhatsApp Digest
              </h4>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Compiles sorted deadlines, links, and official circulars into a neat WhatsApp message with emojis, markdown bolding, and course tags.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span>Ready for CRs & batch groups</span>
              <span>•</span>
              <span className="text-purple-400">Copy or Download .ics</span>
            </div>
          </MagicBentoCard>
        </>
      )}
    </div>
  );
}

