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
  | 'crown'
  | 'speaker'
  | 'speakerOff'

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
      viewBox={name === 'trophy' ? '0 0 20 20' : name === 'ball' ? '0 0 24 24' : '0 0 16 16'}
      fill="none"
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
          <rect x="2.4" y="2.6" width="11.2" height="10.8" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
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
      {name === 'crown' ? (
        <>
          <path
            d="M2.4 11.6h11.2V13c0 .6-.5 1.1-1.1 1.1H3.5c-.6 0-1.1-.5-1.1-1.1v-1.4Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M2.6 11.4 4.2 6.4 8 9.1l3.8-4.7 1.6 7"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
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
