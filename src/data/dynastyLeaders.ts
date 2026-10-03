import type { LeaderTerm } from './leaders'
import type { LeaderKind, LeaderTier } from './leaderFame'

export const DYNASTY_KINDS = ['ott', 'jp', 'mc', 'bn', 'jo', 'ma', 'dk', 'nl', 'li', 'sz'] as const
export type DynastyKind = (typeof DYNASTY_KINDS)[number]

type Row = [id: string, n: number, from: number, to: number | null, en: string, ru: string, wiki: string, tier?: LeaderTier]

function terms(kind: LeaderKind, rows: readonly Row[]): LeaderTerm[] {
  return rows.map((row) => {
    const id = `${kind}-${row[0]}`
    return {
      id,
      personId: id.replace(/-\d+$/, ''),
      kind,
      n: row[1],
      from: row[2],
      to: row[3],
      en: row[4],
      ru: row[5],
      wiki: row[6],
      tier: row[7] ?? 'hard',
    }
  })
}

const OTTOMAN: Row[] = [
  ['osman', 1, 1299, 1324, 'Osman I', 'Осман I', 'Osman I', 'easy'],
  ['orhan', 2, 1324, 1362, 'Orhan', 'Орхан', 'Orhan'],
  ['murad1', 3, 1362, 1389, 'Murad I', 'Мурад I', 'Murad I', 'medium'],
  ['bayezid1', 4, 1389, 1402, 'Bayezid I', 'Баязид I', 'Bayezid I', 'medium'],
  ['mehmed1', 5, 1413, 1421, 'Mehmed I', 'Мехмед I', 'Mehmed I'],
  ['murad2-1', 6, 1421, 1444, 'Murad II', 'Мурад II', 'Murad II'],
  ['mehmed2-1', 7, 1444, 1446, 'Mehmed II', 'Мехмед II', 'Mehmed II', 'easy'],
  ['murad2-2', 8, 1446, 1451, 'Murad II', 'Мурад II', 'Murad II'],
  ['mehmed2-2', 9, 1451, 1481, 'Mehmed II', 'Мехмед II', 'Mehmed II', 'easy'],
  ['bayezid2', 10, 1481, 1512, 'Bayezid II', 'Баязид II', 'Bayezid II', 'medium'],
  ['selim1', 11, 1512, 1520, 'Selim I', 'Селим I', 'Selim I', 'easy'],
  ['suleiman', 12, 1520, 1566, 'Suleiman I', 'Сулейман I', 'Suleiman the Magnificent', 'easy'],
  ['selim2', 13, 1566, 1574, 'Selim II', 'Селим II', 'Selim II'],
  ['murad3', 14, 1574, 1595, 'Murad III', 'Мурад III', 'Murad III'],
  ['mehmed3', 15, 1595, 1603, 'Mehmed III', 'Мехмед III', 'Mehmed III'],
  ['ahmed1', 16, 1603, 1617, 'Ahmed I', 'Ахмед I', 'Ahmed I'],
  ['mustafa1-1', 17, 1617, 1618, 'Mustafa I', 'Мустафа I', 'Mustafa I'],
  ['osman2', 18, 1618, 1622, 'Osman II', 'Осман II', 'Osman II'],
  ['mustafa1-2', 19, 1622, 1623, 'Mustafa I', 'Мустафа I', 'Mustafa I'],
  ['murad4', 20, 1623, 1640, 'Murad IV', 'Мурад IV', 'Murad IV', 'medium'],
  ['ibrahim', 21, 1640, 1648, 'Ibrahim', 'Ибрагим', 'Ibrahim of the Ottoman Empire'],
  ['mehmed4', 22, 1648, 1687, 'Mehmed IV', 'Мехмед IV', 'Mehmed IV'],
  ['suleiman2', 23, 1687, 1691, 'Suleiman II', 'Сулейман II', 'Suleiman II of the Ottoman Empire'],
  ['ahmed2', 24, 1691, 1695, 'Ahmed II', 'Ахмед II', 'Ahmed II'],
  ['mustafa2', 25, 1695, 1703, 'Mustafa II', 'Мустафа II', 'Mustafa II'],
  ['ahmed3', 26, 1703, 1730, 'Ahmed III', 'Ахмед III', 'Ahmed III'],
  ['mahmud1', 27, 1730, 1754, 'Mahmud I', 'Махмуд I', 'Mahmud I'],
  ['osman3', 28, 1754, 1757, 'Osman III', 'Осман III', 'Osman III'],
  ['mustafa3', 29, 1757, 1774, 'Mustafa III', 'Мустафа III', 'Mustafa III'],
  ['abdulhamid1', 30, 1774, 1789, 'Abdul Hamid I', 'Абдул-Хамид I', 'Abdul Hamid I'],
  ['selim3', 31, 1789, 1807, 'Selim III', 'Селим III', 'Selim III', 'medium'],
  ['mustafa4', 32, 1807, 1808, 'Mustafa IV', 'Мустафа IV', 'Mustafa IV'],
  ['mahmud2', 33, 1808, 1839, 'Mahmud II', 'Махмуд II', 'Mahmud II', 'medium'],
  ['abdulmejid', 34, 1839, 1861, 'Abdulmejid I', 'Абдул-Меджид I', 'Abdulmejid I'],
  ['abdulaziz', 35, 1861, 1876, 'Abdulaziz', 'Абдул-Азиз', 'Abdulaziz'],
  ['murad5', 36, 1876, 1876, 'Murad V', 'Мурад V', 'Murad V'],
  ['abdulhamid2', 37, 1876, 1909, 'Abdul Hamid II', 'Абдул-Хамид II', 'Abdul Hamid II', 'easy'],
  ['mehmed5', 38, 1909, 1918, 'Mehmed V', 'Мехмед V', 'Mehmed V'],
  ['mehmed6', 39, 1918, 1922, 'Mehmed VI', 'Мехмед VI', 'Mehmed VI', 'medium'],
]

const JAPAN: Row[] = [
  ['gokomatsu', 100, 1392, 1412, 'Emperor Go-Komatsu', 'Император Го-Комацу', 'Emperor Go-Komatsu'],
  ['shoko', 101, 1412, 1428, 'Emperor Shōkō', 'Император Сёко', 'Emperor Shōkō'],
  ['gohanazono', 102, 1428, 1464, 'Emperor Go-Hanazono', 'Император Го-Ханадзоно', 'Emperor Go-Hanazono'],
  ['gotsuchimikado', 103, 1464, 1500, 'Emperor Go-Tsuchimikado', 'Император Го-Цутимикадо', 'Emperor Go-Tsuchimikado'],
  ['gokashiwabara', 104, 1500, 1526, 'Emperor Go-Kashiwabara', 'Император Го-Касивабара', 'Emperor Go-Kashiwabara'],
  ['gonara', 105, 1526, 1557, 'Emperor Go-Nara', 'Император Го-Нара', 'Emperor Go-Nara'],
  ['ogimachi', 106, 1557, 1586, 'Emperor Ōgimachi', 'Император Огимати', 'Emperor Ōgimachi'],
  ['goyozei', 107, 1586, 1611, 'Emperor Go-Yōzei', 'Император Го-Ёдзэй', 'Emperor Go-Yōzei', 'medium'],
  ['gomizunoo', 108, 1611, 1629, 'Emperor Go-Mizunoo', 'Император Го-Мидзуноо', 'Emperor Go-Mizunoo', 'medium'],
  ['meisho', 109, 1629, 1643, 'Empress Meishō', 'Императрица Мэйсё', 'Empress Meishō', 'medium'],
  ['gokomyo', 110, 1643, 1654, 'Emperor Go-Kōmyō', 'Император Го-Комё', 'Emperor Go-Kōmyō'],
  ['gosai', 111, 1654, 1663, 'Emperor Go-Sai', 'Император Го-Сай', 'Emperor Go-Sai'],
  ['reigen', 112, 1663, 1687, 'Emperor Reigen', 'Император Рэйген', 'Emperor Reigen'],
  ['higashiyama', 113, 1687, 1709, 'Emperor Higashiyama', 'Император Хигасияма', 'Emperor Higashiyama'],
  ['nakamikado', 114, 1709, 1735, 'Emperor Nakamikado', 'Император Накамикадо', 'Emperor Nakamikado'],
  ['sakuramachi', 115, 1735, 1747, 'Emperor Sakuramachi', 'Император Сакурамати', 'Emperor Sakuramachi'],
  ['momozono', 116, 1747, 1762, 'Emperor Momozono', 'Император Момодзоно', 'Emperor Momozono'],
  ['gosakuramachi', 117, 1762, 1771, 'Empress Go-Sakuramachi', 'Императрица Го-Сакурамати', 'Empress Go-Sakuramachi'],
  ['gomomozono', 118, 1771, 1779, 'Emperor Go-Momozono', 'Император Го-Момодзоно', 'Emperor Go-Momozono'],
  ['kokaku', 119, 1780, 1817, 'Emperor Kōkaku', 'Император Кокаку', 'Emperor Kōkaku', 'medium'],
  ['ninko', 120, 1817, 1846, 'Emperor Ninkō', 'Император Нинко', 'Emperor Ninkō'],
  ['komei', 121, 1846, 1867, 'Emperor Kōmei', 'Император Комэй', 'Emperor Kōmei', 'medium'],
  ['meiji', 122, 1867, 1912, 'Emperor Meiji', 'Император Мэйдзи', 'Emperor Meiji', 'easy'],
  ['taisho', 123, 1912, 1926, 'Emperor Taishō', 'Император Тайсё', 'Emperor Taishō', 'easy'],
  ['showa', 124, 1926, 1989, 'Emperor Shōwa', 'Император Сёва', 'Hirohito', 'easy'],
  ['akihito', 125, 1989, 2019, 'Emperor Akihito', 'Император Акихито', 'Akihito', 'easy'],
  ['naruhito', 126, 2019, null, 'Emperor Naruhito', 'Император Нарухито', 'Naruhito', 'easy'],
]

const MONACO: Row[] = [
  ['rainier1', 1, 1297, 1301, 'Rainier I', 'Ренье I', 'Rainier I of Monaco, Lord of Cagnes'],
  ['charles1', 2, 1331, 1357, 'Charles I', 'Карл I', 'Charles I, Lord of Monaco'],
  ['jean1', 3, 1419, 1454, 'Jean I', 'Жан I', 'Jean I, Lord of Monaco'],
  ['catalan', 4, 1454, 1457, 'Catalan', 'Каталан', 'Catalan, Lord of Monaco'],
  ['claudine', 5, 1457, 1458, 'Claudine', 'Клодина', 'Claudine, Lady of Monaco'],
  ['lambert', 6, 1458, 1494, 'Lambert', 'Ламбер', 'Lambert, Lord of Monaco'],
  ['jean2', 7, 1494, 1505, 'Jean II', 'Жан II', 'Jean II, Lord of Monaco'],
  ['lucien', 8, 1505, 1523, 'Lucien', 'Люсьен', 'Lucien, Lord of Monaco'],
  ['honore1', 9, 1523, 1581, 'Honoré I', 'Оноре I', 'Honoré I, Lord of Monaco'],
  ['charles2', 10, 1581, 1589, 'Charles II', 'Карл II', 'Charles II, Lord of Monaco'],
  ['hercule', 11, 1589, 1604, 'Hercule', 'Эркюль', 'Hercule, Lord of Monaco'],
  ['honore2', 12, 1604, 1662, 'Honoré II', 'Оноре II', 'Honoré II, Prince of Monaco', 'easy'],
  ['louis1', 13, 1662, 1701, 'Louis I', 'Людовик I', 'Louis I, Prince of Monaco'],
  ['antoine1', 14, 1701, 1731, 'Antoine I', 'Антуан I', 'Antonio I of Monaco'],
  ['louise', 15, 1731, 1731, 'Louise Hippolyte', 'Луиза Ипполита', 'Louise Hippolyte, Princess of Monaco', 'medium'],
  ['jacques1', 16, 1731, 1733, 'Jacques I', 'Жак I', 'Jacques I, Prince of Monaco'],
  ['honore3', 17, 1733, 1793, 'Honoré III', 'Оноре III', 'Honoré III, Prince of Monaco', 'medium'],
  ['honore4', 18, 1814, 1819, 'Honoré IV', 'Оноре IV', 'Honoré IV, Prince of Monaco'],
  ['honore5', 19, 1819, 1841, 'Honoré V', 'Оноре V', 'Honoré V, Prince of Monaco'],
  ['florestan', 20, 1841, 1856, 'Florestan I', 'Флорестан I', 'Florestan I, Prince of Monaco', 'medium'],
  ['charles3', 21, 1856, 1889, 'Charles III', 'Карл III', 'Charles III, Prince of Monaco', 'medium'],
  ['albert1', 22, 1889, 1922, 'Albert I', 'Альбер I', 'Albert I, Prince of Monaco', 'easy'],
  ['louis2', 23, 1922, 1949, 'Louis II', 'Людовик II', 'Louis II, Prince of Monaco', 'medium'],
  ['rainier3', 24, 1949, 2005, 'Rainier III', 'Ренье III', 'Rainier III, Prince of Monaco', 'easy'],
  ['albert2', 25, 2005, null, 'Albert II', 'Альбер II', 'Albert II, Prince of Monaco', 'easy'],
]

const BRUNEI: Row[] = [
  ['muhammad-shah', 1, 1363, 1402, 'Muhammad Shah', 'Мухаммад Шах', 'Muhammad Shah (Brunei)', 'easy'],
  ['ahmad-bn', 2, 1408, 1425, 'Ahmad', 'Ахмад', 'Ahmad of Brunei'],
  ['sharif-ali', 3, 1425, 1432, 'Sharif Ali', 'Шариф Али', 'Sharif Ali', 'medium'],
  ['sulaiman-bn', 4, 1432, 1485, 'Sulaiman', 'Сулейман', 'Sulaiman of Brunei'],
  ['bolkiah', 5, 1485, 1524, 'Bolkiah', 'Болкиах', 'Bolkiah', 'easy'],
  ['abdul-kahar', 6, 1524, 1530, 'Abdul Kahar', 'Абдул Кахар', 'Abdul Kahar'],
  ['saiful', 7, 1533, 1581, 'Saiful Rijal', 'Сайфул Риджал', 'Saiful Rijal'],
  ['shah-berunai', 8, 1581, 1582, 'Shah Berunai', 'Шах Берунай', 'Shah Berunai'],
  ['muhammad-hassan', 9, 1582, 1598, 'Muhammad Hassan', 'Мухаммад Хассан', 'Muhammad Hassan of Brunei'],
  ['jalilul-akbar', 10, 1598, 1659, 'Abdul Jalilul Akbar', 'Абдул Джалилул Акбар', 'Abdul Jalilul Akbar'],
  ['jalilul-jabbar', 11, 1659, 1660, 'Abdul Jalilul Jabbar', 'Абдул Джалилул Джаббар', 'Abdul Jalilul Jabbar'],
  ['muhammad-ali-bn', 12, 1660, 1661, 'Muhammad Ali', 'Мухаммад Али', 'Muhammad Ali of Brunei'],
  ['mubin', 13, 1661, 1673, 'Abdul Hakkul Mubin', 'Абдул Хаккул Мубин', 'Abdul Hakkul Mubin'],
  ['muhyiddin', 14, 1673, 1690, 'Muhyiddin', 'Мухиддин', 'Muhyiddin of Brunei'],
  ['nassaruddin', 15, 1690, 1710, 'Nassaruddin', 'Нассаруддин', 'Nassaruddin of Brunei'],
  ['hussin-1', 16, 1710, 1730, 'Hussin Kamaluddin', 'Хуссин Камалуддин', 'Hussin Kamaluddin'],
  ['alauddin-bn', 17, 1730, 1737, 'Muhammad Alauddin', 'Мухаммад Алауддин', 'Muhammad Alauddin of Brunei'],
  ['hussin-2', 18, 1737, 1740, 'Hussin Kamaluddin', 'Хуссин Камалуддин', 'Hussin Kamaluddin'],
  ['omar1', 19, 1740, 1795, 'Omar Ali Saifuddin I', 'Омар Али Сайфуддин I', 'Omar Ali Saifuddin I'],
  ['tajuddin-1', 20, 1795, 1804, 'Muhammad Tajuddin', 'Мухаммад Таджуддин', 'Muhammad Tajuddin'],
  ['jamalul1', 21, 1804, 1804, 'Muhammad Jamalul Alam I', 'Мухаммад Джамалул Алам I', 'Muhammad Jamalul Alam I'],
  ['tajuddin-2', 22, 1804, 1807, 'Muhammad Tajuddin', 'Мухаммад Таджуддин', 'Muhammad Tajuddin'],
  ['kanzul', 23, 1807, 1826, 'Muhammad Kanzul Alam', 'Мухаммад Канзул Алам', 'Muhammad Kanzul Alam'],
  ['muhammad-alam', 24, 1826, 1828, 'Muhammad Alam', 'Мухаммад Алам', 'Muhammad Alam of Brunei'],
  ['omar2', 25, 1828, 1852, 'Omar Ali Saifuddin II', 'Омар Али Сайфуддин II', 'Omar Ali Saifuddin II', 'medium'],
  ['abdul-momin', 26, 1852, 1885, 'Abdul Momin', 'Абдул Момин', 'Abdul Momin', 'medium'],
  ['hashim-bn', 27, 1885, 1906, 'Hashim Jalilul Alam', 'Хашим Джалилул Алам', 'Hashim Jalilul Alam Aqamaddin', 'medium'],
  ['jamalul2', 28, 1906, 1924, 'Muhammad Jamalul Alam II', 'Мухаммад Джамалул Алам II', 'Muhammad Jamalul Alam II'],
  ['ahmad-tajuddin', 29, 1924, 1950, 'Ahmad Tajuddin', 'Ахмад Таджуддин', 'Ahmad Tajuddin', 'medium'],
  ['omar3', 30, 1950, 1967, 'Omar Ali Saifuddien III', 'Омар Али Сайфуддин III', 'Omar Ali Saifuddien III', 'easy'],
  ['hassanal', 31, 1967, null, 'Hassanal Bolkiah', 'Хассанал Болкиах', 'Hassanal Bolkiah', 'easy'],
]

const HASHEMITE: Row[] = [
  ['hussein-hejaz', 1, 1916, 1924, 'Hussein bin Ali of Hejaz', 'Хусейн ибн Али (Хиджаз)', 'Hussein bin Ali, King of Hejaz', 'medium'],
  ['abdullah1', 2, 1921, 1951, 'Abdullah I of Jordan', 'Абдалла I (Иордания)', 'Abdullah I of Jordan', 'easy'],
  ['faisal1', 3, 1921, 1933, 'Faisal I of Iraq', 'Фейсал I (Ирак)', 'Faisal I of Iraq', 'easy'],
  ['ali-hejaz', 4, 1924, 1925, 'Ali of Hejaz', 'Али (Хиджаз)', 'Ali of Hejaz', 'medium'],
  ['ghazi', 5, 1933, 1939, 'Ghazi of Iraq', 'Гази (Ирак)', 'Ghazi of Iraq', 'medium'],
  ['faisal2', 6, 1939, 1958, 'Faisal II of Iraq', 'Фейсал II (Ирак)', 'Faisal II of Iraq', 'medium'],
  ['talal', 7, 1951, 1952, 'Talal of Jordan', 'Талал (Иордания)', 'Talal of Jordan'],
  ['hussein-jo', 8, 1952, 1999, 'Hussein of Jordan', 'Хусейн (Иордания)', 'Hussein of Jordan', 'easy'],
  ['abdullah2', 9, 1999, null, 'Abdullah II of Jordan', 'Абдалла II (Иордания)', 'Abdullah II of Jordan', 'easy'],
]

const MOROCCO: Row[] = [
  ['rashid-ma', 1, 1666, 1672, 'Al-Rashid', 'Ар-Рашид', 'Al-Rashid of Morocco', 'medium'],
  ['ismail-ma', 2, 1672, 1727, 'Moulay Ismail', 'Мулай Исмаил', 'Ismail Ibn Sharif', 'easy'],
  ['abdallah-ma', 3, 1729, 1757, 'Abdallah', 'Абдалла', 'Abdallah of Morocco'],
  ['mohammed3', 4, 1757, 1790, 'Mohammed III', 'Мухаммед III', 'Mohammed ben Abdallah', 'medium'],
  ['yazid-ma', 5, 1790, 1792, 'Yazid', 'Язид', 'Yazid of Morocco'],
  ['slimane', 6, 1792, 1822, 'Slimane', 'Сулейман', 'Slimane of Morocco', 'medium'],
  ['rahman-ma', 7, 1822, 1859, 'Abd al-Rahman', 'Абд ар-Рахман', 'Abd al-Rahman of Morocco'],
  ['muhammad4-ma', 8, 1859, 1873, 'Muhammad IV', 'Мухаммед IV', 'Muhammad IV of Morocco'],
  ['hassan1-ma', 9, 1873, 1894, 'Hassan I', 'Хасан I', 'Hassan I of Morocco', 'medium'],
  ['abdelaziz-ma', 10, 1894, 1908, 'Abdelaziz', 'Абд аль-Азиз', 'Abdelaziz of Morocco', 'medium'],
  ['hafid-ma', 11, 1908, 1912, 'Abd al-Hafid', 'Абд аль-Хафиз', 'Abd al-Hafid of Morocco'],
  ['yusef-ma', 12, 1912, 1927, 'Yusef', 'Юсуф', 'Yusef of Morocco'],
  ['mohammed5-1', 13, 1927, 1953, 'Mohammed V', 'Мухаммед V', 'Mohammed V of Morocco', 'easy'],
  ['ben-aarafa', 14, 1953, 1955, 'Mohammed Ben Aarafa', 'Мухаммед бен Арафа', 'Mohammed Ben Aarafa'],
  ['mohammed5-2', 15, 1955, 1961, 'Mohammed V', 'Мухаммед V', 'Mohammed V of Morocco', 'easy'],
  ['hassan2-ma', 16, 1961, 1999, 'Hassan II', 'Хасан II', 'Hassan II of Morocco', 'easy'],
  ['mohammed6', 17, 1999, null, 'Mohammed VI', 'Мухаммед VI', 'Mohammed VI of Morocco', 'easy'],
]

const OLDENBURG: Row[] = [
  ['christian1', 1, 1448, 1481, 'Christian I of Denmark', 'Кристиан I Датский', 'Christian I of Denmark', 'medium'],
  ['hans-dk', 2, 1481, 1513, 'John of Denmark', 'Ханс Датский', 'John, King of Denmark'],
  ['christian2', 3, 1513, 1523, 'Christian II of Denmark', 'Кристиан II Датский', 'Christian II of Denmark', 'medium'],
  ['frederick1', 4, 1523, 1533, 'Frederick I of Denmark', 'Фредерик I Датский', 'Frederick I of Denmark'],
  ['christian3', 5, 1534, 1559, 'Christian III of Denmark', 'Кристиан III Датский', 'Christian III of Denmark'],
  ['frederick2', 6, 1559, 1588, 'Frederick II of Denmark', 'Фредерик II Датский', 'Frederick II of Denmark'],
  ['christian4', 7, 1588, 1648, 'Christian IV of Denmark', 'Кристиан IV Датский', 'Christian IV of Denmark', 'easy'],
  ['frederick3', 8, 1648, 1670, 'Frederick III of Denmark', 'Фредерик III Датский', 'Frederick III of Denmark'],
  ['christian5', 9, 1670, 1699, 'Christian V of Denmark', 'Кристиан V Датский', 'Christian V of Denmark'],
  ['frederick4', 10, 1699, 1730, 'Frederick IV of Denmark', 'Фредерик IV Датский', 'Frederick IV of Denmark'],
  ['christian6', 11, 1730, 1746, 'Christian VI of Denmark', 'Кристиан VI Датский', 'Christian VI of Denmark'],
  ['frederick5', 12, 1746, 1766, 'Frederick V of Denmark', 'Фредерик V Датский', 'Frederick V of Denmark'],
  ['christian7', 13, 1766, 1808, 'Christian VII of Denmark', 'Кристиан VII Датский', 'Christian VII of Denmark', 'medium'],
  ['frederick6', 14, 1808, 1839, 'Frederick VI of Denmark', 'Фредерик VI Датский', 'Frederick VI of Denmark'],
  ['christian8', 15, 1839, 1848, 'Christian VIII of Denmark', 'Кристиан VIII Датский', 'Christian VIII of Denmark'],
  ['frederick7', 16, 1848, 1863, 'Frederick VII of Denmark', 'Фредерик VII Датский', 'Frederick VII of Denmark', 'medium'],
  ['christian9', 17, 1863, 1906, 'Christian IX of Denmark', 'Кристиан IX Датский', 'Christian IX of Denmark', 'easy'],
  ['haakon7', 18, 1905, 1957, 'Haakon VII of Norway', 'Хокон VII Норвежский', 'Haakon VII', 'easy'],
  ['frederick8', 19, 1906, 1912, 'Frederick VIII of Denmark', 'Фредерик VIII Датский', 'Frederick VIII of Denmark'],
  ['christian10', 20, 1912, 1947, 'Christian X of Denmark', 'Кристиан X Датский', 'Christian X of Denmark', 'medium'],
  ['frederick9', 21, 1947, 1972, 'Frederick IX of Denmark', 'Фредерик IX Датский', 'Frederick IX of Denmark', 'medium'],
  ['olav5', 22, 1957, 1991, 'Olav V of Norway', 'Улав V Норвежский', 'Olav V of Norway', 'medium'],
  ['margrethe2', 23, 1972, 2024, 'Margrethe II of Denmark', 'Маргрете II Датская', 'Margrethe II of Denmark', 'easy'],
  ['harald5', 24, 1991, null, 'Harald V of Norway', 'Харальд V Норвежский', 'Harald V of Norway', 'easy'],
  ['frederik10', 25, 2024, null, 'Frederik X of Denmark', 'Фредерик X Датский', 'Frederik X', 'easy'],
]

const NETHERLANDS: Row[] = [
  ['willem1', 1, 1815, 1840, 'William I of the Netherlands', 'Виллем I', 'William I of the Netherlands', 'easy'],
  ['willem2', 2, 1840, 1849, 'William II of the Netherlands', 'Виллем II', 'William II of the Netherlands'],
  ['willem3', 3, 1849, 1890, 'William III of the Netherlands', 'Виллем III', 'William III of the Netherlands', 'medium'],
  ['wilhelmina', 4, 1890, 1948, 'Wilhelmina', 'Вильгельмина', 'Wilhelmina of the Netherlands', 'easy'],
  ['juliana', 5, 1948, 1980, 'Juliana', 'Юлиана', 'Juliana of the Netherlands', 'medium'],
  ['beatrix', 6, 1980, 2013, 'Beatrix', 'Беатрикс', 'Beatrix of the Netherlands', 'easy'],
  ['willem-alexander', 7, 2013, null, 'Willem-Alexander', 'Виллем-Александр', 'Willem-Alexander of the Netherlands', 'easy'],
]

const LIECHTENSTEIN: Row[] = [
  ['anton-florian', 1, 1719, 1721, 'Anton Florian', 'Антон Флориан', 'Anton Florian of Liechtenstein'],
  ['joseph-johann', 2, 1721, 1732, 'Joseph Johann Adam', 'Йозеф Иоганн Адам', 'Joseph Johann Adam, Prince of Liechtenstein'],
  ['nepomuk', 3, 1732, 1748, 'Johann Nepomuk Karl', 'Иоганн Непомук Карл', 'Johann Nepomuk Karl, Prince of Liechtenstein'],
  ['wenzel-li', 4, 1748, 1772, 'Joseph Wenzel I', 'Йозеф Венцель I', 'Joseph Wenzel I, Prince of Liechtenstein', 'easy'],
  ['franz-josef1-li', 5, 1772, 1781, 'Franz Joseph I', 'Франц Иосиф I', 'Franz Joseph I, Prince of Liechtenstein'],
  ['aloys1', 6, 1781, 1805, 'Aloys I', 'Алоиз I', 'Aloys I, Prince of Liechtenstein'],
  ['johann1-li', 7, 1805, 1836, 'Johann I Joseph', 'Иоганн I', 'Johann I Joseph, Prince of Liechtenstein', 'medium'],
  ['aloys2', 8, 1836, 1858, 'Aloys II', 'Алоиз II', 'Aloys II, Prince of Liechtenstein'],
  ['johann2-li', 9, 1858, 1929, 'Johann II', 'Иоганн II', 'Johann II, Prince of Liechtenstein', 'easy'],
  ['franz1-li', 10, 1929, 1938, 'Franz I', 'Франц I', 'Franz I of Liechtenstein', 'medium'],
  ['franz-josef2-li', 11, 1938, 1989, 'Franz Joseph II', 'Франц Иосиф II', 'Franz Joseph II, Prince of Liechtenstein', 'easy'],
  ['hans-adam2', 12, 1989, null, 'Hans-Adam II', 'Ханс-Адам II', 'Hans-Adam II, Prince of Liechtenstein', 'easy'],
]

const DLAMINI: Row[] = [
  ['ngwane3', 1, 1745, 1780, 'Ngwane III', 'Нгване III', 'Ngwane III', 'medium'],
  ['ndvungunye', 2, 1780, 1815, 'Ndvungunye', 'Ндвунгунье', 'Ndvungunye'],
  ['sobhuza1', 3, 1815, 1836, 'Sobhuza I', 'Собуза I', 'Sobhuza I', 'easy'],
  ['mswati2', 4, 1840, 1868, 'Mswati II', 'Мсвати II', 'Mswati II', 'easy'],
  ['mbandzeni', 5, 1875, 1889, 'Mbandzeni', 'Мбандзени', 'Mbandzeni', 'medium'],
  ['ngwane5', 6, 1895, 1899, 'Ngwane V', 'Нгване V', 'Ngwane V'],
  ['sobhuza2', 7, 1899, 1982, 'Sobhuza II', 'Собуза II', 'Sobhuza II', 'easy'],
  ['ntfombi', 8, 1982, 1986, 'Ntfombi', 'Нтфомби', 'Ntfombi of Eswatini', 'medium'],
  ['mswati3', 9, 1986, null, 'Mswati III', 'Мсвати III', 'Mswati III', 'easy'],
]

export const OTTOMAN_SULTANS = terms('ott', OTTOMAN)
export const JAPAN_EMPERORS = terms('jp', JAPAN)
export const MONACO_PRINCES = terms('mc', MONACO)
export const BRUNEI_SULTANS = terms('bn', BRUNEI)
export const HASHEMITE_RULERS = terms('jo', HASHEMITE)
export const ALAOUITE_RULERS = terms('ma', MOROCCO)
export const OLDENBURG_RULERS = terms('dk', OLDENBURG)
export const ORANGE_RULERS = terms('nl', NETHERLANDS)
export const LIECHTENSTEIN_PRINCES = terms('li', LIECHTENSTEIN)
export const DLAMINI_RULERS = terms('sz', DLAMINI)

export const DYNASTY_TERMS: LeaderTerm[] = [
  ...OTTOMAN_SULTANS,
  ...JAPAN_EMPERORS,
  ...MONACO_PRINCES,
  ...BRUNEI_SULTANS,
  ...HASHEMITE_RULERS,
  ...ALAOUITE_RULERS,
  ...OLDENBURG_RULERS,
  ...ORANGE_RULERS,
  ...LIECHTENSTEIN_PRINCES,
  ...DLAMINI_RULERS,
]

const BY_KIND: Record<DynastyKind, LeaderTerm[]> = {
  ott: OTTOMAN_SULTANS,
  jp: JAPAN_EMPERORS,
  mc: MONACO_PRINCES,
  bn: BRUNEI_SULTANS,
  jo: HASHEMITE_RULERS,
  ma: ALAOUITE_RULERS,
  dk: OLDENBURG_RULERS,
  nl: ORANGE_RULERS,
  li: LIECHTENSTEIN_PRINCES,
  sz: DLAMINI_RULERS,
}

export function isDynastyKind(kind: LeaderKind): kind is DynastyKind {
  return (DYNASTY_KINDS as readonly string[]).includes(kind)
}

export function dynastyTerms(kind: DynastyKind): LeaderTerm[] {
  return BY_KIND[kind]
}

export const DYNASTY_LATE_FROM: Record<DynastyKind, number> = {
  ott: 1703,
  jp: 1867,
  mc: 1814,
  bn: 1828,
  jo: 1951,
  ma: 1912,
  dk: 1863,
  nl: 1890,
  li: 1858,
  sz: 1899,
}
