import React from 'react';
import BorderGlow from './BorderGlow';
import { downloadSampleChatFile } from '../engine/downloadSample';
import { 
  Plus, 
  Share2, 
  Trash2,
  Sparkles,
  Download
} from 'lucide-react';

export default function Hero({ 
  groupName, 
  stats, 
  onOpenIngest, 
  onOpenDigest, 
  onToggleSpam, 
  showSpamColumn 
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 relative z-10 w-full">
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
        className="shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="p-6 sm:p-7 backdrop-blur-xl">
          {/* Card Header & Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                <span className="text-purple-300 font-bold uppercase tracking-wider">Active Group</span>
              </div>
              
              {stats && stats.totalMessages > 0 && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">{stats.noisePercentage}% noise stripped</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">~{stats.timeSavedMinutes}m saved</span>
                </div>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white truncate max-w-full">
              {typeof groupName === 'string' && !groupName.includes('\n') && !groupName.startsWith('[') && groupName.length < 50
                ? groupName
                : 'CS Dept Official // 2026 Batch'}
            </h2>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              College chat filter separating deadlines, documents, and official notices from group chatter.
            </p>
          </div>

          {/* Card Actions & Telemetry Pills */}
          <div className="pt-4 mt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenIngest}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold bg-purple-500 hover:bg-purple-400 text-white transition shadow-[0_0_25px_rgba(168,85,247,0.4)] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Import Chat</span>
              </button>

              <button
                onClick={onOpenDigest}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.08] transition"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Export Digest</span>
              </button>

              <button
                onClick={downloadSampleChatFile}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition shadow-sm"
                title="Download realistic fake WhatsApp group chat export (.txt) with deadlines & resources"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sample .txt</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-white/[0.08] text-purple-300 font-semibold">
                {stats?.signalCount || 0} signals
              </span>

              <button
                onClick={onToggleSpam}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition ${
                  showSpamColumn
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-zinc-900/90 text-zinc-400 border-white/[0.08] hover:text-zinc-200'
                }`}
              >
                <Trash2 className="w-3 h-3" />
                <span>{stats?.noiseFiltered || 0} noise</span>
              </button>
            </div>
          </div>

        </div>
      </BorderGlow>
    </div>
  );
}
