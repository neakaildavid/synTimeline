import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('past')

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0
      setProgress(pct)
      setScrolled(window.scrollY > 60)

      const sections = ['section-past', 'section-recent', 'section-future']
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i].replace('section-', ''))
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-progress" aria-hidden="true">
        <div className="navbar-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="navbar-inner">
        <button
          className="navbar-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <span className="brand-mark" aria-hidden="true">◈</span>
          <span className="brand-name">The Climate Record</span>
        </button>

        <div className="navbar-links" role="list">
          {[
            { id: 'past',   label: 'Past',   years: '1950–2000' },
            { id: 'recent', label: 'Recent', years: '2000–Now'  },
            { id: 'future', label: 'Future', years: '2025–2100' },
          ].map(({ id, label, years }) => (
            <button
              key={id}
              role="listitem"
              className={`nav-link${activeSection === id ? ' active' : ''}${id === 'future' ? ' future-link' : ''}`}
              onClick={() => scrollTo(`section-${id}`)}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              <span className="nav-label">{label}</span>
              <span className="nav-years">{years}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
