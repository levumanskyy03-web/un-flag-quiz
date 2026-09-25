import { isListId } from '../data/lists'
import { pickL, t11, type L11 } from '../data/math'
import { LIST_COPY } from './listCopy'
import type { Lang } from './lang'

export type CollectionCopy = {
  title: string
  lead: string
}

const EXTRA: Record<string, { title: L11; lead: L11 }> = {
  'great-clubs': {
    title: t11('Великие клубы', 'Great clubs', 'Große Klubs', '伟大俱乐部', 'Grandes clubes', 'महान क्लब', 'الأندية العظيمة', 'মহান ক্লাব', 'Grandes clubes', '名門クラブ', 'מועדונים גדולים'),
    lead: t11('Гербы клубов, которые выигрывали ЛЧ или определяли свою страну.', 'Crests of clubs that won the Champions League or defined their country.', 'Wappen der Klubs, die die Champions League gewannen oder ihr Land prägten.', '赢得欧冠或代表本国的俱乐部队徽。', 'Escudos de clubes que ganaron la Champions o marcaron su país.', 'उन क्लबों के चिह्न जिन्होंने चैंपियंस लीग जीती या अपना देश दर्शाया।', 'شعارات أندية فازت بدوري الأبطال أو صنعت بلادها.', 'ক্লাব ক্রেস্ট যারা চ্যাম্পিয়নস লিগ জিতেছে বা দেশকে চিনিয়েছে।', 'Brasões de clubes que venceram a Champions ou marcaram o seu país.', 'CL優勝や母国を象徴するクラブのエンブレム。', 'סמלי מועדונים שזכו בליגת האלופות או עיצבו את ארצם.'),
  },
  'wc-winners': {
    title: t11('Чемпионы мира', 'World Cup winners', 'Weltmeister', '世界杯冠军', 'Campeones del mundo', 'विश्व कप विजेता', 'أبطال كأس العالم', 'বিশ্বকাপ চ্যাম্পিয়ন', 'Campeões do mundo', 'ワールドカップ優勝', 'אלופי העולם'),
    lead: t11('Год финала → страна, которая подняла кубок.', 'Final year → the country that lifted the trophy.', 'Finaljahr → das Land mit dem Pokal.', '决赛年份 → 捧起奖杯的国家。', 'Año de la final → el país que alzó la copa.', 'फाइनल का वर्ष → कप उठाने वाला देश।', 'سنة النهائي → البلد الذي رفع الكأس.', 'ফাইনালের বছর → যে দেশ কাপ তুলেছে।', 'Ano da final → o país que ergueu o troféu.', '決勝の年 → カップを掲げた国。', 'שנת הגמר → המדינה שהרימה את הגביע.'),
  },
  'ucl-winners': {
    title: t11('Победители ЛЧ', 'UCL winners', 'CL-Sieger', '欧冠冠军', 'Campeones de la Champions', 'चैंपियंस लीग विजेता', 'أبطال دوري الأبطال', 'চ্যাম্পিয়নস লিগ জয়ী', 'Vencedores da Champions', 'CL優勝クラブ', 'זוכי ליגת האלופות'),
    lead: t11('Год финала → клуб-чемпион Европы.', 'Final year → the European champion club.', 'Finaljahr → der Europapokalsieger.', '决赛年份 → 欧洲冠军俱乐部。', 'Año de la final → el club campeón de Europa.', 'फाइनल का वर्ष → यूरोपीय चैंपियन क्लब।', 'سنة النهائي → النادي بطل أوروبا.', 'ফাইনালের বছর → ইউরোপের চ্যাম্পিয়ন ক্লাব।', 'Ano da final → o clube campeão da Europa.', '決勝の年 → 欧州王者のクラブ。', 'שנת הגמר → המועדון אלוף אירופה.'),
  },
  'us-presidents': {
    title: t11('Президенты США', 'US presidents', 'US-Präsidenten', '美国总统', 'Presidentes de EE. UU.', 'अमेरिकी राष्ट्रपति', 'رؤساء أمريكا', 'মার্কিন রাষ্ট্রপতি', 'Presidentes dos EUA', 'アメリカ大統領', 'נשיאי ארה״ב'),
    lead: t11('Портрет → имя президента.', 'Portrait → the president’s name.', 'Porträt → Name des Präsidenten.', '肖像 → 总统姓名。', 'Retrato → el nombre del presidente.', 'चित्र → राष्ट्रपति का नाम।', 'صورة → اسم الرئيس.', 'প্রতিকৃতি → রাষ্ট্রপতির নাম।', 'Retrato → o nome do presidente.', '肖像 → 大統領の名前。', 'דיוקן → שם הנשיא.'),
  },
  popes: {
    title: t11('Папы римские', 'Popes', 'Päpste', '教皇', 'Papas', 'पोप', 'الباباوات', 'পোপ', 'Papas', 'ローマ教皇', 'אפיפיורים'),
    lead: t11('Портрет → имя папы.', 'Portrait → the pope’s name.', 'Porträt → Name des Papstes.', '肖像 → 教皇姓名。', 'Retrato → el nombre del papa.', 'चित्र → पोप का नाम।', 'صورة → اسم البابا.', 'প্রতিকৃতি → পোপের নাম।', 'Retrato → o nome do papa.', '肖像 → 教皇の名前。', 'דיוקן → שם האפיפיור.'),
  },
  'uk-monarchs': {
    title: t11('Монархи Британии', 'British monarchs', 'Britische Monarchen', '英国君主', 'Monarcas británicos', 'ब्रिटिश राजा', 'ملوك بريطانيا', 'ব্রিটিশ রাজারা', 'Monarcas britânicos', 'イギリス君主', 'מלכי בריטניה'),
    lead: t11('Портрет → имя монарха.', 'Portrait → the monarch’s name.', 'Porträt → Name des Monarchen.', '肖像 → 君主姓名。', 'Retrato → el nombre del monarca.', 'चित्र → राजा का नाम।', 'صورة → اسم الملك.', 'প্রতিকৃতি → রাজার নাম।', 'Retrato → o nome do monarca.', '肖像 → 君主の名前。', 'דיוקן → שם המונרך.'),
  },
  'rus-leaders': {
    title: t11('Правители Руси', 'Rulers of Rus', 'Herrscher der Rus', '罗斯统治者', 'Gobernantes de la Rus', 'रूस के शासक', 'حكام روس', 'রুশ শাসক', 'Governantes da Rus', 'ルーシの支配者', 'שליטי רוס'),
    lead: t11('Портрет → имя правителя.', 'Portrait → the ruler’s name.', 'Porträt → Name des Herrschers.', '肖像 → 统治者姓名。', 'Retrato → el nombre del gobernante.', 'चित्र → शासक का नाम।', 'صورة → اسم الحاكم.', 'প্রতিকৃতি → শাসকের নাম।', 'Retrato → o nome do governante.', '肖像 → 支配者の名前。', 'דיוקן → שם השליט.'),
  },
  symbols: {
    title: t11('Математические символы', 'Math symbols', 'Mathe-Symbole', '数学符号', 'Símbolos matemáticos', 'गणित चिह्न', 'رموز الرياضيات', 'গণিতের চিহ্ন', 'Símbolos matemáticos', '数学記号', 'סמלי מתמטיקה'),
    lead: t11('Знак → что он значит.', 'A symbol → what it means.', 'Zeichen → Bedeutung.', '符号 → 含义。', 'Un símbolo → lo que significa.', 'चिह्न → उसका अर्थ।', 'رمز → معناه.', 'চিহ্ন → অর্থ।', 'Um símbolo → o que significa.', '記号 → 意味。', 'סימן → מה הוא אומר.'),
  },
  shapes: {
    title: t11('Фигуры', 'Shapes', 'Formen', '图形', 'Figuras', 'आकृतियाँ', 'أشكال', 'আকৃতি', 'Figuras', '図形', 'צורות'),
    lead: t11('Картинка фигуры → её имя.', 'A shape picture → its name.', 'Formbild → Name.', '图形 → 名称。', 'Dibujo de una figura → su nombre.', 'आकृति → उसका नाम।', 'صورة شكل → اسمه.', 'আকৃতির ছবি → নাম।', 'Desenho da figura → o nome.', '図形 → 名前。', 'ציור צורה → שמה.'),
  },
  'math-people': {
    title: t11('Люди науки', 'People of science', 'Wissenschaftler', '科学人物', 'Gente de ciencia', 'विज्ञान के लोग', 'علماء', 'বিজ্ঞানের মানুষ', 'Gente da ciência', '科学の人', 'אנשי מדע'),
    lead: t11('Портрет → имя.', 'Portrait → the name.', 'Porträt → Name.', '肖像 → 姓名。', 'Retrato → el nombre.', 'चित्र → नाम।', 'صورة → الاسم.', 'প্রতিকৃতি → নাম।', 'Retrato → o nome.', '肖像 → 名前。', 'דיוקן → השם.'),
  },
  planets: {
    title: t11('Планеты', 'Planets', 'Planeten', '行星', 'Planetas', 'ग्रह', 'الكواكب', 'গ্রহ', 'Planetas', '惑星', 'כוכבי לכת'),
    lead: t11('Планета → её место от Солнца.', 'A planet → its order from the Sun.', 'Planet → Rang von der Sonne.', '行星 → 距太阳的次序。', 'Un planeta → su orden desde el Sol.', 'ग्रह → सूर्य से क्रम।', 'كوكب → ترتيبه من الشمس.', 'গ্রহ → সূর্য থেকে ক্রম।', 'Um planeta → a ordem a partir do Sol.', '惑星 → 太陽からの順番。', 'כוכב לכת → סדר מהשמש.'),
  },
  moons: {
    title: t11('Луны', 'Moons', 'Monde', '卫星', 'Lunas', 'चंद्रमा', 'الأقمار', 'চাঁদ', 'Luas', '衛星', 'ירחים'),
    lead: t11('Спутник → какая планета.', 'A moon → which planet.', 'Mond → welcher Planet.', '卫星 → 所属行星。', 'Una luna → qué planeta.', 'चंद्रमा → कौन सा ग्रह।', 'قمر → أي كوكب.', 'চাঁদ → কোন গ্রহ।', 'Uma lua → que planeta.', '衛星 → どの惑星か。', 'ירח → איזה כוכב לכת.'),
  },
  constellations: {
    title: t11('Созвездия', 'Constellations', 'Sternbilder', '星座', 'Constelaciones', 'तारामंडल', 'الأبراج', 'তারামণ্ডল', 'Constelações', '星座', 'קבוצות כוכבים'),
    lead: t11('Подсказка → имя созвездия.', 'A clue → the constellation’s name.', 'Hinweis → Name des Sternbilds.', '提示 → 星座名称。', 'Una pista → el nombre de la constelación.', 'संकेत → तारामंडल का नाम।', 'تلميح → اسم الكوكبة.', 'ইঙ্গিত → তারামণ্ডলের নাম।', 'Uma pista → o nome da constelação.', '手がかり → 星座名。', 'רמז → שם קבוצת הכוכבים.'),
  },
  'deep-sky': {
    title: t11('Глубокий космос', 'Deep sky', 'Deep Sky', '深空天体', 'Cielo profundo', 'गहन अंतरिक्ष', 'السماء العميقة', 'গভীর মহাকাশ', 'Céu profundo', '深宇宙', 'שמיים עמוקים'),
    lead: t11('Факты → галактика, туманность или скопление.', 'Facts → a galaxy, nebula, or cluster.', 'Fakten → Galaxie, Nebel oder Sternhaufen.', '事实 → 星系、星云或星团。', 'Hechos → una galaxia, nebulosa o cúmulo.', 'तथ्य → आकाशगंगा, नीहारिका या तारागुच्छ।', 'حقائق → مجرة أو سديم أو عنقود.', 'তথ্য → ছায়াপথ, নীহারিকা বা তারাগুচ্ছ।', 'Factos → galáxia, nebulosa ou enxame.', '事実 → 銀河・星雲・星団。', 'עובדות → גלקסיה, ערפילית או צביר.'),
  },
  'space-missions': {
    title: t11('Космические миссии', 'Space missions', 'Weltraummissionen', '太空任务', 'Misiones espaciales', 'अंतरिक्ष मिशन', 'مهمات فضائية', 'মহাকাশ মিশন', 'Missões espaciais', '宇宙ミッション', 'משימות חלל'),
    lead: t11('Факты → название космической миссии.', 'Facts → the space mission’s name.', 'Fakten → Name der Weltraummission.', '事实 → 太空任务名称。', 'Hechos → el nombre de la misión espacial.', 'तथ्य → अंतरिक्ष मिशन का नाम।', 'حقائق → اسم المهمة الفضائية.', 'তথ্য → মহাকাশ মিশনের নাম।', 'Factos → o nome da missão espacial.', '事実 → 宇宙ミッション名。', 'עובדות → שם משימת החלל.'),
  },
  organelles: {
    title: t11('Органеллы', 'Organelles', 'Organellen', '细胞器', 'Orgánulos', 'अंगक', 'العضيات', 'অঙ্গাণু', 'Organelos', '細胞小器官', 'אברונים'),
    lead: t11('Часть клетки → её роль.', 'A cell part → its role.', 'Zellteil → seine Rolle.', '细胞器 → 功能。', 'Una parte de la célula → su papel.', 'कोशिका भाग → उसकी भूमिका।', 'جزء من الخلية → دوره.', 'কোষের অংশ → ভূমিকা।', 'Uma parte da célula → o seu papel.', '細胞の部位 → 役割。', 'חלק בתא → תפקידו.'),
  },
  organs: {
    title: t11('Органы', 'Organs', 'Organe', '器官', 'Órganos', 'अंग', 'الأعضاء', 'অঙ্গ', 'Órgãos', '器官', 'איברים'),
    lead: t11('Орган → система тела.', 'An organ → the body system.', 'Organ → Körpersystem.', '器官 → 系统。', 'Un órgano → el sistema del cuerpo.', 'अंग → शरीर तंत्र।', 'عضو → جهاز الجسم.', 'অঙ্গ → দেহতন্ত্র।', 'Um órgão → o sistema do corpo.', '器官 → 器官系。', 'איבר → מערכת הגוף.'),
  },
  kingdoms: {
    title: t11('Царства жизни', 'Kingdoms of life', 'Reiche des Lebens', '生物界', 'Reinos de la vida', 'जीवन के जगत', 'ممالك الحياة', 'জীবনের রাজ্য', 'Reinos da vida', '生物の界', 'ממלכות החיים'),
    lead: t11('Царство → пример организма.', 'A kingdom → an example organism.', 'Reich → Beispielorganismus.', '界 → 示例生物。', 'Un reino → un organismo de ejemplo.', 'जगत → उदाहरण जीव।', 'مملكة → كائن مثال.', 'রাজ্য → উদাহরণ জীব।', 'Um reino → um organismo exemplo.', '界 → 例の生物。', 'ממלכה → אורגניזם לדוגמה.'),
  },
  hosts: {
    title: t11('Города Олимпиад', 'Olympic host cities', 'Olympische Gastgeber', '奥运主办城市', 'Sedes olímpicas', 'ओलंपिक मेज़बान', 'مدن الأولمبياد', 'অলিম্পিক আয়োজক', 'Cidades olímpicas', '五輪開催都市', 'ערי אולימפיאדה'),
    lead: t11('Год Игр → город-хозяин.', 'Games year → the host city.', 'Olympiajahr → Gastgeberstadt.', '奥运年份 → 主办城市。', 'Año de los Juegos → la ciudad sede.', 'खेलों का वर्ष → मेज़बान शहर।', 'سنة الألعاب → المدينة المضيفة.', 'গেমসের বছর → আয়োজক শহর।', 'Ano dos Jogos → a cidade anfitriã.', '大会の年 → 開催都市。', 'שנת המשחקים → עיר המארחת.'),
  },
  sports: {
    title: t11('Олимпийские виды', 'Olympic sports', 'Olympische Sportarten', '奥运项目', 'Deportes olímpicos', 'ओलंपिक खेल', 'رياضات أولمبية', 'অলিম্পিক খেলা', 'Desportos olímpicos', '五輪競技', 'ענפי אולימפיאדה'),
    lead: t11('Вид спорта → категория.', 'A sport → its category.', 'Sportart → Kategorie.', '项目 → 类别。', 'Un deporte → su categoría.', 'खेल → उसकी श्रेणी।', 'رياضة → فئتها.', 'খেলা → বিভাগ।', 'Um desporto → a sua categoria.', '競技 → カテゴリー。', 'ענף → הקטגוריה.'),
  },
  nocs: {
    title: t11('Коды НОК', 'NOC codes', 'NOK-Kürzel', '国家奥委会代码', 'Códigos CON', 'एनओसी कोड', 'رموز اللجان', 'এনওসি কোড', 'Códigos CON', 'NOCコード', 'קודי NOC'),
    lead: t11('Код комитета → страна.', 'A committee code → the country.', 'Kürzel → Land.', '代码 → 国家。', 'Un código → el país.', 'कोड → देश।', 'رمز → البلد.', 'কোড → দেশ।', 'Um código → o país.', 'コード → 国。', 'קוד → המדינה.'),
  },
  hackers: {
    title: t11('Люди информатики', 'CS people', 'Informatik-Köpfe', '计算机人物', 'Gente de informática', 'सीएस लोग', 'شخصيات الحاسوب', 'সিএস মানুষ', 'Gente da informática', '情報の人', 'אנשי מחשבים'),
    lead: t11('Портрет → имя.', 'Portrait → the name.', 'Porträt → Name.', '肖像 → 姓名。', 'Retrato → el nombre.', 'चित्र → नाम।', 'صورة → الاسم.', 'প্রতিকৃতি → নাম।', 'Retrato → o nome.', '肖像 → 名前。', 'דיוקן → השם.'),
  },
  terms: {
    title: t11('Термины информатики', 'CS terms', 'Informatik-Begriffe', '计算机术语', 'Términos de informática', 'सीएस शब्द', 'مصطلحات الحاسوب', 'সিএস শব্দ', 'Termos de informática', '情報の用語', 'מונחי מחשבים'),
    lead: t11('Термин → смысл.', 'A term → its meaning.', 'Begriff → Bedeutung.', '术语 → 含义。', 'Un término → su significado.', 'शब्द → अर्थ।', 'مصطلح → معناه.', 'শব্দ → অর্থ।', 'Um termo → o significado.', '用語 → 意味。', 'מונח → משמעותו.'),
  },
  dishes: {
    title: t11('Блюда', 'Dishes', 'Gerichte', '菜肴', 'Platos', 'व्यंजन', 'أطباق', 'খাবার', 'Pratos', '料理', 'מנות'),
    lead: t11('Блюдо → кухня.', 'A dish → its cuisine.', 'Gericht → Küche.', '菜肴 → 菜系。', 'Un plato → su cocina.', 'व्यंजन → उसकी रसोई।', 'طبق → مطبخه.', 'খাবার → রান্না।', 'Um prato → a sua cozinha.', '料理 → 料理系統。', 'מנה → המטבח.'),
  },
  origins: {
    title: t11('Состав блюд', 'Dish ingredients', 'Zutaten der Gerichte', '菜肴食材', 'Ingredientes de los platos', 'व्यंजन की सामग्री', 'مكونات الأطباق', 'পদের উপকরণ', 'Ingredientes dos pratos', '料理の材料', 'רכיבי המנות'),
    lead: t11('Состав → блюдо.', 'Ingredients → the dish.', 'Zutaten → Gericht.', '食材 → 菜肴。', 'Ingredientes → el plato.', 'सामग्री → व्यंजन।', 'مكونات → الطبق.', 'উপকরণ → পদ।', 'Ingredientes → o prato.', '材料 → 料理。', 'רכיבים → המנה.'),
  },
  plates: {
    title: t11('Фото блюд', 'Dish photos', 'Fotos von Gerichten', '菜肴照片', 'Fotos de platos', 'व्यंजन की तस्वीरें', 'صور الأطباق', 'পদের ছবি', 'Fotos de pratos', '料理の写真', 'תמונות מנות'),
    lead: t11('Фото тарелки → блюдо.', 'A plate photo → the dish.', 'Fototeller → Gericht.', '餐盘照片 → 菜肴。', 'Foto del plato → el nombre.', 'प्लेट की तस्वीर → व्यंजन।', 'صورة الصحن → الطبق.', 'প্লেটের ছবি → পদ।', 'Foto do prato → o nome.', '皿の写真 → 料理。', 'תמונת צלחת → המנה.'),
  },
}

export function collectionCopyOf(id: string, lang: Lang): CollectionCopy {
  if (isListId(id)) {
    const row = LIST_COPY[lang][id]
    return { title: row.title, lead: row.lead }
  }
  const row = EXTRA[id]
  if (!row) return { title: id, lead: '' }
  return { title: pickL(row.title, lang), lead: pickL(row.lead, lang) }
}
