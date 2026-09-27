import { useEffect } from 'react'
import { useStore, THEME_PALETTES } from '../../store/useStore'

/**
 * ThemeProvider — applies the current palette as CSS custom properties
 * on the document root element. Also manages reduced-motion preference.
 * Renders nothing; purely a side-effect component.
 */
export default function ThemeProvider() {
  const themePalette = useStore(s => s.themePalette)
  const reducedMotion = useStore(s => s.reducedMotion)

  useEffect(() => {
    const palette = THEME_PALETTES[themePalette] || THEME_PALETTES.midnight
    const root = document.documentElement

    root.style.setProperty('--color-primary', palette.primary)
    root.style.setProperty('--color-primary-light', palette.primaryLight)
    root.style.setProperty('--color-primary-dark', palette.primaryDark)
    root.style.setProperty('--color-accent', palette.accent)
    root.style.setProperty('--color-accent-light', palette.accentLight)
    root.style.setProperty('--color-surface', palette.surface)
    root.style.setProperty('--color-surface-alt', palette.surfaceAlt)
    root.style.setProperty('--color-glass-base', palette.glassBase)
    root.style.setProperty('--color-glass-border', palette.glassBorder)
    root.style.setProperty('--color-text', palette.textPrimary)
    root.style.setProperty('--color-text-secondary', palette.textSecondary)
    root.style.setProperty('--color-text-muted', palette.textMuted)
    root.style.setProperty('--color-glow', palette.glowColor)
    root.style.setProperty('--color-scrollbar', palette.scrollbar)
    root.style.setProperty('--color-gradient', palette.gradient)

    // For easy use with opacity variants
    root.style.setProperty('--color-primary-rgb', hexToRgb(palette.primary))
    root.style.setProperty('--color-accent-rgb', hexToRgb(palette.accent))
  }, [themePalette])

  useEffect(() => {
    document.documentElement.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false')
  }, [reducedMotion])

  return null
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246'
}
