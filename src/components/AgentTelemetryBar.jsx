import React, { useState, useEffect } from 'react';
import LatticeLoader from './LatticeLoader';
import { 
  Search 
} from 'lucide-react';

export default function AgentTelemetryBar({
  groupName,
  stats,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  availableCourses,
  selectedCourse,
  setSelectedCourse,
  isProcessing
}) {
  const [isDone, setIsDone] = useState(true);

  // Trigger working state during filtering, searching, or processing
  useEffect(() => {
    if (isProcessing) {
      setIsDone(false);
      return;
    }
    setIsDone(false);
    const timer = setTimeout(() => {
      setIsDone(true);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedCourse, isProcessing]);

  return (
    <div className="border-b border-white/[0.06] bg-[#090b12]/80 backdrop-blur-md py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Group Name + Noise / Signal Counts */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${stats?.totalMessages > 0 ? 'bg-emerald-400' : 'bg-zinc-600'}`}></span>
            <span 
              className="text-sm font-bold text-white font-mono tracking-tight truncate max-w-[180px] sm:max-w-[240px] md:max-w-[320px]"
              title={typeof groupName === 'string' && groupName.length < 60 ? groupName : 'No Chat Loaded'}
            >
              {typeof groupName === 'string' && !groupName.includes('\n') && !groupName.startsWith('[') && groupName.length < 50
                ? groupName
                : (stats?.totalMessages > 0 ? 'Imported WhatsApp Group' : 'No Chat Loaded')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
              {stats.noiseFiltered} noise
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-emerald-400 font-medium">
              {stats.signalCount} signals
            </span>
          </div>
        </div>

        {/* Center: Multi-Agent Filter & Process Animation */}
        <div className="flex items-center justify-center my-0.5 md:my-0">
          <LatticeLoader
            status={isDone ? 'done' : 'working'}
            label="Thinking"
            doneLabel="Done in"
            errorLabel="Failed after"
            pattern="orbit"
            grid={3}
            shape="round"
            doneColor="#22c55e"
            errorColor="#ef4444"
            cellSize={6}
            gap={2}
            fontSize={14}
            step={90}
            idleOpacity={0.15}
            glow={false}
            glowColor=""
            showTimer
          />
        </div>

        {/* Right: Search & Minimal Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Minimal Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1 text-xs bg-zinc-900/90 border border-white/[0.08] rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Minimal Filter Tabs */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded transition ${
                selectedCategory === 'ALL'
                  ? 'bg-zinc-200 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
              }`}
            >
              All
            </button>

            <button
              onClick={() => setSelectedCategory('DEADLINE')}
              className={`px-2.5 py-1 rounded transition ${
                selectedCategory === 'DEADLINE'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
              }`}
            >
              Deadlines
            </button>

            <button
              onClick={() => setSelectedCategory('RESOURCE')}
              className={`px-2.5 py-1 rounded transition ${
                selectedCategory === 'RESOURCE'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
              }`}
            >
              Resources
            </button>

            <button
              onClick={() => setSelectedCategory('ANNOUNCEMENT')}
              className={`px-2.5 py-1 rounded transition ${
                selectedCategory === 'ANNOUNCEMENT'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
              }`}
            >
              Notices
            </button>

            {availableCourses.length > 1 && (
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-zinc-900 border border-white/[0.08] text-zinc-300 text-xs rounded px-2 py-1 font-mono focus:outline-none"
              >
                <option value="ALL">All Subjects</option>
                {availableCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
