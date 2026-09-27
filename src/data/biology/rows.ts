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
  wikiFile?: string,
): ThemeItem | null {
  if (!isThemeMode(mode)) return null
  return { id, mode: mode as ThemeMode, tier, prompt, answer, key, ...(wikiFile ? { wikiFile } : {}) }
}

const MAMMAL = t11('млекопитающие', 'mammals', 'Säugetiere', '哺乳动物', 'mamíferos', 'स्तनधारी', 'ثدييات', 'স্তন্যপায়ী', 'mamíferos', '哺乳類', 'יונקים')
const BIRD = t11('птицы', 'birds', 'Vögel', '鸟类', 'aves', 'पक्षी', 'طيور', 'পাখি', 'aves', '鳥類', 'עופות')
const FISH = t11('рыбы', 'fish', 'Fische', '鱼类', 'peces', 'मछलियाँ', 'أسماك', 'মাছ', 'peixes', '魚類', 'דגים')
const AMPH = t11('земноводные', 'amphibians', 'Amphibien', '两栖动物', 'anfibios', 'उभयचर', 'برمائيات', 'উভচর', 'anfíbios', '両生類', 'דו־חיים')
const REPT = t11('пресмыкающиеся', 'reptiles', 'Reptilien', '爬行动物', 'reptiles', 'सरीसृप', 'زواحف', 'সরীসৃপ', 'répteis', '爬虫類', 'זוחלים')
const INSECT = t11('насекомые', 'insects', 'Insekten', '昆虫', 'insectos', 'कीट', 'حشرات', 'পোকা', 'insetos', '昆虫', 'חרקים')
const ARACH = t11('паукообразные', 'arachnids', 'Spinnentiere', '蛛形纲', 'arácnidos', 'अरैक्निड', 'عنكبيات', 'আরাকনিড', 'aracnídeos', 'クモ綱', 'עכבישניים')
const MOLL = t11('моллюски', 'molluscs', 'Weichtiere', '软体动物', 'moluscos', 'मोलस्क', 'رخويات', 'মলাস্ক', 'moluscos', '軟体動物', 'רכיכות')
const CRUST = t11('ракообразные', 'crustaceans', 'Krebstiere', '甲壳动物', 'crustáceos', 'क्रस्टेशियन', 'قشريات', 'ক্রাস্টেশিয়ান', 'crustáceos', '甲殻類', 'סרטנאים')
const ANNEL = t11('кольчатые черви', 'annelids', 'Ringelwürmer', '环节动物', 'anélidos', 'एनेलिड', 'حلقيات', 'অ্যানেলিড', 'anelídeos', '環形動物', 'תולעים טבעתיות')
const ECHIN = t11('иглокожие', 'echinoderms', 'Stachelhäuter', '棘皮动物', 'equinodermos', 'एकिनोडर्म', 'شوكيات الجلد', 'একাইনোডার্ম', 'equinodermos', '棘皮動物', 'קווצי עור')
const CNID = t11('стрекающие', 'cnidarians', 'Nesseltiere', '刺胞动物', 'cnidarios', 'निडारिया', 'لاسعات', 'নিডারিয়া', 'cnidários', '刺胞動物', 'צורבים')

const SAVANNA = t11('саванна', 'savanna', 'Savanne', '稀树草原', 'sabana', 'सवाना', 'سافانا', 'সাভানা', 'savana', 'サバンナ', 'סוואנה')
const ARCTIC = t11('Арктика', 'Arctic', 'Arktis', '北极', 'Ártico', 'आर्कटिक', 'القطب الشمالي', 'আর্কটিক', 'Ártico', '北極', 'הקוטב הצפוני')
const ANTARCTIC = t11('Антарктика', 'Antarctic', 'Antarktis', '南极', 'Antártida', 'अंटार्कटिक', 'القطب الجنوبي', 'অ্যান্টার্কটিকা', 'Antártida', '南極', 'אנטארקטיקה')
const OCEAN = t11('океан', 'ocean', 'Ozean', '海洋', 'océano', 'महासागर', 'محيط', 'মহাসাগর', 'oceano', '海', 'אוקיינוס')
const DESERT = t11('пустыня', 'desert', 'Wüste', '沙漠', 'desierto', 'मरुस्थल', 'صحراء', 'মরুভূমি', 'deserto', '砂漠', 'מדבר')
const REEF = t11('коралловый риф', 'coral reef', 'Korallenriff', '珊瑚礁', 'arrecife de coral', 'प्रवाल भित्ति', 'شعاب مرجانية', 'প্রবাল প্রাচীর', 'recife de coral', 'サンゴ礁', 'שונית אלמוגים')
const POND = t11('пруд', 'pond', 'Teich', '池塘', 'estanque', 'तालाब', 'بركة', 'পুকুর', 'lagoa', '池', 'בריכה')
const GRASS = t11('луг', 'grassland', 'Grasland', '草原', 'pradera', 'घास का मैदान', 'مروج', 'তৃণভূমি', 'pradaria', '草原', 'עשב')
const RAIN = t11('тропический лес', 'rainforest', 'Regenwald', '雨林', 'selva', 'वर्षावन', 'غابة مطيرة', 'বৃষ্টিঅরণ্য', 'floresta tropical', '熱帯雨林', 'יער גשם')
const WOODS = t11('эвкалиптовый лес', 'eucalyptus woods', 'Eukalyptuswald', '桉树林', 'bosque de eucaliptos', 'यूकलिप्टस वन', 'غابة أوكالبتوس', 'ইউক্যালিপটাস বন', 'bosque de eucalipto', 'ユーカリ林', 'יער אקליפטוס')
const BAMBOO = t11('бамбуковый лес', 'bamboo forest', 'Bambuswald', '竹林', 'bosque de bambú', 'बाँस का जंगल', 'غابة خيزران', 'বাঁশবন', 'floresta de bambu', '竹林', 'יער במבוק')
const RIVER = t11('река', 'river', 'Fluss', '河流', 'río', 'नदी', 'نهر', 'নদী', 'rio', '川', 'נהר')

type Klass = { label: L11; key: string }
type Home = { label: L11; key: string }

type Species = {
  id: string
  tier: ThemeTier
  name: L11
  file: string
  klass?: Klass
  home?: Home
}

const SPECIES: Species[] = [
  { id: 'lion', tier: 'easy', name: t11('лев', 'lion', 'Löwe', '狮', 'león', 'शेर', 'أسد', 'সিংহ', 'leão', 'ライオン', 'אריה'), file: '020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg', klass: { label: MAMMAL, key: 'mammal' }, home: { label: SAVANNA, key: 'savanna' } },
  { id: 'panda', tier: 'easy', name: t11('большая панда', 'giant panda', 'Großer Panda', '大熊猫', 'panda gigante', 'जायंट पांडा', 'باندا عملاق', 'জায়ান্ট পান্ডা', 'panda-gigante', 'ジャイアントパンダ', 'פנדה ענק'), file: 'Grosser_Panda.JPG', klass: { label: MAMMAL, key: 'mammal' }, home: { label: BAMBOO, key: 'bamboo' } },
  { id: 'polar', tier: 'easy', name: t11('белый медведь', 'polar bear', 'Eisbär', '北极熊', 'oso polar', 'ध्रुवीय भालू', 'دب قطبي', 'মেরু ভালুক', 'urso-polar', 'ホッキョクグマ', 'דוב קוטב'), file: 'Polar_Bear_-_Alaska_(cropped).jpg', klass: { label: MAMMAL, key: 'mammal' }, home: { label: ARCTIC, key: 'arctic' } },
  { id: 'eagle', tier: 'easy', name: t11('белоголовый орлан', 'bald eagle', 'Weißkopfseeadler', '白头海雕', 'águila calva', 'बाल्ड ईगल', 'عقاب رخماء', 'বল্ড ঈগল', 'águia-careca', 'ハクトウワシ', 'עיטם לבן-ראש'), file: 'Bald_eagle_about_to_fly_in_Alaska_(2016).jpg', klass: { label: BIRD, key: 'bird' } },
  { id: 'penguin', tier: 'easy', name: t11('императорский пингвин', 'emperor penguin', 'Kaiserpinguin', '帝企鹅', 'pingüino emperador', 'सम्राट पेंगुइन', 'بطريق إمبراطور', 'সম্রাট পেঙ্গুইন', 'pinguim-imperador', 'コウテイペンギン', 'פינגווין קיסרי'), file: 'Aptenodytes_forsteri_-Snow_Hill_Island,_Antarctica_-adults_and_juvenile-8.jpg', klass: { label: BIRD, key: 'bird' }, home: { label: ANTARCTIC, key: 'antarctic' } },
  { id: 'shark', tier: 'easy', name: t11('белая акула', 'great white shark', 'Weißer Hai', '大白鲨', 'gran tiburón blanco', 'ग्रेट व्हाइट शार्क', 'قرش أبيض كبير', 'গ্রেট হোয়াইট শার্ক', 'tubarão-branco', 'ホホジロザメ', 'עמלץ לבן'), file: 'White_shark.jpg', klass: { label: FISH, key: 'fish' } },
  { id: 'frog', tier: 'easy', name: t11('квакша', 'tree frog', 'Laubfrosch', '树蛙', 'ranita de San Antonio', 'वृक्ष मेंढक', 'ضفدع الشجر', 'গাছের ব্যাঙ', 'rela', 'アマガエル', 'אילנית'), file: 'European_tree_frog_(Hyla_arborea)_on_hemp-agrimony_(Eupatorium_cannabinum).jpg', klass: { label: AMPH, key: 'amph' }, home: { label: POND, key: 'pond' } },
  { id: 'bee', tier: 'easy', name: t11('медоносная пчела', 'honey bee', 'Honigbiene', '蜜蜂', 'abeja melífera', 'मधुमक्खी', 'نحل العسل', 'মৌমাছি', 'abelha-melífera', 'ミツバチ', 'דבורה'), file: 'Apis_mellifera_Western_honey_bee.jpg', klass: { label: INSECT, key: 'insect' } },
  { id: 'kangaroo', tier: 'easy', name: t11('кенгуру', 'kangaroo', 'Känguru', '袋鼠', 'canguro', 'कंगारू', 'كنغر', 'ক্যাঙ্গারু', 'canguru', 'カンガルー', 'קנגורו'), file: 'Forester_kangaroo_(Macropus_giganteus_tasmaniensis)_juvenile_hopping_Esk_Valley.jpg', klass: { label: MAMMAL, key: 'mammal' }, home: { label: GRASS, key: 'grass' } },
  { id: 'oak', tier: 'easy', name: t11('дуб черешчатый', 'English oak', 'Stieleiche', '夏栎', 'roble común', 'अंग्रेज़ी ओक', 'بلوط إنجليزي', 'ইংরেজি ওক', 'carvalho-roble', 'ヨーロッパナラ', 'אלון אנגלי'), file: 'Quercus_robur.jpg' },
  { id: 'sunflower', tier: 'easy', name: t11('подсолнечник', 'sunflower', 'Sonnenblume', '向日葵', 'girasol', 'सूरजमुखी', 'دوار الشمس', 'সূর্যমুখী', 'girassol', 'ヒマワリ', 'חמנייה'), file: 'Sunflower_sky_backdrop.jpg' },
  { id: 'tiger', tier: 'medium', name: t11('тигр', 'tiger', 'Tiger', '虎', 'tigre', 'बाघ', 'نمر', 'বাঘ', 'tigre', 'トラ', 'טיגריס'), file: 'Bengal_tiger_(Panthera_tigris_tigris)_female_3_crop.jpg', klass: { label: MAMMAL, key: 'mammal' } },
  { id: 'whale', tier: 'medium', name: t11('горбатый кит', 'humpback whale', 'Buckelwal', '座头鲸', 'ballena jorobada', 'हंपबैक व्हेल', 'حوت أحدب', 'হাম্পব্যাক তিমি', 'baleia-jubarte', 'ザトウクジラ', 'לווייתן גדול-סנפיר'), file: 'Humpback_whale_breaching_off_Cabo_San_Lucas.jpg', klass: { label: MAMMAL, key: 'mammal' }, home: { label: OCEAN, key: 'ocean' } },
  { id: 'macaw', tier: 'medium', name: t11('красный ара', 'scarlet macaw', 'Scharlachara', '绯红金刚鹦鹉', 'guacamayo rojo', 'स्कार्लेट मैकॉ', 'مكاو قرمزي', 'স্কারলেট ম্যাকাও', 'arara-vermelha', 'コンゴウインコ', 'ארה אדום'), file: 'Scarlet_macaw_(Ara_macao_cyanopterus)_Copan.jpg', klass: { label: BIRD, key: 'bird' }, home: { label: RAIN, key: 'rain' } },
  { id: 'owl', tier: 'medium', name: t11('сипуха', 'barn owl', 'Schleiereule', '仓鸮', 'lechuza', 'खलिहान उल्लू', 'بومة المخازن', 'শস্যাগার পেঁচা', 'coruja-das-torres', 'メンフクロウ', 'תנשמת'), file: 'American_Barn_Owl_(Tyto_furcata_guatemalae),_Orange_Walk.jpg', klass: { label: BIRD, key: 'bird' } },
  { id: 'clownfish', tier: 'medium', name: t11('рыба-клоун', 'clownfish', 'Anemonenfisch', '小丑鱼', 'pez payaso', 'क्लाउनफ़िश', 'سمكة المهرج', 'ক্লাউনফিশ', 'peixe-palhaço', 'クマノミ', 'דג ליצן'), file: 'Amphiprion_ocellaris_(Clown_anemonefish)_by_Nick_Hobgood.jpg', klass: { label: FISH, key: 'fish' }, home: { label: REEF, key: 'reef' } },
  { id: 'cobra', tier: 'medium', name: t11('индийская кобра', 'Indian cobra', 'Indische Kobra', '印度眼镜蛇', 'cobra india', 'भारतीय नाग', 'كوبرا هندية', 'ভারতীয় গোখরা', 'naja-indiana', 'インドコブラ', 'פתן הודי'), file: 'Indian_Cobra,_crop.jpg', klass: { label: REPT, key: 'rept' } },
  { id: 'butterfly', tier: 'medium', name: t11('бабочка-монарх', 'monarch butterfly', 'Monarchfalter', '黑脉金斑蝶', 'mariposa monarca', 'मोनार्क तितली', 'فراشة الملك', 'মোনার্ক প্রজাপতি', 'borboleta-monarca', 'オオカバマダラ', 'דנאית מלכותית'), file: 'Monarch_Butterfly_Danaus_plexippus_Male_2664px.jpg', klass: { label: INSECT, key: 'insect' } },
  { id: 'spider', tier: 'medium', name: t11('паук-крестовик', 'garden spider', 'Gartenkreuzspinne', '十字园蛛', 'araña de jardín', 'बगीचे की मकड़ी', 'عنكبوت الحديقة', 'বাগানের মাকড়সা', 'aranha-de-jardim', 'オニグモ', 'כסופי עכביש'), file: 'Araneus_diadematus_MHNT_Femelle_Fronton.jpg', klass: { label: ARACH, key: 'arach' } },
  { id: 'crab', tier: 'medium', name: t11('краб съедобный', 'edible crab', 'Taschenkrebs', '食用黄道蟹', 'buey de mar', 'खाने योग्य केकड़ा', 'سلطعون صالح للأكل', 'ভক্ষ্য কাঁকড়া', 'sapateira', 'ヨーロッパカニ', 'סרטן מאכל'), file: 'Cancer_pagurus.jpg', klass: { label: CRUST, key: 'crust' } },
  { id: 'dolphin', tier: 'medium', name: t11('афалина', 'bottlenose dolphin', 'Großer Tümmler', '宽吻海豚', 'delfín mular', 'बॉटलनोज़ डॉल्फ़िन', 'دلفين قاروري', 'বোতলনাক ডলফিন', 'golfinho-roaz', 'バンドウイルカ', 'דולפין סטנלה'), file: 'Tursiops_truncatus_01-cropped.jpg', klass: { label: MAMMAL, key: 'mammal' } },
  { id: 'camel', tier: 'medium', name: t11('одногорбый верблюд', 'dromedary', 'Dromedar', '单峰驼', 'dromedario', 'ड्रोमेडरी', 'جمل عربي', 'এককুঁজ উট', 'dromedário', 'ヒトコブラクダ', 'גמל חד-דבשתי'), file: 'Camelus_dromedarius_in_Nuweiba.jpg', klass: { label: MAMMAL, key: 'mammal' }, home: { label: DESERT, key: 'desert' } },
  { id: 'cactus', tier: 'medium', name: t11('сагуаро', 'saguaro', 'Saguaro', '巨柱仙人掌', 'saguaro', 'सगुआरो', 'صبار ساجوارو', 'সাগুয়ারো', 'saguaro', 'ベンケイチュウ', 'סגווארו'), file: 'Carnegiea_gigantea_in_Saguaro_National_Park_near_Tucson,_Arizona_during_November_(58).jpg' },
  { id: 'mushroom', tier: 'medium', name: t11('шампиньон', 'button mushroom', 'Champignon', '双孢蘑菇', 'champiñón', 'बटन मशरूम', 'فطر عيش الغراب', 'বাটন মাশরুম', 'cogumelo-paris', 'マッシュルーム', 'פטריית שמפיניון'), file: 'ChampignonMushroom.jpg' },
  { id: 'koala', tier: 'hard', name: t11('коала', 'koala', 'Koala', '考拉', 'koala', 'कोआला', 'كوالا', 'কোয়ালা', 'coala', 'コアラ', 'קואלה'), file: 'Koala_climbing_tree.jpg', klass: { label: MAMMAL, key: 'mammal' }, home: { label: WOODS, key: 'woods' } },
  { id: 'seahorse', tier: 'hard', name: t11('морской конёк', 'seahorse', 'Seepferdchen', '海马', 'caballito de mar', 'समुद्री घोड़ा', 'فرس البحر', 'সমুদ্রঘোড়া', 'cavalo-marinho', 'タツノオトシゴ', 'סוסון ים'), file: 'Hippocampus_hippocampus_(on_Ascophyllum_nodosum).jpg', klass: { label: FISH, key: 'fish' } },
  { id: 'salmon', tier: 'hard', name: t11('атлантический лосось', 'Atlantic salmon', 'Atlantischer Lachs', '大西洋鲑', 'salmón atlántico', 'अटलांटिक सैमन', 'سلمون أطلسي', 'আটলান্টিক স্যামন', 'salmão-do-atlântico', 'タイセイヨウサケ', 'סלמון אטלנטי'), file: 'Wst_atlantischer_lachs_stoer_001.jpg', klass: { label: FISH, key: 'fish' }, home: { label: RIVER, key: 'river' } },
  { id: 'chameleon', tier: 'hard', name: t11('йеменский хамелеон', 'veiled chameleon', 'Jemen-Chamäleon', '高冠变色龙', 'camaleón de Yemen', 'वेल्ड गिरगिट', 'حرباء يمنية', 'ইয়েমেনি গিরগিটি', 'camaleão-do-iémen', 'エボシカメレオン', 'זיקית תימנית'), file: 'Yemen_Chameleon.jpg', klass: { label: REPT, key: 'rept' } },
  { id: 'scorpion', tier: 'hard', name: t11('императорский скорпион', 'emperor scorpion', 'Kaiserskorpion', '帝王蝎', 'escorpión emperador', 'सम्राट बिच्छू', 'عقرب إمبراطور', 'সম্রাট বৃশ্চিক', 'escorpião-imperador', 'ダイオウサソリ', 'עקרב קיסרי'), file: 'Female_Emperor_Scorpion.jpg', klass: { label: ARACH, key: 'arach' } },
  { id: 'octopus', tier: 'hard', name: t11('обыкновенный осьминог', 'common octopus', 'Gewöhnlicher Krake', '真蛸', 'pulpo común', 'सामान्य ऑक्टोपस', 'أخطبوط شائع', 'সাধারণ অক্টোপাস', 'polvo-comum', 'マダコ', 'תמנון מצוי'), file: 'Octopus2.jpg', klass: { label: MOLL, key: 'moll' } },
  { id: 'worm', tier: 'hard', name: t11('дождевой червь', 'earthworm', 'Regenwurm', '蚯蚓', 'lombriz de tierra', 'केंचुआ', 'دودة الأرض', 'কেঁচো', 'minhoca', 'ミミズ', 'תולעת אדמה'), file: 'Regenwurm1.jpg', klass: { label: ANNEL, key: 'annel' } },
  { id: 'jelly', tier: 'hard', name: t11('ушастая медуза', 'moon jelly', 'Ohrenqualle', '海月水母', 'medusa luna', 'मून जेली', 'قنديل القمر', 'চাঁদ জেলি', 'medusa-da-lua', 'ミズクラゲ', 'מדוזה סהרונית'), file: 'Aurelia_aurita_(Cnidaria)_Luc_Viatour.jpg', klass: { label: CNID, key: 'cnid' } },
  { id: 'starfish', tier: 'hard', name: t11('морская звезда', 'common starfish', 'Gemeiner Seestern', '海星', 'estrella de mar', 'सामान्य तारा मछली', 'نجم البحر', 'সাধারণ তারামাছ', 'estrela-do-mar', 'ヒトデ', 'כוכב ים'), file: 'Asterias_rubens.jpg', klass: { label: ECHIN, key: 'echin' } },
  { id: 'flytrap', tier: 'hard', name: t11('венерина мухоловка', 'Venus flytrap', 'Venusfliegenfalle', '捕蝇草', 'venus atrapamoscas', 'वीनस फ्लाईट्रैप', 'خناق الذباب', 'ভিনাস ফ্লাইট্র্যাপ', 'dioneia', 'ハエトリグサ', 'דיונאה'), file: 'Venus_Flytrap_showing_trigger_hairs.jpg' },
  { id: 'agaric', tier: 'hard', name: t11('мухомор красный', 'fly agaric', 'Fliegenpilz', '毒蝇伞', 'matamoscas', 'फ्लाई एगारिक', 'فطريات الذباب', 'ফ্লাই অ্যাগারিক', 'agário-das-moscas', 'ベニテングタケ', 'אמנית הזבובים'), file: 'Amanita_muscaria_Aberystwyth_2023.jpg' },
  { id: 'fox', tier: 'medium', name: t11('обыкновенная лисица', 'red fox', 'Rotfuchs', '赤狐', 'zorro rojo', 'लाल लोमड़ी', 'ثعلب أحمر', 'লাল শিয়াল', 'raposa-vermelha', 'アカギツネ', 'שועל מצוי'), file: 'Portrait_of_a_red_fox_in_Rautas_fjällurskog_(cropped).jpg', klass: { label: MAMMAL, key: 'mammal' } },
  { id: 'wolf', tier: 'medium', name: t11('серый волк', 'gray wolf', 'Wolf', '灰狼', 'lobo gris', 'धूसर भेड़िया', 'ذئب رمادي', 'ধূসর নেকড়ে', 'lobo-cinzento', 'タイリクオオカミ', 'זאב אפור'), file: 'Eurasian_wolf_2.jpg', klass: { label: MAMMAL, key: 'mammal' } },
  { id: 'giraffe', tier: 'easy', name: t11('жираф', 'giraffe', 'Giraffe', '长颈鹿', 'jirafa', 'जिराफ़', 'زرافة', 'জিরাফ', 'girafa', 'キリン', 'ג׳ירף'), file: 'Giraffe_Mikumi_National_Park.jpg', klass: { label: MAMMAL, key: 'mammal' } },
  { id: 'hedgehog', tier: 'easy', name: t11('обыкновенный ёж', 'European hedgehog', 'Braunbrustigel', '欧洲刺猬', 'erizo europeo', 'यूरोपीय हेजहॉग', 'قنفذ أوروبي', 'ইউরোপীয় হেজহগ', 'ouriço-europeu', 'ハリネズミ', 'קיפוד מצוי'), file: 'Erinaceus_europaeus_LC0119.jpg', klass: { label: MAMMAL, key: 'mammal' } },
  { id: 'swan', tier: 'easy', name: t11('лебедь-шипун', 'mute swan', 'Höckerschwan', '疣鼻天鹅', 'cisne blanco', 'म्यूट स्वान', 'تم صامت', 'মূক রাজহাঁস', 'cisne-branco', 'コブハクチョウ', 'ברבור מצוי'), file: 'CygneVaires.jpg', klass: { label: BIRD, key: 'bird' } },
  { id: 'croc', tier: 'medium', name: t11('нильский крокодил', 'Nile crocodile', 'Nilkrokodil', '尼罗鳄', 'cocodrilo del Nilo', 'नील मगरमच्छ', 'تمساح النيل', 'নীল কুমির', 'crocodilo-do-nilo', 'ナイルワニ', 'תנין היאור'), file: 'NileCrocodile.jpg', klass: { label: REPT, key: 'rept' } },
  { id: 'turtle', tier: 'medium', name: t11('зелёная черепаха', 'green sea turtle', 'Suppenschildkröte', '绿海龟', 'tortuga verde', 'हरा समुद्री कछुआ', 'سلحفاة خضراء', 'সবুজ সামুদ্রিক কাছিম', 'tartaruga-verde', 'アオウミガメ', 'צב ים ירוק'), file: 'Green_sea_turtle_(Chelonia_mydas)_Moorea.jpg', klass: { label: REPT, key: 'rept' } },
  { id: 'snake', tier: 'easy', name: t11('обыкновенный уж', 'grass snake', 'Ringelnatter', '水游蛇', 'culebra de collar', 'घास का साँप', 'ثعبان العشب', 'ঘাসের সাপ', 'cobra-de-água', 'ヨーロッパヤマカガシ', 'נחש מים'), file: 'Grass_snake_(Natrix_natrix)_Pieniny.jpg', klass: { label: REPT, key: 'rept' } },
  { id: 'ladybug', tier: 'easy', name: t11('семиточечная коровка', 'seven-spot ladybird', 'Siebenpunkt-Marienkäfer', '七星瓢虫', 'mariquita de siete puntos', 'सात-बिंदु लेडीबर्ड', 'دعسوقة سباعية', 'সাত-বিন্দু লেডিবার্ড', 'joaninha-de-sete-pintas', 'ナナホシテントウ', 'מושית השבע'), file: '7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg', klass: { label: INSECT, key: 'insect' } },
  { id: 'ant', tier: 'medium', name: t11('рыжий лесной муравей', 'red wood ant', 'Rote Waldameise', '红林蚁', 'hormiga roja', 'लाल लकड़ी चींटी', 'نمل الخشب الأحمر', 'লাল কাঠপিঁপড়া', 'formiga-vermelha', 'アカヤマアリ', 'נמלה אדומה'), file: 'A_Formica_rufa_sideview.jpg', klass: { label: INSECT, key: 'insect' } },
  { id: 'dragonfly', tier: 'medium', name: t11('дозорщик-император', 'emperor dragonfly', 'Große Königslibelle', '帝王伟蜓', 'libélula emperador', 'सम्राट व्याध पतंग', 'يعسوب إمبراطور', 'সম্রাট ফড়িং', 'libélula-imperador', 'ギンヤンマ', 'שפירית הקיסר'), file: 'Anax_imperator_qtl2.jpg', klass: { label: INSECT, key: 'insect' } },
  { id: 'snail', tier: 'medium', name: t11('виноградная улитка', 'garden snail', 'Weinbergschnecke', '葡萄蜗牛', 'caracol de jardín', 'बगीचे का घोंघा', 'حلزون الحديقة', 'বাগানের শামুক', 'caracol-de-jardim', 'エスカルゴ', 'חילזון הגינה'), file: 'Snail1web.jpg', klass: { label: MOLL, key: 'moll' } },
  { id: 'rose', tier: 'easy', name: t11('шиповник', 'wild rose', 'Weinrose', '蔷薇', 'rosa silvestre', 'जंगली गुलाब', 'ورد بري', 'বুনো গোলাপ', 'rosa-silvestre', 'バラ', 'ורד בר'), file: 'Rosa_rubiginosa_1.jpg' },
  { id: 'pine', tier: 'medium', name: t11('сосна обыкновенная', 'Scots pine', 'Waldkiefer', '欧洲赤松', 'pino silvestre', 'स्कॉट्स पाइन', 'صنوبر اسكتلندي', 'স্কটস পাইন', 'pinheiro-silvestre', 'ヨーロッパアカマツ', 'אורן היערות'), file: 'Skuleskogen_pine.jpg' },
  { id: 'fern', tier: 'hard', name: t11('орляк', 'bracken', 'Adlerfarn', '蕨', 'helecho águila', 'ब्रैकन', 'سرخس', 'ব্র্যাকেন', 'feto-águia', 'ワラビ', 'שרך'), file: 'Pteridium_aquilinum_nf.jpg' },
  { id: 'apple', tier: 'easy', name: t11('яблоко', 'apple', 'Apfel', '苹果', 'manzana', 'सेब', 'تفاح', 'আপেল', 'maçã', 'リンゴ', 'תפוח'), file: 'Pink_lady_and_cross_section.jpg' },
  { id: 'dandelion', tier: 'hard', name: t11('одуванчик', 'dandelion', 'Löwenzahn', '蒲公英', 'diente de león', 'डंडेलियन', 'هندباء', 'ড্যান্ডেলিয়ন', 'dente-de-leão', 'タンポポ', 'שן ארי'), file: 'Taraxacum_officinale_-_Köhler–s_Medizinal-Pflanzen-135.jpg' },
]

/** Lead photo for the older animal → class cards, same file as the species set. */
export const BIO_CLASS_PHOTO: Record<string, string> = {
  lion: '020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg',
  eagle: 'Bald_eagle_about_to_fly_in_Alaska_(2016).jpg',
  shark: 'White_shark.jpg',
  frog: 'European_tree_frog_(Hyla_arborea)_on_hemp-agrimony_(Eupatorium_cannabinum).jpg',
  snake: 'Grass_snake_(Natrix_natrix)_Pieniny.jpg',
  bee: 'Apis_mellifera_Western_honey_bee.jpg',
  spider: 'Araneus_diadematus_MHNT_Femelle_Fronton.jpg',
  snail: 'Snail1web.jpg',
  crab: 'Cancer_pagurus.jpg',
  worm: 'Regenwurm1.jpg',
}

type Scientist = {
  id: string
  tier: ThemeTier
  name: L11
  idea: L11
  ideaKey: string
  file?: string
}

const SCIENTISTS: Scientist[] = [
  { id: 'darwin', tier: 'easy', name: t11('Чарльз Дарвин', 'Charles Darwin', 'Charles Darwin', '查尔斯·达尔文', 'Charles Darwin', 'चार्ल्स डार्विन', 'تشارلز داروين', 'চার্লস ডারউইন', 'Charles Darwin', 'チャールズ・ダーウィン', 'צ׳ארלס דרווין'), idea: t11('естественный отбор', 'natural selection', 'natürliche Selektion', '自然选择', 'selección natural', 'प्राकृतिक चयन', 'الانتقاء الطبيعي', 'প্রাকৃতিক নির্বাচন', 'seleção natural', '自然選択', 'ברירה טבעית'), ideaKey: 'selection', file: 'Charles_Darwin_seated_crop.jpg' },
  { id: 'mendel', tier: 'easy', name: t11('Грегор Мендель', 'Gregor Mendel', 'Gregor Mendel', '格雷戈尔·孟德尔', 'Gregor Mendel', 'ग्रेगर मेंडल', 'غريغور مندل', 'গ্রেগর মেন্ডেল', 'Gregor Mendel', 'グレゴール・メンデル', 'גרגור מנדל'), idea: t11('законы наследственности', 'laws of inheritance', 'Vererbungsregeln', '遗传定律', 'leyes de la herencia', 'वंशानुक्रम के नियम', 'قوانين الوراثة', 'বংশগতির সূত্র', 'leis da hereditariedade', '遺伝の法則', 'חוקי התורשה'), ideaKey: 'inheritance', file: 'Gregor_Mendel_2.jpg' },
  { id: 'linnaeus', tier: 'easy', name: t11('Карл Линней', 'Carl Linnaeus', 'Carl von Linné', '卡尔·林奈', 'Carlos Linneo', 'कार्ल लीनियस', 'كارل لينيوس', 'কার্ল লিনিয়াস', 'Carlos Lineu', 'カール・リンネ', 'קארל לינאוס'), idea: t11('двойные названия видов', 'two-part species names', 'zweiteilige Artnamen', '双名法', 'nombres dobles de especies', 'द्विपद नाम', 'أسماء الأنواع المزدوجة', 'দ্বিপদ নাম', 'nomes duplos das espécies', '二名法', 'שמות דו-שמיים'), ideaKey: 'binomial', file: 'Carl_von_Linné.jpg' },
  { id: 'pavlov', tier: 'easy', name: t11('Иван Павлов', 'Ivan Pavlov', 'Iwan Pawlow', '伊万·巴甫洛夫', 'Iván Pávlov', 'इवान पावलोव', 'إيفان بافلوف', 'ইভান পাভলভ', 'Ivan Pavlov', 'イワン・パブロフ', 'איוואן פבלוב'), idea: t11('условный рефлекс', 'conditioned reflex', 'bedingter Reflex', '条件反射', 'reflejo condicionado', 'अनुबंधित प्रतिवर्त', 'المنعكس الشرطي', 'সাপেক্ষ প্রতিবর্ত', 'reflexo condicionado', '条件反射', 'התניה קלאסית'), ideaKey: 'reflex', file: 'Ivan_Pavlov_NLM3.jpg' },
  { id: 'leeuwenhoek', tier: 'medium', name: t11('Антони ван Левенгук', 'Antonie van Leeuwenhoek', 'Antoni van Leeuwenhoek', '安东尼·范·列文虎克', 'Anton van Leeuwenhoek', 'एंटोनी वैन लीउवेनहुक', 'أنطوني فان ليفينهوك', 'আন্তনি ফান লিউয়েনহুক', 'Antonie van Leeuwenhoek', 'アントニ・ファン・レーウェンフック', 'אנטוני ואן לוונהוק'), idea: t11('увидел живой микромир', 'saw living microbes', 'sah lebende Mikroben', '看见活的微生物', 'vio microbios vivos', 'जीवित सूक्ष्मजीव देखे', 'رأى ميكروبات حية', 'জীবন্ত জীবাণু দেখেছিলেন', 'viu micróbios vivos', '生きた微生物を見た', 'ראה יצורים זעירים חיים'), ideaKey: 'microbes', file: 'Anthonie_van_Leeuwenhoek_(1632-1723)._Natuurkundige_te_Delft_Rijksmuseum_SK-A-957.jpeg' },
  { id: 'harvey', tier: 'medium', name: t11('Уильям Гарвей', 'William Harvey', 'William Harvey', '威廉·哈维', 'William Harvey', 'विलियम हार्वे', 'ويليام هارفي', 'উইলিয়াম হার্ভে', 'William Harvey', 'ウィリアム・ハーヴェイ', 'ויליאם הארווי'), idea: t11('круги кровообращения', 'blood circulation', 'Blutkreislauf', '血液循环', 'circulación de la sangre', 'रक्त परिसंचरण', 'الدورة الدموية', 'রক্ত সঞ্চালন', 'circulação do sangue', '血液循環', 'מחזור הדם'), ideaKey: 'circulation', file: 'William_Harvey_2.jpg' },
  { id: 'carson', tier: 'medium', name: t11('Рейчел Карсон', 'Rachel Carson', 'Rachel Carson', '蕾切尔·卡森', 'Rachel Carson', 'रेचल कार्सन', 'راشيل كارسون', 'রেচেল কার্সন', 'Rachel Carson', 'レイチェル・カーソン', 'רייצ׳ל קרסון'), idea: t11('вред пестицидов для природы', 'harm of pesticides', 'Schaden durch Pestizide', '农药的危害', 'daño de los pesticidas', 'कीटनाशकों का नुकसान', 'ضرر المبيدات', 'কীটনাশকের ক্ষতি', 'dano dos pesticidas', '農薬の害', 'נזק של חומרי הדברה'), ideaKey: 'pesticides', file: 'Rachel-Carson.jpg' },
  { id: 'franklin', tier: 'medium', name: t11('Розалинд Франклин', 'Rosalind Franklin', 'Rosalind Franklin', '罗莎琳德·富兰克林', 'Rosalind Franklin', 'रोज़लिंड फ्रैंकलिन', 'روزاليند فرانكلين', 'রोजালিন্ড ফ্র্যাঙ্কলিন', 'Rosalind Franklin', 'ロザリンド・フランクリン', 'רוזלינד פרנקלין'), idea: t11('структура ДНК', 'structure of DNA', 'Struktur der DNA', 'DNA 结构', 'estructura del ADN', 'डीएनए की संरचना', 'بنية الحمض النووي', 'ডিএনএর গঠন', 'estrutura do ADN', 'DNAの構造', 'מבנה ה-DNA'), ideaKey: 'dna', file: 'Rosalind_Franklin_(retouched).jpg' },
  { id: 'hooke', tier: 'medium', name: t11('Роберт Гук', 'Robert Hooke', 'Robert Hooke', '罗伯特·胡克', 'Robert Hooke', 'रॉबर्ट हुक', 'روبرت هوك', 'রবার্ট হুক', 'Robert Hooke', 'ロバート・フック', 'רוברט הוק'), idea: t11('дал имя клетке', 'named the cell', 'benannte die Zelle', '命名了细胞', 'dio nombre a la célula', 'कोशिका का नाम दिया', 'سمّى الخلية', 'কোষের নাম দিয়েছিলেন', 'deu nome à célula', '細胞と名付けた', 'נתן לתא את שמו'), ideaKey: 'cell' },
  { id: 'vesalius', tier: 'hard', name: t11('Андреас Везалий', 'Andreas Vesalius', 'Andreas Vesalius', '安德烈亚斯·维萨里', 'Andrés Vesalio', 'आंद्रेयास वेसालियस', 'أندرياس فيزاليوس', 'আন্দ্রেয়াস ভেসালিয়াস', 'Andreas Vesalius', 'アンドレアス・ヴェサリウス', 'אנדריאס וסאליוס'), idea: t11('атлас анатомии человека', 'human anatomy atlas', 'Atlas der Anatomie', '人体解剖图谱', 'atlas de anatomía humana', 'मानव शरीर रचना एटलस', 'أطلس تشريح الإنسان', 'মানব শারীরস্থান মানচিত্র', 'atlas de anatomia humana', '人体解剖図譜', 'אטלס אנטומיה'), ideaKey: 'anatomy', file: 'Man_dressed_in_Black_by_Calcar_(Hermitage).jpg' },
  { id: 'merian', tier: 'hard', name: t11('Мария Сибилла Мериан', 'Maria Sibylla Merian', 'Maria Sibylla Merian', '玛丽亚·西比拉·梅里安', 'Maria Sibylla Merian', 'मारिया सिबिला मेरियन', 'ماريا سيبيلا ميريان', 'মারিয়া সিবিলা মেরিয়ান', 'Maria Sibylla Merian', 'マリア・ジビラ・メーリアン', 'מריה זיבילה מריאן'), idea: t11('метаморфоз насекомых', 'insect metamorphosis', 'Metamorphose der Insekten', '昆虫变态', 'metamorfosis de insectos', 'कीट कायांतरण', 'تحول الحشرات', 'পতঙ্গের রূপান্তর', 'metamorfose dos insetos', '昆虫の変態', 'גלגול חרקים'), ideaKey: 'metamorphosis', file: 'Bildnis_der_Maria_Sibylla_Merian,_1679.jpg' },
  { id: 'mcclintock', tier: 'hard', name: t11('Барбара Макклинток', 'Barbara McClintock', 'Barbara McClintock', '芭芭拉·麦克林托克', 'Barbara McClintock', 'बारबरा मैक्लिंटॉक', 'باربرا مكلينتوك', 'বারবারা ম্যাকলিন্টক', 'Barbara McClintock', 'バーバラ・マクリントック', 'ברברה מקלינטוק'), idea: t11('прыгающие гены', 'jumping genes', 'springende Gene', '跳跃基因', 'genes saltarines', 'कूदते जीन', 'جينات قافزة', 'লাফানো জিন', 'genes saltadores', '動く遺伝子', 'גנים קופצים'), ideaKey: 'jumping', file: 'Barbara_McClintock_(1902-1992)_shown_in_her_laboratory_in_1947.jpg' },
  { id: 'humboldt', tier: 'hard', name: t11('Александр фон Гумбольдт', 'Alexander von Humboldt', 'Alexander von Humboldt', '亚历山大·冯·洪堡', 'Alexander von Humboldt', 'अलेक्जेंडर वॉन हम्बोल्ट', 'ألكسندر فون هومبولت', 'আলেকজান্ডার ফন হুমবোল্ট', 'Alexander von Humboldt', 'アレクサンダー・フォン・フンボルト', 'אלכסנדר פון הומבולדט'), idea: t11('география растений', 'plant geography', 'Pflanzengeographie', '植物地理学', 'geografía de las plantas', 'पादप भूगोल', 'جغرافيا النباتات', 'উদ্ভিদ ভূগোল', 'geografia das plantas', '植物地理学', 'גאוגרפיה של צמחים'), ideaKey: 'plants', file: 'Stieler,_Joseph_Karl_-_Alexander_von_Humboldt_-_1843.jpg' },
]

export function bioGeneratedRows(): ThemeItem[] {
  const rows: Array<ThemeItem | null> = []
  for (const species of SPECIES) {
    rows.push(item(`bn-${species.id}`, 'bioPhotoToName', species.tier, species.name, species.name, `sp:${species.id}`, species.file))
    if (species.klass) {
      rows.push(item(`bc-${species.id}`, 'bioPhotoToClass', species.tier, species.name, species.klass.label, species.klass.key, species.file))
    }
    if (species.home) {
      rows.push(item(`sh-${species.id}`, 'speciesToHabitat', species.tier, species.name, species.home.label, species.home.key, species.file))
      rows.push(item(`hs-${species.id}`, 'habitatToSpecies', species.tier, species.home.label, species.name, `sp:${species.id}`, species.file))
    }
  }
  for (const person of SCIENTISTS) {
    if (person.file) {
      rows.push(item(`bp-${person.id}`, 'bioScientistPhoto', person.tier, person.name, person.name, `sci:${person.id}`, person.file))
    }
    rows.push(item(`bi-${person.id}`, 'bioScientistToIdea', person.tier, person.name, person.idea, person.ideaKey, person.file))
    rows.push(item(`ib-${person.id}`, 'bioIdeaToScientist', person.tier, person.idea, person.name, `sci:${person.id}`, person.file))
  }
  return rows.filter((row): row is ThemeItem => row !== null)
}
