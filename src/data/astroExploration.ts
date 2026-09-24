import { t11, type L11 } from './math'

export type AstroCatalogTier = 'easy' | 'medium' | 'hard'

export interface AstroCatalogEntry {
  id: string
  name: L11
  tier: AstroCatalogTier
  facts: L11[]
  target?: L11
}

const l = t11

export const DEEP_SKY_OBJECTS: AstroCatalogEntry[] = [
  {
    id: 'andromeda-galaxy',
    name: l('Галактика Андромеды', 'Andromeda Galaxy', 'Andromedagalaxie', '仙女座星系', 'Galaxia de Andrómeda', 'एंड्रोमेडा आकाशगंगा', 'مجرة أندروميدا', 'অ্যান্ড্রোমিডা ছায়াপথ', 'Galáxia de Andrômeda', 'アンドロメダ銀河', 'גלקסיית אנדרומדה'),
    tier: 'easy',
    facts: [l('M31; ближайшая крупная галактика к Млечному Пути.', 'M31; nearest large galaxy to the Milky Way.', 'M31; nächste große Galaxie der Milchstraße.', 'M31；距银河系最近的大星系。', 'M31; la gran galaxia más cercana a la Vía Láctea.', 'M31; आकाशगंगा की निकटतम बड़ी गैलेक्सी।', 'M31؛ أقرب مجرة كبيرة إلى درب التبانة.', 'M31; আকাশগঙ্গার নিকটতম বড় ছায়াপথ।', 'M31; a grande galáxia mais próxima da Via Láctea.', 'M31。天の川に最も近い大銀河。', 'M31; הגלקסיה הגדולה הקרובה לשביל החלב.')],
  },
  {
    id: 'orion-nebula',
    name: l('Туманность Ориона', 'Orion Nebula', 'Orionnebel', '猎户座大星云', 'Nebulosa de Orión', 'ओरायन नीहारिका', 'سديم الجبار', 'ওরায়ন নীহারিকা', 'Nebulosa de Órion', 'オリオン大星雲', 'ערפילית אוריון'),
    tier: 'easy',
    facts: [l('M42; яркая область рождения звёзд в Мече Ориона.', 'M42; bright stellar nursery in Orion’s Sword.', 'M42; helle Sternentstehungsregion im Schwert des Orion.', 'M42；猎户座“剑”中的恒星诞生区。', 'M42; vivero estelar en la Espada de Orión.', 'M42; ओरायन की तलवार में तारा-निर्माण क्षेत्र।', 'M42؛ منطقة ولادة نجوم في سيف الجبار.', 'M42; ওরায়নের তরবারিতে নক্ষত্র-জন্ম অঞ্চল।', 'M42; berçário estelar na Espada de Órion.', 'M42。オリオンの剣にある星形成領域。', 'M42; אזור יצירת כוכבים בחרב אוריון.')],
  },
  {
    id: 'crab-nebula',
    name: l('Крабовидная туманность', 'Crab Nebula', 'Krebsnebel', '蟹状星云', 'Nebulosa del Cangrejo', 'क्रैब नीहारिका', 'سديم السرطان', 'ক্র্যাব নীহারিকা', 'Nebulosa do Caranguejo', 'かに星雲', 'ערפילית הסרטן'),
    tier: 'easy',
    facts: [l('M1; остаток сверхновой, замеченной в 1054 году.', 'M1; remnant of the supernova seen in 1054.', 'M1; Überrest der 1054 beobachteten Supernova.', 'M1；1054 年超新星的遗迹。', 'M1; resto de la supernova observada en 1054.', 'M1; 1054 में देखे गए सुपरनोवा का अवशेष।', 'M1؛ بقايا المستعر الأعظم المرصود عام 1054.', 'M1; ১০৫৪ সালের সুপারনোভার অবশেষ।', 'M1; resto da supernova observada em 1054.', 'M1。1054年に観測された超新星の残骸。', 'M1; שריד הסופרנובה שנצפתה ב־1054.')],
  },
  {
    id: 'pleiades',
    name: l('Плеяды', 'Pleiades', 'Plejaden', '昴星团', 'Pléyades', 'कृत्तिका', 'الثريا', 'কৃত্তিকা', 'Plêiades', 'プレアデス星団', 'הפליאדות'),
    tier: 'easy',
    facts: [l('M45; молодое рассеянное скопление «Семь сестёр».', 'M45; young open cluster called the Seven Sisters.', 'M45; junger offener Haufen, die Sieben Schwestern.', 'M45；年轻疏散星团“七姐妹”。', 'M45; cúmulo abierto joven, las Siete Hermanas.', 'M45; युवा खुला तारागुच्छ, सात बहनें।', 'M45؛ عنقود مفتوح فتي يُسمى الشقيقات السبع.', 'M45; তরুণ উন্মুক্ত তারাগুচ্ছ, সাত বোন।', 'M45; jovem enxame aberto, as Sete Irmãs.', 'M45。若い散開星団「すばる」。', 'M45; צביר פתוח צעיר, שבע האחיות.')],
  },
  {
    id: 'whirlpool',
    name: l('Галактика Водоворот', 'Whirlpool Galaxy', 'Whirlpool-Galaxie', '涡状星系', 'Galaxia del Remolino', 'व्हर्लपूल आकाशगंगा', 'مجرة الدوامة', 'ঘূর্ণি ছায়াপথ', 'Galáxia do Rodamoinho', '子持ち銀河', 'גלקסיית המערבולת'),
    tier: 'medium',
    facts: [l('M51; спиральная галактика, взаимодействующая с меньшим соседом.', 'M51; spiral galaxy interacting with a smaller companion.', 'M51; Spiralgalaxie mit kleiner Begleitgalaxie.', 'M51；与较小伴星系相互作用的旋涡星系。', 'M51; espiral que interactúa con una compañera menor.', 'M51; छोटी साथी गैलेक्सी से जुड़ी सर्पिल गैलेक्सी।', 'M51؛ مجرة حلزونية تتفاعل مع رفيقة أصغر.', 'M51; ছোট সঙ্গীর সঙ্গে মিথস্ক্রিয় সর্পিল ছায়াপথ।', 'M51; espiral que interage com uma companheira menor.', 'M51。小さな伴銀河と相互作用する渦巻銀河。', 'M51; גלקסיה ספירלית המקיימת אינטראקציה עם בת־לוויה קטנה.')],
  },
  {
    id: 'sombrero',
    name: l('Галактика Сомбреро', 'Sombrero Galaxy', 'Sombrerogalaxie', '草帽星系', 'Galaxia del Sombrero', 'सोम्ब्रेरो आकाशगंगा', 'مجرة سومبريرو', 'সোমব্রেরো ছায়াপথ', 'Galáxia do Sombrero', 'ソンブレロ銀河', 'גלקסיית הסומבררו'),
    tier: 'medium',
    facts: [l('M104; яркое ядро и заметная тёмная полоса пыли.', 'M104; bright core crossed by a dark dust lane.', 'M104; heller Kern mit dunklem Staubband.', 'M104；明亮核心横穿暗尘带。', 'M104; núcleo brillante cruzado por polvo oscuro.', 'M104; चमकीला केंद्र और गहरी धूल पट्टी।', 'M104؛ نواة ساطعة يشقها حزام غبار داكن.', 'M104; উজ্জ্বল কেন্দ্র ও গাঢ় ধূলির রেখা।', 'M104; núcleo brilhante cortado por poeira escura.', 'M104。明るい核を暗いダストレーンが横切る。', 'M104; ליבה בהירה ופס אבק כהה.')],
  },
  {
    id: 'omega-centauri',
    name: l('Омега Центавра', 'Omega Centauri', 'Omega Centauri', '半人马座欧米伽', 'Omega Centauri', 'ओमेगा सेंटॉरी', 'أوميغا قنطورس', 'ওমেগা সেন্টরি', 'Omega Centauri', 'オメガ星団', 'אומגה קנטאורי'),
    tier: 'medium',
    facts: [l('Крупнейшее шаровое скопление Млечного Пути.', 'Largest globular cluster in the Milky Way.', 'Größter Kugelsternhaufen der Milchstraße.', '银河系最大的球状星团。', 'El mayor cúmulo globular de la Vía Láctea.', 'आकाशगंगा का सबसे बड़ा गोलाकार तारागुच्छ।', 'أكبر عنقود كروي في درب التبانة.', 'আকাশগঙ্গার বৃহত্তম গোলাকার তারাগুচ্ছ।', 'Maior enxame globular da Via Láctea.', '天の川最大の球状星団。', 'הצביר הכדורי הגדול בשביל החלב.')],
  },
  {
    id: 'sagittarius-a',
    name: l('Стрелец A*', 'Sagittarius A*', 'Sagittarius A*', '人马座 A*', 'Sagitario A*', 'सैजिटेरियस A*', 'الرامي A*', 'স্যাজিটারিয়াস A*', 'Sagitário A*', 'いて座A*', 'קשת A*'),
    tier: 'medium',
    facts: [l('Сверхмассивная чёрная дыра в центре Млечного Пути.', 'Supermassive black hole at the Milky Way’s center.', 'Supermassereiches Schwarzes Loch im Zentrum der Milchstraße.', '银河系中心的超大质量黑洞。', 'Agujero negro supermasivo del centro de la Vía Láctea.', 'आकाशगंगा के केंद्र का महाविशाल ब्लैक होल।', 'ثقب أسود فائق الكتلة في مركز درب التبانة.', 'আকাশগঙ্গার কেন্দ্রে অতিভারী কৃষ্ণগহ্বর।', 'Buraco negro supermassivo no centro da Via Láctea.', '天の川中心の超大質量ブラックホール。', 'חור שחור על־מסיבי במרכז שביל החלב.')],
  },
]

export const SPACE_MISSIONS: AstroCatalogEntry[] = [
  {
    id: 'apollo-11',
    name: l('Аполлон-11', 'Apollo 11', 'Apollo 11', '阿波罗 11 号', 'Apolo 11', 'अपोलो 11', 'أبولو 11', 'অ্যাপোলো ১১', 'Apollo 11', 'アポロ11号', 'אפולו 11'),
    target: l('Луна', 'Moon', 'Mond', '月球', 'Luna', 'चंद्रमा', 'القمر', 'চাঁদ', 'Lua', '月', 'הירח'),
    tier: 'easy',
    facts: [l('Первая высадка людей, 1969 год.', 'First crewed landing, 1969.', 'Erste bemannte Landung, 1969.', '1969 年首次载人登月。', 'Primer alunizaje tripulado, 1969.', 'पहली मानव लैंडिंग, 1969।', 'أول هبوط مأهول، 1969.', 'প্রথম মানুষসহ অবতরণ, ১৯৬৯।', 'Primeira alunagem tripulada, 1969.', '初の有人月面着陸、1969年。', 'הנחיתה המאוישת הראשונה, 1969.')],
  },
  {
    id: 'voyager-1',
    name: l('Вояджер-1', 'Voyager 1', 'Voyager 1', '旅行者 1 号', 'Voyager 1', 'वॉयेजर 1', 'فوياجر 1', 'ভয়েজার ১', 'Voyager 1', 'ボイジャー1号', 'וויאג׳ר 1'),
    target: l('Юпитер, Сатурн и межзвёздное пространство', 'Jupiter, Saturn, and interstellar space', 'Jupiter, Saturn und interstellarer Raum', '木星、土星与星际空间', 'Júpiter, Saturno y espacio interestelar', 'बृहस्पति, शनि और अंतरतारकीय अंतरिक्ष', 'المشتري وزحل والفضاء بين النجوم', 'বৃহস্পতি, শনি ও আন্তঃনাক্ষত্রিক মহাকাশ', 'Júpiter, Saturno e espaço interestelar', '木星・土星・星間空間', 'צדק, שבתאי והחלל הבין־כוכבי'),
    tier: 'easy',
    facts: [l('Запущен в 1977 году; самый далёкий аппарат человечества.', 'Launched in 1977; humanity’s most distant spacecraft.', '1977 gestartet; fernstes Raumfahrzeug der Menschheit.', '1977 年发射；飞得最远的人造航天器。', 'Lanzada en 1977; la nave humana más distante.', '1977 में प्रक्षेपित; मानवता का सबसे दूर यान।', 'أُطلق عام 1977؛ أبعد مركبة بشرية.', '১৯৭৭ সালে উৎক্ষেপিত; মানুষের সবচেয়ে দূরের যান।', 'Lançada em 1977; a nave humana mais distante.', '1977年打上げ。人類最遠の探査機。', 'שוגרה ב־1977; החללית הרחוקה ביותר של האנושות.')],
  },
  {
    id: 'curiosity',
    name: l('Кьюриосити', 'Curiosity', 'Curiosity', '好奇号', 'Curiosity', 'क्यूरियोसिटी', 'كيوريوسيتي', 'কিউরিওসিটি', 'Curiosity', 'キュリオシティ', 'קיוריוסיטי'),
    target: l('Марс', 'Mars', 'Mars', '火星', 'Marte', 'मंगल', 'المريخ', 'মঙ্গল', 'Marte', '火星', 'מאדים'),
    tier: 'easy',
    facts: [l('Марсоход исследует кратер Гейла с 2012 года.', 'Rover exploring Gale Crater since 2012.', 'Rover erforscht seit 2012 den Gale-Krater.', '自 2012 年探索盖尔陨石坑的火星车。', 'Róver que explora el cráter Gale desde 2012.', '2012 से गेल क्रेटर खोजता रोवर।', 'جوال يستكشف فوهة غيل منذ 2012.', '২০১২ থেকে গেইল গহ্বর অন্বেষণকারী রোভার।', 'Rover que explora a cratera Gale desde 2012.', '2012年からゲール・クレーターを探査するローバー。', 'רובר החוקר את מכתש גייל מאז 2012.')],
  },
  {
    id: 'cassini-huygens',
    name: l('Кассини — Гюйгенс', 'Cassini–Huygens', 'Cassini–Huygens', '卡西尼-惠更斯', 'Cassini-Huygens', 'कैसिनी-ह्यूजेंस', 'كاسيني-هويغنز', 'ক্যাসিনি-হাইগেন্স', 'Cassini-Huygens', 'カッシーニ・ホイヘンス', 'קאסיני-הויגנס'),
    target: l('Сатурн и Титан', 'Saturn and Titan', 'Saturn und Titan', '土星与土卫六', 'Saturno y Titán', 'शनि और टाइटन', 'زحل وتيتان', 'শনি ও টাইটান', 'Saturno e Titã', '土星とタイタン', 'שבתאי וטיטאן'),
    tier: 'easy',
    facts: [l('Орбитер Сатурна и первая посадка во внешней Солнечной системе.', 'Saturn orbiter and first landing in the outer Solar System.', 'Saturnorbiter und erste Landung im äußeren Sonnensystem.', '土星轨道器，并首次着陆外太阳系。', 'Orbitador de Saturno y primer aterrizaje en el sistema exterior.', 'शनि ऑर्बिटर और बाहरी सौर मंडल में पहली लैंडिंग।', 'مسبار زحل وأول هبوط في النظام الشمسي الخارجي.', 'শনি অরবিটার ও বাইরের সৌরজগতে প্রথম অবতরণ।', 'Orbitador de Saturno e primeira aterragem no Sistema Solar exterior.', '土星周回機と外惑星圏初の着陸。', 'מקפת שבתאי והנחיתה הראשונה במערכת השמש החיצונית.')],
  },
  {
    id: 'rosetta',
    name: l('Розетта', 'Rosetta', 'Rosetta', '罗塞塔号', 'Rosetta', 'रोसेटा', 'روزيتا', 'রোসেটা', 'Rosetta', 'ロゼッタ', 'רוזטה'),
    target: l('Комета 67P', 'Comet 67P', 'Komet 67P', '67P 彗星', 'Cometa 67P', 'धूमकेतु 67P', 'المذنب 67P', 'ধূমকেতু 67P', 'Cometa 67P', 'チュリュモフ・ゲラシメンコ彗星', 'השביט 67P'),
    tier: 'medium',
    facts: [l('Доставила модуль «Филы» на ядро кометы.', 'Delivered the Philae lander to a comet nucleus.', 'Brachte den Lander Philae auf einen Kometenkern.', '将“菲莱”着陆器送上彗核。', 'Llevó el módulo Philae al núcleo de un cometa.', 'फिलाए लैंडर को धूमकेतु के केंद्र तक पहुँचाया।', 'أوصلت مركبة فيلة إلى نواة مذنب.', 'ফিলে ল্যান্ডারকে ধূমকেতুর কেন্দ্রে পৌঁছায়।', 'Levou o módulo Philae ao núcleo de um cometa.', '着陸機フィラエを彗星核へ届けた。', 'הביאה את הנחתת פילאה לגרעין שביט.')],
  },
  {
    id: 'new-horizons',
    name: l('Новые горизонты', 'New Horizons', 'New Horizons', '新视野号', 'New Horizons', 'न्यू होराइजन्स', 'نيو هورايزونز', 'নিউ হরাইজনস', 'New Horizons', 'ニュー・ホライズンズ', 'ניו הורייזונס'),
    target: l('Плутон и пояс Койпера', 'Pluto and the Kuiper Belt', 'Pluto und Kuipergürtel', '冥王星与柯伊伯带', 'Plutón y el cinturón de Kuiper', 'प्लूटो और काइपर बेल्ट', 'بلوتو وحزام كايبر', 'প্লুটো ও কাইপার বেল্ট', 'Plutão e cintura de Kuiper', '冥王星とカイパーベルト', 'פלוטו וחגורת קויפר'),
    tier: 'medium',
    facts: [l('В 2015 году впервые пролетела рядом с Плутоном.', 'Made the first Pluto flyby in 2015.', 'Flog 2015 erstmals an Pluto vorbei.', '2015 年首次飞掠冥王星。', 'Primer sobrevuelo de Plutón en 2015.', '2015 में प्लूटो का पहला फ्लाईबाय।', 'أول تحليق قرب بلوتو عام 2015.', '২০১৫ সালে প্লুটোর প্রথম ফ্লাইবাই।', 'Primeiro sobrevoo de Plutão em 2015.', '2015年に初の冥王星フライバイ。', 'ביצעה את היעף הראשון ליד פלוטו ב־2015.')],
  },
  {
    id: 'hayabusa2',
    name: l('Хаябуса-2', 'Hayabusa2', 'Hayabusa2', '隼鸟 2 号', 'Hayabusa2', 'हायाबुसा2', 'هايابوسا 2', 'হায়াবুসা২', 'Hayabusa2', 'はやぶさ2', 'היאבוסה 2'),
    target: l('Астероид Рюгу', 'Asteroid Ryugu', 'Asteroid Ryugu', '小行星龙宫', 'Asteroide Ryugu', 'क्षुद्रग्रह रयुगु', 'الكويكب ريوغو', 'গ্রহাণু রিউগু', 'Asteroide Ryugu', '小惑星リュウグウ', 'האסטרואיד ריוגו'),
    tier: 'medium',
    facts: [l('Вернула на Землю образцы астероида в 2020 году.', 'Returned asteroid samples to Earth in 2020.', 'Brachte 2020 Asteroidenproben zur Erde.', '2020 年将小行星样本送回地球。', 'Trajo muestras de asteroide a la Tierra en 2020.', '2020 में क्षुद्रग्रह नमूने पृथ्वी पर लाई।', 'أعادت عينات كويكب إلى الأرض عام 2020.', '২০২০ সালে গ্রহাণুর নমুনা পৃথিবীতে আনে।', 'Trouxe amostras de asteroide à Terra em 2020.', '2020年に小惑星試料を地球へ持ち帰った。', 'החזירה דגימות אסטרואיד לכדור הארץ ב־2020.')],
  },
  {
    id: 'parker',
    name: l('Солнечный зонд Паркер', 'Parker Solar Probe', 'Parker Solar Probe', '帕克太阳探测器', 'Sonda Solar Parker', 'पार्कर सोलर प्रोब', 'مسبار باركر الشمسي', 'পার্কার সোলার প্রোব', 'Sonda Solar Parker', 'パーカー・ソーラー・プローブ', 'גשושית השמש פארקר'),
    target: l('Солнце', 'Sun', 'Sonne', '太阳', 'Sol', 'सूर्य', 'الشمس', 'সূর্য', 'Sol', '太陽', 'השמש'),
    tier: 'medium',
    facts: [l('Ближе всех аппаратов подошёл к Солнцу и вошёл в корону.', 'Came closest to the Sun and entered its corona.', 'Kam der Sonne am nächsten und trat in die Korona ein.', '最接近太阳并进入日冕的探测器。', 'La nave que más se acercó al Sol y entró en su corona.', 'सूर्य के सबसे पास पहुँचा और कोरोना में प्रवेश किया।', 'اقترب من الشمس أكثر من أي مركبة ودخل هالتها.', 'সূর্যের সবচেয়ে কাছে গিয়ে করোনা প্রবেশ করেছে।', 'Chegou mais perto do Sol e entrou na coroa.', '太陽へ最接近しコロナへ入った探査機。', 'התקרבה לשמש יותר מכל חללית ונכנסה לעטרה.')],
  },
]

export const SPACE_TELESCOPES: AstroCatalogEntry[] = [
  {
    id: 'hubble',
    name: l('Хаббл', 'Hubble', 'Hubble', '哈勃', 'Hubble', 'हबल', 'هابل', 'হাবল', 'Hubble', 'ハッブル', 'האבל'),
    tier: 'easy',
    facts: [l('Космический телескоп на низкой околоземной орбите с 1990 года.', 'Space telescope in low Earth orbit since 1990.', 'Weltraumteleskop seit 1990 im niedrigen Erdorbit.', '自 1990 年运行于近地轨道的空间望远镜。', 'Telescopio espacial en órbita baja desde 1990.', '1990 से निम्न पृथ्वी कक्षा में अंतरिक्ष दूरबीन।', 'تلسكوب فضائي في مدار أرضي منخفض منذ 1990.', '১৯৯০ থেকে নিম্ন পৃথিবী কক্ষপথে মহাকাশ দূরবীন।', 'Telescópio espacial em órbita baixa desde 1990.', '1990年から地球低軌道で運用する宇宙望遠鏡。', 'טלסקופ חלל במסלול נמוך מאז 1990.')],
  },
  {
    id: 'jwst',
    name: l('Джеймс Уэбб', 'James Webb', 'James Webb', '詹姆斯·韦布', 'James Webb', 'जेम्स वेब', 'جيمس ويب', 'জেমস ওয়েব', 'James Webb', 'ジェイムズ・ウェッブ', 'ג׳יימס וב'),
    tier: 'easy',
    facts: [l('Инфракрасная обсерватория у точки L2 с зеркалом 6,5 м.', 'Infrared observatory at L2 with a 6.5 m mirror.', 'Infrarotobservatorium bei L2 mit 6,5-m-Spiegel.', '位于 L2、主镜 6.5 米的红外天文台。', 'Observatorio infrarrojo en L2 con espejo de 6,5 m.', 'L2 पर 6.5 मीटर दर्पण वाली अवरक्त वेधशाला।', 'مرصد بالأشعة تحت الحمراء عند L2 بمرآة 6.5 م.', 'L2-তে ৬.৫ মিটার আয়নার অবলোহিত মানমন্দির।', 'Observatório infravermelho em L2 com espelho de 6,5 m.', 'L2にある口径6.5mの赤外線天文台。', 'מצפה תת־אדום בנקודת L2 עם מראה בקוטר 6.5 מ׳.')],
  },
  {
    id: 'chandra',
    name: l('Чандра', 'Chandra', 'Chandra', '钱德拉', 'Chandra', 'चंद्रा', 'تشاندرا', 'চন্দ্রা', 'Chandra', 'チャンドラ', 'צ׳נדרה'),
    tier: 'easy',
    facts: [l('Космическая рентгеновская обсерватория NASA.', 'NASA space-based X-ray observatory.', 'Röntgen-Weltraumobservatorium der NASA.', 'NASA 空间 X 射线天文台。', 'Observatorio espacial de rayos X de la NASA.', 'NASA की अंतरिक्ष एक्स-रे वेधशाला।', 'مرصد ناسا الفضائي للأشعة السينية.', 'NASA-র মহাকাশ এক্স-রে মানমন্দির।', 'Observatório espacial de raios X da NASA.', 'NASAの宇宙X線観測衛星。', 'מצפה רנטגן חללי של נאס״א.')],
  },
  {
    id: 'kepler',
    name: l('Кеплер', 'Kepler', 'Kepler', '开普勒', 'Kepler', 'केपलर', 'كيبلر', 'কেপলার', 'Kepler', 'ケプラー', 'קפלר'),
    tier: 'easy',
    facts: [l('Искал экзопланеты по падениям блеска звёзд.', 'Found exoplanets by measuring dips in starlight.', 'Fand Exoplaneten durch Helligkeitsabfälle von Sternen.', '通过恒星亮度下降寻找系外行星。', 'Halló exoplanetas midiendo caídas de brillo estelar.', 'तारों की चमक घटने से बहिर्ग्रह खोजे।', 'اكتشف كواكب خارجية من انخفاض ضوء النجوم.', 'তারার আলো কমা মেপে বহির্গ্রহ খুঁজেছে।', 'Encontrou exoplanetas medindo quedas no brilho estelar.', '恒星の減光から系外惑星を発見。', 'גילה כוכבי לכת חוץ־שמשיים לפי ירידות באור כוכבים.')],
  },
  {
    id: 'spitzer',
    name: l('Спитцер', 'Spitzer', 'Spitzer', '斯皮策', 'Spitzer', 'स्पिट्जर', 'سبيتزر', 'স্পিটজার', 'Spitzer', 'スピッツァー', 'שפיצר'),
    tier: 'medium',
    facts: [l('Инфракрасный космический телескоп, работал в 2003–2020 годах.', 'Infrared space telescope active from 2003 to 2020.', 'Infrarot-Weltraumteleskop, aktiv 2003–2020.', '2003 至 2020 年运行的红外空间望远镜。', 'Telescopio espacial infrarrojo activo de 2003 a 2020.', '2003–2020 सक्रिय अवरक्त अंतरिक्ष दूरबीन।', 'تلسكوب فضائي بالأشعة تحت الحمراء عمل 2003–2020.', '২০০৩–২০২০ সক্রিয় অবলোহিত মহাকাশ দূরবীন।', 'Telescópio espacial infravermelho ativo de 2003 a 2020.', '2003～2020年に運用された赤外線宇宙望遠鏡。', 'טלסקופ חלל תת־אדום שפעל בשנים 2003–2020.')],
  },
  {
    id: 'gaia',
    name: l('Гайя', 'Gaia', 'Gaia', '盖亚', 'Gaia', 'गैया', 'غايا', 'গাইয়া', 'Gaia', 'ガイア', 'גאיה'),
    tier: 'medium',
    facts: [l('Составляет трёхмерную карту более миллиарда звёзд Млечного Пути.', 'Maps positions and motions of over a billion Milky Way stars.', 'Kartiert über eine Milliarde Sterne der Milchstraße.', '绘制银河系十亿多颗恒星的位置与运动。', 'Cartografía más de mil millones de estrellas de la Vía Láctea.', 'आकाशगंगा के एक अरब से अधिक तारों का मानचित्र बनाता है।', 'يرسم مواقع وحركات أكثر من مليار نجم في درب التبانة.', 'আকাশগঙ্গার এক বিলিয়নের বেশি তারার মানচিত্র বানায়।', 'Mapeia mais de mil milhões de estrelas da Via Láctea.', '天の川の10億個以上の恒星を測量。', 'ממפה יותר ממיליארד כוכבים בשביל החלב.')],
  },
  {
    id: 'alma',
    name: l('ALMA', 'ALMA', 'ALMA', '阿塔卡马大型毫米波阵列', 'ALMA', 'ALMA', 'ألما', 'ALMA', 'ALMA', 'アルマ望遠鏡', 'ALMA'),
    tier: 'medium',
    facts: [l('Решётка радиотелескопов высоко в чилийской Атакаме.', 'Radio array high in Chile’s Atacama Desert.', 'Radiointerferometer in der chilenischen Atacamawüste.', '位于智利阿塔卡马高原的射电阵列。', 'Red de radiotelescopios en el desierto de Atacama.', 'चिली के अटाकामा में ऊँचा रेडियो सरणी।', 'مصفوفة راديوية في صحراء أتاكاما التشيلية.', 'চিলির আতাকামায় উচ্চস্থ রেডিও অ্যারে।', 'Rede de radiotelescópios no Atacama chileno.', 'チリ・アタカマ高地の電波干渉計。', 'מערך רדיו גבוה במדבר אטקמה בצ׳ילה.')],
  },
  {
    id: 'fast',
    name: l('FAST', 'FAST', 'FAST', '中国天眼 FAST', 'FAST', 'FAST', 'فاست', 'FAST', 'FAST', 'FAST', 'FAST'),
    tier: 'medium',
    facts: [l('Крупнейший заполненный одноапертурный радиотелескоп, находится в Китае.', 'Largest filled-aperture single-dish radio telescope, in China.', 'Größtes gefülltes Einzelschüssel-Radioteleskop in China.', '位于中国的最大单口径射电望远镜。', 'El mayor radiotelescopio de plato único, en China.', 'चीन में सबसे बड़ा एकल-डिश रेडियो टेलीस्कोप।', 'أكبر تلسكوب راديوي أحادي الطبق في الصين.', 'চীনে বৃহত্তম একক-ডিশ রেডিও টেলিস্কোপ।', 'Maior radiotelescópio de prato único, na China.', '中国にある世界最大の単一鏡面電波望遠鏡。', 'טלסקופ הרדיו החד־צלחתי הגדול ביותר, בסין.')],
  },
]
