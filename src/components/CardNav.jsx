import React, { useState, useRef, useEffect } from 'react';
import './CardNav.css';
import { 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Activity, 
  Trash2, 
  Share2, 
  Download,
  Menu,
  X
} from 'lucide-react';

export default function CardNav({
  logo,
  logoAlt = 'SignalDrop',
  items = [],
  cta = { label: 'Get started', href: '#' },
  cardEffect = 'rise',
  openOn = 'click',
  stats = null,
  showSpamColumn = false,
  onToggleSpam = null,
  onOpenDigest = null,
  onDownloadSample = null,
  onReplayPreloader = null,
  className = ''
}) {
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close card when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveItemIndex(null);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setActiveItemIndex(null);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleItemClick = (index) => {
    if (openOn === 'click') {
      setActiveItemIndex(prev => (prev === index ? null : index));
    }
  };

  const handleMouseEnter = (index) => {
    if (openOn === 'hover') {
      setActiveItemIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (openOn === 'hover') {
      setActiveItemIndex(null);
    }
  };

  const activeItem = activeItemIndex !== null ? items[activeItemIndex] : null;

  return (
    <header ref={navRef} className={`cardnav-container sticky top-0 ${className}`}>
      <div className="cardnav-bar">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onReplayPreloader}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="SignalDrop — Noise Filter for WhatsApp"
          >
            {logo ? (
              typeof logo === 'string' ? (
                <img src={logo} alt={logoAlt} className="w-8 h-8 rounded-lg object-contain filter drop-shadow-md group-hover:scale-105 transition" />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center">{logo}</div>
              )
            ) : (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-purple-500/50 group-hover:text-purple-300 transition">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-mono flex items-center gap-1.5">
                {logoAlt}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </span>
            </div>
          </div>

          {/* Quick live pill if stats present */}
          {stats && stats.totalMessages > 0 && (
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-900/80 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
              <span className="text-emerald-400 font-semibold">{stats.noisePercentage}% filtered</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">~{stats.timeSavedMinutes}m saved</span>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Items */}
        {items && items.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item, index) => {
              const isActive = activeItemIndex === index;
              return (
                <button
                  key={item.label || index}
                  type="button"
                  onClick={() => handleItemClick(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  className={`cardnav-item-btn font-mono ${isActive ? 'is-active' : ''}`}
                  aria-expanded={isActive}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="cardnav-chevron" />
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Quick actions & CTA Button */}
        <div className="flex items-center gap-2">
          {/* Quick action buttons if wired */}
          {onToggleSpam && (
            <button
              onClick={onToggleSpam}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition ${
                showSpamColumn
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border-white/[0.06]'
              }`}
              title="Toggle Noise Vault"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Vault</span>
            </button>
          )}

          {onOpenDigest && (
            <button
              onClick={onOpenDigest}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] transition"
              title="Export WhatsApp Digest"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Digest</span>
            </button>
          )}

          {onDownloadSample && (
            <button
              onClick={onDownloadSample}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition"
              title="Download Fake WhatsApp Chat Export (.txt)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Fake Chat .txt</span>
            </button>
          )}

          {/* CardNav CTA Button */}
          {cta && (
            cta.onClick ? (
              <button
                type="button"
                onClick={cta.onClick}
                className="cardnav-cta-btn font-mono"
              >
                <span>{cta.label || 'Get started'}</span>
              </button>
            ) : (
              <a
                href={cta.href || '#'}
                className="cardnav-cta-btn font-mono"
              >
                <span>{cta.label || 'Get started'}</span>
              </a>
            )
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Card with Card Effect ("rise") */}
      {activeItem && (
        <div 
          className="cardnav-card-wrapper px-4"
          onMouseLeave={handleMouseLeave}
        >
          <div className={`cardnav-card-rise ${cardEffect === 'rise' ? 'cardnav-rise-active' : ''}`}>
            {/* Card Header */}
            <div className="flex items-start justify-between pb-3 mb-3 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                  <h3 className="text-base font-bold text-white font-mono tracking-tight">
                    {activeItem.label}
                  </h3>
                </div>
                {activeItem.description && (
                  <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
                    {activeItem.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveItemIndex(null)}
                className="text-zinc-500 hover:text-zinc-300 transition p-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links Grid */}
            {activeItem.links && activeItem.links.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {activeItem.links.map((link, lIdx) => (
                  <div key={link.label || lIdx}>
                    {link.onClick ? (
                      <button
                        type="button"
                        onClick={() => {
                          link.onClick();
                          setActiveItemIndex(null);
                        }}
                        className="cardnav-card-link w-full text-left font-mono text-xs group"
                      >
                        <span className="font-semibold">{link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
                      </button>
                    ) : (
                      <a
                        href={link.href || '#'}
                        onClick={() => setActiveItemIndex(null)}
                        className="cardnav-card-link font-mono text-xs group"
                      >
                        <span className="font-semibold">{link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0b0c14]/95 backdrop-blur-2xl p-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.label || idx} className="space-y-1.5 pb-2 border-b border-white/[0.04]">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                  {item.label}
                </span>
                {item.description && (
                  <p className="text-[11px] text-zinc-400">{item.description}</p>
                )}
                <div className="grid grid-cols-1 gap-1 pt-1">
                  {item.links?.map((link, lIdx) => (
                    link.onClick ? (
                      <button
                        key={link.label || lIdx}
                        onClick={() => {
                          link.onClick();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left text-xs font-mono text-zinc-300 hover:text-white py-1 px-2 rounded hover:bg-white/[0.05]"
                      >
                        • {link.label}
                      </button>
                    ) : (
                      <a
                        key={link.label || lIdx}
                        href={link.href || '#'}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs font-mono text-zinc-300 hover:text-white py-1 px-2 rounded hover:bg-white/[0.05] block"
                      >
                        • {link.label}
                      </a>
                    )
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile Actions */}
            <div className="pt-2 flex flex-col gap-2">
              {onDownloadSample && (
                <button
                  onClick={() => {
                    onDownloadSample();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Fake Chat .txt</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

