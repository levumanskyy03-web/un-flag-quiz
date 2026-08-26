type GeoIconName = 'compass' | 'globe' | 'map' | 'pin' | 'meridians' | 'trophy' | 'ball'

interface GeoIconProps {
  name: GeoIconName
  size?: number
}

export function GeoIcon({ name, size = 14 }: GeoIconProps) {
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
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 6.6 14.8 8.6 13.7 11.9H10.3L9.2 8.6Z"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 8.6 5.6 7.2M14.8 8.6 18.4 7.2M13.7 11.9 17.2 15.6M10.3 11.9 7.8 15.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M5.6 7.2c.3 2.6-.4 5.2-1.6 7.1M18.4 7.2c-.3 2.6.4 5.2 1.6 7.1M7.8 15.6c1.3 1.6 2.7 2.5 4.2 2.8M17.2 15.6c-1.3 1.6-2.7 2.5-4.2 2.8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
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
    </svg>
  )
}
