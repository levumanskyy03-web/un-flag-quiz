import { buildFactsReview } from '../../lib/factsReview'

export const dynamic = 'force-dynamic'

export default function FactsDumpPage() {
  const review = buildFactsReview()
  const { totals, problems, countries } = review

  return (
    <main className="facts-dump">
      <header className="facts-dump-head">
        <p className="facts-dump-kicker">Проверка фактов</p>
        <h1>Все страны и все факты</h1>
        <p>
          В колоде только проверенные факты, под которые подходят от 2 до 100 стран ООН. Столицы, точное
          население и уникальные trivia убраны. Первые 4 — размытые; 5-й всегда материк. Ниже — один
          пример последовательности; в игре комбинация из банка каждый раунд другая. В дуэли оба игрока
          видят одну и ту же последовательность.
        </p>
        <ul className="facts-dump-stats">
          <li>Стран: {totals.countries}</li>
          <li>После 4 фактов меньше 3 стран: {totals.after4TooTight}</li>
          <li>После 4 фактов ровно 1 страна: {totals.after4Unique}</li>
          <li>Фактов с уникальностью 1: {totals.uniqueFacts}</li>
          <li>Минимум фактов в банке: {totals.minBank}</li>
          <li>Минимум фактов в последовательности: {totals.minSequence}</li>
        </ul>
        {problems.length > 0 ? (
          <details>
            <summary>Проблемы ({problems.length})</summary>
            <ul>
              {problems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        ) : (
          <p className="facts-dump-ok">Проверок без красных флагов.</p>
        )}
      </header>

      {countries.map((country) => (
        <article key={country.iso} id={country.iso} className="facts-dump-country">
          <h2>
            {country.nameRu} <span>/ {country.nameEn} · {country.iso} · {country.region}</span>
          </h2>
          <p className="facts-dump-meta">
            После 4 фактов остаётся {country.after4} стран
            {country.sequence[4] ? ` · после материка ${country.after5}` : ''}
            {country.flags.length > 0 ? ` · ${country.flags.join(', ')}` : ''}
          </p>

          <h3>Последовательность в игре</h3>
          <ol>
            {country.sequence.map((row) => (
              <li key={`seq-${country.iso}-${row.n}`}>
                <strong>
                  #{row.n} · {row.kind} · {row.uniqueness} стран · остаток {row.stillMatching}
                </strong>
                <div>{row.ru}</div>
                <div className="facts-dump-en">{row.en}</div>
              </li>
            ))}
          </ol>

          <h3>Весь банк</h3>
          <ol>
            {country.bank.map((row) => (
              <li key={`bank-${country.iso}-${row.id}`}>
                <strong>
                  {row.kind} · {row.uniqueness} стран
                </strong>
                <div>{row.ru}</div>
                <div className="facts-dump-en">{row.en}</div>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </main>
  )
}
