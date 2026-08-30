import type { LeaderTerm } from './leaders'
import { leaderFame } from './leaderFame'

type Row = [id: string, n: number, from: number, to: number | null, en: string, ru: string, wiki: string, easy?: 1]

const ROWS: Row[] = [
  ['washington', 1, 1789, 1797, 'George Washington', 'Джордж Вашингтон', 'George Washington', 1],
  ['jadams', 2, 1797, 1801, 'John Adams', 'Джон Адамс', 'John Adams'],
  ['jefferson', 3, 1801, 1809, 'Thomas Jefferson', 'Томас Джефферсон', 'Thomas Jefferson', 1],
  ['madison', 4, 1809, 1817, 'James Madison', 'Джеймс Мэдисон', 'James Madison'],
  ['monroe', 5, 1817, 1825, 'James Monroe', 'Джеймс Монро', 'James Monroe'],
  ['jqadams', 6, 1825, 1829, 'John Quincy Adams', 'Джон Куинси Адамс', 'John Quincy Adams'],
  ['jackson', 7, 1829, 1837, 'Andrew Jackson', 'Эндрю Джексон', 'Andrew Jackson', 1],
  ['vanburen', 8, 1837, 1841, 'Martin Van Buren', 'Мартин Ван Бюрен', 'Martin Van Buren'],
  ['wharrison', 9, 1841, 1841, 'William Henry Harrison', 'Уильям Генри Гаррисон', 'William Henry Harrison'],
  ['tyler', 10, 1841, 1845, 'John Tyler', 'Джон Тайлер', 'John Tyler'],
  ['polk', 11, 1845, 1849, 'James K. Polk', 'Джеймс Полк', 'James K. Polk'],
  ['taylor', 12, 1849, 1850, 'Zachary Taylor', 'Закари Тейлор', 'Zachary Taylor'],
  ['fillmore', 13, 1850, 1853, 'Millard Fillmore', 'Миллард Филлмор', 'Millard Fillmore'],
  ['pierce', 14, 1853, 1857, 'Franklin Pierce', 'Франклин Пирс', 'Franklin Pierce'],
  ['buchanan', 15, 1857, 1861, 'James Buchanan', 'Джеймс Бьюкенен', 'James Buchanan'],
  ['lincoln', 16, 1861, 1865, 'Abraham Lincoln', 'Авраам Линкольн', 'Abraham Lincoln', 1],
  ['ajohnson', 17, 1865, 1869, 'Andrew Johnson', 'Эндрю Джонсон', 'Andrew Johnson'],
  ['grant', 18, 1869, 1877, 'Ulysses S. Grant', 'Улисс Грант', 'Ulysses S. Grant'],
  ['hayes', 19, 1877, 1881, 'Rutherford B. Hayes', 'Ратерфорд Хейз', 'Rutherford B. Hayes'],
  ['garfield', 20, 1881, 1881, 'James A. Garfield', 'Джеймс Гарфилд', 'James A. Garfield'],
  ['arthur', 21, 1881, 1885, 'Chester A. Arthur', 'Честер Артур', 'Chester A. Arthur'],
  ['cleveland-22', 22, 1885, 1889, 'Grover Cleveland', 'Гровер Кливленд', 'Grover Cleveland'],
  ['bharrison', 23, 1889, 1893, 'Benjamin Harrison', 'Бенджамин Гаррисон', 'Benjamin Harrison'],
  ['cleveland-24', 24, 1893, 1897, 'Grover Cleveland', 'Гровер Кливленд', 'Grover Cleveland'],
  ['mckinley', 25, 1897, 1901, 'William McKinley', 'Уильям Мак-Кинли', 'William McKinley'],
  ['troosevelt', 26, 1901, 1909, 'Theodore Roosevelt', 'Теодор Рузвельт', 'Theodore Roosevelt', 1],
  ['taft', 27, 1909, 1913, 'William Howard Taft', 'Уильям Говард Тафт', 'William Howard Taft'],
  ['wilson', 28, 1913, 1921, 'Woodrow Wilson', 'Вудро Вильсон', 'Woodrow Wilson', 1],
  ['harding', 29, 1921, 1923, 'Warren G. Harding', 'Уоррен Гардинг', 'Warren G. Harding'],
  ['coolidge', 30, 1923, 1929, 'Calvin Coolidge', 'Калвин Кулидж', 'Calvin Coolidge'],
  ['hoover', 31, 1929, 1933, 'Herbert Hoover', 'Герберт Гувер', 'Herbert Hoover'],
  ['fdr', 32, 1933, 1945, 'Franklin D. Roosevelt', 'Франклин Рузвельт', 'Franklin D. Roosevelt', 1],
  ['truman', 33, 1945, 1953, 'Harry S. Truman', 'Гарри Трумэн', 'Harry S. Truman', 1],
  ['eisenhower', 34, 1953, 1961, 'Dwight D. Eisenhower', 'Дуайт Эйзенхауэр', 'Dwight D. Eisenhower', 1],
  ['kennedy', 35, 1961, 1963, 'John F. Kennedy', 'Джон Кеннеди', 'John F. Kennedy', 1],
  ['lbj', 36, 1963, 1969, 'Lyndon B. Johnson', 'Линдон Джонсон', 'Lyndon B. Johnson'],
  ['nixon', 37, 1969, 1974, 'Richard Nixon', 'Ричард Никсон', 'Richard Nixon', 1],
  ['ford', 38, 1974, 1977, 'Gerald Ford', 'Джеральд Форд', 'Gerald Ford'],
  ['carter', 39, 1977, 1981, 'Jimmy Carter', 'Джимми Картер', 'Jimmy Carter'],
  ['reagan', 40, 1981, 1989, 'Ronald Reagan', 'Рональд Рейган', 'Ronald Reagan', 1],
  ['ghwbush', 41, 1989, 1993, 'George H. W. Bush', 'Джордж Буш-старший', 'George H. W. Bush'],
  ['clinton', 42, 1993, 2001, 'Bill Clinton', 'Билл Клинтон', 'Bill Clinton', 1],
  ['gwbush', 43, 2001, 2009, 'George W. Bush', 'Джордж Буш-младший', 'George W. Bush', 1],
  ['obama', 44, 2009, 2017, 'Barack Obama', 'Барак Обама', 'Barack Obama', 1],
  ['trump-45', 45, 2017, 2021, 'Donald Trump', 'Дональд Трамп', 'Donald Trump', 1],
  ['biden', 46, 2021, 2025, 'Joe Biden', 'Джо Байден', 'Joe Biden', 1],
  ['trump-47', 47, 2025, null, 'Donald Trump', 'Дональд Трамп', 'Donald Trump', 1],
]

function personId(id: string) {
  return id.replace(/-\d+$/, '')
}

export const US_PRESIDENTS: LeaderTerm[] = ROWS.map((row) => ({
  id: row[0],
  personId: personId(row[0]),
  kind: 'us',
  n: row[1],
  from: row[2],
  to: row[3],
  en: row[4],
  ru: row[5],
  wiki: row[6],
  tier: leaderFame('us', personId(row[0]), row[1], row[2]),
}))
