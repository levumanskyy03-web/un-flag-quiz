export interface FootballStadium {
  id: string
  clubId: string
  en: string
  ru: string
}

export const FOOTBALL_STADIUMS: FootballStadium[] = [
  { id: 'bernabeu', clubId: 'real', en: 'Santiago Bernabéu', ru: 'Сантьяго Бернабеу' },
  { id: 'campnou', clubId: 'barca', en: 'Camp Nou', ru: 'Камп Ноу' },
  { id: 'metropolitano', clubId: 'atletico', en: 'Metropolitano', ru: 'Метрополитано' },
  { id: 'mestalla', clubId: 'valencia', en: 'Mestalla', ru: 'Месталья' },
  { id: 'oldtrafford', clubId: 'manutd', en: 'Old Trafford', ru: 'Олд Траффорд' },
  { id: 'etihad', clubId: 'mancity', en: 'Etihad Stadium', ru: 'Этихад' },
  { id: 'anfield', clubId: 'liverpool', en: 'Anfield', ru: 'Энфилд' },
  { id: 'stamford', clubId: 'chelsea', en: 'Stamford Bridge', ru: 'Стэмфорд Бридж' },
  { id: 'emirates', clubId: 'arsenal', en: 'Emirates Stadium', ru: 'Эмирейтс' },
  { id: 'tottenhamst', clubId: 'tottenham', en: 'Tottenham Hotspur Stadium', ru: 'Тотенхэм Хотспур Стэдиум' },
  { id: 'allianz', clubId: 'bayern', en: 'Allianz Arena', ru: 'Альянц Арена' },
  { id: 'westfalen', clubId: 'dortmund', en: 'Signal Iduna Park', ru: 'Сигнал Идуна Парк' },
  { id: 'parc', clubId: 'psg', en: 'Parc des Princes', ru: 'Парк де Пренс' },
  { id: 'velodrome', clubId: 'marseille', en: 'Stade Vélodrome', ru: 'Велодром' },
  { id: 'juvestad', clubId: 'juve', en: 'Allianz Stadium', ru: 'Альянц Стадиум' },
  { id: 'diego', clubId: 'napoli', en: 'Stadio Diego Armando Maradona', ru: 'Диего Армандо Марадона' },
  { id: 'olimpicoj', clubId: 'roma', en: 'Stadio Olimpico', ru: 'Олимпийский стадион (Рим)' },
  { id: 'dragao', clubId: 'porto', en: 'Estádio do Dragão', ru: 'Драгау' },
  { id: 'luz', clubId: 'benfica', en: 'Estádio da Luz', ru: 'Да Луш' },
  { id: 'celticpark', clubId: 'celtic', en: 'Celtic Park', ru: 'Селтик Парк' },
  { id: 'ibrox', clubId: 'rangers', en: 'Ibrox', ru: 'Айброкс' },
  { id: 'johan', clubId: 'ajax', en: 'Johan Cruyff Arena', ru: 'Йохан Кройф Арена' },
  { id: 'dekuip', clubId: 'feyenoord', en: 'De Kuip', ru: 'Де Кёйп' },
  { id: 'bombonera', clubId: 'boca', en: 'La Bombonera', ru: 'Бомбонера' },
  { id: 'monumental', clubId: 'river', en: 'El Monumental', ru: 'Монументаль' },
  { id: 'maracana', clubId: 'flamengo', en: 'Maracanã', ru: 'Маракана' },
  { id: 'morumbi', clubId: 'saopaulo', en: 'Morumbi', ru: 'Морумби' },
  { id: 'vila', clubId: 'santos', en: 'Vila Belmiro', ru: 'Вила Белмиро' },
]

export function stadiumById(id: string): FootballStadium | undefined {
  return FOOTBALL_STADIUMS.find((item) => item.id === id)
}

export function stadiumName(item: FootballStadium, lang: string): string {
  return lang === 'ru' ? item.ru : item.en
}
