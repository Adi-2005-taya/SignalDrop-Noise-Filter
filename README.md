# ⚡ SignalDrop: The College WhatsApp Noise Filter

[![GeNarrative Clash 2026](https://img.shields.io/badge/Hackathon-GeNarrative%20Clash%202026-8b5cf6?style=for-the-badge)](https://github.com/Adi-2005-taya/SignalDrop-Noise-Filter)
[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald?style=for-the-badge)](https://github.com/Adi-2005-taya/SignalDrop-Noise-Filter)

> **GeNarrative Clash 2026 Flagship Submission**  
> *West Bengal's premier state-level GenAI & Prompt Engineering Hackathon hosted by GFG Student Chapter TIU at Techno India University (Grand Finale: November 21, 2026).*

A high-performance **Focus Mode & Signal Extraction Dashboard** for campus communications. Forward or paste messy college WhatsApp group chat exports, let a deterministic 2-stage multi-agent pipeline strip away **90%+ conversational noise**, and isolate actionable academic signals (**Deadlines**, **Resources**, **Announcements**) on an interactive focus board with 1-click `.ics` calendar exports and WhatsApp broadcast digests.

---

## 📌 The Problem: The College Group Struggle

College and university WhatsApp & Telegram groups suffer from severe information overload:
- **90%+ Noise**: Overwhelming feeds of *"Ok sir"*, *"Thank you sir"*, *"+1"*, *"Happy Birthday bro"*, stickers, emojis, and casual chatter.
- **Buried Signals**: Critical LMS deadlines, Google Drive lecture slides, examination timetables, and placement notices get lost in the feed.
- **Doomscrolling & Missed Deadlines**: Students waste 30+ minutes daily scrolling through messages, leading to missed assignments and delayed exam preparation.

---

## 🚀 The Multi-Agent Pipeline Architecture

```
[ Raw College Group Chat Dump (WhatsApp / Telegram .txt export) ]
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 AGENT 1: The Sorter (Classification Agent)                   │
│ • Eliminates conversational chatter, greetings, stickers & "+1" │
│ • Multi-Signal Intent: Disentangles compound announcements      │
│   into BOTH Deadlines and Notices without hallucination         │
│ • Computes statistical confidence and routes noise to the Vault │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ ⚡ AGENT 2: The Extractor (Entity & Action Parser)               │
│ • Normalizes Dates & Times (e.g., "Sunday, 15 Nov 11:59 PM")    │
│ • Classifies Links (Google Drive, LMS, Superset, GitHub, Docs)  │
│ • Identifies Course Codes (e.g., CS-301, ECE-201, T&P Cell)     │
│ • Synthesizes Action Items (e.g., "Submit Lab 4 on Portal")     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 📋 Interactive Focus Dashboard                                  │
│ ├── ⏰ Column 1: Deadlines (with 1-click .ics Calendar sync)    │
│ ├── 📚 Column 2: Resources (Google Drive, Docs, PDFs, Repos)    │
│ ├── 📢 Column 3: Announcements (Notices, room changes, events)  │
│ └── 🗑️ Column 4: Noise Vault (Auditable spam with 1-click ↺)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Dual-Agent Extraction Pipeline
- **Agent 1 (The Sorter)**: Filters out greetings, acknowledgments, and spam with >90% reduction, preserving 100% of actionable events.
- **Agent 2 (The Extractor)**: Extracts normalized deadlines, categorized resource links, course tags, and concise action summaries.
- **Dual-Intent Handling**: Composite posts containing both an event announcement and a submission deadline are intelligently classified into *both* columns.

### 2. 100% Client-Side Privacy
- No third-party servers, cloud databases, or tracking.
- Every chat message is parsed directly in your browser's local sandbox; your campus communications never leave your device.

### 3. Actionable Focus Board
- **1-Click `.ics` Calendar Sync**: Add deadlines directly to Google Calendar, Apple Calendar, or Outlook.
- **Direct Resource Launchers**: Instant access to Google Drive, GitHub repositories, PDF lab guides, and payment portals.
- **Task Checkboxes**: Mark deadlines as completed with local persistence.

### 4. Modern React Bits UI Architecture
- **`MagicBento` Grid**: Interactive Bento overview with dynamic cursor spotlight tracking, reactive border glow, and click shockwave ripple effects.
- **`CardNav` Navigation**: Modern header navigation featuring smooth rising floating cards (`cardEffect="rise"`), link directories, and mobile-responsive drawer.
- **`BorderGlow`**: Reactive cursor-tracking edge spotlighting applied across cards and modals.
- **`AeroShards`**: Full-screen interactive background featuring 1,300 3D glass polygon shards with mouse deflection and click shockwaves.
- **`CrystalizedBall` & `LightTunnel` Preloaders**: Cyberpunk particle vortex intro with glowing status indicator.

### 5. Campus Focus Digest
- Generates a cleanly formatted WhatsApp message complete with markdown bolding, emojis, and categorized bullet points.
- Allows Class Representatives (CRs) and students to broadcast distilled updates back to group chats.

### 6. Built-in Testing Scenarios & Sample Chat Download
- Pre-loaded with realistic college scenarios:
  - `CS-301: Database Management Systems` (DBMS Project, 15 Nov deadline)
  - `CS-304: Computer Networks` (Socket programming lab, 18 Nov deadline)
  - `Official Circulars & Administration` (Semester exam fee payment, 20 Nov)
  - `GeNarrative Clash 2026 Hackathon Giveaway` (TIU campus, 13 Nov deadline)
- Includes a 1-click **Download Fake Chat `.txt`** button to test importing real WhatsApp exports instantly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism |
| **Components** | React Bits (`MagicBento`, `CardNav`, `BorderGlow`, `AeroShards`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typography** | JetBrains Mono & Plus Jakarta Sans |
| **Exports** | iCalendar (`.ics`), WhatsApp Markdown Digest |

---

## 📁 Project Structure

```
├── public/
│   ├── sample-whatsapp-chat.txt                           # Ready-to-import sample WhatsApp chat
│   └── WhatsApp Chat - CS_Department_Official_2026.txt    # Extended academic dataset
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AeroShards.jsx & AeroShards.css                # 1300-shard 3D glass background
│   │   ├── AgentInfoModal.jsx                             # Multi-agent architecture explainer
│   │   ├── AgentTelemetryBar.jsx                          # Search, filter pills & telemetry
│   │   ├── BorderGlow.jsx & BorderGlow.css                # Reactive cursor border glow
│   │   ├── CardNav.jsx & CardNav.css                      # Expandable rise-card navigation
│   │   ├── ChatInputModal.jsx                             # Raw chat paste & .txt drag-and-drop
│   │   ├── CrystalizedBall.jsx                            # Preloader Phase 1 particle sphere
│   │   ├── DigestModal.jsx                                # WhatsApp broadcast digest generator
│   │   ├── Hero.jsx                                       # Active group banner with BorderGlow
│   │   ├── ItemDetailModal.jsx                            # Full message inspection modal
│   │   ├── KanbanBoard.jsx & KanbanCard.jsx               # Drag-and-drop signal board
│   │   ├── LatticeLoader.jsx & LatticeLoader.css          # Orbiting dot matrix loader
│   │   ├── LightTunnel.jsx & LightTunnel.css              # Preloader Phase 2 radial tunnel
│   │   ├── MagicBento.jsx & MagicBento.css                # Spotlight & border glow Bento grid
│   │   ├── Navbar.jsx                                     # Legacy navigation fallback
│   │   └── Preloader.jsx                                  # Two-phase loading orchestrator
│   ├── data/
│   │   └── sampleChats.js                                 # Pre-configured campus scenario dumps
│   ├── engine/
│   │   ├── agentPipeline.js                               # 2-stage Sorter & Extractor engine
│   │   ├── calendarExport.js                              # RFC 5545 .ics generator
│   │   └── downloadSample.js                              # 1-click sample file download trigger
│   ├── logo.svg                                           # Custom SignalDrop neon vector logo
│   ├── App.jsx                                            # Root application orchestrator
│   ├── index.css                                          # Tailwind styles & theme variables
│   └── main.jsx                                           # React entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Adi-2005-taya/SignalDrop-Noise-Filter.git

# 2. Navigate to the project directory
cd SignalDrop-Noise-Filter

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
# Build optimized production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Testing with WhatsApp Chat Exports

1. Open SignalDrop in your browser.
2. Click **"+ Import Chat"** in the top navigation or drag-and-drop any `.txt` WhatsApp chat export directly onto the window.
3. Alternatively, click **"Fake Chat .txt"** to download the realistic sample dataset and upload it.
4. Watch the pipeline isolate **Deadlines**, **Resources**, and **Announcements** in under 1 second!

---

## 🏆 Hackathon Attribution

- **Event**: GeNarrative Clash 2026
- **Host**: GFG Student Chapter TIU — Techno India University, Kolkata, West Bengal
- **Grand Finale**: November 21, 2026
- **Author**: [Adi-2005-taya](https://github.com/Adi-2005-taya)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
