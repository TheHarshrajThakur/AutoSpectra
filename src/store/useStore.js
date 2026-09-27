import { create } from 'zustand'
import { engineAudio } from '../utils/engineAudioSynthesizer'

/**
 * Theme Palette Definitions
 * Each palette defines primary, accent, surface, and glow colors
 * used across the entire app via CSS custom properties.
 */
export const THEME_PALETTES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    icon: '🌊',
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#1d4ed8',
    accent: '#818cf8',
    accentLight: '#a5b4fc',
    surface: '#050505',
    surfaceAlt: 'rgba(15, 18, 28, 0.7)',
    glassBase: 'rgba(20, 20, 25, 0.8)',
    glassBorder: 'rgba(59, 130, 246, 0.15)',
    textPrimary: '#f8fafc',
    textSecondary: 'rgba(255,255,255,0.6)',
    textMuted: 'rgba(255,255,255,0.4)',
    glowColor: 'rgba(59,130,246,0.1)',
    scrollbar: '#1d4ed8',
    gradient: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)',
  },
  ember: {
    id: 'ember',
    name: 'Ember Forge',
    icon: '🔥',
    primary: '#f97316',
    primaryLight: '#fb923c',
    primaryDark: '#c2410c',
    accent: '#ef4444',
    accentLight: '#f87171',
    surface: '#0a0504',
    surfaceAlt: 'rgba(28, 15, 10, 0.7)',
    glassBase: 'rgba(25, 18, 14, 0.8)',
    glassBorder: 'rgba(249, 115, 22, 0.15)',
    textPrimary: '#fef2f2',
    textSecondary: 'rgba(255,235,220,0.65)',
    textMuted: 'rgba(255,220,200,0.4)',
    glowColor: 'rgba(249,115,22,0.1)',
    scrollbar: '#c2410c',
    gradient: 'linear-gradient(90deg, #c2410c, #f97316, #fb923c)',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Circuit',
    icon: '💎',
    primary: '#10b981',
    primaryLight: '#34d399',
    primaryDark: '#059669',
    accent: '#06b6d4',
    accentLight: '#22d3ee',
    surface: '#030a06',
    surfaceAlt: 'rgba(10, 28, 18, 0.7)',
    glassBase: 'rgba(14, 25, 18, 0.8)',
    glassBorder: 'rgba(16, 185, 129, 0.15)',
    textPrimary: '#f0fdf4',
    textSecondary: 'rgba(220,255,235,0.65)',
    textMuted: 'rgba(200,255,220,0.4)',
    glowColor: 'rgba(16,185,129,0.1)',
    scrollbar: '#059669',
    gradient: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
  },
  violet: {
    id: 'violet',
    name: 'Ultraviolet',
    icon: '🔮',
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#6d28d9',
    accent: '#ec4899',
    accentLight: '#f472b6',
    surface: '#050308',
    surfaceAlt: 'rgba(20, 12, 30, 0.7)',
    glassBase: 'rgba(22, 16, 30, 0.8)',
    glassBorder: 'rgba(139, 92, 246, 0.15)',
    textPrimary: '#faf5ff',
    textSecondary: 'rgba(235,220,255,0.65)',
    textMuted: 'rgba(220,200,255,0.4)',
    glowColor: 'rgba(139,92,246,0.1)',
    scrollbar: '#6d28d9',
    gradient: 'linear-gradient(90deg, #6d28d9, #8b5cf6, #a78bfa)',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Turbo',
    icon: '🏎️',
    primary: '#ef4444',
    primaryLight: '#f87171',
    primaryDark: '#dc2626',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    surface: '#080303',
    surfaceAlt: 'rgba(28, 12, 12, 0.7)',
    glassBase: 'rgba(25, 14, 14, 0.8)',
    glassBorder: 'rgba(239, 68, 68, 0.15)',
    textPrimary: '#fef2f2',
    textSecondary: 'rgba(255,220,220,0.65)',
    textMuted: 'rgba(255,200,200,0.4)',
    glowColor: 'rgba(239,68,68,0.1)',
    scrollbar: '#dc2626',
    gradient: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)',
  },
  arctic: {
    id: 'arctic',
    name: 'Arctic Ice',
    icon: '❄️',
    primary: '#0ea5e9',
    primaryLight: '#38bdf8',
    primaryDark: '#0284c7',
    accent: '#06b6d4',
    accentLight: '#67e8f9',
    surface: '#020608',
    surfaceAlt: 'rgba(8, 18, 28, 0.7)',
    glassBase: 'rgba(12, 20, 28, 0.8)',
    glassBorder: 'rgba(14, 165, 233, 0.15)',
    textPrimary: '#f0f9ff',
    textSecondary: 'rgba(200,235,255,0.65)',
    textMuted: 'rgba(180,220,255,0.4)',
    glowColor: 'rgba(14,165,233,0.1)',
    scrollbar: '#0284c7',
    gradient: 'linear-gradient(90deg, #0284c7, #0ea5e9, #38bdf8)',
  },
  gold: {
    id: 'gold',
    name: 'Gold Prestige',
    icon: '👑',
    primary: '#eab308',
    primaryLight: '#facc15',
    primaryDark: '#ca8a04',
    accent: '#f97316',
    accentLight: '#fb923c',
    surface: '#080600',
    surfaceAlt: 'rgba(28, 24, 8, 0.7)',
    glassBase: 'rgba(25, 22, 12, 0.8)',
    glassBorder: 'rgba(234, 179, 8, 0.15)',
    textPrimary: '#fefce8',
    textSecondary: 'rgba(255,245,200,0.65)',
    textMuted: 'rgba(255,235,180,0.4)',
    glowColor: 'rgba(234,179,8,0.1)',
    scrollbar: '#ca8a04',
    gradient: 'linear-gradient(90deg, #ca8a04, #eab308, #facc15)',
  },
  stealth: {
    id: 'stealth',
    name: 'Stealth Carbon',
    icon: '🖤',
    primary: '#71717a',
    primaryLight: '#a1a1aa',
    primaryDark: '#52525b',
    accent: '#a1a1aa',
    accentLight: '#d4d4d8',
    surface: '#050505',
    surfaceAlt: 'rgba(18, 18, 18, 0.7)',
    glassBase: 'rgba(22, 22, 22, 0.8)',
    glassBorder: 'rgba(113, 113, 122, 0.15)',
    textPrimary: '#fafafa',
    textSecondary: 'rgba(255,255,255,0.6)',
    textMuted: 'rgba(255,255,255,0.35)',
    glowColor: 'rgba(113,113,122,0.08)',
    scrollbar: '#52525b',
    gradient: 'linear-gradient(90deg, #52525b, #71717a, #a1a1aa)',
  },
}

// Load persisted preferences from localStorage
function loadPersistedSettings() {
  try {
    const raw = localStorage.getItem('autospectra-settings')
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore parse errors */ }
  return {}
}
const persisted = loadPersistedSettings()

/**
 * Global Store (Zustand)
 * Manages the application state including active models, hand tracking data,
 * SpectraVoice AI copilot, SpectraDyno telemetry, and SpectraVision shaders.
 */
export const useStore = create((set, get) => ({
  activeModel: null,
  isDetailOpen: false,
  setActiveModel: (model) => set({ activeModel: model, isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false, activeModel: null }),
  
  // Hand Gesture State
  isHandTracking: false,
  handControlTarget: null, // can be 'main', or comp-{id}
  setHandTracking: (enabled, target = null) => set({ 
    isHandTracking: enabled, 
    handControlTarget: enabled ? target : null 
  }),
  handPosition: { x: 0.5, y: 0.5 },
  setHandPosition: (x, y) => set({ handPosition: { x, y } }),
  handZoom: 1,
  setHandZoom: (zoom) => set({ handZoom: zoom }),

  // SpectraVision Shader Mode: 'standard' | 'thermal' | 'xray' | 'cycle'
  visionMode: 'standard',
  setVisionMode: (mode) => set({ visionMode: mode }),

  // 720° Combustion Cycle crank angle (0 - 720)
  crankAngle: 0,
  setCrankAngle: (angle) => set({ crankAngle: angle }),

  // Engine Animation & Ignition (OFF by default for zero sound until explicitly started)
  isEngineIgnited: false,
  setIsEngineIgnited: (val) => {
    if (!val) {
      try {
        engineAudio.stop()
      } catch (e) {}
    }
    set({ isEngineIgnited: val })
  },
  mainExplosionFactor: 0,
  setMainExplosionFactor: (val) => set({ mainExplosionFactor: val }),

  // SpectraVoice AI Copilot State
  isVoiceActive: false,
  setVoiceActive: (val) => set({ isVoiceActive: val }),
  voiceFeedbackText: '',
  setVoiceFeedbackText: (text) => set({ voiceFeedbackText: text }),
  lastSpokenCommand: '',
  setLastSpokenCommand: (cmd) => set({ lastSpokenCommand: cmd }),

  // SpectraDyno & Diagnostic State
  dynoRpm: 850,
  setDynoRpm: (rpm) => set({ dynoRpm: rpm }),
  activeFault: 'none', // 'none' | 'rod_knock' | 'misfire' | 'detonation' | 'head_gasket'
  setActiveFault: (fault) => set({ activeFault: fault }),

  // Engine Model Viewer Source: 'native' | 'v6_sketchfab'
  viewerSource: 'native',
  setViewerSource: (source) => set({ viewerSource: source }),

  // Hovered & Selected 3D engine part for 360 viewer inspection HUD
  hoveredEnginePart: null,
  setHoveredEnginePart: (part) => set({ hoveredEnginePart: part }),
  selectedEnginePart: null,
  setSelectedEnginePart: (part) => set({ selectedEnginePart: part }),

  // ─── SETTINGS & THEME ───────────────────────────────────────────
  isSettingsOpen: false,
  setSettingsOpen: (val) => set({ isSettingsOpen: val }),
  toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),

  // Theme palette ID (persisted)
  themePalette: persisted.themePalette || 'midnight',
  setThemePalette: (id) => {
    set({ themePalette: id })
    const s = get()
    _persistSettings({ themePalette: id, reducedMotion: s.reducedMotion, renderQuality: s.renderQuality })
  },

  // Reduced Motion preference (persisted)
  reducedMotion: persisted.reducedMotion ?? false,
  setReduccedMotion: (val) => {
    set({ reducedMotion: val })
    const s = get()
    _persistSettings({ themePalette: s.themePalette, reducedMotion: val, renderQuality: s.renderQuality })
  },

  // 3D Render Quality: 'low' | 'medium' | 'high'
  renderQuality: persisted.renderQuality || 'high',
  setRenderQuality: (q) => {
    set({ renderQuality: q })
    const s = get()
    _persistSettings({ themePalette: s.themePalette, reducedMotion: s.reducedMotion, renderQuality: q })
  },
}))

function _persistSettings(data) {
  try {
    localStorage.setItem('autospectra-settings', JSON.stringify(data))
  } catch (e) { /* quota exceeded, ignore */ }
}
