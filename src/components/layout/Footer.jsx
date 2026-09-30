import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Code2 } from 'lucide-react'

// Official GitHub vector mark
function GithubIcon({ size = 18, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export const DEVELOPERS = [
  {
    name: 'Harshraj Singh Thakur',
    handle: 'TheHarshrajThakur',
    url: 'https://github.com/TheHarshrajThakur',
    label: 'GitHub Profile',
  },
  {
    name: 'Anurag Sharma',
    handle: 'anurag-sharma09',
    url: 'https://github.com/anurag-sharma09',
    label: 'GitHub Profile',
  },
]

export default function Footer() {
  const { t } = useTranslation()

  const platformLinks = [
    { label: t('footer.link_forge', { defaultValue: '360° Forge' }), href: '#360' },
    { label: t('footer.link_library', { defaultValue: 'Technical Library' }), href: '#inventory' },
    { label: t('footer.link_academy', { defaultValue: 'Academy' }), href: '/academy' },
    { label: 'V8 Builder Assessment', href: '/assessment' },
    { label: 'SpectraLab Suite', href: '/lab' },
    { label: t('footer.link_schematics', { defaultValue: 'Schematics' }), href: '#inventory' }
  ]

  const resourceLinks = [
    { label: t('footer.link_docs', { defaultValue: 'Documentation' }), href: '#' },
    { label: t('footer.link_community', { defaultValue: 'Community' }), href: '#' },
    { label: t('footer.link_status', { defaultValue: 'System Status' }), href: '#' },
    { label: t('footer.link_changelog', { defaultValue: 'Changelog' }), href: '#' }
  ]

  const designedByText = t('footer.designed_by', { defaultValue: 'Designed and Developed by' })

  return (
    <footer
      style={{
        padding: '5rem 1.5rem 6rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, var(--color-surface, #050505) 0%, rgba(8, 10, 15, 0.98) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '1px',
          background: 'radial-gradient(ellipse at center, var(--color-primary, #3b82f6) 0%, transparent 70%)',
          opacity: 0.6,
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mb-14">
          {/* Branding & Developers Column */}
          <div className="col-span-1 sm:col-span-2 mobile-center">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                <span className="text-icy">Auto Spectra</span>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 0 1.75rem 0' }}>
              {t('footer.desc', {
                defaultValue: "The world's most advanced interactive platform for mechanical engineering education. Visualizing the future of machines, one component at a time."
              })}
            </p>

            {/* Developer Credits Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                maxWidth: '440px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-primary-light, #60a5fa)',
                  marginBottom: '0.9rem'
                }}
              >
                <Code2 size={14} />
                <span>{designedByText}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {DEVELOPERS.map((dev) => (
                  <motion.a
                    key={dev.handle}
                    href={dev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      textDecoration: 'none',
                      color: '#fff',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)'
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          flexShrink: 0
                        }}
                      >
                        <GithubIcon size={16} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                          {dev.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'monospace', marginTop: '2px' }}>
                          github.com/{dev.handle}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--color-primary-light, #60a5fa)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      <span>GitHub</span>
                      <ExternalLink size={12} />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mobile-center">
            <h4
              style={{
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 800,
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}
            >
              {t('footer.platform_title', { defaultValue: 'Platform' })}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.45)',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="mobile-center">
            <h4
              style={{
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 800,
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}
            >
              {t('footer.resources_title', { defaultValue: 'Resources' })}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.45)',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div
          className="mobile-center"
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 500 }}>
            {t('footer.copyright', {
              defaultValue: '© 2026 AUTO SPECTRA. ALL SPECIFICATIONS SUBJECT TO INDUSTRIAL STANDARDS.'
            })}
          </span>
        </div>
      </div>
    </footer>
  )
}
