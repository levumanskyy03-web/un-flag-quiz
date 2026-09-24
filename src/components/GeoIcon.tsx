import { useId } from 'react'

type GeoIconName =
  | 'compass'
  | 'globe'
  | 'map'
  | 'pin'
  | 'meridians'
  | 'trophy'
  | 'ball'
  | 'stamp'
  | 'hash'
  | 'laurel'
  | 'sigma'
  | 'orbit'
  | 'speaker'
  | 'speakerOff'
  | 'leaf'
  | 'torch'
  | 'code'
  | 'bowl'
  | 'hq'
  | 'notes'
  | 'notesOff'
  | 'deck'

const BOX_24: ReadonlySet<GeoIconName> = new Set([
  'ball',
  'laurel',
  'sigma',
  'orbit',
  'leaf',
  'torch',
  'code',
  'bowl',
  'hq',
  'notes',
  'notesOff',
  'deck',
])

interface GeoIconProps {
  name: GeoIconName
  size?: number
}

export function GeoIcon({ name, size = 14 }: GeoIconProps) {
  const clipId = useId().replace(/:/g, '')

  return (
    <svg
      className="geo-icon"
      width={size}
      height={size}
      viewBox={name === 'trophy' ? '0 0 20 20' : BOX_24.has(name) ? '0 0 24 24' : '0 0 16 16'}
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {name === 'ball' ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <circle cx="12" cy="12" r="9.35" />
            </clipPath>
          </defs>
          <circle cx="12" cy="12" r="9.35" stroke="currentColor" strokeWidth="1.75" />
          <path fill="currentColor" d="M12 8.75 15.09 11 13.91 14.63 10.09 14.63 8.91 11Z" />
          <g clipPath={`url(#${clipId})`}>
            <path
              d="M12 8.75 15.09 11l3.49-1.56.4-3.8-3.09-2.24-3.49 1.55ZM15.09 11 13.91 14.63l2.56 2.84 3.73-.8 1.18-3.63-2.55-2.84ZM13.91 14.63h-3.82L8.18 17.94l1.91 3.31h3.82l1.91-3.31ZM10.09 14.63 8.91 11l-3.74-.8-2.55 2.84 1.18 3.63 3.73.8ZM8.91 11 12 8.75l-.4-3.8-3.49-1.55-3.09 2.24.4 3.8Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </>
      ) : null}
      {name === 'trophy' ? (
        <>
          <path
            d="M5.2 3.4h9.6v3.2c0 2.7-2.1 4.8-4.8 4.8S5.2 9.3 5.2 6.6V3.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M7.2 16.6h5.6M10 11.4v5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M5.2 4.6H3.4V6c0 1.3 1 2.4 2.2 2.6M14.8 4.6h1.8V6c0 1.3-1 2.4-2.2 2.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {name === 'compass' ? (
        <>
          <circle cx="8" cy="8" r="6.15" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M8 1.9v1.55M8 12.55V14.1M1.9 8h1.55M12.55 8H14.1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path d="M8 3.7 9.35 8 8 12.3 6.65 8Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
        </>
      ) : null}
      {name === 'globe' ? (
        <>
          <circle cx="8" cy="8" r="6.15" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="8" cy="8" rx="2.35" ry="6.15" stroke="currentColor" strokeWidth="1.15" />
          <path d="M2.2 8h11.6" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
        </>
      ) : null}
      {name === 'map' ? (
        <>
          <path
            d="M2.4 4.2 5.8 2.8 10.2 4.2 13.6 2.8v9L10.2 13.2 5.8 11.8 2.4 13.2V4.2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M5.8 2.8v9M10.2 4.2v9" stroke="currentColor" strokeWidth="1.1" />
        </>
      ) : null}
      {name === 'pin' ? (
        <>
          <path
            d="M8 14.2s4.4-4.05 4.4-7.05A4.4 4.4 0 1 0 3.6 7.15C3.6 10.15 8 14.2 8 14.2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="7.1" r="1.45" stroke="currentColor" strokeWidth="1.15" />
        </>
      ) : null}
      {name === 'meridians' ? (
        <>
          <circle cx="8" cy="8" r="6.15" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M2.55 5.4c1.55.85 3.4 1.3 5.45 1.3s3.9-.45 5.45-1.3M2.55 10.6c1.55-.85 3.4-1.3 5.45-1.3s3.9.45 5.45 1.3"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
          <path d="M8 1.85v12.3" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
        </>
      ) : null}
      {name === 'stamp' ? (
        <>
          <rect x="2.4" y="2.6" width="11.2" height="10.8" rx="2.2" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M2.4 4.4h11.2M2.4 11.6h11.2"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeDasharray="1.2 1.1"
          />
        </>
      ) : null}
      {name === 'hash' ? (
        <>
          <path d="M6.1 2.8 5 13.2M11.1 2.8 10 13.2M2.6 6.2h10.8M2.6 9.8h10.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      ) : null}
      {name === 'laurel' ? (
        <g fill="currentColor">
          <ellipse cx="9.05" cy="6.35" rx="1.28" ry="2.35" transform="rotate(-50 9.05 6.35)" />
          <ellipse cx="7.05" cy="9.15" rx="1.32" ry="2.45" transform="rotate(-30 7.05 9.15)" />
          <ellipse cx="6.45" cy="12.25" rx="1.32" ry="2.5" transform="rotate(-8 6.45 12.25)" />
          <ellipse cx="7.25" cy="15.35" rx="1.28" ry="2.35" transform="rotate(16 7.25 15.35)" />
          <ellipse cx="9.2" cy="17.85" rx="1.22" ry="2.2" transform="rotate(38 9.2 17.85)" />
          <ellipse cx="14.95" cy="6.35" rx="1.28" ry="2.35" transform="rotate(50 14.95 6.35)" />
          <ellipse cx="16.95" cy="9.15" rx="1.32" ry="2.45" transform="rotate(30 16.95 9.15)" />
          <ellipse cx="17.55" cy="12.25" rx="1.32" ry="2.5" transform="rotate(8 17.55 12.25)" />
          <ellipse cx="16.75" cy="15.35" rx="1.28" ry="2.35" transform="rotate(-16 16.75 15.35)" />
          <ellipse cx="14.8" cy="17.85" rx="1.22" ry="2.2" transform="rotate(-38 14.8 17.85)" />
          <path d="M10.2 18.85c.55.95 1.2 1.55 1.8 1.55s1.25-.6 1.8-1.55c-.55.28-1.15.42-1.8.42s-1.25-.14-1.8-.42Z" />
        </g>
      ) : null}
      {name === 'sigma' ? (
        <path
          d="M6 5.2h12.2L12.4 12 18.2 18.8H6.1V16.7h8.4L9.6 12l4.8-4.6H6Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
      {name === 'orbit' ? (
        <>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
          <ellipse cx="12" cy="12" rx="9.2" ry="3.4" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="20.4" cy="12" r="1.35" fill="currentColor" />
        </>
      ) : null}
      {name === 'leaf' ? (
        <>
          <path
            d="M12 3.8c5.2 3.2 7.6 8.2 7.4 13.4-4.8.4-8.4-1.2-11.4-4.6C5.6 9.4 7.6 5.4 12 3.8Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M12 4.2v13.8" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
          <path
            d="M12 9.4c-1.7 1.2-2.8 2.7-3.4 4.4M12 11.8c1.5 1 2.6 2.3 3.2 3.8"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {name === 'torch' ? (
        <>
          <path
            d="M12 3.4c1.85 1.55 2.85 3.15 2.85 4.85 0 1.7-1.25 3-2.85 3s-2.85-1.3-2.85-3c0-1.7 1-3.3 2.85-4.85Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M8.35 12.1h7.3l-.85 2.35H9.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 14.45v5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M9.6 20.6h4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      ) : null}
      {name === 'code' ? (
        <>
          <path
            d="M9.2 6.6 4.7 12 9.2 17.4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.8 6.6 19.3 12 14.8 17.4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M13.15 5.8 10.85 18.2" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
        </>
      ) : null}
      {name === 'bowl' ? (
        <>
          <path
            d="M4.6 11.2h14.8c-.45 5.05-3.55 8.05-7.4 8.05s-6.95-3-7.4-8.05Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M8.2 11.2c.25-3.05 1.85-4.85 3.8-4.85s3.55 1.8 3.8 4.85"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
          <path
            d="M10.2 4.35c.15-1.05.7-1.7 1.8-1.7M13.7 4.7c.2-1 .75-1.55 1.7-1.45"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {name === 'hq' ? (
        <>
          <path
            d="M4.4 19.2V9.4L12 4.6l7.6 4.8v9.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M9.2 19.2v-5.2h5.6v5.2" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
          <path d="M8.4 11.2h.1M12 11.2h.1M15.6 11.2h.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : null}
      {name === 'deck' ? (
        <>
          <rect x="8.2" y="4.4" width="11.2" height="13.4" rx="1.8" stroke="currentColor" strokeWidth="1.55" />
          <rect x="6.1" y="6.2" width="11.2" height="13.4" rx="1.8" stroke="currentColor" strokeWidth="1.55" fill="none" />
          <rect x="4" y="8" width="11.2" height="13.4" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
          <path d="M6.4 12.4h6.4M6.4 15.2h4.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </>
      ) : null}
      {name === 'notes' || name === 'notesOff' ? (
        <>
          <path d="M9.2 5.2v10.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <ellipse cx="7.1" cy="15.4" rx="2.3" ry="1.7" fill="currentColor" />
          <path d="M15.4 3.8v10.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <ellipse cx="13.3" cy="14" rx="2.3" ry="1.7" fill="currentColor" />
          <path d="M9.2 5.2h6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          {name === 'notesOff' ? (
            <path d="M4.2 4.2 19.8 19.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          ) : null}
        </>
      ) : null}
      {name === 'speaker' || name === 'speakerOff' ? (
        <>
          <path
            d="M2.7 6.15h2.35L8.5 3.55v8.9L5.05 9.85H2.7A.7.7 0 0 1 2 9.15v-2.3a.7.7 0 0 1 .7-.7Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {name === 'speaker' ? (
            <>
              <path
                d="M10.35 6.15c.7.55.7 3.15 0 3.7"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
              />
              <path
                d="M12.15 4.7c1.45 1.2 1.45 5.4 0 6.6"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
              />
            </>
          ) : (
            <path d="M3.15 3.15 12.85 12.85" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          )}
        </>
      ) : null}
    </svg>
  )
}
