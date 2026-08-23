import { avatarInfo, type AvatarId } from '../data/avatars'

interface AvatarMarkProps {
  id?: string
  photo?: string
  size?: number
  className?: string
}

export function AvatarMark({ id, photo, size = 44, className }: AvatarMarkProps) {
  if (photo) {
    return (
      <img
        className={`avatar-photo ${className ?? ''}`.trim()}
        src={photo}
        width={size}
        height={size}
        alt=""
        draggable={false}
      />
    )
  }
  const info = avatarInfo(id)
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill={info.bg} />
      <g fill={info.fg} stroke={info.fg} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <Icon id={info.id} />
      </g>
    </svg>
  )
}

function Icon({ id }: { id: AvatarId }) {
  switch (id) {
    case 'globe':
      return (
        <>
          <circle cx="20" cy="20" r="9" fill="none" />
          <ellipse cx="20" cy="20" rx="4" ry="9" fill="none" />
          <path d="M11 20h18M14 14.5h12M14 25.5h12" fill="none" />
        </>
      )
    case 'compass':
      return (
        <>
          <circle cx="20" cy="20" r="9" fill="none" />
          <path d="M20 12.5l3.2 7.5L20 27.5 16.8 20z" />
        </>
      )
    case 'flag':
      return <path d="M14 10.5v19M14 12h13l-2.5 4.2 2.5 4.3H14" fill="none" />
    case 'lion':
      return (
        <>
          <circle cx="20" cy="20" r="7.5" fill="none" />
          <circle cx="17.2" cy="19" r="1.1" fill={avatarInfo('lion').fg} stroke="none" />
          <circle cx="22.8" cy="19" r="1.1" fill={avatarInfo('lion').fg} stroke="none" />
          <path d="M16 24c1.4 1.4 6.6 1.4 8 0M12 14l4 3M28 14l-4 3M12 26l4-2M28 26l-4-2" fill="none" />
        </>
      )
    case 'eagle':
      return <path d="M8 22c6-9 18-9 24 0-4-2-8-2-12 3-4-5-8-5-12-3zM18 14l2-4 2 4" fill="none" />
    case 'whale':
      return <path d="M8 22c3-7 14-9 21-3 2 1.6 4 2 5 1-1 3-4 4-7 3l-2 4c-1-2-3-3-5-3-7 0-12-1-12-2z" fill="none" />
    case 'panda':
      return (
        <>
          <circle cx="20" cy="21" r="8" fill="none" />
          <circle cx="14.5" cy="15.5" r="2.4" />
          <circle cx="25.5" cy="15.5" r="2.4" />
          <circle cx="17" cy="20.5" r="1.3" />
          <circle cx="23" cy="20.5" r="1.3" />
        </>
      )
    case 'fox':
      return <path d="M10 26l4-14 6 6 6-6 4 14-10-4zM17 24c1 1.4 5 1.4 6 0" fill="none" />
    case 'owl':
      return (
        <>
          <ellipse cx="20" cy="22" rx="8" ry="9" fill="none" />
          <circle cx="16.5" cy="20" r="2.4" fill="none" />
          <circle cx="23.5" cy="20" r="2.4" fill="none" />
          <path d="M20 22.5l1.8 2.6H18.2z" />
        </>
      )
    case 'turtle':
      return (
        <>
          <ellipse cx="20" cy="20" rx="8" ry="6" fill="none" />
          <path d="M12 20h16M20 14v12M11 16h-3M29 16h3M11 25h-2M29 25h2M20 12v-2" fill="none" />
        </>
      )
    case 'cat':
      return (
        <>
          <circle cx="20" cy="22" r="8" fill="none" />
          <path d="M13 16l-1-7 6 5M27 16l1-7-6 5M17 24c1.2 1.5 4.8 1.5 6 0" fill="none" />
        </>
      )
    case 'dog':
      return (
        <>
          <circle cx="21" cy="21" r="7.5" fill="none" />
          <path d="M14 16c-4 0-5 6-2 7M27 18l4-4M18 25c1.4 1.2 5 1.2 6.5 0" fill="none" />
        </>
      )
    case 'penguin':
      return (
        <>
          <ellipse cx="20" cy="21" rx="7" ry="10" fill="none" />
          <ellipse cx="20" cy="23" rx="4" ry="6" fill="none" />
          <path d="M18 16h4" />
        </>
      )
    case 'camel':
      return <path d="M8 26c2-8 5-10 8-6 2-6 6-6 8 0 2-2 6-1 8 4M12 26v4M24 26v4" fill="none" />
    case 'koala':
      return (
        <>
          <circle cx="13" cy="16" r="4.2" fill="none" />
          <circle cx="27" cy="16" r="4.2" fill="none" />
          <circle cx="20" cy="22" r="7.5" fill="none" />
          <circle cx="17.5" cy="21" r="1.1" />
          <circle cx="22.5" cy="21" r="1.1" />
        </>
      )
    case 'sun':
      return (
        <>
          <circle cx="20" cy="20" r="5.5" fill="none" />
          <path d="M20 9v3M20 28v3M9 20h3M28 20h3M12 12l2 2M26 26l2 2M12 28l2-2M26 14l2-2" fill="none" />
        </>
      )
    case 'moon':
      return <path d="M24 11a9 9 0 1 0 5 16 11 11 0 1 1-5-16z" fill="none" />
    case 'mountain':
      return <path d="M6 29l10-16 5 8 4-6 9 14zM16 19l3 5" fill="none" />
    case 'tree':
      return <path d="M20 30v-7M12 24c4-10 12-10 16 0zM14 19c3-8 9-8 12 0" fill="none" />
    case 'wave':
      return <path d="M8 24c3-6 6-6 8 0 2 6 5 6 8 0 2-6 5-6 8 0" fill="none" />
    case 'star':
      return <path d="M20 9l2.6 7.4H30l-6 4.6 2.3 7.4L20 24.2l-6.3 4.2 2.3-7.4-6-4.6h7.4z" fill="none" />
    case 'crown':
      return <path d="M8 26h24l-2-12-6 6-4-8-4 8-6-6z" fill="none" />
    case 'ship':
      return <path d="M8 24h24l-3 6H11zM20 10v14M14 16h12" fill="none" />
    case 'rocket':
      return <path d="M20 8c5 6 5 16 0 22-5-6-5-16 0-22zM14 24l-3 6M26 24l3 6M17 18h6" fill="none" />
    case 'dragon':
      return <path d="M8 26c4-10 10-12 14-6 2-6 8-8 10-2-4 1-6 4-5 8M14 18c2 2 4 2 6 0" fill="none" />
  }
}
