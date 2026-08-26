import type { Metadata } from 'next'
import { LegalShell } from '../../components/LegalShell'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Паспорт страны',
  description: 'Какие данные собирает Паспорт страны и какие cookies использует.',
}

export default function PrivacyPage() {
  return (
    <LegalShell title="Политика конфиденциальности">
      <p>Оператор сайта: Лев Уманский, почта levumanskyy03@gmail.com. Дата: 27 августа 2026.</p>

      <h2>Что хранится</h2>
      <ul>
        <li>
          Если вы регистрируетесь: ник, хеш пароля, аватар, дата регистрации, опыт и ачивки. Пароль в открытом виде
          не сохраняется.
        </li>
        <li>
          Рейтинг и дуэли на сервере (хостинг Vercel, база Upstash Redis). Серверы могут находиться за пределами РФ.
        </li>
        <li>Жалобы, которые вы сами отправляете на почту.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Единственная cookie сайта — <code>pq-session</code>. Она ставится только после входа, живёт до 30 дней,
        недоступна скриптам страницы (HttpOnly) и нужна, чтобы узнать ваш аккаунт. Гость без регистрации эту cookie
        не получает.
      </p>
      <p>Рекламных и аналитических cookies сейчас нет. Если они появятся, это будет отдельно указано здесь.</p>

      <h2>Память браузера</h2>
      <p>
        Прогресс игры (язык, история раундов, рекорды, уровни, опыт, ник и аватар на устройстве) пишется в
        localStorage. Это остаётся у вас в браузере, чтобы игра не сбрасывалась после обновления страницы. В дуэли
        во вкладке хранится временный id игрока (sessionStorage).
      </p>

      <h2>Зачем это нужно</h2>
      <p>Чтобы работали аккаунт, рейтинг, дуэль и сохранение прогресса на устройстве. Рекламы на сайте пока нет.</p>

      <h2>Как удалить</h2>
      <p>
        Выйдите из аккаунта в настройках. Данные на устройстве можно стереть, очистив данные сайта в браузере. Чтобы
        удалить аккаунт на сервере, напишите на почту выше.
      </p>

      <p lang="en">
        Operator: Lev Umansky, levumanskyy03@gmail.com. We store a nickname and a password hash if you register,
        plus a session cookie <code>pq-session</code> after sign-in. Game progress is kept in the browser
        (localStorage). No ad cookies yet. Hosting: Vercel and Upstash.
      </p>
    </LegalShell>
  )
}
