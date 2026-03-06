import { ImageResponse } from 'next/og'

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

interface OGPageImageProps {
  title: string
  subtitle?: string
  accent?: string
  pills?: { label: string; color: string }[]
}

export function createOGImage({
  title,
  subtitle,
  accent = '#34C759',
  pills,
}: OGPageImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0A14 0%, #12121A 50%, #0A0A14 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, #FF9500)` }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)` }} />
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 32 32">
            <path d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z" fill="#34C759" />
            <circle cx="16" cy="27" r="2" fill="#FF9500" />
          </svg>
        </div>
        <div style={{ marginTop: 28, fontSize: 52, fontWeight: 800, color: '#ffffff', letterSpacing: '-1px', textAlign: 'center', maxWidth: '80%', lineHeight: 1.1 }}>{title}</div>
        {subtitle && (
          <div style={{ marginTop: 16, fontSize: 22, color: 'rgba(255,255,255,0.45)', fontWeight: 400, textAlign: 'center', maxWidth: '70%' }}>{subtitle}</div>
        )}
        {pills && pills.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {pills.map((pill) => (
              <div key={pill.label} style={{ padding: '8px 20px', borderRadius: 24, fontSize: 13, fontWeight: 600, color: pill.color, border: `1px solid ${pill.color}40`, background: `${pill.color}12` }}>{pill.label}</div>
            ))}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 44, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 32, paddingRight: 32, borderTop: '1px solid rgba(52,199,89,0.15)', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <span>NourishAI</span>
          <span style={{ letterSpacing: '1px' }}>nourishhealthai.com</span>
        </div>
      </div>
    ),
    { ...ogSize }
  )
}
