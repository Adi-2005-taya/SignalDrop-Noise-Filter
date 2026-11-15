import React from 'react';
import BorderGlow from './BorderGlow';
import { 
  Plus, 
  Share2, 
  Trash2,
  Sparkles
} from 'lucide-react';

export default function Hero({ 
  groupName, 
  stats, 
  onOpenIngest, 
  onOpenDigest, 
  onToggleSpam, 
  showSpamColumn,
  onLoadSample
}) {
  const hasMessages = stats && stats.totalMessages > 0;

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
                <span className={`w-2 h-2 rounded-full ${hasMessages ? 'bg-purple-400 animate-ping' : 'bg-zinc-600'}`}></span>
                <span className={`${hasMessages ? 'text-purple-300' : 'text-zinc-400'} font-bold uppercase tracking-wider`}>
                  {hasMessages ? 'Active Group' : 'Awaiting Chat'}
                </span>
              </div>
              
              {hasMessages ? (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">{stats.noisePercentage}% noise stripped</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">~{stats.timeSavedMinutes}m saved</span>
                </div>
              ) : (
                <div className="text-xs font-mono text-zinc-500">
                  Ready for .txt &amp; .zip
                </div>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white truncate max-w-full">
              {hasMessages
                ? (typeof groupName === 'string' && !groupName.includes('\n') && !groupName.startsWith('[') && groupName.length < 50
                    ? groupName
                    : 'Imported WhatsApp Group')
                : 'No Chat Loaded'}
            </h2>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              {hasMessages
                ? 'College chat filter separating deadlines, documents, and official notices from group chatter.'
                : 'Paste or drop your raw WhatsApp group export (.txt or .zip) to automatically strip chatter and isolate deadlines, links, and notices.'}
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

              {hasMessages ? (
                <button
                  onClick={onOpenDigest}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.08] transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Export Digest</span>
                </button>
              ) : onLoadSample ? (
                <button
                  onClick={onLoadSample}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.08] transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Load Sample Demo</span>
                </button>
              ) : null}
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
