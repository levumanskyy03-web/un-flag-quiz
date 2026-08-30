import type { AchievementId } from '../data/achievements'

interface AchievementMarkProps {
  id: AchievementId
  size?: number
}

export function AchievementMark({ id, size = 24 }: AchievementMarkProps) {
  return (
    <svg
      className="achievement-mark"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <Icon id={id} />
    </svg>
  )
}

function Icon({ id }: { id: AchievementId }) {
  switch (id) {
    case 'firstRound':
      return (
        <>
          <circle cx="8" cy="12" r="3" />
          <path d="M12 12h8M16.5 8.5 21 12l-4.5 3.5" />
        </>
      )
    case 'firstHit':
      return <path d="M5 12.5 10 17.5 19 7" />
    case 'completeFive':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8 12.2 11 15.2 16.5 9" />
        </>
      )
    case 'campaign1':
      return <path d="M12 3.5 19 6.2v6.2c0 4.4-3.2 7.2-7 8.8-3.8-1.6-7-4.4-7-8.8V6.2z" />
    case 'flagComplete':
      return <path d="M6 4.5v16M6 6h11l-2.2 3.4L17 12.8H6" />
    case 'eightOfTen':
      return (
        <>
          <path d="M5 16a8 8 0 1 1 14 0" />
          <path d="M12 16V10.5" />
          <circle cx="12" cy="16" r="1.1" fill="currentColor" stroke="none" />
        </>
      )
    case 'perfect5':
      return <path d="M12 3.5 14.6 10h6.7l-5.4 4 2 6.6L12 16.8 5.9 20.6l2-6.6-5.4-4h6.7z" />
    case 'hardComplete':
      return <path d="M4.5 18.5 12 6l7.5 12.5zM8.2 18.5 12 12.2l3.8 6.3" />
    case 'campaign3':
      return (
        <>
          <path d="M5 18h14" />
          <path d="M7.5 14h9" />
          <path d="M10 10h4" />
          <path d="M12 10V6" />
        </>
      )
    case 'twoModes':
      return (
        <>
          <rect x="4" y="6" width="10" height="10" rx="1.8" />
          <rect x="10" y="8" width="10" height="10" rx="1.8" />
        </>
      )
    case 'perfect10':
      return (
        <>
          <circle cx="12" cy="10.5" r="5.5" />
          <path d="M9 16.5 8 20.5h8L15 16.5" />
          <path d="M12 8l.9 2h2.1l-1.7 1.3.7 2.1L12 12.3l-2 1.1.7-2.1L9 10h2.1z" />
        </>
      )
    case 'fiveRegions':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <ellipse cx="12" cy="12" rx="3.2" ry="8" />
          <path d="M4.2 12h15.6M6.5 8h11M6.5 16h11" />
        </>
      )
    case 'threeModes':
      return (
        <>
          <rect x="3.5" y="8" width="5.5" height="8" rx="1.2" />
          <rect x="9.25" y="8" width="5.5" height="8" rx="1.2" />
          <rect x="15" y="8" width="5.5" height="8" rx="1.2" />
        </>
      )
    case 'campaign8':
      return (
        <>
          <path d="M5 18c3-7 5 0 7-7 2 7 4 0 7-6" />
          <circle cx="5" cy="18" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="11" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="19" cy="5" r="1.2" fill="currentColor" stroke="none" />
        </>
      )
    case 'hardcoreComplete':
      return <path d="M13 3 6.5 13h5L11 21l6.5-10h-5z" />
    case 'perfect20':
      return (
        <>
          <path d="M5 9.5 8.5 7l3.5 2.2L15.5 7 19 9.5v2.2c0 4.4-3.2 6.8-7 8.3-3.8-1.5-7-3.9-7-8.3z" />
          <path d="M8.5 7V5.2M15.5 7V5.2" />
        </>
      )
    case 'allModes':
      return (
        <g fill="currentColor" stroke="none">
          <circle cx="7" cy="7" r="1.7" />
          <circle cx="12" cy="7" r="1.7" />
          <circle cx="17" cy="7" r="1.7" />
          <circle cx="7" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="17" cy="12" r="1.7" />
          <circle cx="7" cy="17" r="1.7" />
          <circle cx="12" cy="17" r="1.7" />
          <circle cx="17" cy="17" r="1.7" />
        </g>
      )
    case 'campaign15':
      return (
        <>
          <path d="M3.5 18.5 9 9l3 5 3.2-4.4L20.5 18.5z" />
          <path d="M14.8 9.8 15.5 5h3.2" />
        </>
      )
    case 'hardcoreLevel':
      return <path d="M12 3.5 19.5 12 12 20.5 4.5 12z" />
    case 'completes10':
      return (
        <>
          <path d="M8 7.5h11M8 12h11M8 16.5h11" />
          <path d="M4.5 7.5l1.4 1.4 2.4-2.8M4.5 12l1.4 1.4 2.4-2.8M4.5 16.5l1.4 1.4 2.4-2.8" />
        </>
      )
    case 'campaign20':
      return (
        <>
          <path d="M8 5h8v4.2a4 4 0 0 1-8 0z" />
          <path d="M8 5H5.5a3.2 3.2 0 0 0 3.2 3.2M16 5h2.5A3.2 3.2 0 0 1 15.3 8.2" />
          <path d="M10 13.4h4V16M8.5 20h7M12 16v4" />
        </>
      )
    case 'goldTen':
      return (
        <>
          <circle cx="12" cy="13" r="6" />
          <path d="M9 4.5h6l-1.4 4.2H10.4z" />
          <path d="M12 10.4l.9 1.9 2.1.2-1.6 1.4.5 2.1L12 14.8l-1.9 1.2.5-2.1-1.6-1.4 2.1-.2z" />
        </>
      )
    case 'goldFinal':
      return (
        <path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8.2a3.9 3.9 0 0 1 7 2.6C19 15.6 12 20 12 20z" />
      )
    case 'perfectHardcore':
      return (
        <>
          <path d="M12 3.5 14.6 10h6.7l-5.4 4 2 6.6L12 16.8 5.9 20.6l2-6.6-5.4-4h6.7z" />
          <path d="M12.4 8.2 9.8 12.4h2.1L11.3 16l2.8-4.4h-2.1z" />
        </>
      )
    case 'worldPerfect':
      return (
        <>
          <circle cx="11" cy="12" r="7.5" />
          <ellipse cx="11" cy="12" rx="3" ry="7.5" />
          <path d="M3.6 12h14.8" />
          <path d="M15.5 16.5 17.5 18.5 21 14.8" />
        </>
      )
    case 'play10m':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.2L15 14" />
        </>
      )
    case 'play1h':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.5V12h4" />
          <path d="M12 4.2V2.8M12 21.2v-1.4M4.2 12H2.8M21.2 12h-1.4" />
        </>
      )
    case 'play10h':
      return (
        <>
          <path d="M7 4.5h10M7 19.5h10" />
          <path d="M8 4.5 12 12 8 19.5M16 4.5 12 12l4 7.5" />
        </>
      )
    case 'rank5':
      return (
        <>
          <path d="M12 3.5 19 8.2v7.6L12 20.5 5 15.8V8.2z" />
          <path d="M12 8.2v5.2M10 11.2h4" />
        </>
      )
    case 'rank10':
      return (
        <>
          <path d="M12 3.5 19 8.2v7.6L12 20.5 5 15.8V8.2z" />
          <path d="M9.2 12.2h1.8V15M13 15V9.8h.2c1.4 0 2.2.8 2.2 2.6S14.6 15 13.2 15H13" />
        </>
      )
    case 'rank20':
      return (
        <>
          <path d="M12 3.5 19 8.2v7.6L12 20.5 5 15.8V8.2z" />
          <path d="M8.8 10.2h3.2l-3.2 4.6H12.4M14.2 15V9.8" />
        </>
      )
    case 'veteranDay':
      return (
        <>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 5.2V3.4M12 20.6v-1.8M5.2 12H3.4M20.6 12h-1.8M7.1 7.1 5.8 5.8M18.2 18.2l-1.3-1.3M7.1 16.9 5.8 18.2M18.2 5.8l-1.3 1.3" />
        </>
      )
    case 'veteranWeek':
      return (
        <>
          <rect x="4.5" y="6" width="15" height="14" rx="2" />
          <path d="M4.5 10h15M8 4.5v3M16 4.5v3" />
          <path d="M8 13.5h2M12 13.5h2M16 13.5h.01M8 16.5h2M12 16.5h2" />
        </>
      )
    case 'veteranMonth':
      return (
        <>
          <rect x="4.5" y="6" width="15" height="14" rx="2" />
          <path d="M4.5 10h15M8 4.5v3M16 4.5v3" />
          <path d="M12 13.2v4.2M10.2 15h3.6" />
        </>
      )
    case 'recordBreak1':
      return (
        <>
          <path d="M8 5h8v4.2a4 4 0 0 1-8 0z" />
          <path d="M8 5H5.5a3.2 3.2 0 0 0 3.2 3.2M16 5h2.5A3.2 3.2 0 0 1 15.3 8.2" />
          <path d="M9.2 16.5 12 14.2l2.8 2.3V20H9.2z" />
        </>
      )
    case 'recordBreak10':
      return (
        <>
          <path d="M8 4.5h8v4a4 4 0 0 1-8 0z" />
          <path d="M8 4.5H5.6a3 3 0 0 0 3 3M16 4.5h2.4a3 3 0 0 1-3 3" />
          <path d="M12 3.2 13.4 7h3.6l-2.9 2.2 1.1 3.5L12 10.6 8.8 12.7l1.1-3.5L7 7h3.6z" />
        </>
      )
    case 'fbKickoff':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.2 14.4 9l-.9 2.8H10.5L9.6 9z" />
          <path d="M4.8 12h14.4" />
        </>
      )
    case 'fbFirstGoal':
      return (
        <>
          <path d="M4 16.5h16" />
          <path d="M7 16.5V8.5l5 3.2 5-3.2v8" />
          <circle cx="17.5" cy="6.2" r="2.1" />
        </>
      )
    case 'fbHatTrick':
      return (
        <>
          <circle cx="6.2" cy="13" r="2.4" />
          <circle cx="12" cy="9.2" r="2.4" />
          <circle cx="17.8" cy="13" r="2.4" />
        </>
      )
    case 'fbCleanSheet':
      return (
        <>
          <path d="M5 16.5V8.2l7-3.4 7 3.4v8.3" />
          <path d="M9.2 13.2 11.4 15.4 15.5 10.8" />
        </>
      )
    case 'fbWorldCup':
      return (
        <>
          <path d="M8 5h8v4.2a4 4 0 0 1-8 0z" />
          <path d="M8 5H5.5a3.2 3.2 0 0 0 3.2 3.2M16 5h2.5A3.2 3.2 0 0 1 15.3 8.2" />
          <path d="M10 13.4h4V16M8.5 20h7M12 16v4" />
        </>
      )
    case 'fbFinal':
      return (
        <>
          <circle cx="8" cy="12" r="3.2" />
          <circle cx="16" cy="12" r="3.2" />
          <path d="M11.2 12h1.6" />
        </>
      )
    case 'fbHosts':
      return (
        <>
          <path d="M4.5 18.5h15" />
          <path d="M6 18.5V9.5l6-4.2 6 4.2v9" />
          <path d="M10.2 18.5v-5.2h3.6v5.2" />
        </>
      )
    case 'fbYears':
      return (
        <>
          <rect x="4.5" y="6" width="15" height="14" rx="2" />
          <path d="M4.5 10h15M8 4.5v3M16 4.5v3" />
          <path d="M9.2 14.2h5.6M12 12.2v5" />
        </>
      )
    case 'fbEuro':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.2 9.2c1.2-1.4 3.1-1.6 4.4-.4 1.4 1.3.4 3.4-1.2 3.6-1.2.2-2.1-.6-1.8-1.6" />
          <path d="M14.8 16.2c-.8.6-2 .8-3.2.4" />
        </>
      )
    case 'fbAllModes':
      return (
        <>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M3.5 12h17" />
          <circle cx="12" cy="12" r="3.2" />
        </>
      )
    case 'fbPerfect10':
      return (
        <>
          <path d="M12 3.5 14.6 10h6.7l-5.4 4 2 6.6L12 16.8 5.9 20.6l2-6.6-5.4-4h6.7z" />
          <circle cx="12" cy="12.2" r="2.2" />
        </>
      )
    case 'fbHard':
      return (
        <>
          <path d="M4 16.5h16" />
          <path d="M6.5 16.5 9 8.5h6l2.5 8" />
          <path d="M9.5 12h5" />
        </>
      )
    case 'fbTenMatches':
      return (
        <>
          <rect x="3.8" y="5.5" width="7.2" height="5.5" rx="1" />
          <rect x="13" y="5.5" width="7.2" height="5.5" rx="1" />
          <rect x="3.8" y="13" width="7.2" height="5.5" rx="1" />
          <rect x="13" y="13" width="7.2" height="5.5" rx="1" />
        </>
      )
    case 'fbHardcore':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12h8M12 8v8" />
          <path d="M12.4 8.2 9.8 12.4h2.1L11.3 16" />
        </>
      )
    case 'fbLevel':
      return (
        <>
          <path d="M5 18.5h14" />
          <path d="M7 18.5V12h3.2v6.5M13.8 18.5V8h3.2v10.5" />
        </>
      )
    case 'fbCampaign':
      return (
        <>
          <path d="M8 5h8v4.2a4 4 0 0 1-8 0z" />
          <path d="M8 5H5.5a3.2 3.2 0 0 0 3.2 3.2M16 5h2.5A3.2 3.2 0 0 1 15.3 8.2" />
          <circle cx="12" cy="17.2" r="3" />
        </>
      )
    case 'cdKickoff':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.2 12h7.6M12 8.2v7.6" />
          <path d="M9.2 9.2h5.6v5.6H9.2z" />
        </>
      )
    case 'cdTld':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8.5v0.01" />
          <circle cx="12" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
          <path d="M8 15.2h8" />
        </>
      )
    case 'cdCalling':
      return (
        <>
          <rect x="7" y="3.8" width="10" height="16.4" rx="2.2" />
          <path d="M10 6.2h4M10 17.6h4" />
        </>
      )
    case 'cdCar':
      return (
        <>
          <rect x="3.5" y="9" width="17" height="7.2" rx="1.6" />
          <path d="M6.5 9 8.2 6.2h7.6L17.5 9" />
          <circle cx="7.5" cy="16.6" r="1.4" />
          <circle cx="16.5" cy="16.6" r="1.4" />
        </>
      )
    case 'cdAllModes':
      return (
        <>
          <rect x="4" y="5" width="16" height="14" rx="1.8" />
          <path d="M7 9h10M7 12h10M7 15h6" />
        </>
      )
    case 'cdPerfect':
      return (
        <>
          <rect x="5" y="4.5" width="14" height="15" rx="1.6" />
          <path d="M8.2 12.2 10.6 14.6 15.6 9.2" />
        </>
      )
    case 'cdTen':
      return (
        <>
          <path d="M6 6.5h12M6 12h12M6 17.5h8" />
          <path d="M4.2 6.5l1.2 1.2 2-2.2M4.2 12l1.2 1.2 2-2.2" />
        </>
      )
    case 'stFirst':
      return (
        <>
          <rect x="5" y="5" width="14" height="14" rx="1.4" />
          <path d="M5 9h14M9 5v14" />
        </>
      )
    case 'stTen':
      return (
        <>
          <rect x="3.5" y="6" width="12" height="12" rx="1.2" />
          <rect x="8.5" y="6" width="12" height="12" rx="1.2" />
        </>
      )
    case 'stFifty':
      return (
        <>
          <rect x="4.2" y="5" width="15.6" height="14" rx="1.4" />
          <path d="M8 12.2 10.4 14.6 16 8.8" />
        </>
      )
    case 'stAlbum':
      return (
        <>
          <path d="M6 4.5h12v15H6z" />
          <path d="M6 4.5C7.8 4.5 9 5.6 9 7v12.5" />
          <path d="M11 9h5M11 12h5M11 15h3.5" />
        </>
      )
    case 'msFirst':
      return (
        <>
          <path d="M4.8 12a7.2 7.2 0 1 0 2.1-5.1" />
          <path d="M4.8 6.2v4.2H9" />
        </>
      )
    case 'msPerfect':
      return (
        <>
          <path d="M4.8 12a7.2 7.2 0 1 0 2.1-5.1" />
          <path d="M4.8 6.2v4.2H9" />
          <path d="M9.2 12.4 11.2 14.4 15.4 10" />
        </>
      )
    case 'seaCoast':
      return (
        <>
          <path d="M3.5 10.5c1.6 1.6 3.2 1.6 4.8 0s3.2-1.6 4.8 0 3.2 1.6 4.8 0" />
          <path d="M3.5 15c1.6 1.6 3.2 1.6 4.8 0s3.2-1.6 4.8 0 3.2 1.6 4.8 0" />
          <path d="M12 4.5 14.2 8H9.8z" />
        </>
      )
    case 'riverBank':
      return (
        <>
          <path d="M8 4.5c2.4 2.2 2.4 4.6 0 6.8 2.4 2.2 2.4 4.6 0 8.2" />
          <path d="M14 4.5c2.4 2.2 2.4 4.6 0 6.8 2.4 2.2 2.4 4.6 0 8.2" />
        </>
      )
    case 'waterLevel':
      return (
        <>
          <path d="M5 18h14" />
          <path d="M7.5 14h9" />
          <path d="M3.5 9.5c1.6 1.6 3.2 1.6 4.8 0s3.2-1.6 4.8 0 3.2 1.6 4.8 0" />
        </>
      )
    case 'langFluent':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 9.2h8M8 12h5.5M8 14.8h3.2" />
          <path d="M16.4 14.2c.7.5.7 2.2 0 2.7" />
        </>
      )
    case 'rankAtlas':
      return (
        <>
          <path d="M5 18.5h14" />
          <path d="M7 18.5V11h3v7.5M13.5 18.5V7h3.5v11.5" />
        </>
      )
    case 'ldThree':
      return (
        <>
          <circle cx="6.2" cy="9" r="2.2" />
          <circle cx="12" cy="8.2" r="2.2" />
          <circle cx="17.8" cy="9" r="2.2" />
          <path d="M3.8 18.2c.4-2.6 1.6-4 2.4-4 .8 0 2 1.4 2.4 4M9.6 18.2c.4-2.8 1.7-4.4 2.4-4.4s2 1.6 2.4 4.4M14.8 18.2c.4-2.6 1.6-4 2.4-4 .8 0 2 1.4 2.4 4" />
        </>
      )
    case 'mixIron':
      return (
        <>
          <rect x="4" y="6" width="7.2" height="7.2" rx="1.4" />
          <rect x="12.8" y="10.8" width="7.2" height="7.2" rx="1.4" />
          <path d="M11 9.6 13.2 12" />
        </>
      )
    case 'stampsCentury':
      return (
        <>
          <rect x="4" y="5.5" width="10.5" height="10.5" rx="1.2" />
          <rect x="9.5" y="8" width="10.5" height="10.5" rx="1.2" />
          <path d="M12 12.4 13.6 14 17 10.6" />
        </>
      )
    case 'geoHardTen':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <ellipse cx="12" cy="12" rx="3.2" ry="8" />
          <path d="M4.2 12h15.6" />
          <path d="M12 4.5 13.2 7.2h2.8L14.2 9l.9 2.6L12 10.2 8.9 11.6 9.8 9 7 7.2h2.8z" />
        </>
      )
    case 'campaignTriple':
      return (
        <>
          <path d="M4.5 18h15" />
          <path d="M6 18V12h3.2v6M10.4 18V9h3.2v9M14.8 18V6h3.2v12" />
        </>
      )
    case 'speedTen':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.2L16 14" />
          <path d="M7 7 5.5 5.5M17 7l1.5-1.5" />
        </>
      )
    case 'fbIron':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.2 14.4 9l-.9 2.8H10.5L9.6 9z" />
          <path d="M8.5 16.5 12 13l3.5 3.5" />
        </>
      )
    case 'mythWorld':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <ellipse cx="12" cy="12" rx="3.2" ry="8" />
          <path d="M4.2 12h15.6" />
          <path d="M12.2 7.2 9.6 11.4h2.1L11.1 15l2.8-4.4h-2.1z" />
        </>
      )
    case 'mythGoldRoad':
      return (
        <>
          <path d="M5 18.5h14" />
          <path d="M7 18.5 12 5.5 17 18.5" />
          <path d="M8.8 13.5h6.4" />
          <path d="M12 5.5 13.1 8.2h2.6L14.1 10l.8 2.5L12 11.1 9.1 12.5 9.9 10 8.3 8.2h2.6z" />
        </>
      )
    case 'mythAtlas':
      return (
        <>
          <rect x="3.5" y="5" width="7.2" height="6.2" rx="1.1" />
          <rect x="13.3" y="5" width="7.2" height="6.2" rx="1.1" />
          <rect x="3.5" y="13" width="7.2" height="6.2" rx="1.1" />
          <rect x="13.3" y="13" width="7.2" height="6.2" rx="1.1" />
        </>
      )
    case 'mythRankings':
      return (
        <>
          <path d="M4.5 18.5h15" />
          <path d="M6.5 18.5V14h2.6v4.5M10.7 18.5V10h2.6v8.5M14.9 18.5V6h2.6v12.5" />
          <path d="M12 3.8 13 6.2h2.4L13.8 7.8l.7 2.2L12 8.8l-2.5 1.2.7-2.2L8.6 6.2H11z" />
        </>
      )
    case 'mythRegions':
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 5.2 13.4 9h3.6l-2.9 2.2 1.1 3.4L12 12.6 8.8 14.6l1.1-3.4L7 9h3.6z" />
        </>
      )
    case 'mythLevel40':
      return (
        <>
          <path d="M12 3.5 19 8.2v7.6L12 20.5 5 15.8V8.2z" />
          <path d="M8.4 15V10.2L12.4 15h.2V10.2" />
        </>
      )
    case 'mythHundred':
      return (
        <>
          <path d="M5 7.5h14M5 12h14M5 16.5h10" />
          <path d="M3.4 7.5l1.3 1.3 2.2-2.4M3.4 12l1.3 1.3 2.2-2.4M3.4 16.5l1.3 1.3 2.2-2.4" />
        </>
      )
    case 'mythLeaders':
      return (
        <>
          <circle cx="12" cy="8" r="2.4" />
          <path d="M7.2 18.4c.5-3.2 2-5 4.8-5s4.3 1.8 4.8 5" />
          <path d="M12 3.5 13.2 6h2.8L14.2 7.7l.8 2.5L12 8.8 9 10.2l.8-2.5L8 6h2.8z" />
        </>
      )
    case 'veteranYear':
      return (
        <>
          <rect x="4.5" y="6" width="15" height="14" rx="2" />
          <path d="M4.5 10h15M8 4.5v3M16 4.5v3" />
          <circle cx="12" cy="15.2" r="2.4" />
        </>
      )
  }
}
