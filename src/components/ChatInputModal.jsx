import React, { useState, useEffect } from 'react';
import LatticeLoader from './LatticeLoader';
import BorderGlow from './BorderGlow';
import { downloadSampleChatFile } from '../engine/downloadSample';
import { 
  X, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  ArrowRight, 
  Bot, 
  CheckCircle,
  Terminal,
  Clipboard,
  Smartphone,
  Laptop,
  Check,
  AlertCircle,
  Download
} from 'lucide-react';
import { SAMPLE_CHATS } from '../data/sampleChats';
import { parseRawChat } from '../engine/agentPipeline';

export default function ChatInputModal({ 
  isOpen, 
  onClose, 
  onProcessChat 
}) {
  const [tab, setTab] = useState('paste'); // 'paste' | 'upload' | 'samples' | 'guide'
  const [pastedText, setPastedText] = useState('');
  const [customGroupName, setCustomGroupName] = useState('');
  const [processingState, setProcessingState] = useState(null); // null | 'sorting' | 'extracting' | 'done'
  const [parsedPreviewCount, setParsedPreviewCount] = useState(0);
  const [clipboardStatus, setClipboardStatus] = useState('');

  // Update preview count dynamically
  useEffect(() => {
    if (pastedText.trim()) {
      const parsed = parseRawChat(pastedText);
      setParsedPreviewCount(parsed.length);
    } else {
      setParsedPreviewCount(0);
    }
  }, [pastedText]);

  if (!isOpen) return null;

  const handleSelectSample = (sample) => {
    simulatePipeline(sample.rawText, sample.name);
  };

  const handleCustomSubmit = () => {
    let text = pastedText.trim();
    let name = customGroupName.trim();

    // Guard: if user mistakenly pasted the full chat into the group name field
    if (name.includes('\n') || name.startsWith('[') || name.length > 50) {
      if (!text) {
        text = name;
      }
      name = 'Imported WhatsApp Group';
    }

    if (!text) return;
    simulatePipeline(text, name || 'Imported WhatsApp Group');
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPastedText(text);
        setClipboardStatus('Pasted from clipboard!');
        setTimeout(() => setClipboardStatus(''), 2500);
      }
    } catch (err) {
      setClipboardStatus('Please press Ctrl+V in the box below');
      setTimeout(() => setClipboardStatus(''), 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setPastedText(text);
      const cleanName = file.name
        .replace(/WhatsApp Chat - /i, '')
        .replace(/\.[^/.]+$/, '')
        .trim();
      setCustomGroupName(cleanName || 'Imported WhatsApp Group');
      setTab('paste');
    };
    reader.readAsText(file);
  };

  const simulatePipeline = (text, name) => {
    setProcessingState('sorting');
    setTimeout(() => {
      setProcessingState('extracting');
      setTimeout(() => {
        setProcessingState('done');
        setTimeout(() => {
          onProcessChat(text, name);
          setProcessingState(null);
          onClose();
        }, 500);
      }, 700);
    }, 600);
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
        colors={['#10b981', '#38bdf8', '#c084fc']}
        className="w-full max-w-3xl shadow-2xl"
      >
        <div className="relative w-full rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Input Real Campus Chat Data</h2>
              <p className="text-xs text-zinc-400 font-mono">Paste chat text, upload .txt export, or test realistic samples</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing Overlay if pipeline is active */}
        {processingState && (
          <div className="absolute inset-0 z-50 bg-[#090b11]/95 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4">
              <LatticeLoader
                status={processingState === 'done' ? 'done' : 'working'}
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

            <div className="space-y-4 max-w-md w-full font-mono text-left bg-zinc-950 p-4 rounded-xl border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">PIPELINE EXECUTION:</span>
                <span className="text-emerald-400 font-bold animate-pulse">FILTERING NOISE</span>
              </div>

              <div className={`flex items-center gap-2.5 text-xs ${processingState === 'sorting' ? 'text-cyan-400 font-semibold' : 'text-zinc-500'}`}>
                {processingState === 'sorting' ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>[Agent 1: Sorter] Categorizing chatter vs actionable signals...</span>
              </div>

              <div className={`flex items-center gap-2.5 text-xs ${processingState === 'extracting' ? 'text-amber-400 font-semibold' : processingState === 'done' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                {processingState === 'extracting' ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : processingState === 'done' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-zinc-700" />
                )}
                <span>[Agent 2: Extractor] Extracting deadlines, drive links & actions...</span>
              </div>

              <div className={`flex items-center gap-2.5 text-xs ${processingState === 'done' ? 'text-emerald-400 font-semibold' : 'text-zinc-600'}`}>
                {processingState === 'done' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-zinc-700" />
                )}
                <span>[Focus Board] Rendering Zero-Doomscroll Kanban Board...</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tabs */}
        <div className="flex border-b border-white/[0.08] px-6 bg-zinc-900/40 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setTab('paste')}
            className={`py-3 px-4 border-b-2 font-medium shrink-0 transition ${
              tab === 'paste'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📋 Paste Real Chat Text
          </button>

          <button
            onClick={() => setTab('upload')}
            className={`py-3 px-4 border-b-2 font-medium shrink-0 transition ${
              tab === 'upload'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📁 Upload .txt Export
          </button>

          <button
            onClick={() => setTab('samples')}
            className={`py-3 px-4 border-b-2 font-medium shrink-0 transition ${
              tab === 'samples'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ⚡ Demo College Scenarios
          </button>

          <button
            onClick={() => setTab('guide')}
            className={`py-3 px-4 border-b-2 font-medium shrink-0 transition ${
              tab === 'guide'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            💡 How to Export from WhatsApp
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: PASTE REAL CHAT */}
          {tab === 'paste' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Group / Course Name (Optional):
                  </label>
                  <input
                    type="text"
                    value={customGroupName}
                    onChange={(e) => setCustomGroupName(e.target.value)}
                    placeholder="e.g. CS-401 Machine Learning or B.Tech Section C"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/[0.1] rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:self-end">
                  <button
                    onClick={handlePasteFromClipboard}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-cyan-300 border border-cyan-500/20 transition"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste from Clipboard</span>
                  </button>
                </div>
              </div>

              {clipboardStatus && (
                <div className="text-xs font-mono text-emerald-400 animate-in fade-in">
                  ✓ {clipboardStatus}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
                  <span>Paste raw WhatsApp, Telegram or email text:</span>
                  {parsedPreviewCount > 0 && (
                    <span className="text-emerald-400 font-bold">
                      ✓ {parsedPreviewCount} message{parsedPreviewCount > 1 ? 's' : ''} detected
                    </span>
                  )}
                </div>

                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`You can paste any real format:\n\n1. Standard WhatsApp export:\n12/10/26, 14:32 - Prof. Rao: Assignment 2 due Friday 11:59 PM: https://classroom.google.com/...\n12/10/26, 14:33 - Aryan: ok sir\n12/10/26, 14:34 - Sneha: +1\n\n2. Direct Web copy:\nProf. Rao: Midterm exam on Monday at 2 PM in Hall 3.\nRohan: ok sir\n\n3. Single announcement notice without timestamps.`}
                  className="w-full px-3 py-2.5 text-xs bg-zinc-950 border border-white/[0.1] rounded-lg text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setPastedText('')}
                  disabled={!pastedText}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                >
                  Clear Box
                </button>

                <button
                  onClick={handleCustomSubmit}
                  disabled={!pastedText.trim()}
                  className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-zinc-950 transition flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Filter Noise & Run Agents</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD .TXT FILE */}
          {tab === 'upload' && (
            <div className="space-y-4">
              {/* Quick Sample Download Callout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-bold block">Need a test WhatsApp export?</span>
                    <span className="text-zinc-400 text-[11px]">Download our realistic campus chat with deadlines, links & circulars.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleChatFile}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs transition shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>

              <label className="border-2 border-dashed border-white/[0.15] hover:border-emerald-500/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-zinc-950/40 hover:bg-zinc-900/40 transition group">
                <UploadCloud className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition mb-3" />
                <span className="text-sm font-semibold text-white mb-1">Select or drag & drop WhatsApp .txt export</span>
                <span className="text-xs text-zinc-400 font-mono mb-3">Compatible with all Android and iOS WhatsApp backups</span>
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-white/[0.08]">
                  Browse Computer (.txt)
                </span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs font-mono text-zinc-400 space-y-1">
                <div className="text-zinc-300 font-bold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Quick Export Shortcut:</span>
                </div>
                <p className="font-sans text-zinc-400">
                  In WhatsApp, open any group → Tap <strong>⋮ (Three dots)</strong> or group name → <strong>More</strong> → <strong>Export Chat</strong> → <strong>Without Media</strong>. Then upload the generated <code>.txt</code> file here!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DEMO COLLEGE SCENARIOS */}
          {tab === 'samples' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 font-mono">
                Click any real-world scenario to benchmark the noise filter:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {SAMPLE_CHATS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/[0.08] hover:border-emerald-500/40 cursor-pointer transition group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 border border-white/[0.06] text-emerald-400">
                          {sample.category}
                        </span>
                        <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition">
                          {sample.name}
                        </h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                    </div>

                    <p className="text-xs text-zinc-300 mb-2 font-sans">
                      {sample.description}
                    </p>

                    <div className="text-[11px] font-mono text-zinc-400">
                      {sample.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HOW TO EXPORT GUIDE */}
          {tab === 'guide' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Android Guide */}
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/[0.08]">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Android WhatsApp</span>
                  </div>
                  <ol className="space-y-2 text-zinc-300 font-sans list-decimal list-inside leading-relaxed">
                    <li>Open your college WhatsApp group.</li>
                    <li>Tap the <strong>Three Dots (⋮)</strong> in the top right corner.</li>
                    <li>Tap <strong>More</strong> → <strong>Export chat</strong>.</li>
                    <li>Select <strong>Without Media</strong> (keeps it light & fast).</li>
                    <li>Share to your computer (Drive, Email, or USB) and drop the <code>.txt</code> file into SignalDrop.</li>
                  </ol>
                </div>

                {/* iPhone Guide */}
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/[0.08]">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                    <Smartphone className="w-4 h-4" />
                    <span>iPhone (iOS) WhatsApp</span>
                  </div>
                  <ol className="space-y-2 text-zinc-300 font-sans list-decimal list-inside leading-relaxed">
                    <li>Open the group and tap the <strong>Group Subject / Name</strong> at the top.</li>
                    <li>Scroll down and tap <strong>Export Chat</strong>.</li>
                    <li>Choose <strong>Without Media</strong>.</li>
                    <li>Tap <strong>Save to Files</strong> or AirDrop to your laptop.</li>
                    <li>Upload the saved file into SignalDrop!</li>
                  </ol>
                </div>

                {/* WhatsApp Web Guide */}
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/[0.08] md:col-span-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                    <Laptop className="w-4 h-4" />
                    <span>Fastest Method: WhatsApp Web (Direct Copy)</span>
                  </div>
                  <p className="text-zinc-300 font-sans leading-relaxed">
                    You don't even need to export files! In WhatsApp Web on your browser, click and drag with your mouse to highlight the last 20–50 messages from your professor or group, press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200">Ctrl+C</kbd>, switch to SignalDrop, and press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200">Ctrl+V</kbd> in the <strong>Paste Real Chat Text</strong> tab. The multi-agent pipeline immediately handles the rest.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
      </BorderGlow>
    </div>
  );
}
