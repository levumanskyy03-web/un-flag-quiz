import { useId, type CSSProperties } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { accountLevelMark, accountProgress, formatXp } from '../lib/xp'
import { RatingsButton } from './RatingsButton'
import { SettingsButton, type SettingsButtonProps } from './SettingsButton'

interface PlayerHudProps extends SettingsButtonProps {
  xp: number
  xpReady?: boolean
}

export function PlayerHud({ xp, xpReady = false, ...settings }: PlayerHudProps) {
  const t = STRINGS[settings.lang]
  const rank = accountProgress(xp)
  const mark = accountLevelMark(rank.level)
  const fillId = useId().replace(/:/g, '')
  const edgeId = useId().replace(/:/g, '')
  const history = settings.history ?? []
  const bests = settings.bests ?? []
  const levelClears = settings.levelClears ?? []

  return (
    <div className="player-hud">
      <div className="player-hud-mark">
        <SettingsButton {...settings} />
        {xpReady ? (
          <span
            className={`coc-level is-${mark.metal}`}
            aria-label={t.accountLevel(rank.level)}
            style={{
              '--level-scale': String(mark.scale),
              '--level-ink': mark.ink,
              '--level-shade': mark.shade,
            } as CSSProperties}
          >
            <svg className="coc-level-shield" viewBox="0 0 36 40" aria-hidden="true">
              <defs>
                <linearGradient id={fillId} x1="18" y1="2" x2="18" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={mark.fill[0]} />
                  <stop offset="0.45" stopColor={mark.fill[1]} />
                  <stop offset="1" stopColor={mark.fill[2]} />
                </linearGradient>
                <linearGradient id={edgeId} x1="18" y1="2" x2="18" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={mark.edge[0]} />
                  <stop offset="1" stopColor={mark.edge[1]} />
                </linearGradient>
              </defs>
              <path
                d="M18 2.4 33.2 13.2 27.6 37.2H8.4L2.8 13.2Z"
                fill={`url(#${fillId})`}
                stroke={`url(#${edgeId})`}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M18 6.2 29.4 14.4 25.2 32.6H10.8L6.6 14.4Z"
                fill="none"
                stroke={mark.sheen}
                strokeOpacity="0.55"
                strokeWidth="1.1"
              />
            </svg>
            <span className={`coc-level-n${rank.level >= 100 ? ' is-long' : rank.level >= 10 ? ' is-mid' : ''}`}>
              {rank.level}
            </span>
          </span>
        ) : null}
      </div>
      {xpReady ? (
        <div
          className="coc-xp"
          role="meter"
          aria-label={t.xpTotal(formatXp(rank.xp, settings.lang))}
          aria-valuemin={0}
          aria-valuemax={rank.span}
          aria-valuenow={rank.into}
        >
          <span className="coc-xp-fill" style={{ width: `${Math.round(rank.ratio * 100)}%` }} />
          <span className="coc-xp-label">{formatXp(rank.xp, settings.lang)}</span>
        </div>
      ) : null}
      <RatingsButton
        lang={settings.lang}
        history={history}
        bests={bests}
        levelClears={levelClears}
        xp={xp}
      />
    </div>
  )
}
