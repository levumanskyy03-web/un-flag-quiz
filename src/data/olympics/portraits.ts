export interface OlyPortrait {
  wiki: string
  wikiFile?: string
}

const OLY_PORTRAITS: Record<string, OlyPortrait> = {
  'Usain Bolt': { wiki: 'Usain Bolt', wikiFile: 'Usain Bolt portrait.jpg' },
  'Michael Phelps': { wiki: 'Michael Phelps', wikiFile: 'Michael Phelps.jpg' },
  'Jesse Owens': { wiki: 'Jesse Owens', wikiFile: 'Jesse Owens 1936.jpg' },
  'Nadia Comăneci': { wiki: 'Nadia Comăneci', wikiFile: 'Nadia Comăneci 1976.jpg' },
  'Paavo Nurmi': { wiki: 'Paavo Nurmi', wikiFile: 'Paavo-Nurmi-1972.jpg' },
  'Abebe Bikila': { wiki: 'Abebe Bikila', wikiFile: 'Abebe Bikila 1964 Olympics.jpg' },
  'Cathy Freeman': { wiki: 'Cathy Freeman', wikiFile: 'Cathy Freeman (cropped).jpg' },
  'Mo Farah': { wiki: 'Mo Farah', wikiFile: 'Mo Farah (5000m Olympic Final).jpg' },
  'Carl Lewis': { wiki: 'Carl Lewis', wikiFile: 'Carl Lewis (cropped).jpg' },
  'Mark Spitz': { wiki: 'Mark Spitz', wikiFile: 'Mark Spitz.jpg' },
  'Kōhei Uchimura': { wiki: 'Kōhei Uchimura', wikiFile: 'Kohei Uchimura (2011).jpg' },
  'Teddy Riner': { wiki: 'Teddy Riner', wikiFile: 'Teddy Riner Cannes 2016.jpg' },
  'Teófilo Stevenson': { wiki: 'Teófilo Stevenson', wikiFile: 'Bundesarchiv Bild 183-1985-1004-023, Teofilo Stevenson cropped.jpg' },
  'Eliud Kipchoge': { wiki: 'Eliud Kipchoge', wikiFile: 'Eliud Kipchoge in Berlin - 2015 (cropped).jpg' },
  'Birgit Fischer': { wiki: 'Birgit Fischer', wikiFile: 'Birgit Fischer (2010).jpg' },
  'Federica Pellegrini': { wiki: 'Federica Pellegrini', wikiFile: 'Federica Pellegrini e Luca Marin (cropped).jpg' },
  'Krisztina Egerszegi': { wiki: 'Krisztina Egerszegi', wikiFile: 'Egerszegi Krisztina fortepan 40687.jpg' },
  'Ian Thorpe': { wiki: 'Ian Thorpe', wikiFile: 'Ian Thorpe 2012.jpg' },
  'Shelly-Ann Fraser-Pryce': { wiki: 'Shelly-Ann Fraser-Pryce', wikiFile: "Women's 100 m- Beijing 2015.jpg" },
  'Allyson Felix': { wiki: 'Allyson Felix', wikiFile: 'AllysonFelixRio2016.jpg' },
  'Fanny Blankers-Koen': { wiki: 'Fanny Blankers-Koen', wikiFile: 'Olympische dag in Amsterdam. Fanny Blankers-Koen, Bestanddeelnr 903-4520.jpg' },
  'Michael Jordan': { wiki: 'Michael Jordan', wikiFile: 'Michael Jordan in 2014.jpg' },
  Marta: { wiki: 'Marta (footballer)', wikiFile: 'NC Courage vs Orlando Pride (Jun 2024) 073 (cropped).jpg' },
  'Rafael Nadal': { wiki: 'Rafael Nadal', wikiFile: 'Rafael Nadal en 2024 (cropped).jpg' },
  'Ma Long': { wiki: 'Ma Long', wikiFile: 'Ma Long ATTC2017 29.jpeg' },
  'Chris Hoy': { wiki: 'Chris Hoy', wikiFile: 'Prostate Cancer Roundtable with Sir Chris Hoy (cropped).jpg' },
  'Wayne Gretzky': { wiki: 'Wayne Gretzky', wikiFile: 'Wayne Gretzky 1997.jpg' },
  'Marcel Hirscher': { wiki: 'Marcel Hirscher', wikiFile: 'Hirscher-001.jpg' },
  'Ole Einar Bjørndalen': { wiki: 'Ole Einar Bjørndalen', wikiFile: 'Bjoerndalen cutout.JPG' },
}

export function olyPortrait(name: string): OlyPortrait | undefined {
  return OLY_PORTRAITS[name]
}
