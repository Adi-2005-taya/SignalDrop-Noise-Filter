import React, { useState, useEffect } from 'react';
import CrystalizedBall from './CrystalizedBall';
import LightTunnel from './LightTunnel';
import BorderGlow from './BorderGlow';
import { Filter } from 'lucide-react';

export default function Preloader({ onComplete }) {
  // Stages: 'plasma' (CrystalizedBall) -> 'tunnel' (LightTunnel) -> 'done'
  const [stage, setStage] = useState('plasma');
  const [isFading, setIsFading] = useState(false);

  // Stage 1: CrystalizedBall progression (~2.6s)
  useEffect(() => {
    if (stage === 'plasma') {
      const t = setTimeout(() => {
        setStage('tunnel');
      }, 2600);

      return () => clearTimeout(t);
    }
  }, [stage]);

  // Stage 2: LightTunnel progression (~2.4s)
  useEffect(() => {
    if (stage === 'tunnel') {
      const t = setTimeout(() => {
        handleFinish();
      }, 2400);

      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleFinish = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };

  return (
    <div 
      onClick={handleFinish}
      className={`fixed inset-0 z-[999] bg-[#07090e] flex items-center justify-center overflow-hidden transition-opacity duration-500 cursor-pointer ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Click anywhere to enter dashboard"
    >
      {/* Main Viewport */}
      <div className="w-full h-full flex items-center justify-center relative">
        {stage === 'plasma' ? (
          /* Stage 1: CrystalizedBall + Themed Welcome Card with BorderGlow */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div style={{ width: '100%', height: '520px', position: 'relative' }}>
              <CrystalizedBall
                preset="plasma"
                color="#F25BD0"
                size={0.7}
                crackle={0.85}
                fill={0.5}
                interactive
                hoverStrength={0.7}
              />
            </div>

            {/* Themed Card with BorderGlow matching the Dashboard */}
            <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-20 w-full max-w-lg px-4">
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#0b0b0d"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1.0}
                coneSpread={25}
                animated={false}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
                className="shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-3 duration-500"
              >
                <div className="p-5 sm:p-6 backdrop-blur-xl space-y-2.5 text-left">
                  {/* Header status pills matching Hero card */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                      <span className="text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                        Active Group
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-emerald-400 font-semibold">0% noise stripped</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">~1m saved</span>
                    </div>
                  </div>

                  {/* Brand title matching Navbar & Hero */}
                  <div className="flex items-center gap-2.5 pt-0.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <Filter className="w-3.5 h-3.5" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
                      Welcome to SignalDrop
                    </h1>
                  </div>

                  {/* Subtitle matching Hero */}
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    College chat filter separating deadlines, documents, and official notices from group chatter.
                  </p>
                </div>
              </BorderGlow>
            </div>
          </div>
        ) : (
          /* Stage 2: LightTunnel */
          <div style={{ width: '100%', height: '100%', maxHeight: '650px', position: 'relative' }}>
            <LightTunnel
              cableColor="#ffffff"
              pulseColor="#ffffff"
              cableCount={56}
              pulseDensity={0.5}
              flowDirection="inward"
              mouseInteraction
              clickSurge
            />
          </div>
        )}
      </div>
    </div>
  );
}
