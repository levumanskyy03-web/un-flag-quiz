import type { Lang } from '../i18n/lang'
import { COUNTRIES, type Country } from './countries'
import { CAMPAIGN_LEVELS, LEVEL_ISOS } from './levels'

export type WaterKind = 'ocean' | 'sea' | 'river' | 'lake'
export type WaterDataMode = 'seaToName' | 'riverToName'
export type WaterMapMode = 'mapToSea' | 'mapToRiver'
export type WaterMode = WaterDataMode | WaterMapMode

export interface WaterBody {
  id: string
  kind: WaterKind
  en: string
  ru: string
  easy?: boolean
}

export const WATER_BODIES: Record<string, WaterBody> = {
  atlantic: { id: 'atlantic', kind: 'ocean', en: 'Atlantic Ocean', ru: 'Атлантический океан', easy: true },
  pacific: { id: 'pacific', kind: 'ocean', en: 'Pacific Ocean', ru: 'Тихий океан', easy: true },
  indian: { id: 'indian', kind: 'ocean', en: 'Indian Ocean', ru: 'Индийский океан', easy: true },
  arctic: { id: 'arctic', kind: 'ocean', en: 'Arctic Ocean', ru: 'Северный Ледовитый океан', easy: true },
  southern: { id: 'southern', kind: 'ocean', en: 'Southern Ocean', ru: 'Южный океан', easy: true },
  mediterranean: { id: 'mediterranean', kind: 'sea', en: 'Mediterranean Sea', ru: 'Средиземное море', easy: true },
  caribbean: { id: 'caribbean', kind: 'sea', en: 'Caribbean Sea', ru: 'Карибское море', easy: true },
  north_sea: { id: 'north_sea', kind: 'sea', en: 'North Sea', ru: 'Северное море', easy: true },
  baltic: { id: 'baltic', kind: 'sea', en: 'Baltic Sea', ru: 'Балтийское море', easy: true },
  black_sea: { id: 'black_sea', kind: 'sea', en: 'Black Sea', ru: 'Чёрное море', easy: true },
  red_sea: { id: 'red_sea', kind: 'sea', en: 'Red Sea', ru: 'Красное море', easy: true },
  persian_gulf: { id: 'persian_gulf', kind: 'sea', en: 'Persian Gulf', ru: 'Персидский залив', easy: true },
  gulf_mexico: { id: 'gulf_mexico', kind: 'sea', en: 'Gulf of Mexico', ru: 'Мексиканский залив', easy: true },
  south_china: { id: 'south_china', kind: 'sea', en: 'South China Sea', ru: 'Южно-Китайское море', easy: true },
  english_channel: { id: 'english_channel', kind: 'sea', en: 'English Channel', ru: 'Ла-Манш', easy: true },
  japan_sea: { id: 'japan_sea', kind: 'sea', en: 'Sea of Japan', ru: 'Японское море', easy: true },
  caspian: { id: 'caspian', kind: 'lake', en: 'Caspian Sea', ru: 'Каспийское море', easy: true },
  adriatic: { id: 'adriatic', kind: 'sea', en: 'Adriatic Sea', ru: 'Адриатическое море' },
  aegean: { id: 'aegean', kind: 'sea', en: 'Aegean Sea', ru: 'Эгейское море' },
  andaman: { id: 'andaman', kind: 'sea', en: 'Andaman Sea', ru: 'Андаманское море' },
  arabian: { id: 'arabian', kind: 'sea', en: 'Arabian Sea', ru: 'Аравийское море' },
  arafura: { id: 'arafura', kind: 'sea', en: 'Arafura Sea', ru: 'Арафурское море' },
  azov: { id: 'azov', kind: 'sea', en: 'Sea of Azov', ru: 'Азовское море' },
  barents: { id: 'barents', kind: 'sea', en: 'Barents Sea', ru: 'Баренцево море' },
  bengal: { id: 'bengal', kind: 'sea', en: 'Bay of Bengal', ru: 'Бенгальский залив' },
  bering: { id: 'bering', kind: 'sea', en: 'Bering Sea', ru: 'Берингово море' },
  biscay: { id: 'biscay', kind: 'sea', en: 'Bay of Biscay', ru: 'Бискайский залив' },
  celebes: { id: 'celebes', kind: 'sea', en: 'Celebes Sea', ru: 'Море Сулавеси' },
  coral: { id: 'coral', kind: 'sea', en: 'Coral Sea', ru: 'Коралловое море' },
  east_china: { id: 'east_china', kind: 'sea', en: 'East China Sea', ru: 'Восточно-Китайское море' },
  greenland_sea: { id: 'greenland_sea', kind: 'sea', en: 'Greenland Sea', ru: 'Гренландское море' },
  guinea_gulf: { id: 'guinea_gulf', kind: 'sea', en: 'Gulf of Guinea', ru: 'Гвинейский залив' },
  hudson: { id: 'hudson', kind: 'sea', en: 'Hudson Bay', ru: 'Гудзонов залив' },
  ionian: { id: 'ionian', kind: 'sea', en: 'Ionian Sea', ru: 'Ионическое море' },
  irish: { id: 'irish', kind: 'sea', en: 'Irish Sea', ru: 'Ирландское море' },
  mozambique: { id: 'mozambique', kind: 'sea', en: 'Mozambique Channel', ru: 'Мозамбикский пролив' },
  norwegian: { id: 'norwegian', kind: 'sea', en: 'Norwegian Sea', ru: 'Норвежское море' },
  oman_gulf: { id: 'oman_gulf', kind: 'sea', en: 'Gulf of Oman', ru: 'Оманский залив' },
  philippine: { id: 'philippine', kind: 'sea', en: 'Philippine Sea', ru: 'Филиппинское море' },
  tasman: { id: 'tasman', kind: 'sea', en: 'Tasman Sea', ru: 'Тасманово море' },
  timor: { id: 'timor', kind: 'sea', en: 'Timor Sea', ru: 'Тиморское море' },
  tyrrhenian: { id: 'tyrrhenian', kind: 'sea', en: 'Tyrrhenian Sea', ru: 'Тирренское море' },
  yellow_sea: { id: 'yellow_sea', kind: 'sea', en: 'Yellow Sea', ru: 'Жёлтое море' },
  aden: { id: 'aden', kind: 'sea', en: 'Gulf of Aden', ru: 'Аденский залив' },
  nile: { id: 'nile', kind: 'river', en: 'Nile', ru: 'Нил', easy: true },
  amazon: { id: 'amazon', kind: 'river', en: 'Amazon', ru: 'Амазонка', easy: true },
  danube: { id: 'danube', kind: 'river', en: 'Danube', ru: 'Дунай', easy: true },
  rhine: { id: 'rhine', kind: 'river', en: 'Rhine', ru: 'Рейн', easy: true },
  volga: { id: 'volga', kind: 'river', en: 'Volga', ru: 'Волга', easy: true },
  mississippi: { id: 'mississippi', kind: 'river', en: 'Mississippi', ru: 'Миссисипи', easy: true },
  yangtze: { id: 'yangtze', kind: 'river', en: 'Yangtze', ru: 'Янцзы', easy: true },
  ganges: { id: 'ganges', kind: 'river', en: 'Ganges', ru: 'Ганг', easy: true },
  mekong: { id: 'mekong', kind: 'river', en: 'Mekong', ru: 'Меконг', easy: true },
  congo: { id: 'congo', kind: 'river', en: 'Congo River', ru: 'Конго', easy: true },
  niger: { id: 'niger', kind: 'river', en: 'Niger River', ru: 'Нигер', easy: true },
  thames: { id: 'thames', kind: 'river', en: 'Thames', ru: 'Темза', easy: true },
  yellow_river: { id: 'yellow_river', kind: 'river', en: 'Yellow River', ru: 'Хуанхэ', easy: true },
  indus: { id: 'indus', kind: 'river', en: 'Indus', ru: 'Инд', easy: true },
  murray: { id: 'murray', kind: 'river', en: 'Murray', ru: 'Муррей', easy: true },
  baikal: { id: 'baikal', kind: 'lake', en: 'Lake Baikal', ru: 'Байкал', easy: true },
  victoria: { id: 'victoria', kind: 'lake', en: 'Lake Victoria', ru: 'Озеро Виктория', easy: true },
  superior: { id: 'superior', kind: 'lake', en: 'Lake Superior', ru: 'Верхнее озеро', easy: true },
  tanganyika: { id: 'tanganyika', kind: 'lake', en: 'Lake Tanganyika', ru: 'Танганьика', easy: true },
  malawi: { id: 'malawi', kind: 'lake', en: 'Lake Malawi', ru: 'Озеро Малави', easy: true },
  titicaca: { id: 'titicaca', kind: 'lake', en: 'Lake Titicaca', ru: 'Титикака', easy: true },
  dead_sea: { id: 'dead_sea', kind: 'lake', en: 'Dead Sea', ru: 'Мёртвое море', easy: true },
  geneva: { id: 'geneva', kind: 'lake', en: 'Lake Geneva', ru: 'Женевское озеро', easy: true },
  chad: { id: 'chad', kind: 'lake', en: 'Lake Chad', ru: 'Озеро Чад', easy: true },
  seine: { id: 'seine', kind: 'river', en: 'Seine', ru: 'Сена' },
  loire: { id: 'loire', kind: 'river', en: 'Loire', ru: 'Луара' },
  elbe: { id: 'elbe', kind: 'river', en: 'Elbe', ru: 'Эльба' },
  oder: { id: 'oder', kind: 'river', en: 'Oder', ru: 'Одра' },
  vistula: { id: 'vistula', kind: 'river', en: 'Vistula', ru: 'Висла' },
  dnieper: { id: 'dnieper', kind: 'river', en: 'Dnieper', ru: 'Днепр' },
  don: { id: 'don', kind: 'river', en: 'Don', ru: 'Дон' },
  po: { id: 'po', kind: 'river', en: 'Po', ru: 'По' },
  tiber: { id: 'tiber', kind: 'river', en: 'Tiber', ru: 'Тибр' },
  tagus: { id: 'tagus', kind: 'river', en: 'Tagus', ru: 'Тежу' },
  ebro: { id: 'ebro', kind: 'river', en: 'Ebro', ru: 'Эбро' },
  shannon: { id: 'shannon', kind: 'river', en: 'Shannon', ru: 'Шаннон' },
  glooma: { id: 'glooma', kind: 'river', en: 'Glomma', ru: 'Гломма' },
  gotal: { id: 'gotal', kind: 'river', en: 'Göta älv', ru: 'Гёта-Эльв' },
  kemijoki: { id: 'kemijoki', kind: 'river', en: 'Kemijoki', ru: 'Кемийоки' },
  tisa: { id: 'tisa', kind: 'river', en: 'Tisza', ru: 'Тиса' },
  sava: { id: 'sava', kind: 'river', en: 'Sava', ru: 'Сава' },
  drava: { id: 'drava', kind: 'river', en: 'Drava', ru: 'Драва' },
  morava: { id: 'morava', kind: 'river', en: 'Morava', ru: 'Морава' },
  vltava: { id: 'vltava', kind: 'river', en: 'Vltava', ru: 'Влтава' },
  moselle: { id: 'moselle', kind: 'river', en: 'Moselle', ru: 'Мозель' },
  meuse: { id: 'meuse', kind: 'river', en: 'Meuse', ru: 'Маас' },
  scheldt: { id: 'scheldt', kind: 'river', en: 'Scheldt', ru: 'Шельда' },
  douro: { id: 'douro', kind: 'river', en: 'Douro', ru: 'Дору' },
  guadiana: { id: 'guadiana', kind: 'river', en: 'Guadiana', ru: 'Гвадиана' },
  prut: { id: 'prut', kind: 'river', en: 'Prut', ru: 'Прут' },
  dniester: { id: 'dniester', kind: 'river', en: 'Dniester', ru: 'Днестр' },
  daugava: { id: 'daugava', kind: 'river', en: 'Daugava', ru: 'Даугава' },
  nemunas: { id: 'nemunas', kind: 'river', en: 'Neman', ru: 'Неман' },
  tigris: { id: 'tigris', kind: 'river', en: 'Tigris', ru: 'Тигр' },
  euphrates: { id: 'euphrates', kind: 'river', en: 'Euphrates', ru: 'Евфрат' },
  jordan: { id: 'jordan', kind: 'river', en: 'Jordan River', ru: 'Иордан' },
  orontes: { id: 'orontes', kind: 'river', en: 'Orontes', ru: 'Оронт' },
  amu: { id: 'amu', kind: 'river', en: 'Amu Darya', ru: 'Амударья' },
  syr: { id: 'syr', kind: 'river', en: 'Syr Darya', ru: 'Сырдарья' },
  irtysh: { id: 'irtysh', kind: 'river', en: 'Irtysh', ru: 'Иртыш' },
  ob: { id: 'ob', kind: 'river', en: 'Ob', ru: 'Обь' },
  yenisei: { id: 'yenisei', kind: 'river', en: 'Yenisei', ru: 'Енисей' },
  lena: { id: 'lena', kind: 'river', en: 'Lena', ru: 'Лена' },
  amur: { id: 'amur', kind: 'river', en: 'Amur', ru: 'Амур' },
  pearl: { id: 'pearl', kind: 'river', en: 'Pearl River', ru: 'Чжуцзян' },
  irrawaddy: { id: 'irrawaddy', kind: 'river', en: 'Irrawaddy', ru: 'Иравади' },
  salween: { id: 'salween', kind: 'river', en: 'Salween', ru: 'Салуин' },
  chao_phraya: { id: 'chao_phraya', kind: 'river', en: 'Chao Phraya', ru: 'Чао Прая' },
  red_river: { id: 'red_river', kind: 'river', en: 'Red River', ru: 'Хонгха' },
  brahmaputra: { id: 'brahmaputra', kind: 'river', en: 'Brahmaputra', ru: 'Брахмапутра' },
  godavari: { id: 'godavari', kind: 'river', en: 'Godavari', ru: 'Годавари' },
  kura: { id: 'kura', kind: 'river', en: 'Kura', ru: 'Кура' },
  helmand: { id: 'helmand', kind: 'river', en: 'Helmand', ru: 'Гильменд' },
  zambezi: { id: 'zambezi', kind: 'river', en: 'Zambezi', ru: 'Замбези' },
  orange: { id: 'orange', kind: 'river', en: 'Orange River', ru: 'Оранжевая' },
  limpopo: { id: 'limpopo', kind: 'river', en: 'Limpopo', ru: 'Лимпопо' },
  senegal: { id: 'senegal', kind: 'river', en: 'Senegal River', ru: 'Сенегал' },
  volta: { id: 'volta', kind: 'river', en: 'Volta', ru: 'Вольта' },
  ubangi: { id: 'ubangi', kind: 'river', en: 'Ubangi', ru: 'Убанги' },
  kasai: { id: 'kasai', kind: 'river', en: 'Kasai', ru: 'Касаи' },
  okavango: { id: 'okavango', kind: 'river', en: 'Okavango', ru: 'Окаванго' },
  kwanza: { id: 'kwanza', kind: 'river', en: 'Kwanza', ru: 'Кванза' },
  jubba: { id: 'jubba', kind: 'river', en: 'Jubba', ru: 'Джубба' },
  shebelle: { id: 'shebelle', kind: 'river', en: 'Shebelle', ru: 'Веби-Шебели' },
  tana: { id: 'tana', kind: 'river', en: 'Tana', ru: 'Тана' },
  parana: { id: 'parana', kind: 'river', en: 'Paraná', ru: 'Парана' },
  paraguay: { id: 'paraguay', kind: 'river', en: 'Paraguay River', ru: 'Парагвай' },
  uruguay: { id: 'uruguay', kind: 'river', en: 'Uruguay River', ru: 'Уругвай' },
  orinoco: { id: 'orinoco', kind: 'river', en: 'Orinoco', ru: 'Ориноко' },
  magdalena: { id: 'magdalena', kind: 'river', en: 'Magdalena', ru: 'Магдалена' },
  colorado: { id: 'colorado', kind: 'river', en: 'Colorado River', ru: 'Колорадо' },
  columbia: { id: 'columbia', kind: 'river', en: 'Columbia River', ru: 'Колумбия' },
  st_lawrence: { id: 'st_lawrence', kind: 'river', en: 'St. Lawrence', ru: 'Святого Лаврентия' },
  yukon: { id: 'yukon', kind: 'river', en: 'Yukon', ru: 'Юкон' },
  rio_grande: { id: 'rio_grande', kind: 'river', en: 'Rio Grande', ru: 'Рио-Гранде' },
  sao_francisco: { id: 'sao_francisco', kind: 'river', en: 'São Francisco', ru: 'Сан-Франсиску' },
  fly: { id: 'fly', kind: 'river', en: 'Fly River', ru: 'Флай' },
  waikato: { id: 'waikato', kind: 'river', en: 'Waikato', ru: 'Уайкато' },
  sevan: { id: 'sevan', kind: 'lake', en: 'Lake Sevan', ru: 'Севан' },
  van: { id: 'van', kind: 'lake', en: 'Lake Van', ru: 'Ван' },
  issyk: { id: 'issyk', kind: 'lake', en: 'Issyk-Kul', ru: 'Иссык-Куль' },
  balkhash: { id: 'balkhash', kind: 'lake', en: 'Lake Balkhash', ru: 'Балхаш' },
  aral: { id: 'aral', kind: 'lake', en: 'Aral Sea', ru: 'Аральское море' },
  tonle: { id: 'tonle', kind: 'lake', en: 'Tonlé Sap', ru: 'Тонлесап' },
  inle: { id: 'inle', kind: 'lake', en: 'Inle Lake', ru: 'Инле' },
  toba: { id: 'toba', kind: 'lake', en: 'Lake Toba', ru: 'Тоба' },
  biwa: { id: 'biwa', kind: 'lake', en: 'Lake Biwa', ru: 'Бива' },
  constance: { id: 'constance', kind: 'lake', en: 'Lake Constance', ru: 'Боденское озеро' },
  garda: { id: 'garda', kind: 'lake', en: 'Lake Garda', ru: 'Гарда' },
  balaton: { id: 'balaton', kind: 'lake', en: 'Lake Balaton', ru: 'Балатон' },
  ohrid: { id: 'ohrid', kind: 'lake', en: 'Lake Ohrid', ru: 'Охридское озеро' },
  prespa: { id: 'prespa', kind: 'lake', en: 'Lake Prespa', ru: 'Преспа' },
  como: { id: 'como', kind: 'lake', en: 'Lake Como', ru: 'Комо' },
  loch_ness: { id: 'loch_ness', kind: 'lake', en: 'Loch Ness', ru: 'Лох-Несс' },
  vanern: { id: 'vanern', kind: 'lake', en: 'Vänern', ru: 'Венерн' },
  saimaa: { id: 'saimaa', kind: 'lake', en: 'Saimaa', ru: 'Сайма' },
  ladoga: { id: 'ladoga', kind: 'lake', en: 'Lake Ladoga', ru: 'Ладожское озеро' },
  onega: { id: 'onega', kind: 'lake', en: 'Lake Onega', ru: 'Онежское озеро' },
  michigan: { id: 'michigan', kind: 'lake', en: 'Lake Michigan', ru: 'Мичиган' },
  nicaragua: { id: 'nicaragua', kind: 'lake', en: 'Lake Nicaragua', ru: 'Озеро Никарагуа' },
  maracaibo: { id: 'maracaibo', kind: 'lake', en: 'Lake Maracaibo', ru: 'Маракайбо' },
  poopo: { id: 'poopo', kind: 'lake', en: 'Lake Poopó', ru: 'Поопо' },
  kivu: { id: 'kivu', kind: 'lake', en: 'Lake Kivu', ru: 'Киву' },
  albert: { id: 'albert', kind: 'lake', en: 'Lake Albert', ru: 'Озеро Альберт' },
  turkana: { id: 'turkana', kind: 'lake', en: 'Lake Turkana', ru: 'Туркана' },
  tana_lake: { id: 'tana_lake', kind: 'lake', en: 'Lake Tana', ru: 'Тана' },
  kariba: { id: 'kariba', kind: 'lake', en: 'Lake Kariba', ru: 'Кариба' },
  volta_lake: { id: 'volta_lake', kind: 'lake', en: 'Lake Volta', ru: 'Вольта' },
  nasser: { id: 'nasser', kind: 'lake', en: 'Lake Nasser', ru: 'Насер' },
  tuz: { id: 'tuz', kind: 'lake', en: 'Lake Tuz', ru: 'Туз' },
  banda: { id: 'banda', kind: 'sea', en: 'Banda Sea', ru: 'Море Банда' },
  chelif: { id: 'chelif', kind: 'river', en: 'Chelif', ru: 'Шелифф' },
  rhone: { id: 'rhone', kind: 'river', en: 'Rhône', ru: 'Рона' },
  han: { id: 'han', kind: 'river', en: 'Han River', ru: 'Ханган' },
}

/** Coastal / enclosed seas. Landlocked countries are omitted. */
export const COUNTRY_SEAS: Record<string, string[]> = {
  dz: ['mediterranean', 'atlantic'],
  ao: ['atlantic'],
  bj: ['guinea_gulf'],
  cv: ['atlantic'],
  cm: ['guinea_gulf'],
  km: ['mozambique', 'indian'],
  cg: ['atlantic'],
  ci: ['guinea_gulf'],
  cd: ['atlantic'],
  dj: ['aden', 'red_sea'],
  eg: ['mediterranean', 'red_sea'],
  gq: ['guinea_gulf'],
  er: ['red_sea'],
  ga: ['guinea_gulf'],
  gm: ['atlantic'],
  gh: ['guinea_gulf'],
  gn: ['atlantic'],
  gw: ['atlantic'],
  ke: ['indian'],
  lr: ['atlantic'],
  ly: ['mediterranean'],
  mg: ['mozambique', 'indian'],
  mr: ['atlantic'],
  mu: ['indian'],
  ma: ['atlantic', 'mediterranean'],
  mz: ['mozambique', 'indian'],
  na: ['atlantic'],
  ng: ['guinea_gulf'],
  st: ['guinea_gulf'],
  sn: ['atlantic'],
  sc: ['indian'],
  sl: ['atlantic'],
  so: ['indian', 'aden'],
  za: ['atlantic', 'indian'],
  sd: ['red_sea'],
  tz: ['indian'],
  tg: ['guinea_gulf'],
  tn: ['mediterranean'],
  bh: ['persian_gulf'],
  bd: ['bengal'],
  bn: ['south_china'],
  kh: ['south_china'],
  cn: ['east_china', 'south_china', 'yellow_sea'],
  cy: ['mediterranean'],
  ge: ['black_sea'],
  in: ['indian', 'arabian', 'bengal'],
  id: ['indian', 'pacific', 'south_china', 'celebes'],
  ir: ['persian_gulf', 'caspian', 'oman_gulf'],
  iq: ['persian_gulf'],
  il: ['mediterranean', 'red_sea'],
  jp: ['pacific', 'japan_sea'],
  jo: ['red_sea'],
  kz: ['caspian'],
  kw: ['persian_gulf'],
  lb: ['mediterranean'],
  my: ['south_china', 'andaman'],
  mv: ['indian'],
  mm: ['andaman', 'bengal'],
  kp: ['yellow_sea', 'japan_sea'],
  om: ['arabian', 'oman_gulf'],
  pk: ['arabian'],
  ph: ['pacific', 'south_china', 'philippine'],
  qa: ['persian_gulf'],
  sa: ['red_sea', 'persian_gulf'],
  sg: ['south_china'],
  kr: ['yellow_sea', 'japan_sea'],
  lk: ['indian'],
  sy: ['mediterranean'],
  th: ['andaman', 'south_china'],
  tl: ['timor', 'banda'],
  tr: ['mediterranean', 'black_sea', 'aegean'],
  tm: ['caspian'],
  ae: ['persian_gulf', 'oman_gulf'],
  vn: ['south_china'],
  ye: ['red_sea', 'aden', 'arabian'],
  al: ['adriatic', 'ionian'],
  be: ['north_sea'],
  ba: ['adriatic'],
  bg: ['black_sea'],
  hr: ['adriatic'],
  dk: ['north_sea', 'baltic'],
  ee: ['baltic'],
  fi: ['baltic'],
  fr: ['atlantic', 'mediterranean', 'english_channel', 'biscay'],
  de: ['north_sea', 'baltic'],
  gr: ['aegean', 'ionian', 'mediterranean'],
  is: ['atlantic', 'greenland_sea'],
  ie: ['atlantic', 'irish'],
  it: ['mediterranean', 'adriatic', 'tyrrhenian', 'ionian'],
  lv: ['baltic'],
  lt: ['baltic'],
  mt: ['mediterranean'],
  mc: ['mediterranean'],
  me: ['adriatic'],
  nl: ['north_sea'],
  no: ['norwegian', 'north_sea', 'barents', 'atlantic'],
  pl: ['baltic'],
  pt: ['atlantic'],
  ro: ['black_sea'],
  ru: ['baltic', 'black_sea', 'barents', 'bering', 'japan_sea', 'caspian', 'azov', 'arctic'],
  si: ['adriatic'],
  es: ['atlantic', 'mediterranean', 'biscay'],
  se: ['baltic', 'north_sea'],
  ua: ['black_sea', 'azov'],
  gb: ['atlantic', 'north_sea', 'irish', 'english_channel'],
  ag: ['caribbean', 'atlantic'],
  ar: ['atlantic'],
  bs: ['atlantic', 'caribbean'],
  bb: ['atlantic', 'caribbean'],
  bz: ['caribbean'],
  br: ['atlantic'],
  ca: ['atlantic', 'pacific', 'arctic', 'hudson'],
  cl: ['pacific', 'southern'],
  co: ['caribbean', 'pacific'],
  cr: ['caribbean', 'pacific'],
  cu: ['caribbean', 'atlantic'],
  dm: ['caribbean', 'atlantic'],
  do: ['caribbean', 'atlantic'],
  ec: ['pacific'],
  sv: ['pacific'],
  gd: ['caribbean', 'atlantic'],
  gt: ['pacific', 'caribbean'],
  gy: ['atlantic'],
  ht: ['caribbean', 'atlantic'],
  hn: ['caribbean', 'pacific'],
  jm: ['caribbean'],
  mx: ['pacific', 'gulf_mexico', 'caribbean'],
  ni: ['caribbean', 'pacific'],
  pa: ['caribbean', 'pacific'],
  pe: ['pacific'],
  kn: ['caribbean', 'atlantic'],
  lc: ['caribbean', 'atlantic'],
  vc: ['caribbean', 'atlantic'],
  sr: ['atlantic'],
  tt: ['caribbean', 'atlantic'],
  us: ['atlantic', 'pacific', 'gulf_mexico', 'arctic', 'bering'],
  uy: ['atlantic'],
  ve: ['caribbean', 'atlantic'],
  au: ['indian', 'pacific', 'southern', 'tasman', 'coral', 'timor'],
  fj: ['pacific'],
  ki: ['pacific'],
  mh: ['pacific'],
  fm: ['pacific'],
  nr: ['pacific'],
  nz: ['pacific', 'tasman', 'southern'],
  pw: ['pacific'],
  pg: ['pacific', 'coral', 'arafura'],
  ws: ['pacific'],
  sb: ['pacific', 'coral'],
  to: ['pacific'],
  tv: ['pacific'],
  vu: ['pacific', 'coral'],
}

export const COUNTRY_RIVERS: Record<string, string[]> = {
  dz: ['chelif'],
  ao: ['kwanza', 'zambezi'],
  bj: ['niger'],
  bw: ['okavango', 'limpopo'],
  bf: ['volta', 'niger'],
  bi: ['tanganyika', 'nile'],
  cv: [],
  cm: ['congo', 'niger'],
  cf: ['ubangi', 'congo'],
  td: ['chad', 'nile'],
  km: [],
  cg: ['congo'],
  ci: ['niger'],
  cd: ['congo', 'tanganyika'],
  dj: [],
  eg: ['nile', 'nasser'],
  gq: [],
  er: [],
  sz: ['limpopo'],
  et: ['nile', 'tana_lake', 'turkana'],
  ga: ['congo'],
  gm: ['senegal'],
  gh: ['volta', 'volta_lake'],
  gn: ['niger', 'senegal'],
  gw: ['senegal'],
  ke: ['victoria', 'tana', 'turkana'],
  ls: ['orange'],
  lr: [],
  ly: [],
  mg: [],
  mw: ['malawi', 'zambezi'],
  ml: ['niger', 'senegal'],
  mr: ['senegal'],
  mu: [],
  ma: [],
  mz: ['zambezi', 'limpopo'],
  na: ['orange', 'okavango'],
  ne: ['niger', 'chad'],
  ng: ['niger'],
  rw: ['kivu', 'victoria', 'nile'],
  st: [],
  sn: ['senegal'],
  sc: [],
  sl: [],
  so: ['jubba', 'shebelle'],
  za: ['orange', 'limpopo'],
  ss: ['nile'],
  sd: ['nile', 'nasser'],
  tz: ['tanganyika', 'victoria', 'malawi'],
  tg: ['volta'],
  tn: [],
  ug: ['victoria', 'albert', 'nile'],
  zm: ['zambezi', 'kariba'],
  zw: ['zambezi', 'limpopo', 'kariba'],
  af: ['helmand'],
  am: ['sevan', 'kura'],
  az: ['caspian', 'kura'],
  bh: [],
  bd: ['ganges', 'brahmaputra'],
  bt: ['brahmaputra'],
  bn: [],
  kh: ['mekong', 'tonle'],
  cn: ['yangtze', 'yellow_river', 'mekong', 'amur'],
  cy: [],
  ge: ['kura'],
  in: ['ganges', 'indus', 'brahmaputra', 'godavari'],
  id: ['toba'],
  ir: ['caspian', 'helmand'],
  iq: ['tigris', 'euphrates'],
  il: ['jordan', 'dead_sea'],
  jp: ['biwa'],
  jo: ['jordan', 'dead_sea'],
  kz: ['caspian', 'balkhash', 'irtysh', 'syr'],
  kw: [],
  kg: ['issyk', 'syr'],
  la: ['mekong'],
  lb: ['jordan', 'orontes'],
  my: [],
  mv: [],
  mn: ['yenisei'],
  mm: ['irrawaddy', 'salween', 'mekong', 'inle'],
  np: ['ganges'],
  kp: ['amur'],
  om: [],
  pk: ['indus'],
  ph: [],
  qa: [],
  sa: [],
  sg: [],
  kr: ['han'],
  lk: [],
  sy: ['euphrates', 'orontes'],
  tj: ['amu', 'syr'],
  th: ['mekong', 'chao_phraya'],
  tl: [],
  tr: ['van', 'tuz', 'euphrates', 'kura'],
  tm: ['caspian', 'amu'],
  ae: [],
  uz: ['amu', 'syr', 'aral'],
  vn: ['mekong', 'red_river'],
  ye: [],
  al: ['ohrid', 'drava'],
  ad: [],
  at: ['danube', 'drava', 'rhine'],
  by: ['dnieper', 'nemunas', 'daugava'],
  be: ['meuse', 'scheldt', 'rhine'],
  ba: ['sava', 'danube'],
  bg: ['danube'],
  hr: ['sava', 'drava', 'danube'],
  cz: ['vltava', 'elbe', 'morava', 'danube'],
  dk: [],
  ee: [],
  fi: ['saimaa'],
  fr: ['seine', 'loire', 'rhine', 'rhone'],
  de: ['rhine', 'elbe', 'danube', 'oder'],
  gr: ['prespa', 'ohrid'],
  hu: ['danube', 'tisa', 'balaton'],
  is: [],
  ie: ['shannon'],
  it: ['po', 'tiber', 'garda', 'como'],
  lv: ['daugava'],
  li: ['rhine'],
  lt: ['nemunas'],
  lu: ['moselle', 'meuse'],
  mt: [],
  md: ['dniester', 'prut', 'danube'],
  mc: [],
  me: ['sava'],
  nl: ['rhine', 'meuse', 'scheldt'],
  mk: ['ohrid', 'prespa'],
  no: ['glooma'],
  pl: ['vistula', 'oder'],
  pt: ['tagus', 'douro', 'guadiana'],
  ro: ['danube', 'prut'],
  ru: ['volga', 'ob', 'yenisei', 'lena', 'amur', 'baikal', 'ladoga', 'onega', 'don'],
  sm: ['tiber'],
  rs: ['danube', 'sava', 'tisa', 'morava'],
  sk: ['danube', 'morava'],
  si: ['drava', 'sava', 'danube'],
  es: ['ebro', 'tagus', 'guadiana', 'douro'],
  se: ['vanern', 'gotal'],
  ch: ['rhine', 'geneva', 'constance', 'rhone'],
  ua: ['dnieper', 'dniester', 'danube'],
  gb: ['thames', 'loch_ness'],
  ag: [],
  ar: ['parana', 'uruguay', 'parana'],
  bs: [],
  bb: [],
  bz: [],
  bo: ['titicaca', 'poopo', 'paraguay', 'amazon'],
  br: ['amazon', 'parana', 'sao_francisco', 'paraguay'],
  ca: ['st_lawrence', 'superior', 'yukon', 'columbia'],
  cl: [],
  co: ['amazon', 'orinoco', 'magdalena'],
  cr: [],
  cu: [],
  dm: [],
  do: [],
  ec: ['amazon'],
  sv: [],
  gd: [],
  gt: [],
  gy: ['amazon'],
  ht: [],
  hn: [],
  jm: [],
  mx: ['rio_grande', 'colorado'],
  ni: ['nicaragua'],
  pa: [],
  py: ['paraguay', 'parana'],
  pe: ['amazon', 'titicaca'],
  kn: [],
  lc: [],
  vc: [],
  sr: ['amazon'],
  tt: [],
  us: ['mississippi', 'colorado', 'columbia', 'rio_grande', 'superior', 'michigan', 'yukon'],
  uy: ['uruguay', 'parana'],
  ve: ['orinoco', 'maracaibo'],
  au: ['murray'],
  fj: [],
  ki: [],
  mh: [],
  fm: [],
  nr: [],
  nz: ['waikato'],
  pw: [],
  pg: ['fly'],
  ws: [],
  sb: [],
  to: [],
  tv: [],
  vu: [],
}

const FAME_INDEX = new Map(LEVEL_ISOS.flat().map((iso, index) => [iso, index]))
export const WATER_LEVEL_SIZE = 10

function invertWaters(table: Record<string, string[]>): Record<string, string[]> {
  const next: Record<string, string[]> = {}
  for (const [iso, ids] of Object.entries(table)) {
    for (const id of ids) {
      if (!WATER_BODIES[id]) continue
      if (!next[id]) next[id] = []
      next[id].push(iso)
    }
  }
  return next
}

const SEAS_BY_WATER = invertWaters(COUNTRY_SEAS)
const RIVERS_BY_WATER = invertWaters(COUNTRY_RIVERS)

function lonLatBox(lon: number, lat: number, spanLon: number, spanLat: number) {
  const w = (spanLon / 360) * 1010
  const h = (spanLat / 180) * 666
  return {
    x: ((lon + 180) / 360) * 1010 - w / 2,
    y: ((90 - lat) / 180) * 666 - h / 2,
    w,
    h,
  }
}

/** Crops for oceans (country unions span the whole map). ViewBox is 1010×666. */
export const WATER_VIEW: Record<string, { x: number; y: number; w: number; h: number }> = {
  atlantic: lonLatBox(-28, 12, 78, 96),
  pacific: lonLatBox(-145, 8, 72, 88),
  indian: lonLatBox(72, -6, 70, 72),
  arctic: lonLatBox(40, 78, 120, 28),
  southern: lonLatBox(20, -52, 100, 36),
}

export function isWaterCoastMode(value: unknown): value is WaterDataMode {
  return value === 'seaToName' || value === 'riverToName'
}

export function isWaterMapMode(value: unknown): value is WaterMapMode {
  return value === 'mapToSea' || value === 'mapToRiver'
}

export function isWaterMode(value: unknown): value is WaterMode {
  return isWaterCoastMode(value) || isWaterMapMode(value)
}

export function waterDataMode(mode: string): WaterDataMode {
  return mode === 'riverToName' || mode === 'mapToRiver' ? 'riverToName' : 'seaToName'
}

export function watersFor(iso: string, mode: WaterMode | WaterDataMode): string[] {
  const raw = waterDataMode(mode) === 'seaToName' ? COUNTRY_SEAS[iso] : COUNTRY_RIVERS[iso]
  if (!raw) return []
  return raw.filter((id) => Boolean(WATER_BODIES[id]))
}

export function canAskWater(iso: string, mode: WaterMode | WaterDataMode): boolean {
  return watersFor(iso, mode).length > 0
}

export function waterName(id: string, lang: Lang): string {
  const body = WATER_BODIES[id]
  if (!body) return id
  return lang === 'ru' ? body.ru : body.en
}

export function isEasyWaterBody(id: string): boolean {
  return Boolean(WATER_BODIES[id]?.easy)
}

export function isEasyWaterCountry(iso: string, mode: WaterMode | WaterDataMode): boolean {
  if (isWaterMapMode(mode)) {
    const id = watersFor(iso, mode)[0]
    return Boolean(id && isEasyWaterBody(id))
  }
  const primary = watersFor(iso, mode)[0]
  return Boolean(primary && WATER_BODIES[primary]?.easy)
}

export function isosForWater(id: string, mode?: WaterDataMode): string[] {
  if (mode === 'seaToName') return SEAS_BY_WATER[id] ?? []
  if (mode === 'riverToName') return RIVERS_BY_WATER[id] ?? []
  return SEAS_BY_WATER[id] ?? RIVERS_BY_WATER[id] ?? []
}

export function neighboringWaters(id: string, mode: WaterMode | WaterDataMode): string[] {
  const data = waterDataMode(mode)
  const related = new Set<string>()
  for (const iso of isosForWater(id, data)) {
    for (const other of watersFor(iso, data)) {
      if (other !== id) related.add(other)
    }
  }
  return [...related]
}

export function waterIdsForMode(mode: WaterMode | WaterDataMode): string[] {
  const table = waterDataMode(mode) === 'seaToName' ? SEAS_BY_WATER : RIVERS_BY_WATER
  return Object.keys(table)
}

export function countryForWater(id: string, mode: WaterMode | WaterDataMode): Country | undefined {
  const data = waterDataMode(mode)
  const isos = isosForWater(id, data)
  const preferred = isos.find((iso) => watersFor(iso, data)[0] === id) ?? isos[0]
  return COUNTRIES.find((country) => country.iso === preferred)
}

function waterFame(id: string, mode: WaterMode): number {
  const isos = isosForWater(id, waterDataMode(mode))
  if (isos.length === 0) return 999
  return Math.min(...isos.map((iso) => FAME_INDEX.get(iso) ?? 999))
}

export function waterCountries(mode: WaterMode): Country[] {
  if (isWaterMapMode(mode)) {
    return waterIdsForMode(mode)
      .map((id) => countryForWater(id, mode))
      .filter((country): country is Country => Boolean(country))
  }
  return COUNTRIES.filter((country) => canAskWater(country.iso, mode))
}

export function waterLevelChunks(mode: WaterMode): Country[][] {
  const ranked = isWaterMapMode(mode)
    ? waterIdsForMode(mode)
        .sort((a, b) => {
          const easy = Number(isEasyWaterBody(a)) - Number(isEasyWaterBody(b))
          if (easy !== 0) return -easy
          return waterFame(a, mode) - waterFame(b, mode)
        })
        .map((id) => countryForWater(id, mode))
        .filter((country): country is Country => Boolean(country))
    : waterCountries(mode).sort((a, b) => {
        const easy = Number(isEasyWaterCountry(a.iso, mode)) - Number(isEasyWaterCountry(b.iso, mode))
        if (easy !== 0) return -easy
        return (FAME_INDEX.get(a.iso) ?? 999) - (FAME_INDEX.get(b.iso) ?? 999)
      })
  const chunks: Country[][] = []
  for (let index = 0; index < ranked.length; index += WATER_LEVEL_SIZE) {
    chunks.push(ranked.slice(index, index + WATER_LEVEL_SIZE))
  }
  return chunks.slice(0, CAMPAIGN_LEVELS)
}

export function waterCampaignLevels(mode: WaterMode): number {
  return waterLevelChunks(mode).length
}

export function waterLevelNumbers(mode: WaterMode): number[] {
  return waterLevelChunks(mode).map((_, index) => index + 1)
}

export function waterAnswerKey(iso: string, mode: WaterMode, waterId?: string): string {
  const id = waterId ?? watersFor(iso, mode)[0]
  return id ? `${mode}:${id}` : iso
}

export function pickWaterId(iso: string, mode: WaterMode, used: Set<string>): string | undefined {
  const ids = watersFor(iso, mode)
  return ids.find((id) => !used.has(id)) ?? ids[0]
}
