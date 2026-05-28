import Navbar from './components/Navbar'
import TimelineNode from './components/TimelineNode'
import { timelineData, categories } from './data/TimelineData'
import { useScrollTheme } from './hooks/useScrollTheme'
import './App.css'

const past   = timelineData.filter((e) => e.section === 'past')
const recent = timelineData.filter((e) => e.section === 'recent')
const future = timelineData.filter((e) => e.section === 'future')

function SectionHeader({ era, title, subtitle, isFuture }) {
  return (
    <div className={`section-header${isFuture ? ' future-header' : ''}`}>
      <p className="section-era">{era}</p>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
      {isFuture && (
        <p className="future-note">
          Projection based on current policy trajectories. These outcomes are not inevitable.
        </p>
      )}
    </div>
  )
}

function TimelineSection({ children, isFuture }) {
  return (
    <div className={`spine-container${isFuture ? ' future-spine' : ''}`}>
      <div className="spine-line" aria-hidden="true" />
      <div className="nodes-list">{children}</div>
    </div>
  )
}

export default function App() {
  useScrollTheme()

  return (
    <>
      <Navbar />

      <header className="hero" role="banner">
        <div className="hero-content">
          <p className="hero-kicker">Climate · History · 1950–2100</p>
          <h1 className="hero-title">The Climate<br />Record</h1>
          <p className="hero-subtitle">
            From the first measurements of a warming planet to the projected crises of the next century —
            the decisions made, the warnings ignored, and the paths not taken.
          </p>

          <div className="legend" role="list" aria-label="Event categories">
            {Object.entries(categories).map(([key, { label, color }]) => (
              <div key={key} className="legend-item" role="listitem">
                <span className="legend-pip" style={{ background: color }} aria-hidden="true" />
                <span className="legend-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <div className="scroll-cue-line" />
          </div>
        </div>
      </header>

      <main id="main-content">

        <section id="section-past" className="timeline-section" aria-label="Past climate events 1950 to 2000">
          <SectionHeader
            era="1950 – 2000"
            title="The Past"
            subtitle="When we first learned what we were doing to the atmosphere — and chose not to act."
          />
          <TimelineSection>
            {past.map((event, i) => (
              <TimelineNode key={event.id} event={event} index={i} />
            ))}
          </TimelineSection>
        </section>

        <section id="section-recent" className="timeline-section" aria-label="Recent climate events 2000 to present">
          <SectionHeader
            era="2000 – Present"
            title="The Recent"
            subtitle="Promises made, agreements broken, and a planet that stopped waiting for permission to change."
          />
          <TimelineSection>
            {recent.map((event, i) => (
              <TimelineNode key={event.id} event={event} index={i} />
            ))}
          </TimelineSection>
        </section>

        <section id="section-future" className="timeline-section" aria-label="Projected future 2025 to 2100">
          <SectionHeader
            era="2025 – 2100"
            title="The Future"
            subtitle="These are projections, not prophecies. What happens next depends on choices being made today."
            isFuture
          />
          <TimelineSection isFuture>
            {future.map((event, i) => (
              <TimelineNode key={event.id} event={event} index={i} />
            ))}
          </TimelineSection>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">The Climate Record</p>
          <p className="footer-source">
            Data sourced from IPCC Assessment Reports (AR6), NASA GISS, NOAA, and the World Bank.
            Future projections reflect trajectories modeled in the IPCC Sixth Assessment Report.
          </p>
          <p className="footer-note">
            An editorial project. Future events describe peer-reviewed projections under current trajectories —
            not fixed outcomes.
          </p>
        </div>
      </footer>
    </>
  )
}
