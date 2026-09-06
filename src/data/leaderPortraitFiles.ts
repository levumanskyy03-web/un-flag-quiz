/** Commons files to prefer over Wikipedia infobox images (coins, tombs, groups). */
export const WIKI_PORTRAIT_FILES: Record<string, string> = {
  'Pope Leo VIII': 'Leo VIII. Leone VIII.jpg',
  'Pope John XIII': 'Ioannes XIII. Giovanni XIII, papa.jpg',
  'Pope Benedict VI': 'Benedictus VI. Benedetto VI, papa.jpg',
  'Iziaslav I of Kiev': 'Izyaslav I Yaroslavich.png',
  'Sviatopolk I of Kiev': 'Sviatopolk I of Kiev.jpg',
  'Sviatopolk II of Kiev': 'Svyatopolk II - fresco of the Novospassky Monastery.png',
  'Vladimir II Monomakh': 'Vladimir monomakh.jpg',
  'Edward II of England': 'King Edward II.jpg',
  'Grover Cleveland': 'President Grover Cleveland.jpg',
  'Pope Fabian': 'Fabianus. Fabiano, santo e papa.jpg',
  'Pope Stephen I': 'Stephanus I. Stefano I, santo e papa.jpg',
  'Pope Eutychian': 'Eutychianus. Eutichiano, santo e papa.jpg',
  'Pope Caius': 'Caius. Caio, santo e papa.jpg',
  'Pope Marcellinus': 'Marcellinus. Marcellino, santo e papa.jpg',
  'Pope Marcellus I': 'Marcellus I. Marcello I, santo e papa.jpg',
  'Pope Liberius': 'Liberius. Liberio, santo e papa.jpg',
  'Pope Hilarius': 'Hilarius. Ilario, santo e papa.jpg',
  'Pope Hormisdas': 'Hormisdas. Ormisda, santo e papa.jpg',
  'Pope Pelagius II': 'Pelagius II. Pelagio II, santo e papa.jpg',
  'Pope Adeodatus I': 'Adeodatus I. Adeodato I, santo e papa.jpg',
  'Pope Boniface V': 'Bonifacius V. Bonifacio V, santo e papa.jpg',
  'Pope Theodore I': 'Theodorus I. Teodoro I, papa.jpg',
  'Pope Vitalian': 'Vitalianus. Vitaliano, papa.jpg',
  'Pope Leo II': 'Leo II. Leone II, santo e papa.jpg',
  'Pope John V': 'Ioannes V. Giovanni V, papa.jpg',
  'Pope Conon': 'Conon. Conone, papa.jpg',
  'Pope Sergius I': 'Sergius I. Sergio I, papa.jpg',
  'Pope Gregory III': 'Gregorius III. Gregorio III, papa.jpg',
  'Pope Paul I': 'Paulus I. Paolo I, papa.jpg',
  'Pope Stephen III': 'Stephanus III. Stefano III, papa.jpg',
  'Pope Adrian I': 'Hadrianus I. Adriano I, papa.jpg',
  'Pope Benedict III': 'Benedictus III. Benedetto III, papa.jpg',
  'Pope Nicholas I': 'Nicolaus I. Niccolò I, papa.jpg',
  'Pope Stephen VI': 'Stephanus VI. Stefano VI, papa.jpg',
  'Pope Romanus': 'Romanus. Romano, papa.jpg',
  'Pope Sergius III': 'Sergius III. Sergio III, papa.jpg',
  'Pope Anastasius III': 'Anastasius III. Anastasio III, papa.jpg',
  'Pope John X': 'Ioannes X. Giovanni X, papa.jpg',
  'Pope Agapetus II': 'Agapetus II. Agapito II, papa.jpg',
  'Pope Benedict VII': 'Benedictus VII. Benedetto VII.jpg',
  'Pope John XVII': 'Ioannes XVII. Giovanni XVII, papa.jpg',
  'Pope Benedict VIII': 'Benedictus VIII. Benedetto VIII, papa.jpg',
  'Pope John XIX': 'Ioannes XIX. Giovanni XIX, papa.jpg',
  'Pope Benedict IX': "Papa Benedetto IX, di Cristofano dell'Altissimo,1552-68 -FG.jpg",
  'Pope Clement II': 'Clemens II. Clemente II, papa.jpg',
  'Pope Urban II': 'Urbanus II. Urbano II, papa. Châtillon Ottone de.jpg',
  'Pope Callixtus II': 'Callistus II. Callisto II, papa. Guido dei conti di Borgogna.jpg',
  'Pope Celestine II': 'Caelestinus II. Celestino II, papa. Castello Guido Guelfuccio de.jpg',
  'Pope Eugene III': 'Eugenius III. Eugenio III, papa. Paganelli Pietro Bernardo dei.jpg',
  'Pope Alexander III': 'Alexander III. Alessandro III, papa. Bandinelli Rolando.jpg',
  'Pope Clement III': 'Clemens III. Clemente III, papa. Scolari Paolo.jpg',
  'Pope Celestine IV': 'Caelestinus IV. Celestino IV, papa. Castiglioni Goffredo.jpg',
  'Pope Alexander IV': 'Alexander IV. Alessandro IV, papa. Rinaldo dei Signori di Jenne.jpg',
  'Pope Urban IV': 'Urbanus IV. Urbano IV, papa. Pantaléon Jacques.jpg',
  'Pope Adrian V': 'Hadrianus V. Adriano V, papa. Fieschi Ottobono.jpg',
  'Pope Nicholas III': 'Nicolaus III. Niccolò III, papa. Orsini Giovanni Gaetano.jpg',
  'Pope Honorius IV': 'Honorius IV. Onorio IV, papa. Savelli Giacomo.jpg',
  'Pope Boniface VIII': 'Bonifacius VIII. Bonifacio VIII, papa. Caetani Benedetto.jpg',
  'Pope Benedict XI': 'Benedictus XI. Benedetto XI, papa. Nicola di Boccassio.jpg',
  'Pope Gregory XI': 'Portrait of Pope Gregory XI.png',
  'Pope Urban VI': 'Urbanus VI. Urbano VI, papa. Prignano Bartolomeo.jpg',
  'Pope Nicholas V': "Papa Niccolò V, di Cristofano dell'Altissimo, 1552-68 -FG.jpg",
  'Pope Innocent VIII': "Papa Innocenzo VIII, di Cristofano dell'Altissimo, 1552-68 -FG.jpg",
}

/** Same Wikipedia article, different official portraits per term. */
export const TERM_PORTRAIT_FILES: Record<string, string> = {
  'trump-45': 'Donald Trump official portrait.jpg',
  'trump-47': 'Official Presidential Portrait of President Donald J. Trump (2025).jpg',
}

const ALLOWED_FILES = new Set(
  [...Object.values(WIKI_PORTRAIT_FILES), ...Object.values(TERM_PORTRAIT_FILES)].map((name) =>
    name.replace(/_/g, ' '),
  ),
)

export function portraitFileForTerm(id: string): string | undefined {
  return TERM_PORTRAIT_FILES[id]
}

export function isAllowedPortraitFile(file: string): boolean {
  return ALLOWED_FILES.has(file.trim().replace(/_/g, ' '))
}
