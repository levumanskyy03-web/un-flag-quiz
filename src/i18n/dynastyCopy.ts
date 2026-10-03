import type { Lang } from './lang'
import type { Strings } from './strings'

const KINDS = ['ott', 'jp', 'mc', 'bn', 'jo', 'ma', 'dk', 'nl', 'li', 'sz'] as const

type Kind = (typeof KINDS)[number]

type TopicKey =
  | 'ottomanRulers'
  | 'japanEmperors'
  | 'monacoPrinces'
  | 'bruneiSultans'
  | 'hashemiteRulers'
  | 'alaouiteRulers'
  | 'oldenburgRulers'
  | 'orangeRulers'
  | 'liechtensteinPrinces'
  | 'dlaminiRulers'

type PromptKey =
  | 'ottYearsPrompt'
  | 'jpYearsPrompt'
  | 'mcYearsPrompt'
  | 'bnYearsPrompt'
  | 'joYearsPrompt'
  | 'maYearsPrompt'
  | 'dkYearsPrompt'
  | 'nlYearsPrompt'
  | 'liYearsPrompt'
  | 'szYearsPrompt'

type ModeKey = `${Kind}YearsToName` | `${Kind}PhotoToName`

export type DynastyCopy = Pick<
  Strings,
  TopicKey | PromptKey | ModeKey | 'leaderEraEarly' | 'leaderEraLate'
>

const TOPIC_KEY: Record<Kind, TopicKey> = {
  ott: 'ottomanRulers',
  jp: 'japanEmperors',
  mc: 'monacoPrinces',
  bn: 'bruneiSultans',
  jo: 'hashemiteRulers',
  ma: 'alaouiteRulers',
  dk: 'oldenburgRulers',
  nl: 'orangeRulers',
  li: 'liechtensteinPrinces',
  sz: 'dlaminiRulers',
}

function pack(
  topics: Record<TopicKey, string>,
  prompts: Record<Kind, (range: string) => string>,
  years: string,
  photo: string,
  early: string,
  late: string,
): DynastyCopy {
  const copy: Record<string, string | ((range: string) => string)> = {
    ...topics,
    leaderEraEarly: early,
    leaderEraLate: late,
  }
  for (const kind of KINDS) {
    copy[TOPIC_KEY[kind]] = topics[TOPIC_KEY[kind]]
    copy[`${kind}YearsToName`] = `${topics[TOPIC_KEY[kind]]} · ${years}`
    copy[`${kind}PhotoToName`] = `${topics[TOPIC_KEY[kind]]} · ${photo}`
    copy[`${kind}YearsPrompt`] = prompts[kind]
  }
  return copy as DynastyCopy
}

export const DYNASTY_COPY: Record<Lang, DynastyCopy> = {
  ru: pack(
    {
      ottomanRulers: 'Османы',
      japanEmperors: 'Императоры Японии',
      monacoPrinces: 'Князья Монако',
      bruneiSultans: 'Султаны Брунея',
      hashemiteRulers: 'Хашимиты',
      alaouiteRulers: 'Короли Марокко',
      oldenburgRulers: 'Короли Дании и Норвегии',
      orangeRulers: 'Монархи Нидерландов',
      liechtensteinPrinces: 'Князья Лихтенштейна',
      dlaminiRulers: 'Короли Эсватини',
    },
    {
      ott: (range) => `Кто был султаном в ${range}?`,
      jp: (range) => `Кто был императором Японии в ${range}?`,
      mc: (range) => `Кто правил Монако в ${range}?`,
      bn: (range) => `Кто был султаном Брунея в ${range}?`,
      jo: (range) => `Кто из Хашимитов правил в ${range}?`,
      ma: (range) => `Кто правил Марокко в ${range}?`,
      dk: (range) => `Кто правил Данией или Норвегией в ${range}?`,
      nl: (range) => `Кто правил Нидерландами в ${range}?`,
      li: (range) => `Кто был князем Лихтенштейна в ${range}?`,
      sz: (range) => `Кто был королём Эсватини в ${range}?`,
    },
    'годы',
    'фото',
    'Ранние',
    'Поздние',
  ),
  en: pack(
    {
      ottomanRulers: 'Ottomans',
      japanEmperors: 'Emperors of Japan',
      monacoPrinces: 'Princes of Monaco',
      bruneiSultans: 'Sultans of Brunei',
      hashemiteRulers: 'Hashemites',
      alaouiteRulers: 'Kings of Morocco',
      oldenburgRulers: 'Kings of Denmark and Norway',
      orangeRulers: 'Monarchs of the Netherlands',
      liechtensteinPrinces: 'Princes of Liechtenstein',
      dlaminiRulers: 'Kings of Eswatini',
    },
    {
      ott: (range) => `Who was sultan in ${range}?`,
      jp: (range) => `Who was emperor of Japan in ${range}?`,
      mc: (range) => `Who ruled Monaco in ${range}?`,
      bn: (range) => `Who was sultan of Brunei in ${range}?`,
      jo: (range) => `Which Hashemite ruled in ${range}?`,
      ma: (range) => `Who ruled Morocco in ${range}?`,
      dk: (range) => `Who ruled Denmark or Norway in ${range}?`,
      nl: (range) => `Who ruled the Netherlands in ${range}?`,
      li: (range) => `Who was prince of Liechtenstein in ${range}?`,
      sz: (range) => `Who was king of Eswatini in ${range}?`,
    },
    'years',
    'photo',
    'Earlier',
    'Later',
  ),
  de: pack(
    {
      ottomanRulers: 'Osmanen',
      japanEmperors: 'Kaiser von Japan',
      monacoPrinces: 'Fürsten von Monaco',
      bruneiSultans: 'Sultane von Brunei',
      hashemiteRulers: 'Haschimiten',
      alaouiteRulers: 'Könige von Marokko',
      oldenburgRulers: 'Könige von Dänemark und Norwegen',
      orangeRulers: 'Monarchen der Niederlande',
      liechtensteinPrinces: 'Fürsten von Liechtenstein',
      dlaminiRulers: 'Könige von Eswatini',
    },
    {
      ott: (range) => `Wer war Sultan ${range}?`,
      jp: (range) => `Wer war Kaiser von Japan ${range}?`,
      mc: (range) => `Wer herrschte in Monaco ${range}?`,
      bn: (range) => `Wer war Sultan von Brunei ${range}?`,
      jo: (range) => `Welcher Haschimit herrschte ${range}?`,
      ma: (range) => `Wer herrschte in Marokko ${range}?`,
      dk: (range) => `Wer herrschte in Dänemark oder Norwegen ${range}?`,
      nl: (range) => `Wer herrschte in den Niederlanden ${range}?`,
      li: (range) => `Wer war Fürst von Liechtenstein ${range}?`,
      sz: (range) => `Wer war König von Eswatini ${range}?`,
    },
    'Jahre',
    'Foto',
    'Frühe',
    'Späte',
  ),
  zh: pack(
    {
      ottomanRulers: '奥斯曼',
      japanEmperors: '日本天皇',
      monacoPrinces: '摩纳哥亲王',
      bruneiSultans: '文莱苏丹',
      hashemiteRulers: '哈希姆',
      alaouiteRulers: '摩洛哥国王',
      oldenburgRulers: '丹麦和挪威国王',
      orangeRulers: '荷兰君主',
      liechtensteinPrinces: '列支敦士登亲王',
      dlaminiRulers: '斯威士兰国王',
    },
    {
      ott: (range) => `${range} 谁是苏丹？`,
      jp: (range) => `${range} 谁是日本天皇？`,
      mc: (range) => `${range} 谁统治摩纳哥？`,
      bn: (range) => `${range} 谁是文莱苏丹？`,
      jo: (range) => `${range} 哪位哈希姆族人在位？`,
      ma: (range) => `${range} 谁统治摩洛哥？`,
      dk: (range) => `${range} 谁统治丹麦或挪威？`,
      nl: (range) => `${range} 谁统治荷兰？`,
      li: (range) => `${range} 谁是列支敦士登大公？`,
      sz: (range) => `${range} 谁是斯威士兰国王？`,
    },
    '年份',
    '照片',
    '早期',
    '后期',
  ),
  es: pack(
    {
      ottomanRulers: 'Otomanos',
      japanEmperors: 'Emperadores de Japón',
      monacoPrinces: 'Príncipes de Mónaco',
      bruneiSultans: 'Sultanes de Brunéi',
      hashemiteRulers: 'Hachemíes',
      alaouiteRulers: 'Reyes de Marruecos',
      oldenburgRulers: 'Reyes de Dinamarca y Noruega',
      orangeRulers: 'Monarcas de los Países Bajos',
      liechtensteinPrinces: 'Príncipes de Liechtenstein',
      dlaminiRulers: 'Reyes de Esuatini',
    },
    {
      ott: (range) => `¿Quién fue sultán en ${range}?`,
      jp: (range) => `¿Quién fue emperador de Japón en ${range}?`,
      mc: (range) => `¿Quién gobernó Mónaco en ${range}?`,
      bn: (range) => `¿Quién fue sultán de Brunéi en ${range}?`,
      jo: (range) => `¿Qué hachemí gobernó en ${range}?`,
      ma: (range) => `¿Quién gobernó Marruecos en ${range}?`,
      dk: (range) => `¿Quién gobernó Dinamarca o Noruega en ${range}?`,
      nl: (range) => `¿Quién gobernó los Países Bajos en ${range}?`,
      li: (range) => `¿Quién fue príncipe de Liechtenstein en ${range}?`,
      sz: (range) => `¿Quién fue rey de Esuatini en ${range}?`,
    },
    'años',
    'foto',
    'Primeros',
    'Últimos',
  ),
  hi: pack(
    {
      ottomanRulers: 'ओटोमन',
      japanEmperors: 'जापान के सम्राट',
      monacoPrinces: 'मोनाको के राजकुमार',
      bruneiSultans: 'ब्रुनेई के सुल्तान',
      hashemiteRulers: 'हाशिमी',
      alaouiteRulers: 'मोरक्को के राजा',
      oldenburgRulers: 'डेनमार्क और नॉर्वे के राजा',
      orangeRulers: 'नीदरलैंड के शासक',
      liechtensteinPrinces: 'लिकटेंस्टाइन के राजकुमार',
      dlaminiRulers: 'एस्वातीनी के राजा',
    },
    {
      ott: (range) => `${range} में सुल्तान कौन था?`,
      jp: (range) => `${range} में जापान का सम्राट कौन था?`,
      mc: (range) => `${range} में मोनाको पर किसका शासन था?`,
      bn: (range) => `${range} में ब्रुनेई का सुल्तान कौन था?`,
      jo: (range) => `${range} में किस हाशिमी का शासन था?`,
      ma: (range) => `${range} में मोरक्को पर किसका शासन था?`,
      dk: (range) => `${range} में डेनमार्क या नॉर्वे पर किसका शासन था?`,
      nl: (range) => `${range} में नीदरलैंड पर किसका शासन था?`,
      li: (range) => `${range} में लिकटेंस्टाइन का राजकुमार कौन था?`,
      sz: (range) => `${range} में एस्वातीनी का राजा कौन था?`,
    },
    'वर्ष',
    'फ़ोटो',
    'पहले',
    'बाद के',
  ),
  ar: pack(
    {
      ottomanRulers: 'العثمانيون',
      japanEmperors: 'أباطرة اليابان',
      monacoPrinces: 'أمراء موناكو',
      bruneiSultans: 'سلاطين بروناي',
      hashemiteRulers: 'الهاشميون',
      alaouiteRulers: 'ملوك المغرب',
      oldenburgRulers: 'ملوك الدنمارك والنرويج',
      orangeRulers: 'حكام هولندا',
      liechtensteinPrinces: 'أمراء ليختنشتاين',
      dlaminiRulers: 'ملوك إسواتيني',
    },
    {
      ott: (range) => `من كان السلطان في ${range}؟`,
      jp: (range) => `من كان إمبراطور اليابان في ${range}؟`,
      mc: (range) => `من حكم موناكو في ${range}؟`,
      bn: (range) => `من كان سلطان بروناي في ${range}؟`,
      jo: (range) => `أي هاشمي حكم في ${range}؟`,
      ma: (range) => `من حكم المغرب في ${range}؟`,
      dk: (range) => `من حكم الدنمارك أو النرويج في ${range}؟`,
      nl: (range) => `من حكم هولندا في ${range}؟`,
      li: (range) => `من كان أمير ليختنشتاين في ${range}؟`,
      sz: (range) => `من كان ملك إسواتيني في ${range}؟`,
    },
    'السنوات',
    'صورة',
    'الأوائل',
    'الأواخر',
  ),
  bn: pack(
    {
      ottomanRulers: 'উসমানীয়',
      japanEmperors: 'জাপানের সম্রাট',
      monacoPrinces: 'মোনাকোর রাজপুত্র',
      bruneiSultans: 'ব্রুনাইয়ের সুলতান',
      hashemiteRulers: 'হাশিমি',
      alaouiteRulers: 'মরক্কোর রাজা',
      oldenburgRulers: 'ডেনমার্ক ও নরওয়ের রাজা',
      orangeRulers: 'নেদারল্যান্ডসের শাসক',
      liechtensteinPrinces: 'লিশটেনস্টাইনের রাজপুত্র',
      dlaminiRulers: 'এসওয়াতিনির রাজা',
    },
    {
      ott: (range) => `${range}-এ সুলতান কে ছিলেন?`,
      jp: (range) => `${range}-এ জাপানের সম্রাট কে ছিলেন?`,
      mc: (range) => `${range}-এ মোনাকো শাসন করতেন কে?`,
      bn: (range) => `${range}-এ ব্রুনাইয়ের সুলতান কে ছিলেন?`,
      jo: (range) => `${range}-এ কোন হাশিমি শাসন করতেন?`,
      ma: (range) => `${range}-এ মরক্কো শাসন করতেন কে?`,
      dk: (range) => `${range}-এ ডেনমার্ক বা নরওয়ে শাসন করতেন কে?`,
      nl: (range) => `${range}-এ নেদারল্যান্ডস শাসন করতেন কে?`,
      li: (range) => `${range}-এ লিশটেনস্টাইনের রাজপুত্র কে ছিলেন?`,
      sz: (range) => `${range}-এ এসওয়াতিনির রাজা কে ছিলেন?`,
    },
    'বছর',
    'ছবি',
    'আগের',
    'পরের',
  ),
  pt: pack(
    {
      ottomanRulers: 'Otomanos',
      japanEmperors: 'Imperadores do Japão',
      monacoPrinces: 'Príncipes do Mónaco',
      bruneiSultans: 'Sultões do Brunei',
      hashemiteRulers: 'Haxemitas',
      alaouiteRulers: 'Reis de Marrocos',
      oldenburgRulers: 'Reis da Dinamarca e da Noruega',
      orangeRulers: 'Monarcas dos Países Baixos',
      liechtensteinPrinces: 'Príncipes do Listenstaine',
      dlaminiRulers: 'Reis de Essuatíni',
    },
    {
      ott: (range) => `Quem foi sultão em ${range}?`,
      jp: (range) => `Quem foi imperador do Japão em ${range}?`,
      mc: (range) => `Quem governou o Mónaco em ${range}?`,
      bn: (range) => `Quem foi sultão do Brunei em ${range}?`,
      jo: (range) => `Que haxemita governou em ${range}?`,
      ma: (range) => `Quem governou Marrocos em ${range}?`,
      dk: (range) => `Quem governou a Dinamarca ou a Noruega em ${range}?`,
      nl: (range) => `Quem governou os Países Baixos em ${range}?`,
      li: (range) => `Quem foi príncipe do Listenstaine em ${range}?`,
      sz: (range) => `Quem foi rei de Essuatíni em ${range}?`,
    },
    'anos',
    'foto',
    'Primeiros',
    'Últimos',
  ),
  ja: pack(
    {
      ottomanRulers: 'オスマン',
      japanEmperors: '日本の天皇',
      monacoPrinces: 'モナコ公',
      bruneiSultans: 'ブルネイのスルタン',
      hashemiteRulers: 'ハーシム家',
      alaouiteRulers: 'モロッコの王',
      oldenburgRulers: 'デンマークとノルウェーの王',
      orangeRulers: 'オランダの君主',
      liechtensteinPrinces: 'リヒテンシュタイン侯',
      dlaminiRulers: 'エスワティニの王',
    },
    {
      ott: (range) => `${range} のスルタンは？`,
      jp: (range) => `${range} の日本の天皇は？`,
      mc: (range) => `${range} のモナコの君主は？`,
      bn: (range) => `${range} のブルネイのスルタンは？`,
      jo: (range) => `${range} のハーシム家の君主は？`,
      ma: (range) => `${range} のモロッコの君主は？`,
      dk: (range) => `${range} のデンマークかノルウェーの王は？`,
      nl: (range) => `${range} のオランダの君主は？`,
      li: (range) => `${range} のリヒテンシュタイン侯は？`,
      sz: (range) => `${range} のエスワティニの王は？`,
    },
    '年',
    '写真',
    '前半',
    '後半',
  ),
  he: pack(
    {
      ottomanRulers: 'העות׳מאנים',
      japanEmperors: 'קיסרי יפן',
      monacoPrinces: 'נסיכי מונקו',
      bruneiSultans: 'סולטאני ברוניי',
      hashemiteRulers: 'ההאשמים',
      alaouiteRulers: 'מלכי מרוקו',
      oldenburgRulers: 'מלכי דנמרק ונורווגיה',
      orangeRulers: 'שליטי הולנד',
      liechtensteinPrinces: 'נסיכי ליכטנשטיין',
      dlaminiRulers: 'מלכי אסוואטיני',
    },
    {
      ott: (range) => `מי היה הסולטאן ב-${range}?`,
      jp: (range) => `מי היה קיסר יפן ב-${range}?`,
      mc: (range) => `מי שלט במונקו ב-${range}?`,
      bn: (range) => `מי היה סולטאן ברוניי ב-${range}?`,
      jo: (range) => `איזה האשמי שלט ב-${range}?`,
      ma: (range) => `מי שלט במרוקו ב-${range}?`,
      dk: (range) => `מי שלט בדנמרק או בנורווגיה ב-${range}?`,
      nl: (range) => `מי שלט בהולנד ב-${range}?`,
      li: (range) => `מי היה נסיך ליכטנשטיין ב-${range}?`,
      sz: (range) => `מי היה מלך אסוואטיני ב-${range}?`,
    },
    'שנים',
    'תמונה',
    'מוקדמים',
    'מאוחרים',
  ),
}
