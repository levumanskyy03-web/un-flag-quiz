import { STRINGS, type Lang } from '../i18n/strings'
import { STAMP_MAX } from '../lib/stamps'

export function AlbumLootHow({ lang, world }: { lang: Lang; world: 'geo' | 'world' }) {
  const t = STRINGS[lang]
  return (
    <section className="album-loot" aria-labelledby="album-loot-title">
      <div className="album-loot-head">
        <h2 id="album-loot-title">{t.albumLootTitle}</h2>
        <span className="stamp-pips album-loot-pips" aria-hidden="true">
          {Array.from({ length: STAMP_MAX }, (_, index) => (
            <span key={index} className={`stamp-pip${index < 2 ? ' is-on' : ''}`} />
          ))}
        </span>
      </div>
      <ol>
        <li>{t.albumLoot1}</li>
        <li>{t.albumLoot2}</li>
        <li>{t.albumLoot3}</li>
        <li>{t.albumLoot4}</li>
        <li>{t.albumLoot5}</li>
      </ol>
      <p>{world === 'geo' ? t.albumLootNote : t.albumLootNoteWorld}</p>
    </section>
  )
}
