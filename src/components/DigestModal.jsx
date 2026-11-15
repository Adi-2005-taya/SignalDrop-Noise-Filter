import React, { useState } from 'react';
import BorderGlow from './BorderGlow';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  MessageCircle,
  FileCheck
} from 'lucide-react';
import { generateWhatsAppDigest } from '../engine/agentPipeline';

export default function DigestModal({ 
  isOpen, 
  onClose, 
  deadlines, 
  resources, 
  announcements, 
  groupName 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const digestText = generateWhatsAppDigest(deadlines, resources, announcements, groupName);

  const handleCopy = () => {
    navigator.clipboard.writeText(digestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([digestText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${groupName.replace(/\s+/g, '_')}_SignalDrop_Digest.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#0c0f18"
        borderRadius={24}
        glowRadius={44}
        glowIntensity={1.0}
        colors={['#10b981', '#34d399', '#38bdf8']}
        className="w-full max-w-2xl shadow-2xl"
      >
        <div className="relative w-full rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Campus Focus Digest</h2>
              <p className="text-xs text-zinc-400 font-mono">1-click WhatsApp-ready summary to share back to your group</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Formatted with WhatsApp markdown (*bold*, bullet points) ready to paste into class groups.</span>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-zinc-950 border border-white/[0.1] text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {digestText}
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-zinc-950/60 font-mono text-xs">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition"
          >
            <Download className="w-4 h-4" />
            <span>Download .txt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy WhatsApp Digest</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
      </BorderGlow>
    </div>
  );
}

