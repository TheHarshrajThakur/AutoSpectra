import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Zap, Box, GraduationCap, Users, Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', id: 'home', icon: Home },
  { name: 'Showcase', id: 'showcase', icon: Zap },
  { name: 'Inventory', id: 'inventory', icon: Box },
  { name: 'Academy', id: 'academy', icon: GraduationCap },
  { name: 'About', id: 'about', icon: Users },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = navLinks.map(link => link.id)
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.pathname === '/academy') {
      setActiveSection('academy')
    } else if (location.pathname === '/') {
    } else {
      setActiveSection('')
    }
  }, [location])

  const handleNav = (link) => {
    const id = link.toLowerCase()
    setMobileOpen(false)
    if (id === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }
    if (id === 'academy') {
      navigate('/academy')
      return
    }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: '1.5rem', left: 0, right: 0, zIndex: 100,
          display: 'flex', justifyContent: 'center', padding: '0 1.5rem', pointerEvents: 'none'
        }}
      >
        <motion.div 
          animate={{
            background: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.6)',
            borderColor: scrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
            boxShadow: scrolled ? '0 30px 60px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.2)',
          }}
          transition={{ duration: 0.4 }}
          style={{
            width: '100%', maxWidth: '1200px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1.75rem', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '100px',
            pointerEvents: 'auto', gap: '1.5rem'
          }}
          className="nav-container"
        >
          {/* Logo Section */}
          <div 
            onClick={() => handleNav('Home')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '2.8rem' }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }} className="nav-logo-text">
              <span className="text-icy">Auto Spectra</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} className="nav-links">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <motion.button 
                  key={link.id} 
                  onClick={() => handleNav(link.name)}
                  whileHover={{ color: '#fff' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: 'relative', padding: '0.8rem 1.6rem', fontSize: '0.85rem', fontWeight: 700, 
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'color 0.3s ease', zIndex: 1
                  }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      style={{
                        position: 'absolute', inset: '0.2rem', background: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: '100px', zIndex: -1, border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                padding: '0.75rem 1.75rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, 
                background: '#fff', color: '#000', border: 'none', cursor: 'pointer'
              }}
              className="nav-join-btn"
            >
              JOIN
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem',
                display: 'none', width: '2.5rem', height: '2.5rem', alignItems: 'center', justifyContent: 'center'
              }}
              className="mobile-menu-btn"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, rotateX: -20, y: -20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: -20, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{
              position: 'fixed', top: '5.5rem', left: '1.5rem', right: '1.5rem', zIndex: 99,
              background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(24px)',
              borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)',
              padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transformOrigin: 'top'
            }}
          >
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.id
              return (
                <motion.button 
                  key={link.id} 
                  onClick={() => handleNav(link.name)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', 
                    background: isActive ? 'rgba(255,255,255,0.05)' : 'none', 
                    border: 'none', borderRadius: '1.25rem', textAlign: 'left',
                    fontSize: '0.95rem', fontWeight: 600, padding: '1rem 1.5rem', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                  <link.icon size={18} style={{ opacity: isActive ? 1 : 0.5 }} />
                  {link.name}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .nav-container { padding: 0.5rem 1rem !important; gap: 0.5rem !important; }
          .nav-logo-text { font-size: 1.2rem !important; }
          .nav-join-btn { padding: 0.6rem 1.2rem !important; font-size: 0.75rem !important; }
        }
        @media (max-width: 380px) {
          .nav-logo-text { font-size: 1.05rem !important; }
          .nav-join-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
