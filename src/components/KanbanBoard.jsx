import React from 'react';
import KanbanCard from './KanbanCard';
import BorderGlow from './BorderGlow';
import { 
  Clock, 
  FileText, 
  Megaphone, 
  Trash2, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function KanbanBoard({
  deadlines,
  resources,
  announcements,
  spam,
  showSpamColumn,
  onToggleComplete,
  onViewOriginal,
  onRestoreSpam,
  onOpenIngest,
  onLoadSample
}) {
  const allSignalsEmpty = deadlines.length === 0 && resources.length === 0 && announcements.length === 0;
  const noMessagesLoaded = allSignalsEmpty && (!spam || spam.length === 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      
      {/* If entirely empty (no chat loaded yet) */}
      {noMessagesLoaded ? (
        <div className="max-w-lg mx-auto my-10">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#0c0f18"
            borderRadius={24}
            glowRadius={40}
            glowIntensity={0.9}
            colors={['#a855f7', '#38bdf8', '#10b981']}
          >
            <div className="text-center py-14 px-8">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/[0.1] text-purple-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-mono">No Chat Export Loaded</h3>
              <p className="text-xs text-zinc-400 mb-6 font-mono leading-relaxed">
                Import or paste a WhatsApp group export (.txt or .zip) to automatically strip noise and isolate deadlines, resources, and announcements.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onOpenIngest}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-mono font-semibold text-xs transition shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Import Chat</span>
                </button>
                {onLoadSample && (
                  <button
                    onClick={onLoadSample}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.1] text-zinc-300 font-mono text-xs transition"
                  >
                    <span>Try Sample Demo</span>
                  </button>
                )}
              </div>
            </div>
          </BorderGlow>
        </div>
      ) : (
        /* Kanban Columns Grid */
        <div className={`grid grid-cols-1 md:grid-cols-2 ${showSpamColumn ? 'xl:grid-cols-4' : 'lg:grid-cols-3'} gap-4 items-start`}>
        
        {/* ================= COLUMN 1: DEADLINES ================= */}
        <BorderGlow
          edgeSensitivity={26}
          glowColor="40 80 80"
          backgroundColor="#0a0d14"
          borderRadius={20}
          glowRadius={36}
          glowIntensity={0.8}
          colors={['#f43f5e', '#fb7185', '#c084fc']}
        >
          <div className="flex flex-col gap-2.5 min-h-[460px] p-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-rose-500/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider">
                  Deadlines
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                {deadlines.length}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2.5 pt-1 flex-1">
              {deadlines.map(item => (
                <KanbanCard 
                  key={item.id} 
                  item={item} 
                  onToggleComplete={onToggleComplete}
                  onViewOriginal={onViewOriginal}
                />
              ))}

              {deadlines.length === 0 && (
                <div className="h-32 border border-dashed border-rose-500/20 rounded-lg flex items-center justify-center p-3 text-center text-xs text-zinc-500 font-mono">
                  No pending deadlines
                </div>
              )}
            </div>
          </div>
        </BorderGlow>

        {/* ================= COLUMN 2: RESOURCES ================= */}
        <BorderGlow
          edgeSensitivity={26}
          glowColor="40 80 80"
          backgroundColor="#0a0d14"
          borderRadius={20}
          glowRadius={36}
          glowIntensity={0.8}
          colors={['#06b6d4', '#38bdf8', '#818cf8']}
        >
          <div className="flex flex-col gap-2.5 min-h-[460px] p-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider">
                  Resources
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                {resources.length}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2.5 pt-1 flex-1">
              {resources.map(item => (
                <KanbanCard 
                  key={item.id} 
                  item={item} 
                  onToggleComplete={onToggleComplete}
                  onViewOriginal={onViewOriginal}
                />
              ))}

              {resources.length === 0 && (
                <div className="h-32 border border-dashed border-cyan-500/20 rounded-lg flex items-center justify-center p-3 text-center text-xs text-zinc-500 font-mono">
                  No resource links
                </div>
              )}
            </div>
          </div>
        </BorderGlow>

        {/* ================= COLUMN 3: ANNOUNCEMENTS ================= */}
        <BorderGlow
          edgeSensitivity={26}
          glowColor="40 80 80"
          backgroundColor="#0a0d14"
          borderRadius={20}
          glowRadius={36}
          glowIntensity={0.8}
          colors={['#f59e0b', '#fbbf24', '#c084fc']}
        >
          <div className="flex flex-col gap-2.5 min-h-[460px] p-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider">
                  Announcements
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                {announcements.length}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2.5 pt-1 flex-1">
              {announcements.map(item => (
                <KanbanCard 
                  key={item.id} 
                  item={item} 
                  onToggleComplete={onToggleComplete}
                  onViewOriginal={onViewOriginal}
                />
              ))}

              {announcements.length === 0 && (
                <div className="h-32 border border-dashed border-amber-500/20 rounded-lg flex items-center justify-center p-3 text-center text-xs text-zinc-500 font-mono">
                  No active notices
                </div>
              )}
            </div>
          </div>
        </BorderGlow>

        {/* ================= COLUMN 4: SPAM VAULT ================= */}
        {showSpamColumn && (
          <BorderGlow
            edgeSensitivity={26}
            glowColor="40 80 80"
            backgroundColor="#0d0b12"
            borderRadius={20}
            glowRadius={36}
            glowIntensity={0.8}
            colors={['#71717a', '#a1a1aa', '#c084fc']}
          >
            <div className="flex flex-col gap-2.5 min-h-[460px] p-3.5">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider">
                    Noise Vault
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700 font-semibold">
                  {spam.length}
                </span>
              </div>

              {/* Spam Items */}
              <div className="space-y-2 pt-1 flex-1 max-h-[600px] overflow-y-auto pr-1">
                {spam.map((msg, index) => (
                  <div 
                    key={msg.id || index}
                    className="p-2.5 rounded-lg bg-zinc-950/70 border border-white/[0.04] text-xs font-mono text-zinc-400 group hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                      <span className="truncate max-w-[130px] text-zinc-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-zinc-300 mb-2 italic font-sans break-words line-clamp-2">
                      "{msg.text}"
                    </p>
                    
                    <div className="flex items-center justify-end text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-1">
                      <button
                        onClick={() => onRestoreSpam(msg)}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                        title="Restore to board"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                ))}

                {spam.length === 0 && (
                  <div className="py-12 text-center text-xs text-zinc-500 font-mono">
                    Empty
                  </div>
                )}
              </div>
            </div>
          </BorderGlow>
        )}

      </div>
      )}
    </div>
  );
}
