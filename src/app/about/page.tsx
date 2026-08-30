import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'

export const metadata: Metadata = {
  title: 'О проекте — Паспорт страны',
  description: 'Викторина по странам ООН: флаги, столицы, карты и футбол.',
}

export default function AboutPage() {
  return (
    <LegalShell title="О проекте">
      <p>
        Паспорт страны — викторина по 193 государствам ООН: флаги, столицы, валюты, население, год основания,
        соседи и карты. Есть кампания, обучение, дуэль и футбольный раздел (чемпионаты мира и Европы).
      </p>
      <p>На каждой карточке страны — короткий факт. Откроете паспорт снова — увидите другой.</p>
      <p>
        У каждой страны есть открытый паспорт: каталог на <a href="/countries">/countries</a>, сегодняшняя
        страна — <a href="/today">/today</a>.
      </p>
      <p>Сайт сделал Лев Уманский. Игра бесплатная, без обязательной регистрации.</p>
      <p>
        Портреты в разделе «Лидеры» подгружаются с Wikimedia Commons и показываются только если у файла свободная
        лицензия (общественное достояние, CC BY или CC BY-SA). Под фото — автор и лицензия, со ссылкой на страницу
        файла. Fair use и прочие несвободные снимки с Википедии не используем: вместо них инициалы.
      </p>
      <p lang="en">
        Country Passport is a quiz on the 193 UN member states: flags, capitals, maps, and a football section.
        Leader portraits come from Wikimedia Commons and are shown only when the file is Public Domain, CC BY, or
        CC BY-SA. Created by Lev Umansky.
      </p>
    </LegalShell>
  )
}
