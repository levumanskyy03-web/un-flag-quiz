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
  'Cathy Freeman': { wiki: 'Cathy Freeman' },
  'Mo Farah': { wiki: 'Mo Farah', wikiFile: 'Mo Farah (5000m Olympic Final).jpg' },
  'Carl Lewis': { wiki: 'Carl Lewis' },
  'Mark Spitz': { wiki: 'Mark Spitz' },
  'Kōhei Uchimura': { wiki: 'Kōhei Uchimura' },
  'Teddy Riner': { wiki: 'Teddy Riner' },
  'Teófilo Stevenson': { wiki: 'Teófilo Stevenson' },
  'Eliud Kipchoge': { wiki: 'Eliud Kipchoge' },
  'Birgit Fischer': { wiki: 'Birgit Fischer' },
  'Federica Pellegrini': { wiki: 'Federica Pellegrini' },
  'Krisztina Egerszegi': { wiki: 'Krisztina Egerszegi' },
  'Ian Thorpe': { wiki: 'Ian Thorpe' },
  'Shelly-Ann Fraser-Pryce': { wiki: 'Shelly-Ann Fraser-Pryce' },
  'Allyson Felix': { wiki: 'Allyson Felix' },
  'Fanny Blankers-Koen': { wiki: 'Fanny Blankers-Koen' },
  'Michael Jordan': { wiki: 'Michael Jordan' },
  Marta: { wiki: 'Marta (footballer)' },
  'Rafael Nadal': { wiki: 'Rafael Nadal' },
  'Ma Long': { wiki: 'Ma Long' },
  'Chris Hoy': { wiki: 'Chris Hoy' },
  'Wayne Gretzky': { wiki: 'Wayne Gretzky' },
  'Marcel Hirscher': { wiki: 'Marcel Hirscher' },
  'Ole Einar Bjørndalen': { wiki: 'Ole Einar Bjørndalen' },
}

export function olyPortrait(name: string): OlyPortrait | undefined {
  return OLY_PORTRAITS[name]
}
