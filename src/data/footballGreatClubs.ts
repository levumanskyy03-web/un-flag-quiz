export interface GreatClub {
  id: string
  founded: number
}

export const GREAT_CLUBS: GreatClub[] = [
  { id: 'real', founded: 1902 },
  { id: 'barca', founded: 1899 },
  { id: 'bayern', founded: 1900 },
  { id: 'manutd', founded: 1878 },
  { id: 'liverpool', founded: 1892 },
  { id: 'milan', founded: 1899 },
  { id: 'juve', founded: 1897 },
  { id: 'inter', founded: 1908 },
  { id: 'ajax', founded: 1900 },
  { id: 'benfica', founded: 1904 },
  { id: 'porto', founded: 1893 },
  { id: 'arsenal', founded: 1886 },
  { id: 'chelsea', founded: 1905 },
  { id: 'mancity', founded: 1880 },
  { id: 'atletico', founded: 1903 },
  { id: 'dortmund', founded: 1909 },
  { id: 'celtic', founded: 1887 },
  { id: 'psg', founded: 1970 },
  { id: 'napoli', founded: 1926 },
  { id: 'roma', founded: 1927 },
  { id: 'feyenoord', founded: 1908 },
  { id: 'psv', founded: 1913 },
  { id: 'sporting', founded: 1906 },
  { id: 'marseille', founded: 1899 },
  { id: 'redstar', founded: 1945 },
  { id: 'steaua', founded: 1947 },
  { id: 'forest', founded: 1865 },
  { id: 'villa', founded: 1874 },
  { id: 'tottenham', founded: 1882 },
  { id: 'rangers', founded: 1872 },
  { id: 'galatasaray', founded: 1905 },
  { id: 'anderlecht', founded: 1908 },
  { id: 'dynamokyiv', founded: 1927 },
  { id: 'boca', founded: 1905 },
  { id: 'river', founded: 1901 },
  { id: 'flamengo', founded: 1895 },
  { id: 'santos', founded: 1912 },
  { id: 'independiente', founded: 1905 },
  { id: 'penarol', founded: 1891 },
  { id: 'nacional', founded: 1899 },
  { id: 'saopaulo', founded: 1930 },
  { id: 'palmeiras', founded: 1914 },
  { id: 'corinthians', founded: 1910 },
  { id: 'gremio', founded: 1903 },
  { id: 'olimpia', founded: 1902 },
  { id: 'colo', founded: 1925 },
  { id: 'alahly', founded: 1907 },
  { id: 'clubamerica', founded: 1916 },
  { id: 'guadalajara', founded: 1906 },
  { id: 'alhilal', founded: 1957 },
]

const BY_ID = new Map(GREAT_CLUBS.map((club) => [club.id, club]))

export function greatClub(id: string): GreatClub | undefined {
  return BY_ID.get(id)
}
