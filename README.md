# ⚡ SignalDrop: The College WhatsApp Noise Filter

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald?style=for-the-badge)](https://github.com/Adi-2005-taya/SignalDrop-Noise-Filter)

> A focused **Signal Extraction & Organization Dashboard** for college group communications. Paste or import messy WhatsApp group chat exports, filter away over **90% conversational chatter**, and organize academic alerts (**Deadlines**, **Resources**, and **Announcements**) onto a clean board with one-click `.ics` calendar sync and formatted WhatsApp summaries.

---

## 📌 The Problem: College Group Clutter

College and university WhatsApp & Telegram class groups get overwhelmed quickly:
- **90%+ Noise**: Long feeds of *"Ok sir"*, *"Thank you sir"*, *"+1"*, *"Happy Birthday"*, stickers, and casual replies.
- **Buried Information**: LMS submission deadlines, Google Drive lecture slides, timetable changes, and examination circulars get lost in the feed.
- **Lost Focus & Missed Deadlines**: Students waste valuable study time scrolling through hundreds of messages to find what is due.

---

## 🚀 Two-Step Message Processing Architecture

```
[ Raw College Group Chat Dump (WhatsApp / Telegram .txt export) ]
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🧹 STEP 1: Message Filter & Sorter                              │
│ • Eliminates conversational chatter, greetings, stickers & "+1" │
│ • Multi-Signal Routing: Accurately separates compound notices   │
│   into BOTH Deadlines and Announcements                         │
│ • Stores discarded chat into an auditable Noise Vault           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 STEP 2: Detail & Calendar Parser                             │
│ • Normalizes Dates & Times (e.g., "Sunday, 15 Nov 11:59 PM")    │
│ • Classifies Links (Google Drive, LMS, Superset, GitHub, Docs)  │
│ • Identifies Course Codes (e.g., CS-301, CS-304, ECE-201)       │
│ • Produces concise action summaries (e.g., "Submit Lab 4 LMS")  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ 📋 Clean Focus Dashboard                                        │
│ ├── ⏰ Column 1: Deadlines (with 1-click .ics Calendar sync)    │
│ ├── 📚 Column 2: Resources (Google Drive, Docs, PDFs, Repos)    │
│ ├── 📢 Column 3: Announcements (Notices, room changes, events)  │
│ └── 🗑️ Column 4: Noise Vault (Auditable spam with 1-click ↺)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Two-Step Cleaning & Parsing Engine
- **Step 1 (Filter)**: Strips out greetings, acknowledgments, and repetitive replies, keeping real academic updates.
- **Step 2 (Parser)**: Formats submission dates, sorts drive links, identifies course codes, and creates clear action titles.
- **Multi-Signal Detection**: Announcements containing both a date and an event are categorized into both Deadlines and Notices.

### 2. 100% Browser-Local Privacy
- Everything runs client-side directly in the browser.
- No external server logging, no databases, and zero tracking of private student messages.

### 3. Actionable Task Board
- **1-Click `.ics` Calendar Sync**: Add deadlines directly to Google Calendar, Apple Calendar, or Outlook.
- **Resource Launchers**: Direct links for Google Drive, GitHub repositories, lab guides, and fee portals.
- **Task Checkboxes**: Mark deadlines as done with local browser storage.

### 4. Interface & Navigation
- **`CardNav` Header**: Elegant navigation featuring floating rise cards, quick project links, and direct contact options.
- **`MagicBento` Overview**: Interactive Bento grid with cursor spotlight tracking, reactive border glow, and ripple animations.
- **`BorderGlow`**: Interactive cursor-tracking edge spotlight on cards and modals.
- **`AeroShards`**: Full-screen 3D glass polygon background with interactive physics.

### 5. Campus Focus Digest
- Generates a cleanly formatted text message complete with bold headings, emojis, and bullet points.
- Class Representatives (CRs) can broadcast updates back to the group so everyone stays informed without scrolling.

### 6. Universal WhatsApp Export Ingestion (.txt &amp; .zip)
- Direct support for raw `.txt` chat files.
- In-browser unzipping of `.zip` exports (with or without media) via `JSZip`, automatically locating and extracting `_chat.txt` with zero server uploads and complete privacy.

### 7. Built-in Testing Scenarios
- Includes sample college chat scenarios:
  - `CS-301: Database Management Systems` (DBMS Project, 15 Nov deadline)
  - `CS-304: Computer Networks` (Socket programming lab, 18 Nov deadline)
  - `Official Circulars & Administration` (Semester exam fee notice)
- Includes a 1-click **Download Fake Chat `.txt`** button to test the parser immediately.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Typography** | Times New Roman, Georgia, Serif |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism |
| **Components** | `MagicBento`, `CardNav`, `BorderGlow`, `AeroShards` |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Exports** | iCalendar (`.ics`), Formatted Markdown Digest |

---

## 📁 Project Structure

```
├── public/
│   ├── sample-whatsapp-chat.txt                           # Test WhatsApp chat export
│   └── WhatsApp Chat - CS_Department_Official_2026.txt    # Extended academic dataset
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AeroShards.jsx & AeroShards.css                # 3D glass polygon background
│   │   ├── AgentInfoModal.jsx                             # Project overview modal
│   │   ├── AgentTelemetryBar.jsx                          # Search, filter pills & status
│   │   ├── BorderGlow.jsx & BorderGlow.css                # Cursor-tracking border glow
│   │   ├── CardNav.jsx & CardNav.css                      # Expandable rise-card navigation
│   │   ├── ChatInputModal.jsx                             # Chat paste & .txt drag-and-drop
│   │   ├── CrystalizedBall.jsx                            # Preloader Phase 1
│   │   ├── DigestModal.jsx                                # WhatsApp broadcast generator
│   │   ├── Hero.jsx                                       # Active group banner
│   │   ├── ItemDetailModal.jsx                            # Message inspection modal
│   │   ├── KanbanBoard.jsx & KanbanCard.jsx               # Actionable signal board
│   │   ├── LatticeLoader.jsx & LatticeLoader.css          # Orbiting dot matrix loader
│   │   ├── LightTunnel.jsx & LightTunnel.css              # Preloader Phase 2
│   │   ├── MagicBento.jsx & MagicBento.css                # Spotlight & border glow Bento grid
│   │   ├── Navbar.jsx                                     # Legacy navigation fallback
│   │   └── Preloader.jsx                                  # Loading orchestrator
│   ├── data/
│   │   └── sampleChats.js                                 # Pre-configured campus scenario dumps
│   ├── engine/
│   │   ├── agentPipeline.js                               # Sorter & Extractor parsing engine
│   │   ├── calendarExport.js                              # RFC 5545 .ics generator
│   │   └── downloadSample.js                              # 1-click sample download trigger
│   ├── logo.svg                                           # Vector logo
│   ├── App.jsx                                            # Root application orchestrator
│   ├── index.css                                          # Global styles & Times New Roman font
│   └── main.jsx                                           # React entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm`

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

## 📬 Contact & Author

- **Author**: Aditaya Das
- **Email**: [wbaditya2005@gmail.com](mailto:wbaditya2005@gmail.com)
- **LinkedIn**: [linkedin.com/in/aditaya-das-586154325](https://www.linkedin.com/in/aditaya-das-586154325)
- **GitHub**: [github.com/Adi-2005-taya](https://github.com/Adi-2005-taya)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
