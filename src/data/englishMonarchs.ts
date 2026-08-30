import type { LeaderTerm } from './leaders'
import { leaderFame } from './leaderFame'

type Row = [id: string, n: number, from: number, to: number | null, en: string, ru: string, wiki: string]

const ROWS: Row[] = [
  ['william1', 1, 1066, 1087, 'William I the Conqueror', 'Вильгельм I Завоеватель', 'William the Conqueror'],
  ['william2', 2, 1087, 1100, 'William II Rufus', 'Вильгельм II Рыжий', 'William II of England'],
  ['henry1', 3, 1100, 1135, 'Henry I', 'Генрих I', 'Henry I of England'],
  ['stephen', 4, 1135, 1154, 'Stephen', 'Стефан', 'Stephen, King of England'],
  ['henry2', 5, 1154, 1189, 'Henry II', 'Генрих II', 'Henry II of England'],
  ['richard1', 6, 1189, 1199, 'Richard I the Lionheart', 'Ричард I Львиное Сердце', 'Richard I of England'],
  ['john', 7, 1199, 1216, 'John', 'Иоанн Безземельный', 'John, King of England'],
  ['henry3', 8, 1216, 1272, 'Henry III', 'Генрих III', 'Henry III of England'],
  ['edward1', 9, 1272, 1307, 'Edward I', 'Эдуард I', 'Edward I of England'],
  ['edward2', 10, 1307, 1327, 'Edward II', 'Эдуард II', 'Edward II of England'],
  ['edward3', 11, 1327, 1377, 'Edward III', 'Эдуард III', 'Edward III of England'],
  ['richard2', 12, 1377, 1399, 'Richard II', 'Ричард II', 'Richard II of England'],
  ['henry4', 13, 1399, 1413, 'Henry IV', 'Генрих IV', 'Henry IV of England'],
  ['henry5', 14, 1413, 1422, 'Henry V', 'Генрих V', 'Henry V of England'],
  ['henry6-1', 15, 1422, 1461, 'Henry VI', 'Генрих VI', 'Henry VI of England'],
  ['edward4-1', 16, 1461, 1470, 'Edward IV', 'Эдуард IV', 'Edward IV of England'],
  ['henry6-2', 17, 1470, 1471, 'Henry VI', 'Генрих VI', 'Henry VI of England'],
  ['edward4-2', 18, 1471, 1483, 'Edward IV', 'Эдуард IV', 'Edward IV of England'],
  ['edward5', 19, 1483, 1483, 'Edward V', 'Эдуард V', 'Edward V of England'],
  ['richard3', 20, 1483, 1485, 'Richard III', 'Ричард III', 'Richard III of England'],
  ['henry7', 21, 1485, 1509, 'Henry VII', 'Генрих VII', 'Henry VII of England'],
  ['henry8', 22, 1509, 1547, 'Henry VIII', 'Генрих VIII', 'Henry VIII'],
  ['edward6', 23, 1547, 1553, 'Edward VI', 'Эдуард VI', 'Edward VI'],
  ['jane', 24, 1553, 1553, 'Lady Jane Grey', 'Джейн Грей', 'Lady Jane Grey'],
  ['mary1', 25, 1553, 1558, 'Mary I', 'Мария I', 'Mary I of England'],
  ['elizabeth1', 26, 1558, 1603, 'Elizabeth I', 'Елизавета I', 'Elizabeth I'],
  ['james1', 27, 1603, 1625, 'James I', 'Яков I', 'James VI and I'],
  ['charles1', 28, 1625, 1649, 'Charles I', 'Карл I', 'Charles I of England'],
  ['charles2', 29, 1660, 1685, 'Charles II', 'Карл II', 'Charles II of England'],
  ['james2', 30, 1685, 1688, 'James II', 'Яков II', 'James II of England'],
  ['mary2', 31, 1689, 1694, 'Mary II', 'Мария II', 'Mary II of England'],
  ['william3', 32, 1689, 1702, 'William III', 'Вильгельм III', 'William III of England'],
  ['anne', 33, 1702, 1714, 'Anne', 'Анна', 'Anne, Queen of Great Britain'],
  ['george1', 34, 1714, 1727, 'George I', 'Георг I', 'George I of Great Britain'],
  ['george2', 35, 1727, 1760, 'George II', 'Георг II', 'George II of Great Britain'],
  ['george3', 36, 1760, 1820, 'George III', 'Георг III', 'George III'],
  ['george4', 37, 1820, 1830, 'George IV', 'Георг IV', 'George IV'],
  ['william4', 38, 1830, 1837, 'William IV', 'Вильгельм IV', 'William IV'],
  ['victoria', 39, 1837, 1901, 'Victoria', 'Виктория', 'Queen Victoria'],
  ['edward7', 40, 1901, 1910, 'Edward VII', 'Эдуард VII', 'Edward VII'],
  ['george5', 41, 1910, 1936, 'George V', 'Георг V', 'George V'],
  ['edward8', 42, 1936, 1936, 'Edward VIII', 'Эдуард VIII', 'Edward VIII'],
  ['george6', 43, 1936, 1952, 'George VI', 'Георг VI', 'George VI'],
  ['elizabeth2', 44, 1952, 2022, 'Elizabeth II', 'Елизавета II', 'Elizabeth II'],
  ['charles3', 45, 2022, null, 'Charles III', 'Карл III', 'Charles III'],
]

function personId(id: string) {
  return id.replace(/-\d+$/, '')
}

export const UK_MONARCHS: LeaderTerm[] = ROWS.map((row) => ({
  id: row[0],
  personId: personId(row[0]),
  kind: 'uk',
  n: row[1],
  from: row[2],
  to: row[3],
  en: row[4],
  ru: row[5],
  wiki: row[6],
  tier: leaderFame('uk', personId(row[0]), row[1], row[2]),
}))
