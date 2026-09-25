import { t11, type L11 } from '../math'
import type { ThemeItem, ThemeTier } from '../theme'
import { isThemeMode, type ThemeMode } from '../../lib/quiz/themeModes'

function item(
  id: string,
  mode: string,
  tier: ThemeTier,
  prompt: L11,
  answer: L11,
  key: string,
  extra: Partial<Pick<ThemeItem, 'wikiFile'>> = {},
): ThemeItem | null {
  if (!isThemeMode(mode)) return null
  return { id, mode: mode as ThemeMode, tier, prompt, answer, key, ...extra }
}

const JP = t11('Япония', 'Japan', 'Japan', '日本', 'Japón', 'जापान', 'اليابان', 'জাপান', 'Japão', '日本', 'יפן')
const IT = t11('Италия', 'Italy', 'Italien', '意大利', 'Italia', 'इटली', 'إيطاليا', 'ইতালি', 'Itália', 'イタリア', 'איטליה')
const MX = t11('Мексика', 'Mexico', 'Mexiko', '墨西哥', 'México', 'मेक्सिको', 'المكسيك', 'মেক্সিকো', 'México', 'メキシコ', 'מקסיקו')
const ES = t11('Испания', 'Spain', 'Spanien', '西班牙', 'España', 'स्पेन', 'إسبانيا', 'স্পেন', 'Espanha', 'スペイン', 'ספרד')
const TH = t11('Таиланд', 'Thailand', 'Thailand', '泰国', 'Tailandia', 'थाईलैंड', 'تايلاند', 'থাইল্যান্ড', 'Tailândia', 'タイ', 'תאילנד')
const FR = t11('Франция', 'France', 'Frankreich', '法国', 'Francia', 'फ़्रांस', 'فرنسا', 'ফ্রান্স', 'França', 'フランス', 'צרפת')
const US = t11('США', 'United States', 'USA', '美国', 'Estados Unidos', 'संयुक्त राज्य', 'الولايات المتحدة', 'মার্কিন যুক্তরাষ্ট্র', 'Estados Unidos', 'アメリカ', 'ארצות הברית')
const VN = t11('Вьетнам', 'Vietnam', 'Vietnam', '越南', 'Vietnam', 'वियतनाम', 'فيتنام', 'ভিয়েতনাম', 'Vietname', 'ベトナム', 'וייטנאם')
const KR = t11('Корея', 'Korea', 'Korea', '韩国', 'Corea', 'कोरिया', 'كوريا', 'কোরিয়া', 'Coreia', '韓国', 'קוריאה')
const CN = t11('Китай', 'China', 'China', '中国', 'China', 'चीन', 'الصين', 'চীন', 'China', '中国', 'סין')
const GB = t11('Великобритания', 'United Kingdom', 'Vereinigtes Königreich', '英国', 'Reino Unido', 'ब्रिटेन', 'بريطانيا', 'ব্রিটেন', 'Reino Unido', 'イギリス', 'בריטניה')
const GR = t11('Греция', 'Greece', 'Griechenland', '希腊', 'Grecia', 'यूनान', 'اليونان', 'গ্রিস', 'Grécia', 'ギリシャ', 'יוון')
const TR = t11('Турция', 'Turkey', 'Türkei', '土耳其', 'Turquía', 'तुर्की', 'تركيا', 'তুরস্ক', 'Turquia', 'トルコ', 'טורקיה')
const CA = t11('Канада', 'Canada', 'Kanada', '加拿大', 'Canadá', 'कनाडा', 'كندا', 'কানাডা', 'Canadá', 'カナダ', 'קנדה')
const BR = t11('Бразилия', 'Brazil', 'Brasilien', '巴西', 'Brasil', 'ब्राज़ील', 'البرازيل', 'ব্রাজিল', 'Brasil', 'ブラジル', 'ברזיל')
const IN = t11('Индия', 'India', 'Indien', '印度', 'India', 'भारत', 'الهند', 'ভারত', 'Índia', 'インド', 'הודו')
const UA = t11('Украина', 'Ukraine', 'Ukraine', '乌克兰', 'Ucrania', 'यूक्रेन', 'أوكرانيا', 'ইউক্রেন', 'Ucrânia', 'ウクライナ', 'אוקראינה')
const HU = t11('Венгрия', 'Hungary', 'Ungarn', '匈牙利', 'Hungría', 'हंगरी', 'المجر', 'হাঙ্গেরি', 'Hungria', 'ハンガリー', 'הונגריה')
const PE = t11('Перу', 'Peru', 'Peru', '秘鲁', 'Perú', 'पेरू', 'بيرو', 'পেরু', 'Peru', 'ペルー', 'פרו')
const MA = t11('Марокко', 'Morocco', 'Marokko', '摩洛哥', 'Marruecos', 'मोरक्को', 'المغرب', 'মরক্কো', 'Marrocos', 'モロッコ', 'מרוקו')
const PL = t11('Польша', 'Poland', 'Polen', '波兰', 'Polonia', 'पोलैंड', 'بولندا', 'পোল্যান্ড', 'Polónia', 'ポーランド', 'פולין')
const CH = t11('Швейцария', 'Switzerland', 'Schweiz', '瑞士', 'Suiza', 'स्विट्ज़रलैंड', 'سويسرا', 'সুইজারল্যান্ড', 'Suíça', 'スイス', 'שווייץ')
const DE = t11('Германия', 'Germany', 'Deutschland', '德国', 'Alemania', 'जर्मनी', 'ألمانيا', 'জার্মানি', 'Alemanha', 'ドイツ', 'גרמניה')
const GE = t11('Грузия', 'Georgia', 'Georgien', '格鲁吉亚', 'Georgia', 'जॉर्जिया', 'جورجيا', 'জর্জিয়া', 'Geórgia', 'ジョージア', 'גאורגיה')
const UZ = t11('Узбекистан', 'Uzbekistan', 'Usbekistan', '乌兹别克斯坦', 'Uzbekistán', 'उज़्बेकिस्तान', 'أوزبكستان', 'উজবেকিস্তান', 'Usbequistão', 'ウズベキスタン', 'אוזבקיסטן')
const LB = t11('Ливан', 'Lebanon', 'Libanon', '黎巴嫩', 'Líbano', 'लेबनान', 'لبنان', 'লেবানন', 'Líbano', 'レバノン', 'לבנון')
const NG = t11('Нигерия', 'Nigeria', 'Nigeria', '尼日利亚', 'Nigeria', 'नाइजीरिया', 'نيجيريا', 'নাইজেরিয়া', 'Nigéria', 'ナイジェリア', 'ניגריה')
const RU = t11('Россия', 'Russia', 'Russland', '俄罗斯', 'Rusia', 'रूस', 'روسيا', 'রাশিয়া', 'Rússia', 'ロシア', 'רוסיה')
const SE = t11('Швеция', 'Sweden', 'Schweden', '瑞典', 'Suecia', 'स्वीडन', 'السويد', 'সুইডেন', 'Suécia', 'スウェーデン', 'שוודיה')
const AT = t11('Австрия', 'Austria', 'Österreich', '奥地利', 'Austria', 'ऑस्ट्रिया', 'النمسا', 'অস্ট্রিয়া', 'Áustria', 'オーストリア', 'אוסטריה')
const ET = t11('Эфиопия', 'Ethiopia', 'Äthiopien', '埃塞俄比亚', 'Etiopía', 'इथियोपिया', 'إثيوبيا', 'ইথিওপিয়া', 'Etiópia', 'エチオピア', 'אתיופיה')
const AR = t11('Аргентина', 'Argentina', 'Argentinien', '阿根廷', 'Argentina', 'अर्जेंटीना', 'الأرجنتين', 'আর্জেন্টিনা', 'Argentina', 'アルゼンチン', 'ארגנטינה')

type Dish = {
  id: string
  tier: ThemeTier
  name: L11
  country: L11
  ck: string
  ing: L11
  sig?: boolean
  photo?: string
}

const DISHES: Dish[] = [
  {
    id: 'sushi',
    tier: 'easy',
    sig: true,
    photo: 'sushi',
    name: t11('суши', 'sushi', 'Sushi', '寿司', 'sushi', 'सुशी', 'سوشي', 'সুশি', 'sushi', '寿司', 'סושי'),
    country: JP,
    ck: 'jp',
    ing: t11('рис, сырая рыба, нори', 'rice, raw fish, nori', 'Reis, roher Fisch, Nori', '米饭、生鱼、海苔', 'arroz, pescado crudo, nori', 'चावल, कच्ची मछली, नोरी', 'أرز وسمك نيء ونوري', 'ভাত, কাঁচা মাছ, নোরি', 'arroz, peixe cru, nori', 'ご飯、生魚、海苔', 'אורז, דג חי, נורי'),
  },
  {
    id: 'ramen',
    tier: 'medium',
    photo: 'ramen',
    name: t11('рамэн', 'ramen', 'Ramen', '拉面', 'ramen', 'रामेन', 'رامين', 'রামেন', 'ramen', 'ラーメン', 'ראמן'),
    country: JP,
    ck: 'jp',
    ing: t11('лапша, бульон, свинина, яйцо', 'noodles, broth, pork, egg', 'Nudeln, Brühe, Schwein, Ei', '面条、高汤、猪肉、蛋', 'fideos, caldo, cerdo, huevo', 'नूडल्स, शोरबा, पोर्क, अंडा', 'نودلز ومرق ولحم وبيض', 'নুডলস, ঝোল, শুয়োর, ডিম', 'noodles, caldo, porco, ovo', '麺、スープ、豚肉、卵', 'אטריות, מרק, חזיר, ביצה'),
  },
  {
    id: 'pizza',
    tier: 'easy',
    sig: true,
    photo: 'pizza',
    name: t11('пицца', 'pizza', 'Pizza', '披萨', 'pizza', 'पिज़्ज़ा', 'بيتزا', 'পিজা', 'pizza', 'ピザ', 'פיצה'),
    country: IT,
    ck: 'it',
    ing: t11('тесто, томат, сыр', 'dough, tomato, cheese', 'Teig, Tomate, Käse', '面团、番茄、奶酪', 'masa, tomate, queso', 'आटा, टमाटर, पनीर', 'عجينة وطماطم وجبن', 'ডো, টমেটো, পনির', 'massa, tomate, queijo', '生地、トマト、チーズ', 'בצק, עגבנייה, גבינה'),
  },
  {
    id: 'risotto',
    tier: 'medium',
    name: t11('ризотто', 'risotto', 'Risotto', '意大利饭', 'risotto', 'रिसोटो', 'ريزوتو', 'রিসোত্তো', 'risotto', 'リゾット', 'ריזוטו'),
    country: IT,
    ck: 'it',
    ing: t11('рис, бульон, пармезан', 'rice, broth, parmesan', 'Reis, Brühe, Parmesan', '米饭、高汤、帕玛森', 'arroz, caldo, parmesano', 'चावल, शोरबा, पार्मेज़ान', 'أرز ومرق وبارميزان', 'ভাত, ঝোল, পারমেজান', 'arroz, caldo, parmesão', 'ご飯、スープ、パルメザン', 'אורז, מרק, פרמזן'),
  },
  {
    id: 'taco',
    tier: 'easy',
    sig: true,
    photo: 'taco',
    name: t11('тако', 'taco', 'Taco', '塔可', 'taco', 'टैको', 'تاكو', 'টাকো', 'taco', 'タコス', 'טאקו'),
    country: MX,
    ck: 'mx',
    ing: t11('кукурузная тортилья, мясо, сальса', 'corn tortilla, meat, salsa', 'Maistortilla, Fleisch, Salsa', '玉米饼、肉、莎莎酱', 'tortilla de maíz, carne, salsa', 'मक्का टॉर्टिया, मांस, सालसा', 'تورتيلا ذرة ولحم وصلصة', 'ভুট্টার টরটিলা, মাংস, সালসা', 'tortilha de milho, carne, salsa', 'トルティーヤ、肉、サルサ', 'טורטייה, בשר, סלסה'),
  },
  {
    id: 'guacamole',
    tier: 'easy',
    name: t11('гуакамоле', 'guacamole', 'Guacamole', '鳄梨酱', 'guacamole', 'गुआकामोल', 'غواكامولي', 'গুয়াকামোলে', 'guacamole', 'ワカモレ', 'גואקמולה'),
    country: MX,
    ck: 'mx',
    ing: t11('авокадо, лайм, кинза', 'avocado, lime, cilantro', 'Avocado, Limette, Koriander', '牛油果、青柠、香菜', 'aguacate, lima, cilantro', 'एवोकाडो, नींबू, धनिया', 'أفوكادو وليمون وكزبرة', 'অ্যাভোকাডো, লেবু, ধনে', 'abacate, lima, coentro', 'アボカド、ライム、コリアンダー', 'אבוקדו, ליים, כוסברה'),
  },
  {
    id: 'paella',
    tier: 'medium',
    sig: true,
    photo: 'paella',
    name: t11('паэлья', 'paella', 'Paella', '海鲜饭', 'paella', 'पायेला', 'باييلا', 'পায়েয়া', 'paella', 'パエリア', 'פאייה'),
    country: ES,
    ck: 'es',
    ing: t11('рис, шафран, морепродукты', 'rice, saffron, seafood', 'Reis, Safran, Meeresfrüchte', '米饭、藏红花、海鲜', 'arroz, azafrán, marisco', 'चावल, केसर, समुद्री भोजन', 'أرز وزعفران ومأكولات بحرية', 'ভাত, জাফরান, সীফুড', 'arroz, açafrão, marisco', 'ご飯、サフラン、魚介', 'אורז, זעפרן, פירות ים'),
  },
  {
    id: 'pad-thai',
    tier: 'medium',
    sig: true,
    photo: 'pad-thai',
    name: t11('пад тай', 'pad thai', 'Pad Thai', '泰式炒河粉', 'pad thai', 'पैड थाई', 'باد تاي', 'প্যাড থাই', 'pad thai', 'パッタイ', 'פאד תאי'),
    country: TH,
    ck: 'th',
    ing: t11('рисовая лапша, тамаринд, арахис', 'rice noodles, tamarind, peanuts', 'Reisnudeln, Tamarinde, Erdnüsse', '河粉、罗望子、花生', 'fideos de arroz, tamarindo, cacahuete', 'चावल नूडल्स, इमली, मूंगफली', 'نودلز أرز وتمرهندي وفول سوداني', 'চালের নুডলস, তেঁতুল, বাদাম', 'noodles de arroz, tamarindo, amendoim', 'ライスヌードル、タマリンド、落花生', 'אטריות אורז, תמרינד, בוטנים'),
  },
  {
    id: 'tom-yum',
    tier: 'medium',
    name: t11('том ям', 'tom yum', 'Tom Yum', '冬阴功', 'tom yum', 'तोम यम', 'توم يام', 'টম ইয়াম', 'tom yum', 'トムヤム', 'טום יאם'),
    country: TH,
    ck: 'th',
    ing: t11('креветки, лемонграсс, лайм', 'shrimp, lemongrass, lime', 'Garnelen, Zitronengras, Limette', '虾、香茅、青柠', 'gambas, citronela, lima', 'झींगा, लेमनग्रास, नींबू', 'جمبري وعشب ليمون وليمون', 'চিংড়ি, লেমনগ্রাস, লেবু', 'camarão, capim-limão, lima', 'エビ、レモングラス、ライム', 'שרימפס, עשב לימון, ליים'),
  },
  {
    id: 'croissant',
    tier: 'easy',
    sig: true,
    photo: 'croissant',
    name: t11('круассан', 'croissant', 'Croissant', '可颂', 'cruasán', 'क्रुआसाँ', 'كرواسون', 'ক্রুয়াসাঁ', 'croissant', 'クロワッサン', 'קרואסון'),
    country: FR,
    ck: 'fr',
    ing: t11('слоёное тесто и масло', 'laminated dough and butter', 'Blätterteig und Butter', '黄油酥皮', 'masa hojaldrada y mantequilla', 'परतदार आटा और मक्खन', 'عجينة مورقة وزبدة', 'পাতলা ডো আর মাখন', 'massa folhada e manteiga', '折り込み生地とバター', 'בצק עלים וחמאה'),
  },
  {
    id: 'burger',
    tier: 'easy',
    sig: true,
    photo: 'burger',
    name: t11('гамбургер', 'hamburger', 'Hamburger', '汉堡', 'hamburguesa', 'हैमबर्गर', 'هامبرغر', 'হ্যামবার্গার', 'hambúrguer', 'ハンバーガー', 'המבורגר'),
    country: US,
    ck: 'us',
    ing: t11('котлета, булочка, сыр', 'beef patty, bun, cheese', 'Rindfleisch, Brötchen, Käse', '牛肉饼、面包、奶酪', 'carne, pan, queso', 'बीफ पैटी, बन, पनीर', 'لحم وخبز وجبن', 'গরুর প্যাটি, বান, পনির', 'carne, pão, queijo', '牛肉、バンズ、チーズ', 'קציצת בקר, לחמנייה, גבינה'),
  },
  {
    id: 'pho',
    tier: 'medium',
    sig: true,
    photo: 'pho',
    name: t11('фо', 'pho', 'Pho', '河粉', 'pho', 'फो', 'فو', 'ফো', 'pho', 'フォー', 'פו'),
    country: VN,
    ck: 'vn',
    ing: t11('рисовая лапша, говяжий бульон, травы', 'rice noodles, beef broth, herbs', 'Reisnudeln, Rinderbrühe, Kräuter', '河粉、牛肉汤、香草', 'fideos de arroz, caldo de res, hierbas', 'चावल नूडल्स, बीफ शोरबा, जड़ी', 'نودلز أرز ومرق لحم وأعشاب', 'চালের নুডলস, গরুর ঝোল, শাক', 'noodles de arroz, caldo de vaca, ervas', 'ライスヌードル、牛肉スープ、ハーブ', 'אטריות אורז, מרק בקר, עשבים'),
  },
  {
    id: 'bibimbap',
    tier: 'medium',
    sig: true,
    photo: 'bibimbap',
    name: t11('пибимпап', 'bibimbap', 'Bibimbap', '拌饭', 'bibimbap', 'बिबिंबाप', 'بيبيمباب', 'বিবিমবাপ', 'bibimbap', 'ビビンバ', 'ביבימבאפ'),
    country: KR,
    ck: 'kr',
    ing: t11('рис, овощи, яйцо, кочхуджан', 'rice, vegetables, egg, gochujang', 'Reis, Gemüse, Ei, Gochujang', '米饭、蔬菜、蛋、辣椒酱', 'arroz, verduras, huevo, gochujang', 'चावल, सब्ज़ी, अंडा, गोचुजांग', 'أرز وخضار وبيض وصلصة', 'ভাত, সবজি, ডিম, গোচুজাং', 'arroz, legumes, ovo, gochujang', 'ご飯、野菜、卵、コチュジャン', 'אורז, ירקות, ביצה, גוצ׳וג׳אנג'),
  },
  {
    id: 'kimchi',
    tier: 'easy',
    name: t11('кимчи', 'kimchi', 'Kimchi', '泡菜', 'kimchi', 'किमची', 'كيمتشي', 'কিমচি', 'kimchi', 'キムチ', 'קימצ׳י'),
    country: KR,
    ck: 'kr',
    ing: t11('пекинская капуста, чили, чеснок', 'napa cabbage, chili, garlic', 'Chinakohl, Chili, Knoblauch', '白菜、辣椒、蒜', 'col china, chile, ajo', 'नापा गोभी, मिर्च, लहसुन', 'ملفوف وفلفل وثوم', 'বাঁধাকপি, মরিচ, রসুন', 'couve, malagueta, alho', '白菜、唐辛子、にんにく', 'כרוב סיני, צ׳ילי, שום'),
  },
  {
    id: 'duck',
    tier: 'medium',
    sig: true,
    photo: 'duck',
    name: t11('утка по-пекински', 'Peking duck', 'Pekingente', '北京烤鸭', 'pato laqueado', 'पेकिंग डक', 'بط بكين', 'পেকিং ডাক', 'pato de Pequim', '北京ダック', 'ברווז פקין'),
    country: CN,
    ck: 'cn',
    ing: t11('утка, блинчики, хойсин', 'roast duck, pancakes, hoisin', 'Ente, Pfannkuchen, Hoisin', '烤鸭、薄饼、海鲜酱', 'pato, crepes, hoisin', 'बत्तख, पैनकेक, होइसिन', 'بط وفطائر وصلصة', 'হাঁস, প্যানকেক, হইসিন', 'pato, panquecas, hoisin', '鴨、クレープ、甜麺醤', 'ברווז, פנקייק, הויסין'),
  },
  {
    id: 'fish-chips',
    tier: 'easy',
    sig: true,
    photo: 'fish-chips',
    name: t11('фиш-энд-чипс', 'fish and chips', 'Fish and Chips', '炸鱼薯条', 'fish and chips', 'फिश एंड चिप्स', 'سمك وبطاطس', 'ফিশ অ্যান্ড চিপস', 'fish and chips', 'フィッシュ・アンド・チップス', 'פיש אנד צ׳יפס'),
    country: GB,
    ck: 'gb',
    ing: t11('рыба в кляре и картофель', 'battered fish and potatoes', 'Fisch im Teig und Kartoffeln', '裹面炸鱼和土豆', 'pescado rebozado y patatas', 'बैटर मछली और आलू', 'سمك مقلي وبطاطس', 'বেটারে মাছ আর আলু', 'peixe em polme e batatas', '衣をつけた魚とポテト', 'דג בציפוי ותפוחי אדמה'),
  },
  {
    id: 'moussaka',
    tier: 'medium',
    sig: true,
    photo: 'moussaka',
    name: t11('мусака', 'moussaka', 'Moussaka', '穆萨卡', 'musaka', 'मूसाका', 'مسقعة', 'মুসাকা', 'moussaka', 'ムサカ', 'מוסקה'),
    country: GR,
    ck: 'gr',
    ing: t11('баклажан, фарш, бешамель', 'eggplant, minced meat, béchamel', 'Aubergine, Hack, Béchamel', '茄子、肉末、白酱', 'berenjena, carne, bechamel', 'बैंगन, कीमा, बेचमेल', 'باذنجان ولحم وبشاميل', 'বেগুন, কিমা, বেচামেল', 'beringela, carne, bechamel', 'ナス、ひき肉、ベシャメル', 'חציל, בשר טחון, בשאמל'),
  },
  {
    id: 'doner',
    tier: 'easy',
    sig: true,
    photo: 'doner',
    name: t11('донер', 'doner kebab', 'Döner', '沙威玛烤肉', 'döner', 'डोनर', 'دونر', 'ডোনার', 'döner', 'ドネルケバブ', 'דונר'),
    country: TR,
    ck: 'tr',
    ing: t11('мясо на вертеле и лепёшка', 'spit-roasted meat and flatbread', 'Drehspießfleisch und Fladenbrot', '转烤肉和饼', 'carne al asador y pan', 'सीख का मांस और रोटी', 'لحم سيخ وخبز', 'শিকে মাংস আর রুটি', 'carne no espeto e pão', '串焼き肉と平パン', 'בשר על שיפוד ולחם שטוח'),
  },
  {
    id: 'baklava',
    tier: 'easy',
    name: t11('пахлава', 'baklava', 'Baklava', '果仁蜜饼', 'baklava', 'बकलावा', 'بقلاوة', 'বাকলাভা', 'baklava', 'バクラヴァ', 'בקלאווה'),
    country: TR,
    ck: 'tr',
    ing: t11('тесто фило, орехи, сироп', 'phyllo, nuts, syrup', 'Filo, Nüsse, Sirup', '酥皮、坚果、糖浆', 'filo, frutos secos, almíbar', 'फिलो, मेवे, चाशनी', 'عجينة فيلو ومكسرات وقطر', 'ফিলো, বাদাম, সিরাপ', 'filo, frutos secos, calda', 'フィロ、ナッツ、シロップ', 'פילו, אגוזים, סירופ'),
  },
  {
    id: 'poutine',
    tier: 'medium',
    sig: true,
    photo: 'poutine',
    name: t11('путин (блюдо)', 'poutine', 'Poutine', '肉汁奶酪薯条', 'poutine', 'पूटीन', 'بوتين', 'পুটিন', 'poutine', 'プーティン', 'פוטין'),
    country: CA,
    ck: 'ca',
    ing: t11('картофель фри, сырные зерна, подлива', 'fries, cheese curds, gravy', 'Pommes, Käsebruch, Soße', '薯条、奶酪粒、肉汁', 'patatas, cuajada, salsa', 'फ्राइज़, चीज़ कर्ड, ग्रेवी', 'بطاطس وجبن وصلصة', 'ফ্রাই, চিজ কার্ড, গ্রেভি', 'batatas, coalhada, molho', 'フライ、チーズカード、グレービー', 'צ׳יפס, גבינת קוטג׳, רוטב'),
  },
  {
    id: 'feijoada',
    tier: 'medium',
    sig: true,
    photo: 'feijoada',
    name: t11('фейжоада', 'feijoada', 'Feijoada', '黑豆炖肉', 'feijoada', 'फेजोआडा', 'فيجوادا', 'ফেইজুয়াদা', 'feijoada', 'フェイジョアーダ', 'פייז׳ואדה'),
    country: BR,
    ck: 'br',
    ing: t11('чёрная фасоль и свинина', 'black beans and pork', 'schwarze Bohnen und Schwein', '黑豆和猪肉', 'frijoles negros y cerdo', 'काली फलियाँ और पोर्क', 'فاصوليا سوداء ولحم خنزير', 'কালো শিম আর শুয়োর', 'feijão preto e porco', '黒豆と豚肉', 'שעועית שחורה וחזיר'),
  },
  {
    id: 'butter-chicken',
    tier: 'easy',
    sig: true,
    photo: 'butter-chicken',
    name: t11('цыплёнок макхани', 'butter chicken', 'Butter Chicken', '黄油鸡', 'pollo con mantequilla', 'बटर चिकन', 'دجاج بالزبدة', 'বাটার চিকেন', 'frango com manteiga', 'バターチキン', 'עוף בחמאה'),
    country: IN,
    ck: 'in',
    ing: t11('курица, томат, масло, сливки', 'chicken, tomato, butter, cream', 'Huhn, Tomate, Butter, Sahne', '鸡肉、番茄、黄油、奶油', 'pollo, tomate, mantequilla, nata', 'मुर्गा, टमाटर, मक्खन, क्रीम', 'دجاج وطماطم وزبدة وقشدة', 'মুরগি, টমেটো, মাখন, ক্রিম', 'frango, tomate, manteiga, natas', '鶏、トマト、バター、クリーム', 'עוף, עגבנייה, חמאה, שמנת'),
  },
  {
    id: 'dosa',
    tier: 'medium',
    name: t11('доса', 'dosa', 'Dosa', '印度米饼', 'dosa', 'डोसा', 'دوسا', 'ডোসা', 'dosa', 'ドーサ', 'דוסה'),
    country: IN,
    ck: 'in',
    ing: t11('ферментированный рис и чечевица', 'fermented rice and lentils', 'fermentierter Reis und Linsen', '发酵米和扁豆', 'arroz fermentado y lentejas', 'खमीर चावल और दाल', 'أرز مخمر وعدس', 'খামির ভাত আর ডাল', 'arroz fermentado e lentilhas', '発酵米とレンズ豆', 'אורז מותסס ועדשים'),
  },
  {
    id: 'borscht',
    tier: 'easy',
    sig: true,
    photo: 'borscht',
    name: t11('борщ', 'borscht', 'Borschtsch', '罗宋汤', 'borscht', 'बोर्श', 'بورشت', 'বোরশ', 'borscht', 'ボルシチ', 'בורשט'),
    country: UA,
    ck: 'ua',
    ing: t11('свёкла, капуста, бульон', 'beet, cabbage, broth', 'Rote Bete, Kohl, Brühe', '甜菜、卷心菜、高汤', 'remolacha, col, caldo', 'चुकंदर, पत्तागोभी, शोरबा', 'شمندر وملفوف ومرق', 'বিট, বাঁধাকপি, ঝোল', 'beterraba, couve, caldo', 'ビーツ、キャベツ、スープ', 'סלק, כרוב, מרק'),
  },
  {
    id: 'varenyky',
    tier: 'medium',
    name: t11('вареники', 'varenyky', 'Wareniki', '乌克兰饺子', 'varenyky', 'वरेनिकी', 'فارينيكي', 'ভারেনিকি', 'varenyky', 'ヴァレニキ', 'ורניקי'),
    country: UA,
    ck: 'ua',
    ing: t11('тесто и картофель', 'dough and potato', 'Teig und Kartoffel', '面皮和土豆', 'masa y patata', 'आटा और आलू', 'عجينة وبطاطا', 'ডো আর আলু', 'massa e batata', '生地とジャガイモ', 'בצק ותפוח אדמה'),
  },
  {
    id: 'goulash',
    tier: 'medium',
    sig: true,
    photo: 'goulash',
    name: t11('гуляш', 'goulash', 'Gulasch', '匈牙利炖牛肉', 'gulash', 'गुलाश', 'غولاش', 'গুল্যাশ', 'goulash', 'グヤーシュ', 'גולאש'),
    country: HU,
    ck: 'hu',
    ing: t11('говядина и паприка', 'beef and paprika', 'Rind und Paprika', '牛肉和红椒粉', 'ternera y pimentón', 'बीफ और पप्रियका', 'لحم وبابريكا', 'গরুর মাংস আর পপ্রিকা', 'vaca e pimentão', '牛肉とパプリカ', 'בקר ופפריקה'),
  },
  {
    id: 'ceviche',
    tier: 'medium',
    sig: true,
    photo: 'ceviche',
    name: t11('севиче', 'ceviche', 'Ceviche', '酸橘汁腌鱼', 'ceviche', 'सेविचे', 'سيفيتشي', 'সেভিচে', 'ceviche', 'セビーチェ', 'סביצ׳ה'),
    country: PE,
    ck: 'pe',
    ing: t11('сырая рыба, лайм, лук', 'raw fish, lime, onion', 'roher Fisch, Limette, Zwiebel', '生鱼、青柠、洋葱', 'pescado crudo, lima, cebolla', 'कच्ची मछली, नींबू, प्याज़', 'سمك نيء وليمون وبصل', 'কাঁচা মাছ, লেবু, পেঁয়াজ', 'peixe cru, lima, cebola', '生魚、ライム、玉ねぎ', 'דג חי, ליים, בצל'),
  },
  {
    id: 'tagine',
    tier: 'medium',
    sig: true,
    photo: 'tagine',
    name: t11('тажин', 'tagine', 'Tajine', '塔吉锅', 'tayín', 'तजीन', 'طاجين', 'তাজিন', 'tajine', 'タジン', 'טאג׳ין'),
    country: MA,
    ck: 'ma',
    ing: t11('мясо, сухофрукты, специи', 'meat, dried fruit, spices', 'Fleisch, Trockenfrüchte, Gewürze', '肉、干果、香料', 'carne, fruta seca, especias', 'मांस, सूखे फल, मसाले', 'لحم وفاكهة مجففة وتوابل', 'মাংস, শুকনো ফল, মশলা', 'carne, fruta seca, especiarias', '肉、ドライフルーツ、香辛料', 'בשר, פירות יבשים, תבלינים'),
  },
  {
    id: 'couscous',
    tier: 'easy',
    name: t11('кускус', 'couscous', 'Couscous', '库斯库斯', 'cuscús', 'कूसकूस', 'كسكس', 'কুসকুস', 'cuscuz', 'クスクス', 'קוסקוס'),
    country: MA,
    ck: 'ma',
    ing: t11('манка и овощи', 'semolina and vegetables', 'Grieß und Gemüse', '粗麦和蔬菜', 'sémola y verduras', 'सूजी और सब्ज़ियाँ', 'سميد وخضار', 'সুজি আর সবজি', 'sêmola e legumes', 'セモリナと野菜', 'סולת וירקות'),
  },
  {
    id: 'pierogi',
    tier: 'medium',
    sig: true,
    photo: 'pierogi',
    name: t11('пероги', 'pierogi', 'Pierogi', '波兰饺子', 'pierogi', 'पिरोगी', 'بيروغي', 'পিরোগি', 'pierogi', 'ピエロギ', 'פירוגי'),
    country: PL,
    ck: 'pl',
    ing: t11('тесто, картофель, творог', 'dough, potato, cheese', 'Teig, Kartoffel, Käse', '面皮、土豆、奶酪', 'masa, patata, queso', 'आटा, आलू, पनीर', 'عجينة وبطاطا وجبن', 'ডো, আলু, পনির', 'massa, batata, queijo', '生地、ジャガイモ、チーズ', 'בצק, תפוח אדמה, גבינה'),
  },
  {
    id: 'fondue',
    tier: 'medium',
    sig: true,
    photo: 'fondue',
    name: t11('фондю', 'fondue', 'Fondue', '奶酪火锅', 'fondue', 'फोंड्यू', 'فونديو', 'ফঁদ্যু', 'fondue', 'フォンデュ', 'פונדו'),
    country: CH,
    ck: 'ch',
    ing: t11('плавленый сыр и хлеб', 'melted cheese and bread', 'geschmolzener Käse und Brot', '融化奶酪和面包', 'queso fundido y pan', 'पिघला पनीर और ब्रेड', 'جبن ذائب وخبز', 'গলানো পনির আর রুটি', 'queijo fundido e pão', '溶けたチーズとパン', 'גבינה מותכת ולחם'),
  },
  {
    id: 'pretzel',
    tier: 'easy',
    sig: true,
    photo: 'pretzel',
    name: t11('брецель', 'pretzel', 'Brezel', '椒盐卷饼', 'pretzel', 'प्रेट्ज़ेल', 'بريتزل', 'প্রেটজেল', 'pretzel', 'プレッツェル', 'פרעצל'),
    country: DE,
    ck: 'de',
    ing: t11('щёлочное тесто и соль', 'lye dough and salt', 'Laugenteig und Salz', '碱水面团和盐', 'masa de sosa y sal', 'लाइ आटा और नमक', 'عجينة قلوية وملح', 'লাই ডো আর নুন', 'massa de lixívia e sal', 'アルカリ生地と塩', 'בצק בורית ומלח'),
  },
  {
    id: 'currywurst',
    tier: 'medium',
    name: t11('карривурст', 'currywurst', 'Currywurst', '咖喱香肠', 'currywurst', 'करीवुर्स्ट', 'كاري فورست', 'কারিভুর্স্ট', 'currywurst', 'カリーヴルスト', 'קריוורסט'),
    country: DE,
    ck: 'de',
    ing: t11('колбаска и кетчуп с карри', 'sausage and curry ketchup', 'Wurst und Curryketchup', '香肠和咖喱番茄酱', 'salchicha y kétchup al curry', 'सॉसेज और करी केचप', 'نقانق وكاتشب كاري', 'সসেজ আর কারি কেচাপ', 'salsicha e ketchup de caril', 'ソーセージとカレーケチャップ', 'נקניקייה וקטשופ קארי'),
  },
  {
    id: 'khachapuri',
    tier: 'medium',
    sig: true,
    name: t11('хачапури', 'khachapuri', 'Chatschapuri', '哈恰普里', 'jachapuri', 'खाचापुरी', 'خاتشابوري', 'খাচাপুরি', 'khachapuri', 'ハチャプリ', 'חצ׳אפורי'),
    country: GE,
    ck: 'ge',
    ing: t11('лепёшка, сыр, яйцо', 'bread, cheese, egg', 'Brot, Käse, Ei', '面包、奶酪、蛋', 'pan, queso, huevo', 'रोटी, पनीर, अंडा', 'خبز وجبن وبيض', 'রুটি, পনির, ডিম', 'pão, queijo, ovo', 'パン、チーズ、卵', 'לחם, גבינה, ביצה'),
  },
  {
    id: 'plov',
    tier: 'medium',
    sig: true,
    name: t11('плов', 'plov', 'Plov', '抓饭', 'plov', 'प्लोव', 'بلوف', 'প্লভ', 'plov', 'プロフ', 'פלוב'),
    country: UZ,
    ck: 'uz',
    ing: t11('рис, баранина, морковь', 'rice, lamb, carrot', 'Reis, Lamm, Karotte', '米饭、羊肉、胡萝卜', 'arroz, cordero, zanahoria', 'चावल, मेमना, गाजर', 'أرز ولحم ضأن وجزر', 'ভাত, ভেড়া, গাজর', 'arroz, borrego, cenoura', 'ご飯、羊肉、にんじん', 'אורז, כבש, גזר'),
  },
  {
    id: 'falafel',
    tier: 'easy',
    sig: true,
    name: t11('фалафель', 'falafel', 'Falafel', '法拉费', 'falafel', 'फलाफल', 'فلافل', 'ফালাফেল', 'falafel', 'ファラフェル', 'פלאפל'),
    country: LB,
    ck: 'lb',
    ing: t11('нут и зелень', 'chickpeas and herbs', 'Kichererbsen und Kräuter', '鹰嘴豆和香草', 'garbanzos y hierbas', 'छोले और जड़ी', 'حمص وأعشاب', 'ছোলা আর শাক', 'grão e ervas', 'ひよこ豆とハーブ', 'חומוס ועשבים'),
  },
  {
    id: 'jollof',
    tier: 'medium',
    sig: true,
    name: t11('джоллоф', 'jollof rice', 'Jollof', '乔洛夫饭', 'arroz jollof', 'जॉलॉफ राइस', 'أرز جولوف', 'জোলফ ভাত', 'arroz jollof', 'ジョロフライス', 'אורז ג׳ולוף'),
    country: NG,
    ck: 'ng',
    ing: t11('рис, томат, перец', 'rice, tomato, pepper', 'Reis, Tomate, Paprika', '米饭、番茄、辣椒', 'arroz, tomate, pimiento', 'चावल, टमाटर, मिर्च', 'أرز وطماطم وفلفل', 'ভাত, টমেটো, মরিচ', 'arroz, tomate, pimento', 'ご飯、トマト、唐辛子', 'אורז, עגבנייה, פלפל'),
  },
  {
    id: 'pelmeni',
    tier: 'easy',
    sig: true,
    name: t11('пельмени', 'pelmeni', 'Pelmeni', '俄式饺子', 'pelmeni', 'पेल्मेनी', 'بيلميني', 'পেলমেনি', 'pelmeni', 'ペリメニ', 'פלמני'),
    country: RU,
    ck: 'ru',
    ing: t11('тесто и мясной фарш', 'dough and minced meat', 'Teig und Hackfleisch', '面皮和肉末', 'masa y carne picada', 'आटा और कीमा', 'عجينة ولحم مفروم', 'ডো আর কিমা', 'massa e carne picada', '生地とひき肉', 'בצק ובשר טחון'),
  },
  {
    id: 'meatballs',
    tier: 'easy',
    sig: true,
    name: t11('шведские фрикадельки', 'Swedish meatballs', 'Köttbullar', '瑞典肉丸', 'albóndigas suecas', 'स्वीडिश मीटबॉल', 'كرات لحم سويدية', 'সুইডিশ মিটবল', 'almôndegas suecas', 'スウェーデン風ミートボール', 'קציצות שוודיות'),
    country: SE,
    ck: 'se',
    ing: t11('фарш, сливочный соус, брусника', 'mince, cream sauce, lingonberry', 'Hack, Sahnesoße, Preiselbeere', '肉末、奶油酱、越橘', 'carne, salsa, arándano rojo', 'कीमा, क्रीम सॉस, लिंगनबेरी', 'لحم وصلصة وتوت', 'কিমা, ক্রিম সস, লিঙ্গনবেরি', 'carne, molho, arando', 'ひき肉、クリームソース、コケモモ', 'בשר, רוטב שמנת, לינגונברי'),
  },
  {
    id: 'schnitzel',
    tier: 'easy',
    sig: true,
    name: t11('шницель', 'schnitzel', 'Schnitzel', '炸肉排', 'escalope', 'श्निट्सेल', 'شنيتسل', 'শ্নিটসেল', 'schnitzel', 'シュニッツェル', 'שניצל'),
    country: AT,
    ck: 'at',
    ing: t11('отбивная в панировке', 'breaded cutlet', 'paniertes Schnitzel', '裹面包糠的肉排', 'filete empanado', 'ब्रेडेड कटलेट', 'شريحة مغطاة بالبقسماط', 'ব্রেডেড কাটলেট', 'costeleta panada', '衣をつけたカツ', 'קציצה בציפוי'),
  },
  {
    id: 'injera',
    tier: 'medium',
    sig: true,
    name: t11('ынджера', 'injera', 'Injera', '英杰拉', 'injera', 'इंजेरा', 'إنجيرا', 'ইনজেলা', 'injera', 'インジェラ', 'אינג׳רה'),
    country: ET,
    ck: 'et',
    ing: t11('лепёшка из тефа и рагу', 'teff flatbread and stew', 'Teff-Fladen und Eintopf', '画眉草饼和炖菜', 'pan de teff y estofado', 'टेफ रोटी और स्टू', 'خبز تيف ومرق', 'টেফ রুটি আর স্টু', 'pão de teff e guisado', 'テフのパンと煮込み', 'לחם טף ותבשיל'),
  },
  {
    id: 'empanada',
    tier: 'medium',
    sig: true,
    name: t11('эмпанада', 'empanada', 'Empanada', '肉馅饼', 'empanada', 'एम्पानाडा', 'إمبانادا', 'এম্পানাডা', 'empanada', 'エンパナーダ', 'אמפנדה'),
    country: AR,
    ck: 'ar',
    ing: t11('тесто и говяжья начинка', 'pastry and beef filling', 'Teig und Rindfüllung', '酥皮和牛肉馅', 'masa y relleno de carne', 'पेस्ट्री और बीफ भरावन', 'عجينة وحشوة لحم', 'পেস্ট্রি আর গরুর ভরাট', 'massa e recheio de vaca', '生地と牛肉の具', 'בצק ומילוי בקר'),
  },
]

function emit(dish: Dish): Array<ThemeItem | null> {
  const file = dish.photo ? { wikiFile: `/food/${dish.photo}.jpg` } : {}
  const rows: Array<ThemeItem | null> = [
    item(`di-${dish.id}`, 'dishToCuisine', dish.tier, dish.name, dish.country, dish.ck),
    item(`or-${dish.id}`, 'foodToOrigin', dish.tier, dish.ing, dish.name, dish.id),
    item(`in-${dish.id}`, 'dishToIngredients', dish.tier, dish.name, dish.ing, `${dish.id}-ing`),
  ]
  if (dish.sig) rows.push(item(`cu-${dish.id}`, 'cuisineToDish', dish.tier, dish.country, dish.name, dish.id))
  if (dish.photo) {
    rows.push(item(`ph-${dish.id}`, 'foodPhotoToDish', dish.tier, dish.name, dish.name, dish.id, file))
    if (dish.sig) rows.push(item(`pc-${dish.id}`, 'foodPhotoToCuisine', dish.tier, dish.name, dish.country, dish.ck, file))
  }
  return rows
}

export function foodGeneratedRows(): ThemeItem[] {
  return DISHES.flatMap(emit).filter((row): row is ThemeItem => row !== null)
}
