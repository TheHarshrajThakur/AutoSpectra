import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n/i18n';

export default function LanguageSelector({ isMobile = false }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find(
    (l) => l.code === (i18n.language ? i18n.language.split('-')[0] : 'en')
  ) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Isolate wheel and touch events so Lenis does not hijack scrolling
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isOpen) return;

    const handleWheel = (e) => {
      e.stopPropagation();
    };

    const handleTouch = (e) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    el.addEventListener('touchmove', handleTouch, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchmove', handleTouch);
    };
  }, [isOpen]);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', pointerEvents: 'auto' }}>
      <motion.button
        whileHover={{ scale: 1.03, borderColor: 'rgba(59,130,246,0.5)' }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: isMobile ? '0.6rem 1rem' : '0.5rem 0.9rem',
          borderRadius: '100px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#fff',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          transition: 'border-color 0.2s ease, background 0.2s ease',
          boxShadow: isOpen ? '0 0 15px rgba(59,130,246,0.2)' : 'none',
        }}
        title="Change Language"
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currentLang.flag}</span>
        <span style={{ color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>
          {currentLang.code}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.6)' }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={scrollContainerRef}
            data-lenis-prevent
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: isMobile ? -5 : 8, scale: 0.95 }}
            animate={{ opacity: 1, y: isMobile ? 0 : 4, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? -5 : 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: isMobile ? 'auto' : 0,
              left: isMobile ? 0 : 'auto',
              minWidth: '210px',
              maxHeight: '320px',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              background: 'rgba(12, 12, 16, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.85), 0 0 20px rgba(59,130,246,0.15)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              padding: '0.4rem',
              zIndex: 1000,
              pointerEvents: 'auto',
            }}
            className="custom-scrollbar"
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'rgba(12, 12, 16, 0.98)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '0.4rem 0.6rem 0.35rem',
                fontSize: '0.65rem',
                fontWeight: 800,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Globe size={11} color="#3b82f6" />
              <span>Select Language</span>
            </div>

            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang.code;
              return (
                <motion.button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  whileHover={{ background: 'rgba(59,130,246,0.15)', x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.65rem',
                    background: isSelected ? 'rgba(59,130,246,0.18)' : 'transparent',
                    border: isSelected
                      ? '1px solid rgba(59,130,246,0.4)'
                      : '1px solid transparent',
                    color: isSelected ? '#60a5fa' : '#fff',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>{lang.flag}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: isSelected ? '#93c5fd' : '#ffffff', fontSize: '0.82rem' }}>
                        {lang.nativeName}
                      </span>
                      {lang.name !== lang.nativeName && (
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>
                          {lang.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={14} color="#60a5fa" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.6) rgba(255, 255, 255, 0.04);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          margin: 6px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
