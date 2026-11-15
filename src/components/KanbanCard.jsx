import React, { useState } from 'react';
import BorderGlow from './BorderGlow';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  FileText, 
  CheckCircle, 
  Circle, 
  User, 
  Download, 
  Copy, 
  Check, 
  AlertCircle,
  ArrowUpRight,
  Eye,
  MessageSquare
} from 'lucide-react';
import { generateICSContent } from '../engine/agentPipeline';

export default function KanbanCard({ 
  item, 
  onToggleComplete, 
  onViewOriginal 
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const textToCopy = `${item.courseCode}: ${item.actionSummary || item.content}\n${item.extractedDate ? `Due: ${item.extractedDate}\n` : ''}${item.links.length > 0 ? `Link: ${item.links[0].url}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadICS = (e) => {
    e.stopPropagation();
    const icsData = generateICSContent(item);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${item.courseCode}-deadline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Urgency badge styling
  const urgencyConfig = {
    CRITICAL: {
      label: 'CRITICAL',
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    },
    HIGH: {
      label: 'HIGH',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    },
    MEDIUM: {
      label: 'NOTICE',
      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    },
    LOW: {
      label: 'INFO',
      badge: 'bg-zinc-800 text-zinc-400 border-white/[0.06]'
    }
  }[item.urgency] || { label: 'INFO', badge: 'bg-zinc-800 text-zinc-400 border-white/[0.06]' };

  const categoryGlowColors = {
    DEADLINE: ['#f43f5e', '#fb7185', '#c084fc'],
    RESOURCE: ['#06b6d4', '#38bdf8', '#818cf8'],
    ANNOUNCEMENT: ['#f59e0b', '#fbbf24', '#c084fc'],
    SPAM: ['#71717a', '#a1a1aa', '#c084fc']
  }[item.category] || ['#c084fc', '#f472b6', '#38bdf8'];

  return (
    <BorderGlow
      edgeSensitivity={25}
      glowColor="40 80 80"
      backgroundColor={item.isCompleted ? '#080c10' : '#0c0f18'}
      borderRadius={16}
      glowRadius={32}
      glowIntensity={0.85}
      coneSpread={22}
      animated={false}
      colors={categoryGlowColors}
      className={`transition-all duration-200 ${item.isCompleted ? 'opacity-60' : ''}`}
    >
      <div className="p-4 relative group">
      {/* Top Header: Course badge, Sender, Urgency */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800/90 border border-white/[0.1] text-zinc-200">
            {item.courseCode}
          </span>
          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${urgencyConfig.badge}`}>
            {urgencyConfig.label}
          </span>
        </div>

        {/* Sender & Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <User className="w-3 h-3 text-zinc-400" />
          <span className="truncate max-w-[110px]" title={item.sender}>{item.sender}</span>
          <span className="text-zinc-600">•</span>
          <span>{item.time}</span>
        </div>
      </div>

      {/* Main Action Title (Agent 2 synthesized) */}
      <div className="mb-2">
        <h4 className={`text-sm font-semibold tracking-tight text-zinc-100 flex items-start justify-between gap-2 ${
          item.isCompleted ? 'line-through text-zinc-400' : ''
        }`}>
          <span>{item.actionSummary || 'Action Item'}</span>
        </h4>
      </div>

      {/* Extracted Date / Deadline / Event Pill */}
      {item.extractedDate && (
        <div className={`mb-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
          item.category === 'DEADLINE'
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            : item.category === 'ANNOUNCEMENT'
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
        }`}>
          {item.category === 'DEADLINE' ? (
            <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <div className="truncate">
            <span className={`font-semibold ${
              item.category === 'DEADLINE' ? 'text-rose-200' : 'text-amber-200'
            }`}>
              {item.category === 'DEADLINE' ? 'Deadline: ' : 'Event Date: '}
            </span>
            <span>{item.extractedDate}</span>
          </div>
        </div>
      )}

      {/* Content Preview (Expandable) */}
      <div className="mb-3 text-xs text-zinc-300 leading-relaxed font-sans">
        <p className={expanded ? '' : 'line-clamp-2'}>
          {item.content}
        </p>
        {item.content.length > 110 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 mt-1 inline-block"
          >
            {expanded ? '▲ Collapse excerpt' : '▼ Read full text'}
          </button>
        )}
      </div>

      {/* Extracted Links */}
      {item.links && item.links.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {item.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition group/link"
            >
              <div className="flex items-center gap-2 truncate">
                <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="font-medium truncate">{link.label}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover/link:text-cyan-400 shrink-0" />
            </a>
          ))}
        </div>
      )}

      {/* Extracted Attached Files */}
      {item.documents && item.documents.length > 0 && (
        <div className="mb-3 space-y-1">
          {item.documents.map((doc, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/70 border border-white/[0.06] text-xs font-mono text-emerald-300"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{doc.name}</span>
              <span className="ml-auto text-[10px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {doc.extension}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {/* Mark Complete Checkbox */}
          <button
            onClick={() => onToggleComplete(item.id)}
            className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition"
            title={item.isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {item.isCompleted ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-400" />
            )}
            <span className="text-[11px]">{item.isCompleted ? 'Done' : 'Pending'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Calendar export if deadline */}
          {item.extractedDate && (
            <button
              onClick={handleDownloadICS}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-rose-300 transition"
              title="Add to Google Calendar / Apple Calendar (.ics)"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Clean Action */}
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title="Copy clean summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* View Raw WhatsApp Context */}
          <button
            onClick={() => onViewOriginal(item)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-cyan-300 transition"
            title="View original message context"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      </div>
    </BorderGlow>
  );
}

