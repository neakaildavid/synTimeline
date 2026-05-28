import { useRef, useState, useEffect } from 'react'
import { categories } from '../data/TimelineData'
import './TimelineNode.css'

export default function TimelineNode({ event, index }) {
  const [inView, setInView]       = useState(false)
  const [whatIfOpen, setWhatIfOpen] = useState(false)
  const nodeRef = useRef(null)
  const isLeft  = index % 2 === 0
  const cat     = categories[event.category]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    if (nodeRef.current) observer.observe(nodeRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={nodeRef}
      className={[
        'node',
        isLeft ? 'node--left' : 'node--right',
        inView ? 'node--visible' : '',
      ].join(' ')}
      style={{ '--cat': cat.color, '--cat-soft': cat.soft, '--cat-border': cat.border }}
      aria-label={`${event.year}: ${event.title}`}
    >
      {/* Spine dot */}
      <div className="node-dot" aria-hidden="true" />

      {/* Connector line */}
      <div className="node-connector" aria-hidden="true" />

      {/* Card */}
      <div className="node-card">
        <header className="card-meta">
          <time className="card-year" dateTime={String(event.year)}>{event.year}</time>
          <span className="card-cat">
            <span className="card-cat-pip" aria-hidden="true" />
            {cat.label}
          </span>
        </header>

        <h3 className="card-title">{event.title}</h3>
        <p className="card-body">{event.description}</p>

        {event.hasWhatIf && (
          <div className="whatif">
            <button
              className={`whatif-btn${whatIfOpen ? ' open' : ''}`}
              onClick={() => setWhatIfOpen((v) => !v)}
              aria-expanded={whatIfOpen}
              aria-controls={`wi-${event.id}`}
            >
              {whatIfOpen ? 'Close' : 'What if?'} <span className="whatif-arrow" aria-hidden="true">{whatIfOpen ? '↑' : '↓'}</span>
            </button>

            <div
              id={`wi-${event.id}`}
              className={`whatif-panel${whatIfOpen ? ' open' : ''}`}
              role="region"
              aria-label="Alternate history"
            >
              <div className="whatif-body">
                <p className="wi-label">Alternate scenario</p>
                <p className="wi-question">{event.whatIf.question}</p>

                <div className="wi-section">
                  <p className="wi-section-label">If it had happened</p>
                  <p className="wi-text">{event.whatIf.scenario}</p>
                </div>

                <div className="wi-section">
                  <p className="wi-section-label">Potential outcome</p>
                  <p className="wi-text">{event.whatIf.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
