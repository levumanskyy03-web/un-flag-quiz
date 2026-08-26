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
      <p>Сайт сделал Лев Уманский. Игра бесплатная, без обязательной регистрации.</p>
      <p lang="en">
        Country Passport is a quiz on the 193 UN member states: flags, capitals, maps, and a football section.
        Created by Lev Umansky.
      </p>
    </LegalShell>
  )
}
