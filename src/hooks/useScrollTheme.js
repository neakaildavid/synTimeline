function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpRGB([r1, g1, b1], [r2, g2, b2], t) {
  return [Math.round(lerp(r1, r2, t)), Math.round(lerp(g1, g2, t)), Math.round(lerp(b1, b2, t))]
}

function rgb(c)      { return `rgb(${c[0]},${c[1]},${c[2]})` }
function rgba(c, a)  { return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})` }

// Scroll 0→1: daylight sky → golden hour → sunset → dusk → night
const stops = [
  {
    pos: 0.00,
    bg:  [228, 240, 255],   // pale daylight sky
    tp:  [16,  26,  48 ],   // dark navy
    ts:  [60,  78,  112],
    tm:  [130, 150, 188],
    cb:  [255, 253, 249], ca: 0.94,
    sp:  [120, 165, 218, 0.50],
    shadowAlpha: 0.06,
  },
  {
    pos: 0.18,
    bg:  [212, 230, 255],   // clear blue sky
    tp:  [16,  26,  48 ],
    ts:  [60,  78,  112],
    tm:  [130, 150, 188],
    cb:  [255, 253, 249], ca: 0.92,
    sp:  [110, 158, 215, 0.48],
    shadowAlpha: 0.06,
  },
  {
    pos: 0.32,
    bg:  [238, 230, 210],   // afternoon warmth
    tp:  [30,  20,  10 ],
    ts:  [88,  70,  48 ],
    tm:  [148, 120, 90 ],
    cb:  [255, 250, 235], ca: 0.90,
    sp:  [188, 158, 88,  0.46],
    shadowAlpha: 0.07,
  },
  {
    pos: 0.44,
    bg:  [255, 232, 165],   // golden hour
    tp:  [38,  18,  6  ],
    ts:  [100, 65,  35 ],
    tm:  [162, 115, 75 ],
    cb:  [255, 248, 218], ca: 0.88,
    sp:  [200, 145, 52,  0.48],
    shadowAlpha: 0.09,
  },
  {
    pos: 0.54,
    bg:  [250, 165, 65],    // peak sunset — cream cards still legible
    tp:  [28,  10,  3  ],
    ts:  [78,  42,  18 ],
    tm:  [138, 90,  52 ],
    cb:  [255, 242, 218], ca: 0.84,
    sp:  [200, 118, 32,  0.50],
    shadowAlpha: 0.12,
  },
  {
    // Cards flip to dark glass as bg turns deep red — restores contrast
    pos: 0.64,
    bg:  [210, 85,  42],    // deep orange-red
    tp:  [252, 232, 212],   // warm cream text on dark cards
    ts:  [215, 172, 142],
    tm:  [165, 122, 92 ],
    cb:  [22,  7,   3  ], ca: 0.52,
    sp:  [245, 180, 120, 0.42],
    shadowAlpha: 0.34,
  },
  {
    pos: 0.74,
    bg:  [168, 48,  26],    // deep sunset red
    tp:  [252, 228, 205],
    ts:  [215, 165, 135],
    tm:  [162, 112, 88 ],
    cb:  [18,  6,   3  ], ca: 0.50,
    sp:  [240, 168, 108, 0.38],
    shadowAlpha: 0.42,
  },
  {
    pos: 0.85,
    bg:  [42,  14,  42],    // dusk purple
    tp:  [232, 218, 238],
    ts:  [160, 142, 170],
    tm:  [105, 88,  115],
    cb:  [255, 235, 255], ca: 0.09,
    sp:  [138, 52,  148, 0.40],
    shadowAlpha: 0.46,
  },
  {
    pos: 1.00,
    bg:  [8,   5,   14],    // dark night
    tp:  [216, 224, 240],
    ts:  [115, 130, 156],
    tm:  [55,  68,  92 ],
    cb:  [255, 255, 255], ca: 0.06,
    sp:  [78,  55,  138, 0.35],
    shadowAlpha: 0.50,
  },
]

function sample(progress) {
  const p = Math.max(0, Math.min(1, progress))
  let lo = stops[0]
  let hi = stops[stops.length - 1]
  for (let i = 0; i < stops.length - 1; i++) {
    if (p >= stops[i].pos && p <= stops[i + 1].pos) {
      lo = stops[i]
      hi = stops[i + 1]
      break
    }
  }
  const t = lo.pos === hi.pos ? 0 : (p - lo.pos) / (hi.pos - lo.pos)
  const bg = lerpRGB(lo.bg, hi.bg, t)
  return {
    bg:            rgb(bg),
    navBg:         rgba(bg, 0.86),
    textPrimary:   rgb(lerpRGB(lo.tp, hi.tp, t)),
    textSecondary: rgb(lerpRGB(lo.ts, hi.ts, t)),
    textMuted:     rgb(lerpRGB(lo.tm, hi.tm, t)),
    cardBg:        rgba(lerpRGB(lo.cb, hi.cb, t), lerp(lo.ca, hi.ca, t)),
    spineColor:    rgba(
      lerpRGB([lo.sp[0], lo.sp[1], lo.sp[2]], [hi.sp[0], hi.sp[1], hi.sp[2]], t),
      lerp(lo.sp[3], hi.sp[3], t)
    ),
    shadowAlpha:   lerp(lo.shadowAlpha, hi.shadowAlpha, t),
    // Use background luminance to toggle light/dark accent color variants
    luminance: (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) / 255,
  }
}

import { useEffect } from 'react'

export function useScrollTheme() {
  useEffect(() => {
    let rafId = null

    const apply = (progress) => {
      const s = sample(progress)
      const root = document.documentElement

      root.style.setProperty('--bg-page',        s.bg)
      root.style.setProperty('--navbar-bg',      s.navBg)
      root.style.setProperty('--text-primary',   s.textPrimary)
      root.style.setProperty('--text-secondary', s.textSecondary)
      root.style.setProperty('--text-muted',     s.textMuted)
      root.style.setProperty('--card-bg',        s.cardBg)
      root.style.setProperty('--spine-color',    s.spineColor)

      const sa = s.shadowAlpha
      root.style.setProperty(
        '--card-shadow',
        `0 1px 4px rgba(0,0,0,${(sa * 0.75).toFixed(3)}), 0 6px 24px rgba(0,0,0,${(sa * 0.5).toFixed(3)})`
      )

      // Switch accent colors when background becomes dark
      root.classList.toggle('theme-dark', s.luminance < 0.50)
    }

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        apply(total > 0 ? window.scrollY / total : 0)
      })
    }

    apply(0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])
}
