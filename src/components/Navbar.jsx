import React from 'react';
import { downloadSampleChatFile } from '../engine/downloadSample';
import { 
  Filter, 
  Plus, 
  Share2, 
  Trash2,
  Cpu,
  Download
} from 'lucide-react';

export default function Navbar({ 
  stats, 
  onOpenIngest, 
  onOpenDigest, 
  showSpamColumn, 
  setShowSpamColumn,
  onOpenAgentInfo,
  onReplayPreloader
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo & Preloader trigger */}
        <button 
          onClick={onReplayPreloader}
          className="flex items-center gap-2.5 hover:opacity-90 transition group text-left"
          title="Replay Crystalized Ball Intro"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:border-fuchsia-500/50 group-hover:text-fuchsia-400 transition">
            <Filter className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-mono">
            SignalDrop
          </span>
        </button>

        {/* Live Filter Stats */}
        {stats && stats.totalMessages > 0 && (
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/[0.08] text-xs font-mono">
            <span className="text-zinc-400">{stats.totalMessages} raw</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold">{stats.noisePercentage}% filtered</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">~{stats.timeSavedMinutes}m saved</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Noise Vault */}
          <button
            onClick={() => setShowSpamColumn(!showSpamColumn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
              showSpamColumn 
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border-white/[0.06]'
            }`}
            title="Toggle Noise Vault"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Noise Vault</span>
          </button>

          {/* Share Digest Button */}
          <button
            onClick={onOpenDigest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Digest</span>
          </button>

          {/* Download Sample Chat Button */}
          <button
            onClick={downloadSampleChatFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition shadow-sm"
            title="Download fake WhatsApp chat export (.txt) with deadlines & resources"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Fake Chat .txt</span>
            <span className="md:hidden">.txt</span>
          </button>

          {/* Ingest / Forward Chat Button */}
          <button
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>

      </div>
    </header>
  );
}
