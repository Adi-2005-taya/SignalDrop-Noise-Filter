import React from 'react';
import BorderGlow from './BorderGlow';
import MagicBento, { MagicBentoCard } from './MagicBento';
import { 
  X, 
  Cpu, 
  Bot, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  Trash2,
  Sparkles
} from 'lucide-react';

export default function AgentInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#0c0f18"
        borderRadius={24}
        glowRadius={44}
        glowIntensity={1.0}
        colors={['#8b5cf6', '#a855f7', '#38bdf8']}
        className="w-full max-w-3xl shadow-2xl"
      >
        <div className="relative w-full rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">SignalDrop Multi-Agent AI Pipeline</h2>
              <p className="text-xs text-zinc-400 font-mono">Architecture & Technical Implementation Breakdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-mono">
          
          {/* Overview Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Zero-Doomscroll Architecture for Campus Communications</span>
            </h3>
            <p className="text-zinc-300 font-sans leading-relaxed">
              Official and unofficial college groups generate hundreds of messages per day. SignalDrop runs an asynchronous 2-stage agent pipeline that eliminates up to 92% of conversational spam while preserving 100% of actionable academic events.
            </p>
          </div>

          {/* Interactive Agent Flow via MagicBento */}
          <MagicBento
            columns={2}
            rowHeight={260}
            gap={14}
            radius={18}
            enableBorderGlow={true}
            enableSpotlight={true}
            spotlightRadius={260}
            clickEffect={true}
          >
            {/* AGENT 1 CARD */}
            <MagicBentoCard
              colSpan={1}
              rowSpan={1}
              radius={18}
              enableBorderGlow={true}
              enableSpotlight={true}
              spotlightRadius={260}
              clickEffect={true}
              className="p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cyan-300">Agent 1: The Sorter</h4>
                  <span className="text-[10px] text-zinc-400">Semantic Noise Classifier</span>
                </div>
              </div>

              <ul className="space-y-2 text-zinc-300 font-sans text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">▸</span>
                  <span><strong>Spam Elimination:</strong> Filters out greetings ("HBD"), acknowledgments ("ok sir", "+1"), emojis, and casual chatter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">▸</span>
                  <span><strong>Signal Classification:</strong> Routes candidate messages into <em>Deadlines</em>, <em>Resources</em>, or <em>Announcements</em>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">▸</span>
                  <span><strong>Confidence Scoring:</strong> Computes statistical certainty for auditable inspection in the Noise Vault.</span>
                </li>
              </ul>
            </MagicBentoCard>

            {/* AGENT 2 CARD */}
            <MagicBentoCard
              colSpan={1}
              rowSpan={1}
              radius={18}
              enableBorderGlow={true}
              enableSpotlight={true}
              spotlightRadius={260}
              clickEffect={true}
              className="p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Agent 2: The Extractor</h4>
                  <span className="text-[10px] text-zinc-400">Entity &amp; Action Parser</span>
                </div>
              </div>

              <ul className="space-y-2 text-zinc-300 font-sans text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-mono">▸</span>
                  <span><strong>Date &amp; Time Normalization:</strong> Identifies deadlines ("Sunday 11:59 PM") and exports 1-click <code>.ics</code> calendar files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-mono">▸</span>
                  <span><strong>Link &amp; Document Categorization:</strong> Identifies Google Classroom, Drive, Superset, and PDF files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-mono">▸</span>
                  <span><strong>Action Synthesis:</strong> Summarizes the task into a single directive (e.g. "Submit assignment via LMS").</span>
                </li>
              </ul>
            </MagicBentoCard>
          </MagicBento>

          {/* Benchmarks & Highlights */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.06] space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              System Benchmarks & Key Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.05]">
                <div className="text-xl font-bold text-emerald-400">~90%</div>
                <div className="text-[11px] text-zinc-400">Spam Reduction</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.05]">
                <div className="text-xl font-bold text-cyan-400">100%</div>
                <div className="text-[11px] text-zinc-400">Client-Side Privacy</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.05]">
                <div className="text-xl font-bold text-amber-400">&lt; 300ms</div>
                <div className="text-[11px] text-zinc-400">Parse Latency</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-zinc-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition"
          >
            Close
          </button>
        </div>

      </div>
      </BorderGlow>
    </div>
  );
}

