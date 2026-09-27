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
  'died-in-office': {
    title: t11('Не дожили до конца срока', 'Died in office', 'Im Amt gestorben', '任内去世', 'Murieron en el cargo', 'पद पर मृत्यु', 'ماتوا في المنصب', 'পদে থেকে মৃত্যু', 'Morreram no cargo', '任期中に死去', 'מתו בתפקיד'),
    lead: t11('Восемь президентов США, которые умерли, не дослужив срок: от Гаррисона до Кеннеди.', 'Eight US presidents who died before their term ended, from Harrison to Kennedy.', 'Acht US-Präsidenten, die vor Ende der Amtszeit starben, von Harrison bis Kennedy.', '八位未完成任期便去世的美国总统，从哈里森到肯尼迪。', 'Ocho presidentes de EE. UU. que murieron antes de acabar el mandato, de Harrison a Kennedy.', 'आठ अमेरिकी राष्ट्रपति जो कार्यकाल खत्म होने से पहले मर गए, हैरिसन से कैनेडी तक।', 'ثمانية رؤساء أمريكيين ماتوا قبل نهاية الولاية، من هاريسون إلى كينيدي.', 'আট মার্কিন রাষ্ট্রপতি যারা মেয়াদ শেষের আগে মারা যান, হ্যারিসন থেকে কেনেডি।', 'Oito presidentes dos EUA que morreram antes do fim do mandato, de Harrison a Kennedy.', '任期を全うせず亡くなったアメリカ大統領8人。ハリソンからケネディまで。', 'שמונה נשיאי ארה״ב שמתו לפני סוף הכהונה, מהריסון עד קנדי.'),
  },
  'textbook-kings': {
    title: t11('Короли из учебника', 'Kings from the textbook', 'Könige aus dem Lehrbuch', '课本里的国王', 'Reyes del libro de texto', 'पाठ्यपुस्तक के राजा', 'ملوك الكتاب المدرسي', 'পাঠ্যবইয়ের রাজারা', 'Reis do manual', '教科書の王', 'מלכים מספר הלימוד'),
    lead: t11('Не все сорок монархов: Львиное Сердце, Генрих VIII, Елизавета I, Виктория и ещё несколько, без которых история Англии не рассказывается.', 'Not all forty monarchs: the Lionheart, Henry VIII, Elizabeth I, Victoria, and a few others the story of England does not skip.', 'Nicht alle vierzig Monarchen: Löwenherz, Heinrich VIII., Elisabeth I., Victoria und ein paar, ohne die Englands Geschichte nicht erzählt wird.', '不是全部四十位君主：狮心王、亨利八世、伊丽莎白一世、维多利亚，以及英格兰史绕不开的几位。', 'No los cuarenta monarcas: Corazón de León, Enrique VIII, Isabel I, Victoria y unos pocos sin los que no se cuenta Inglaterra.', 'सभी चालीस राजा नहीं: लायनहार्ट, हेनरी आठवें, एलिज़ाबेथ प्रथम, विक्टोरिया और कुछ और, जिनके बिना इंग्लैंड की कहानी अधूरी है।', 'ليس كل الملوك الأربعين: قلب الأسد وهنري الثامن وإليزابيث الأولى وفيكتوريا وقلّة لا تُروى إنجلترا من دونهم.', 'সব চল্লিশ রাজা নয়: লায়নহার্ট, অষ্টম হেনরি, প্রথম এলিজাবেথ, ভিক্টোরিয়া এবং আর কয়েকজন, যাদের ছাড়া ইংল্যান্ডের গল্প হয় না।', 'Não os quarenta monarcas: Coração de Leão, Henrique VIII, Isabel I, Vitória e mais alguns sem os quais a Inglaterra não se conta.', '四十人の君主全員ではない。獅子心王、ヘンリ8世、エリザベス1世、ヴィクトリアなど、イングランド史に欠かせない人だけ。', 'לא כל ארבעים המונרכים: לב הארי, הנרי השמיני, אליזבת הראשונה, ויקטוריה ועוד כמה שבלעדיהם אין סיפור אנגליה.'),
  },
  'modern-popes': {
    title: t11('Папы, которых помнят', 'Popes people still name', 'Päpste, die man noch nennt', '还被记住的教皇', 'Papas que aún se nombran', 'पोप जिन्हें अब भी जाना जाता है', 'باباوات ما زالوا يُذكرون', 'পোপ যাদের এখনও নাম জানা যায়', 'Papas que ainda se nomeiam', 'まだ名前が残る教皇', 'אפיפיורים שעדיין קוראים בשמם'),
    lead: t11('Не все 266 имён. Пий IX, Пий XII, Иоанн XXIII, Иоанн Павел II, Бенедикт XVI, Франциск, Лев XIV.', 'Not all 266 names. Pius IX, Pius XII, John XXIII, John Paul II, Benedict XVI, Francis, Leo XIV.', 'Nicht alle 266 Namen. Pius IX., Pius XII., Johannes XXIII., Johannes Paul II., Benedikt XVI., Franziskus, Leo XIV.', '不是全部 266 个名字。庇护九世、庇护十二世、若望二十三世、若望保禄二世、本笃十六世、方济各、良十四世。', 'No los 266 nombres. Pío IX, Pío XII, Juan XXIII, Juan Pablo II, Benedicto XVI, Francisco, León XIV.', 'सभी 266 नाम नहीं। पायस IX, पायस XII, जॉन XXIII, जॉन पॉल II, बेनेडिक्ट XVI, फ्रांसिस, लियो XIV।', 'ليس كل الأسماء الـ266. بيوس التاسع وبيوس الثاني عشر ويوحنا الثالث والعشرون ويوحنا بولس الثاني وبندكتس السادس عشر وفرنسيس ولاون الرابع عشر.', 'সব ২৬৬ নাম নয়। পিউস নবম, পিউস দ্বাদশ, জন তৃতীয়, জন পল দ্বিতীয়, ষোড়শ বেনেডিক্ট, ফ্রান্সিস, চতুর্দশ লিও।', 'Não os 266 nomes. Pio IX, Pio XII, João XXIII, João Paulo II, Bento XVI, Francisco, Leão XIV.', '266人全員ではない。ピウス9世、ピウス12世、ヨハネ23世、ヨハネ・パウロ2世、ベネディクト16世、フランシスコ、レオ14世。', 'לא כל 266 השמות. פיוס התשיעי, פיוס השנים־עשר, יוחנן העשרים ושלושה, יוחנן פאולוס השני, בנדיקטוס השישה־עשר, פרנציסקוס, לאו הארבעה־עשר.'),
  },
  'rus-known': {
    title: t11('Имена без номера в списке', 'Names you know without a number', 'Namen ohne Listennummer', '不用序号也认得的名字', 'Nombres sin número de lista', 'बिना क्रम संख्या के नाम', 'أسماء بلا رقم في القائمة', 'তালিকার নম্বর ছাড়াই নাম', 'Nomes sem número na lista', '番号なしでわかる名前', 'שמות בלי מספר ברשימה'),
    lead: t11('Не все князья подряд. Рюрик, Ольга, Владимир, Невский, Грозный, Пётр, Екатерина, Николай II, Ленин, Горбачёв.', 'Not every prince in order. Rurik, Olga, Vladimir, Nevsky, Ivan the Terrible, Peter, Catherine, Nicholas II, Lenin, Gorbachev.', 'Nicht jeder Fürst der Reihe nach. Rurik, Olga, Vladimir, Nevski, Iwan der Schreckliche, Peter, Katharina, Nikolaus II., Lenin, Gorbatschow.', '不是按顺序的每一位王公。留里克、奥丽加、弗拉基米尔、涅夫斯基、伊凡雷帝、彼得、叶卡捷琳娜、尼古拉二世、列宁、戈尔巴乔夫。', 'No cada príncipe en orden. Riúrik, Olga, Vladímir, Nevski, Iván el Terrible, Pedro, Catalina, Nicolás II, Lenin, Gorbachov.', 'क्रम से हर राजकुमार नहीं। रूरिक, ओल्गा, व्लादिमीर, नेवस्की, इवान भयानक, पीटर, कैथरीन, निकोलस द्वितीय, लेनिन, गोर्बाचेव।', 'ليس كل أمير بالترتيب. روريك وأولغا وفلاديمير ونيفسكي وإيفان الرهيب وبطرس وكاترين ونيقولا الثاني ولينين وغورباتشوف.', 'ক্রমে প্রতিটি রাজপুত্র নয়। রুরিক, ওলগা, ভ্লাদিমির, নেভস্কি, ইভান দ্য টেরিবল, পিটার, ক্যাথরিন, দ্বিতীয় নিকোলাস, লেনিন, গর্বাচভ।', 'Não cada príncipe em ordem. Rurik, Olga, Vladimir, Nevsky, Ivan, o Terrível, Pedro, Catarina, Nicolau II, Lenine, Gorbatchov.', '順番どおりの公全員ではない。リューリク、オリガ、ウラジーミル、ネフスキー、雷帝、ピョートル、エカチェリーナ、ニコライ2世、レーニン、ゴルバチョフ。', 'לא כל נסיך לפי הסדר. רוריק, אולגה, ולדימיר, נבסקי, איוואן האיום, פיוטר, יקטרינה, ניקולאי השני, לנין, גורבצ׳וב.'),
  },
  symbols: {
    title: t11('Математические символы', 'Math symbols', 'Mathe-Symbole', '数学符号', 'Símbolos matemáticos', 'गणित चिह्न', 'رموز الرياضيات', 'গণিতের চিহ্ন', 'Símbolos matemáticos', '数学記号', 'סמלי מתמטיקה'),
    lead: t11('Знак → что он значит.', 'A symbol → what it means.', 'Zeichen → Bedeutung.', '符号 → 含义。', 'Un símbolo → lo que significa.', 'चिह्न → उसका अर्थ।', 'رمز → معناه.', 'চিহ্ন → অর্থ।', 'Um símbolo → o que significa.', '記号 → 意味。', 'סימן → מה הוא אומר.'),
  },
  shapes: {
    title: t11('Фигуры', 'Shapes', 'Formen', '图形', 'Figuras', 'आकृतियाँ', 'أشكال', 'আকৃতি', 'Figuras', '図形', 'צורות'),
    lead: t11('Картинка фигуры → её имя.', 'A shape picture → its name.', 'Formbild → Name.', '图形 → 名称。', 'Dibujo de una figura → su nombre.', 'आकृति → उसका नाम।', 'صورة شكل → اسمه.', 'আকৃতির ছবি → নাম।', 'Desenho da figura → o nome.', '図形 → 名前。', 'ציור צורה → שמה.'),
  },
  theorems: {
    title: t11('Теоремы и их авторы', 'Theorems and who proved them', 'Sätze und ihre Autoren', '定理与证明者', 'Teoremas y quién los demostró', 'प्रमेय और उनके रचयिता', 'مبرهنات ومن أثبتها', 'উপপাদ্য ও প্রমাণকারী', 'Teoremas e quem os provou', '定理とその人', 'משפטים ומי שהוכיח'),
    lead: t11('Не портретная галерея гениев: название теоремы → кто её сделал.', 'Not a portrait gallery of geniuses: a theorem’s name → who made it.', 'Keine Porträtgalerie der Genies: Name des Satzes → wer ihn schuf.', '不是天才肖像廊：定理名称 → 谁做出了它。', 'No una galería de genios: el nombre del teorema → quién lo hizo.', 'प्रतिभाओं की चित्रशाला नहीं: प्रमेय का नाम → किसने बनाया।', 'ليس معرض صور للعباقرة: اسم المبرهنة → من وضعها.', 'প্রতিভার প্রতিকৃতি নয়: উপপাদ্যের নাম → কে বানিয়েছে।', 'Não uma galeria de génios: o nome do teorema → quem o fez.', '天才の肖像画廊ではない。定理の名前 → 誰のものか。', 'לא גלריית גאונים: שם המשפט → מי עשה אותו.'),
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
  species: {
    title: t11('Виды на фото', 'Species photos', 'Fotos von Arten', '物种照片', 'Fotos de especies', 'प्रजाति की तस्वीरें', 'صور الأنواع', 'প্রজাতির ছবি', 'Fotos de espécies', '種の写真', 'תמונות מינים'),
    lead: t11('Фото → название вида.', 'A photo → the species name.', 'Foto → Artname.', '照片 → 物种名称。', 'Una foto → el nombre de la especie.', 'तस्वीर → प्रजाति का नाम।', 'صورة → اسم النوع.', 'ছবি → প্রজাতির নাম।', 'Uma foto → o nome da espécie.', '写真 → 種の名前。', 'תמונה → שם המין.'),
  },
  scientists: {
    title: t11('Учёные', 'Scientists', 'Forscher', '科学家', 'Científicos', 'वैज्ञानिक', 'علماء', 'বিজ্ঞানী', 'Cientistas', '科学者', 'מדענים'),
    lead: t11('Портрет → имя учёного.', 'A portrait → the scientist’s name.', 'Porträt → Name.', '肖像 → 科学家姓名。', 'Un retrato → el nombre.', 'चित्र → वैज्ञानिक का नाम।', 'صورة → اسم العالم.', 'প্রতিকৃতি → বিজ্ঞানীর নাম।', 'Um retrato → o nome.', '肖像 → 科学者の名前。', 'דיוקן → שם המדען.'),
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
  'first-machines': {
    title: t11('Кто собрал машину', 'Who built the machine', 'Wer die Maschine baute', '谁造出了机器', 'Quién armó la máquina', 'मशीन किसने बनाई', 'من بنى الآلة', 'যন্ত্র কে বানিয়েছে', 'Quem montou a máquina', '機械を組んだ人', 'מי בנה את המכונה'),
    lead: t11('Ада, Бэббидж, Тьюринг, Хоппер, Шеннон, фон Нейман, Хэмилтон, Ритчи — не «все гении», а кто что сделал с вычислителем.', 'Ada, Babbage, Turing, Hopper, Shannon, von Neumann, Hamilton, Ritchie — what each one did with a computer, not a genius roll call.', 'Ada, Babbage, Turing, Hopper, Shannon, von Neumann, Hamilton, Ritchie — was jeder mit dem Rechner tat, keine Genieliste.', '爱达、巴贝奇、图灵、霍珀、香农、冯·诺依曼、汉密尔顿、里奇——各人做了什么，不是天才点名册。', 'Ada, Babbage, Turing, Hopper, Shannon, von Neumann, Hamilton, Ritchie: qué hizo cada uno, no una lista de genios.', 'एडा, बैबेज, ट्यूरिंग, हॉपर, शैनन, फॉन नॉयमान, हैमिल्टन, रिची — हर एक ने क्या किया, प्रतिभाओं की हाजिरी नहीं।', 'آدا وباباج وتورينغ وهوبر وشانون وفون نيومان وهاملتون وريتشي: ماذا فعل كل منهم، لا كشف عباقرة.', 'অ্যাডা, ব্যাবেজ, টুরিং, হপার, শ্যানন, ফন নয়মান, হ্যামিলটন, রিচি — কে কী করেছে, প্রতিভার হাজিরা নয়।', 'Ada, Babbage, Turing, Hopper, Shannon, von Neumann, Hamilton, Ritchie — o que cada um fez, não uma lista de génios.', 'エイダ、バベッジ、チューリング、ホッパー、シャノン、フォン・ノイマン、ハミルトン、リッチー。天才名簿ではなく、各自が計算機に何をしたか。', 'עדה, בבג׳, טיורינג, הופר, שאנון, פון נוימן, המילטון, ריצ׳י — מה כל אחד עשה, לא מצעד גאונים.'),
  },
  'net-langs': {
    title: t11('Сеть и языки', 'The net and the languages', 'Netz und Sprachen', '网络与语言', 'La red y los lenguajes', 'नेट और भाषाएँ', 'الشبكة واللغات', 'নেট ও ভাষা', 'A rede e as linguagens', 'ネットと言語', 'הרשת והשפות'),
    lead: t11('Веб, TCP/IP, Ethernet, Linux, Python, C++, Дейкстра и Кнут.', 'The web, TCP/IP, Ethernet, Linux, Python, C++, Dijkstra and Knuth.', 'Web, TCP/IP, Ethernet, Linux, Python, C++, Dijkstra und Knuth.', '万维网、TCP/IP、以太网、Linux、Python、C++、迪杰斯特拉和克努特。', 'La web, TCP/IP, Ethernet, Linux, Python, C++, Dijkstra y Knuth.', 'वेब, TCP/IP, ईथरनेट, लिनक्स, पायथन, C++, डेक्स्ट्रा और नुथ।', 'الويب وTCP/IP وإيثرنت ولينكس وبايثون وC++ وديكسترا وكنوث.', 'ওয়েব, TCP/IP, ইথারনেট, লিনাক্স, পাইথন, C++, ডেকস্ট্রা ও নুথ।', 'A web, TCP/IP, Ethernet, Linux, Python, C++, Dijkstra e Knuth.', 'ウェブ、TCP/IP、イーサネット、Linux、Python、C++、ダイクストラとクヌース。', 'האינטרנט, TCP/IP, אתרנט, לינוקס, פייתון, ++C, דייקסטרה וקנות.'),
  },
  terms: {
    title: t11('Термины информатики', 'CS terms', 'Informatik-Begriffe', '计算机术语', 'Términos de informática', 'सीएस शब्द', 'مصطلحات الحاسوب', 'সিএস শব্দ', 'Termos de informática', '情報の用語', 'מונחי מחשבים'),
    lead: t11('Термин → смысл. На карточках — зачем слово и в каком процессе оно живёт.', 'A term → its meaning. Cards say why the word exists and which process it sits in.', 'Begriff → Bedeutung. Karten sagen, wozu das Wort da ist und in welchem Ablauf.', '术语 → 含义。卡片说明这个词为什么存在、活在哪个流程里。', 'Un término → su significado. Las tarjetas dicen para qué está la palabra y en qué proceso vive.', 'शब्द → अर्थ। कार्ड बताते हैं शब्द क्यों है और किस प्रक्रिया में रहता है।', 'مصطلح → معناه. البطاقات تقول لماذا الكلمة وفي أي عملية تعيش.', 'শব্দ → অর্থ। কার্ড বলে শব্দ কেন এবং কোন প্রক্রিয়ায় থাকে।', 'Um termo → o significado. Os cartões dizem para que serve a palavra e em que processo vive.', '用語 → 意味。カードは言葉の理由と、どの工程にいるかを書く。', 'מונח → משמעותו. הכרטיסים אומרים למה המילה ולאיזה תהליך היא שייכת.'),
  },
  slang: {
    title: t11('Сленг разработки', 'Dev slang', 'Entwicklerjargon', '开发行话', 'Jerga de desarrollo', 'डेव शब्दजाल', 'مصطلحات المطورين', 'ডেভ শব্দজাল', 'Gíria de desenvolvimento', '開発の俗語', 'סלנג של פיתוח'),
    lead: t11('PR, канарейка, техдолг, идемпотентность — и в каком процессе слово стоит.', 'PR, canary, tech debt, idempotency — and which process the word belongs to.', 'PR, Kanarienvogel, technische Schuld, Idempotenz — und in welchem Ablauf das Wort steht.', 'PR、金丝雀、技术债、幂等——以及这个词站在哪个流程里。', 'PR, canario, deuda técnica, idempotencia — y en qué proceso está la palabra.', 'PR, कैनरी, टेक डेट, इडम्पोटेंसी — और शब्द किस प्रक्रिया में है।', 'طلب سحب وكناري ودين تقني وتماثل مفعول — وفي أي عملية تقف الكلمة.', 'PR, ক্যানারি, টেক ডেট, আইডেমপটেন্সি — এবং শব্দ কোন প্রক্রিয়ায়।', 'PR, canário, dívida técnica, idempotência — e em que processo está a palavra.', 'PR、カナリア、技術的負債、冪等——その言葉がどの工程にいるか。', 'PR, קנרית, חוב טכני, אידמפוטנטיות — ובאיזה תהליך המילה עומדת.'),
  },
  flows: {
    title: t11('Цепочки процессов', 'Process chains', 'Ablaufketten', '流程链', 'Cadenas de procesos', 'प्रक्रिया की कड़ियाँ', 'سلاسل العمليات', 'প্রক্রিয়ার শৃঙ্খল', 'Cadeias de processos', '工程の鎖', 'שרשרות תהליך'),
    lead: t11('Git, CI/CD, HTTP, компиляция, вход, баг, контейнеры, база, инцидент и страница: шаг и то, что идёт сразу после.', 'Git, CI/CD, HTTP, compilation, login, a bug, containers, the database, an incident, and a page: a step and what comes right after.', 'Git, CI/CD, HTTP, Kompilierung, Anmeldung, Bug, Container, Datenbank, Incident und Seite: ein Schritt und was direkt danach kommt.', 'Git、CI/CD、HTTP、编译、登录、缺陷、容器、数据库、事故和页面：一步以及紧接着的下一步。', 'Git, CI/CD, HTTP, compilación, entrada, un bug, contenedores, la base, un incidente y la página: un paso y lo que viene justo después.', 'Git, CI/CD, HTTP, संकलन, लॉगिन, बग, कंटेनर, डेटाबेस, घटना और पेज: एक कदम और ठीक बाद क्या।', 'Git وCI/CD وHTTP والترجمة والدخول والعطل والحاويات والقاعدة والحادث والصفحة: خطوة وما يأتي بعدها مباشرة.', 'Git, CI/CD, HTTP, কম্পাইলেশন, লগইন, বাগ, কন্টেইনার, ডেটাবেস, ঘটনা ও পৃষ্ঠা: এক ধাপ ও ঠিক পরে কী।', 'Git, CI/CD, HTTP, compilação, entrada, um bug, contentores, a base, um incidente e a página: um passo e o que vem logo a seguir.', 'Git、CI/CD、HTTP、コンパイル、ログイン、バグ、コンテナ、データベース、障害、ページ。一つの段とその直後。', 'Git, ‏CI/CD, ‏HTTP, הידור, כניסה, באג, קונטיינרים, מסד, תקרית ודף: צעד ומה שבא מיד אחריו.'),
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
