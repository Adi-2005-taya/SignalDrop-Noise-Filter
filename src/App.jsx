import React, { useState, useEffect, useMemo } from 'react';
import Preloader from './components/Preloader';
import CardNav from './components/CardNav';
import MagicBento from './components/MagicBento';
import logo from './logo.svg';
import Hero from './components/Hero';
import AeroShards from './components/AeroShards';
import AgentTelemetryBar from './components/AgentTelemetryBar';
import KanbanBoard from './components/KanbanBoard';
import ChatInputModal from './components/ChatInputModal';
import DigestModal from './components/DigestModal';
import ItemDetailModal from './components/ItemDetailModal';
import AgentInfoModal from './components/AgentInfoModal';
import { SAMPLE_CHATS } from './data/sampleChats';
import { processChatPipeline } from './engine/agentPipeline';
import { downloadSampleChatFile } from './engine/downloadSample';
import { 
  UploadCloud,
  LayoutGrid
} from 'lucide-react';

const STORAGE_KEY = 'signaldrop_current_data';

export default function App() {
  const [currentGroupName, setCurrentGroupName] = useState(SAMPLE_CHATS[0].name);
  const [pipelineData, setPipelineData] = useState({
    rawMessages: [],
    deadlines: [],
    resources: [],
    announcements: [],
    spam: [],
    stats: {
      totalMessages: 0,
      noiseFiltered: 0,
      noisePercentage: 0,
      signalCount: 0,
      timeSavedMinutes: 0
    }
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSpamColumn, setShowSpamColumn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Modals
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isDigestOpen, setIsDigestOpen] = useState(false);
  const [isAgentInfoOpen, setIsAgentInfoOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  // Initialize
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.rawText) {
          let safeName = parsed.groupName;
          if (!safeName || safeName.includes('\n') || safeName.startsWith('[') || safeName.length > 50) {
            safeName = 'CS Dept Official // 2026 Batch';
          }
          handleProcessChat(parsed.rawText, safeName);
          return;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    handleProcessChat(SAMPLE_CHATS[0].rawText, SAMPLE_CHATS[0].name);
  }, []);

  const handleProcessChat = (rawText, groupName) => {
    setIsProcessing(true);
    let finalName = (groupName || '').trim();
    // Guard against entire chat dump being passed as group name
    if (!finalName || finalName.includes('\n') || finalName.startsWith('[') || finalName.length > 50) {
      finalName = 'CS Dept Official // 2026 Batch';
    }
    setCurrentGroupName(finalName);

    setTimeout(() => {
      const result = processChatPipeline(rawText);
      setPipelineData(result);
      setIsProcessing(false);
      setSelectedCategory('ALL');
      setSelectedCourse('ALL');

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          groupName: finalName,
          rawText
        }));
      } catch (e) {
        // quota or private mode fallback
      }
    }, 550);
  };

  // Whole-page Drag & Drop listeners for .txt files
  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDraggingFile(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (e.relatedTarget === null) {
        setIsDraggingFile(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDraggingFile(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.txt')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const text = event.target.result;
            const cleanName = file.name.replace(/WhatsApp Chat - /i, '').replace(/\.[^/.]+$/, '').trim();
            handleProcessChat(text, cleanName || 'Imported Chat');
          };
          reader.readAsText(file);
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Toggle card completion
  const handleToggleComplete = (cardId) => {
    setPipelineData(prev => {
      const updateList = (list) =>
        list.map(item => item.id === cardId ? { ...item, isCompleted: !item.isCompleted } : item);

      return {
        ...prev,
        deadlines: updateList(prev.deadlines),
        resources: updateList(prev.resources),
        announcements: updateList(prev.announcements)
      };
    });
  };

  // Restore spam item
  const handleRestoreSpam = (spamMsg) => {
    const promotedCard = {
      id: `restored-${Date.now().toString(36)}`,
      originalMessage: spamMsg,
      category: 'ANNOUNCEMENT',
      sender: spamMsg.sender,
      time: spamMsg.time,
      date: spamMsg.date,
      content: spamMsg.text,
      links: [],
      documents: [],
      extractedDate: null,
      courseCode: 'RESTORED',
      urgency: 'NORMAL',
      actionSummary: spamMsg.text.slice(0, 60),
      isCompleted: false,
      pinned: true
    };

    setPipelineData(prev => ({
      ...prev,
      announcements: [promotedCard, ...prev.announcements],
      spam: prev.spam.filter(s => s.id !== spamMsg.id),
      stats: {
        ...prev.stats,
        noiseFiltered: Math.max(0, prev.stats.noiseFiltered - 1),
        signalCount: prev.stats.signalCount + 1
      }
    }));
  };

  // Course codes
  const availableCourses = useMemo(() => {
    const set = new Set();
    [...pipelineData.deadlines, ...pipelineData.resources, ...pipelineData.announcements].forEach(item => {
      if (item.courseCode) set.add(item.courseCode);
    });
    return Array.from(set);
  }, [pipelineData]);

  // Filter items
  const filterList = (list) => {
    return list.filter(item => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCourse !== 'ALL' && item.courseCode !== selectedCourse) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContent = item.content.toLowerCase().includes(q);
        const matchesSender = item.sender.toLowerCase().includes(q);
        const matchesCourse = item.courseCode.toLowerCase().includes(q);
        const matchesSummary = (item.actionSummary || '').toLowerCase().includes(q);
        return matchesContent || matchesSender || matchesCourse || matchesSummary;
      }
      return true;
    });
  };

  const navItems = useMemo(() => [
    {
      label: 'About',
      description: 'The people and the story behind the studio.',
      links: [
        { 
          label: 'Company', 
          href: '#company',
          onClick: () => setIsAgentInfoOpen(true)
        },
        { 
          label: 'Careers', 
          href: '#careers',
          onClick: () => {
            alert('GeNarrative Clash 2026: Star the repository to retain eligibility for the Grand Finale!');
          }
        }
      ]
    },
    {
      label: 'Projects',
      description: 'Selected work from the last few years.',
      links: [
        { 
          label: 'Featured', 
          href: '#featured',
          onClick: () => {
            const el = document.getElementById('magic-bento-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        },
        { 
          label: 'Case studies', 
          href: '#case-studies',
          onClick: () => setIsAgentInfoOpen(true)
        }
      ]
    },
    {
      label: 'Contact',
      description: 'Say hello, we read everything.',
      links: [
        { label: 'Email', href: 'mailto:hello@example.com' },
        { label: 'LinkedIn', href: 'https://linkedin.com' }
      ]
    }
  ], []);

  const filteredDeadlines = useMemo(() => filterList(pipelineData.deadlines), [pipelineData.deadlines, searchQuery, selectedCategory, selectedCourse]);
  const filteredResources = useMemo(() => filterList(pipelineData.resources), [pipelineData.resources, searchQuery, selectedCategory, selectedCourse]);
  const filteredAnnouncements = useMemo(() => filterList(pipelineData.announcements), [pipelineData.announcements, searchQuery, selectedCategory, selectedCourse]);

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-200 flex flex-col font-sans selection:bg-purple-500/20 selection:text-purple-300 relative overflow-x-hidden">
      
      {/* Interactive CrystalizedBall Preloader */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Full-Page Background AeroShards covering all pages */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AeroShards
          shardColor="#896ABD"
          accentColor="#A855F7"
          placement="full"
          material="glass"
          markers="plus"
          count={1300}
          depthOfField={0.75}
          vignette={0.3}
          mouseInteraction
          pulseOnClick
          holdToGather
        />
      </div>

      {/* Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-md border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
          <UploadCloud className="w-16 h-16 text-emerald-300 animate-bounce mb-3" />
          <h2 className="text-xl font-bold text-white mb-1 font-mono">Drop Chat Export (.txt)</h2>
          <p className="text-xs text-emerald-200 font-mono">Release to parse & filter</p>
        </div>
      )}

      {/* Main Page Layout floating on top of AeroShards */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation via React Bits CardNav */}
        <CardNav
          logo={logo}
          logoAlt="SignalDrop"
          items={navItems}
          cta={{ 
            label: 'Get started', 
            href: '/signup',
            onClick: () => setIsIngestOpen(true)
          }}
          cardEffect="rise"
          openOn="click"
          stats={pipelineData.stats}
          showSpamColumn={showSpamColumn}
          onToggleSpam={() => setShowSpamColumn(!showSpamColumn)}
          onOpenDigest={() => setIsDigestOpen(true)}
          onDownloadSample={downloadSampleChatFile}
          onReplayPreloader={() => setIsLoading(true)}
        />

        {/* Main Feed Hero Card */}
        <Hero
          groupName={currentGroupName}
          stats={pipelineData.stats}
          onOpenIngest={() => setIsIngestOpen(true)}
          onOpenDigest={() => setIsDigestOpen(true)}
          onToggleSpam={() => setShowSpamColumn(!showSpamColumn)}
          showSpamColumn={showSpamColumn}
        />

        {/* Magic Bento Section */}
        <section id="magic-bento-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Magic Bento Overview
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              <span>Interactive Spotlight &amp; Reactive Border Glow</span>
            </div>
          </div>

          <MagicBento
            columns={4}
            rowHeight={200}
            gap={12}
            radius={20}
            enableBorderGlow={true}
            enableSpotlight={true}
            spotlightRadius={300}
            clickEffect={true}
            stats={pipelineData.stats}
            onOpenIngest={() => setIsIngestOpen(true)}
            onOpenDigest={() => setIsDigestOpen(true)}
            onDownloadSample={downloadSampleChatFile}
            onToggleSpam={() => setShowSpamColumn(!showSpamColumn)}
          />
        </section>

        {/* Telemetry Bar */}
        <AgentTelemetryBar
          groupName={currentGroupName}
          stats={pipelineData.stats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCourses={availableCourses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          isProcessing={isProcessing}
        />

        {/* Main Kanban Board */}
        <main className="flex-1">
          <KanbanBoard
            deadlines={filteredDeadlines}
            resources={filteredResources}
            announcements={filteredAnnouncements}
            spam={pipelineData.spam}
            showSpamColumn={showSpamColumn}
            onToggleComplete={handleToggleComplete}
            onViewOriginal={(item) => setDetailItem(item)}
            onRestoreSpam={handleRestoreSpam}
            onOpenIngest={() => setIsIngestOpen(true)}
          />
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-white/[0.04] bg-[#05070b]/60 backdrop-blur-md py-3 px-4 text-[11px] font-mono text-zinc-600">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span>SignalDrop</span>
            <button
              onClick={() => setIsAgentInfoOpen(true)}
              className="hover:text-zinc-400 transition"
            >
              Docs
            </button>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ChatInputModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onProcessChat={handleProcessChat}
      />

      <DigestModal
        isOpen={isDigestOpen}
        onClose={() => setIsDigestOpen(false)}
        deadlines={pipelineData.deadlines}
        resources={pipelineData.resources}
        announcements={pipelineData.announcements}
        groupName={currentGroupName}
      />

      <ItemDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
      />

      <AgentInfoModal
        isOpen={isAgentInfoOpen}
        onClose={() => setIsAgentInfoOpen(false)}
      />

    </div>
  );
}
