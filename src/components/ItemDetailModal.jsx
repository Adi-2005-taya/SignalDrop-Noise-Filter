import React from 'react';
import BorderGlow from './BorderGlow';
import { 
  X, 
  MessageSquare, 
  Clock, 
  User, 
  Tag, 
  ShieldAlert, 
  ExternalLink,
  Bot
} from 'lucide-react';

export default function ItemDetailModal({ 
  item, 
  onClose 
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#0c0f18"
        borderRadius={24}
        glowRadius={44}
        glowIntensity={1.0}
        colors={['#06b6d4', '#38bdf8', '#c084fc']}
        className="w-full max-w-xl shadow-2xl"
      >
        <div className="relative w-full rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Message Origin & Details</h2>
              <p className="text-xs text-zinc-400 font-mono">Original WhatsApp message context and parsed details</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-white/[0.1] text-zinc-200">
              Subject: {item.courseCode}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-white/[0.1] text-cyan-300">
              Type: {item.category}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-white/[0.1] text-amber-300">
              Priority: {item.urgency}
            </span>
          </div>

          {/* Synthesized Action Item */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
              Extracted Action Summary:
            </span>
            <p className="text-sm font-semibold text-emerald-200">
              {item.actionSummary || item.content}
            </p>
          </div>

          {/* Original WhatsApp Message Box */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
              <span>Original WhatsApp Message:</span>
              <span>{item.date} • {item.time}</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] text-xs font-mono leading-relaxed text-zinc-300">
              <div className="font-bold text-emerald-400 mb-1">
                {item.sender}:
              </div>
              <p className="whitespace-pre-wrap font-sans text-sm text-zinc-200">
                {item.content}
              </p>
            </div>
          </div>

          {/* Sorter classification reason */}
          {item.originalMessage && item.originalMessage.sorterReason && (
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/[0.06] text-xs font-mono text-zinc-400 flex items-start gap-2">
              <Bot className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-300 font-semibold">Classification Decision: </span>
                <span>{item.originalMessage.sorterReason} (Certainty: {Math.round((item.originalMessage.sorterConfidence || 0.95) * 100)}%)</span>
              </div>
            </div>
          )}

          {/* Links list if any */}
          {item.links && item.links.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-zinc-400 block">Extracted Links:</span>
              {item.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition"
                >
                  <span className="truncate">{link.url}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-zinc-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition"
          >
            Dismiss
          </button>
        </div>

      </div>
      </BorderGlow>
    </div>
  );
}

