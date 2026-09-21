import type { ListId } from '../data/lists'
import type { Lang } from './lang'

export type ListCopy = {
  title: string
  lead: string
  note: string
}

export const LIST_COPY: Record<Lang, Record<ListId, ListCopy>> = {
  ru: {
    microstates: {
      title: 'Микрогосударства',
      lead: 'Члены ООН, чья территория меньше 1 000 км². Город-государства, острова и карликовые страны Европы.',
      note: 'Площадь по данным справочников ООН / CIA World Factbook. Ватикан в список не входит: не член ООН.',
    },
    'no-army': {
      title: 'Без постоянной армии',
      lead: 'Члены ООН без регулярных вооружённых сил: полиция, береговая охрана или договор о защите вместо армии.',
      note: 'Ватикан не в списке: не член ООН. Исландия в НАТО, Панама распустила армию в 1990 году.',
    },
    landlocked: {
      title: 'Без выхода к морю',
      lead: 'Члены ООН без берега океана или внешнего моря — только суша и соседи.',
      note: 'Каспий считается озером, поэтому Азербайджан, Казахстан и Туркменистан в списке.',
    },
    islands: {
      title: 'Островные государства',
      lead: 'Члены ООН без сухопутных границ: вся территория на островах.',
      note: 'Соседи считаются только по суше. Мост или паром границу не даёт.',
    },
    'double-landlocked': {
      title: 'Дважды без моря',
      lead: 'Чтобы выйти к океану, нужно пересечь минимум две страны. Таких членов ООН всего два.',
      note: 'Лихтенштейн окружён Швейцарией и Австрией. Узбекистан граничит только со странами без моря.',
    },
    equator: {
      title: 'На экваторе',
      lead: 'Государства, чья суша пересекается экватором.',
      note: 'Мальдивы не входят: экватор проходит по воде между атоллами, не по островам.',
    },
    'two-capitals': {
      title: 'Две столицы',
      lead: 'Страны, где конституционная столица и фактический центр власти — разные города.',
      note: 'У ЮАР три столицы: Претория, Кейптаун и Блумфонтейн.',
    },
    'one-neighbor': {
      title: 'Один сухопутный сосед',
      lead: 'Члены ООН с ровно одной сухопутной границей с другим государством.',
      note: 'Гибралтар даёт Великобритании соседа Испанию, поэтому её в списке нет.',
    },
    monarchies: {
      title: 'Монархии',
      lead: 'Члены ООН, где глава государства — монарх: король, эмир, султан или князь.',
      note: 'В списке конституционные и абсолютные монархии, включая выборного монарха Малайзии.',
    },
    'security-council': {
      title: 'Постоянные члены СБ ООН',
      lead: 'Пять стран с правом вето в Совете Безопасности ООН.',
      note: 'Состав не менялся с 1945 года, кроме замены Китайской Республики на КНР в 1971-м.',
    },
  },
  en: {
    microstates: {
      title: 'Microstates',
      lead: 'UN members whose land area is under 1,000 km². City-states, islands, and Europe’s smallest countries.',
      note: 'Area from UN / CIA World Factbook references. Vatican City is omitted: not a UN member.',
    },
    'no-army': {
      title: 'No standing army',
      lead: 'UN members with no regular armed forces: police, a coast guard, or a defence treaty instead.',
      note: 'Vatican City is omitted: not a UN member. Iceland is in NATO; Panama abolished its army in 1990.',
    },
    landlocked: {
      title: 'Landlocked',
      lead: 'UN members with no coast on an ocean or open sea — only land borders.',
      note: 'The Caspian is treated as a lake, so Azerbaijan, Kazakhstan and Turkmenistan are included.',
    },
    islands: {
      title: 'Island countries',
      lead: 'UN members with no land borders: their territory is entirely on islands.',
      note: 'Neighbours count only by land. A bridge or ferry does not create a land border.',
    },
    'double-landlocked': {
      title: 'Double landlocked',
      lead: 'To reach an ocean you must cross at least two countries. Only two UN members are in this group.',
      note: 'Liechtenstein is surrounded by Switzerland and Austria. Uzbekistan borders only landlocked states.',
    },
    equator: {
      title: 'On the equator',
      lead: 'Countries whose land is crossed by the equator.',
      note: 'The Maldives are omitted: the equator runs through water between atolls, not across an island.',
    },
    'two-capitals': {
      title: 'Two capitals',
      lead: 'Countries where the constitutional capital and the seat of government are different cities.',
      note: 'South Africa has three: Pretoria, Cape Town and Bloemfontein.',
    },
    'one-neighbor': {
      title: 'One land neighbour',
      lead: 'UN members with exactly one land border with another country.',
      note: 'Gibraltar gives the United Kingdom a border with Spain, so the UK is not on this list.',
    },
    monarchies: {
      title: 'Monarchies',
      lead: 'UN members whose head of state is a monarch: king, emir, sultan or prince.',
      note: 'Includes constitutional and absolute monarchies, and Malaysia’s elected monarch.',
    },
    'security-council': {
      title: 'UN Security Council P5',
      lead: 'The five permanent members with a veto in the UN Security Council.',
      note: 'The seats have been unchanged since 1945, except the 1971 switch from the ROC to the PRC.',
    },
  },
  de: {
    microstates: {
      title: 'Mikrostaaten',
      lead: 'UN-Mitglieder mit weniger als 1 000 km² Fläche. Stadtstaaten, Inseln und Europas Zwergstaaten.',
      note: 'Fläche nach UN- / CIA-World-Factbook-Angaben. Der Vatikan fehlt: kein UN-Mitglied.',
    },
    'no-army': {
      title: 'Ohne stehendes Heer',
      lead: 'UN-Mitglieder ohne reguläre Streitkräfte: Polizei, Küstenwache oder Schutzvertrag statt Armee.',
      note: 'Der Vatikan fehlt: kein UN-Mitglied. Island ist in der NATO; Panama löste die Armee 1990 auf.',
    },
    landlocked: {
      title: 'Binnenstaaten',
      lead: 'UN-Mitglieder ohne Küste am Ozean oder offenen Meer — nur Landgrenzen.',
      note: 'Das Kaspische Meer gilt als See, daher stehen Aserbaidschan, Kasachstan und Turkmenistan auf der Liste.',
    },
    islands: {
      title: 'Inselstaaten',
      lead: 'UN-Mitglieder ohne Landgrenzen: das ganze Gebiet liegt auf Inseln.',
      note: 'Nachbarn zählen nur über Land. Brücke oder Fähre schaffen keine Landgrenze.',
    },
    'double-landlocked': {
      title: 'Doppelt binnenländisch',
      lead: 'Zum Ozean muss man mindestens zwei Länder durchqueren. Nur zwei UN-Mitglieder gehören dazu.',
      note: 'Liechtenstein liegt zwischen der Schweiz und Österreich. Usbekistan grenzt nur an Binnenstaaten.',
    },
    equator: {
      title: 'Am Äquator',
      lead: 'Staaten, deren Land vom Äquator gekreuzt wird.',
      note: 'Die Malediven fehlen: der Äquator verläuft dort durch Wasser zwischen Atollen, nicht über eine Insel.',
    },
    'two-capitals': {
      title: 'Zwei Hauptstädte',
      lead: 'Länder, in denen Verfassungs- und Regierungssitz verschiedene Städte sind.',
      note: 'Südafrika hat drei: Pretoria, Kapstadt und Bloemfontein.',
    },
    'one-neighbor': {
      title: 'Ein Landnachbar',
      lead: 'UN-Mitglieder mit genau einer Landgrenze zu einem anderen Staat.',
      note: 'Gibraltar gibt dem Vereinigten Königreich eine Grenze zu Spanien, daher fehlt es hier.',
    },
    monarchies: {
      title: 'Monarchien',
      lead: 'UN-Mitglieder, deren Staatsoberhaupt ein Monarch ist: König, Emir, Sultan oder Fürst.',
      note: 'Einschließlich konstitutioneller und absoluter Monarchien sowie des Wahlmonarchen Malaysias.',
    },
    'security-council': {
      title: 'Ständige Mitglieder des UN-Sicherheitsrats',
      lead: 'Die fünf ständigen Mitglieder mit Vetorecht im UN-Sicherheitsrat.',
      note: 'Die Sitze sind seit 1945 unverändert, außer dem Wechsel von der Republik China zur VR China 1971.',
    },
  },
  zh: {
    microstates: {
      title: '微型国家',
      lead: '陆地面积不足 1 000 平方公里的联合国会员国：城邦、岛屿和欧洲小国。',
      note: '面积依据联合国 / CIA 世界概况。梵蒂冈不在列：不是联合国会员。',
    },
    'no-army': {
      title: '没有常备军',
      lead: '没有正规军队的联合国会员国：以警察、海岸警卫队或防务条约代替。',
      note: '梵蒂冈不在列：不是联合国会员。冰岛加入北约；巴拿马于 1990 年解散军队。',
    },
    landlocked: {
      title: '内陆国',
      lead: '没有大洋或外海海岸的联合国会员国，只有陆地边界。',
      note: '里海视为湖泊，因此阿塞拜疆、哈萨克斯坦和土库曼斯坦在列。',
    },
    islands: {
      title: '岛国',
      lead: '没有陆地边界的联合国会员国：领土全在岛屿上。',
      note: '邻国只按陆地计算。桥梁或轮渡不算陆地边界。',
    },
    'double-landlocked': {
      title: '双重内陆国',
      lead: '要到达海洋必须穿过至少两个国家。联合国会员中只有两个。',
      note: '列支敦士登夹在瑞士与奥地利之间。乌兹别克斯坦只与内陆国接壤。',
    },
    equator: {
      title: '赤道穿过',
      lead: '陆地被赤道穿过的国家。',
      note: '马尔代夫不在列：赤道从环礁之间的海域通过，不经过岛屿。',
    },
    'two-capitals': {
      title: '两个首都',
      lead: '宪法首都与实际施政中心不在同一座城市的国家。',
      note: '南非有三个：比勒陀利亚、开普敦和布隆方丹。',
    },
    'one-neighbor': {
      title: '只有一个陆邻',
      lead: '与其他国家只有一条陆地边界的联合国会员国。',
      note: '直布罗陀使英国与西班牙接壤，因此英国不在此列。',
    },
    monarchies: {
      title: '君主国',
      lead: '国家元首为君主的联合国会员国：国王、埃米尔、苏丹或亲王。',
      note: '包括君主立宪与绝对君主制，以及马来西亚的选举君主。',
    },
    'security-council': {
      title: '安理会常任理事国',
      lead: '在联合国安理会拥有否决权的五个常任理事国。',
      note: '席位自 1945 年起未变，仅 1971 年由中华民国改为中华人民共和国。',
    },
  },
  es: {
    microstates: {
      title: 'Microestados',
      lead: 'Miembros de la ONU con menos de 1 000 km². Ciudades-Estado, islas y los países más pequeños de Europa.',
      note: 'Superficie según ONU / CIA World Factbook. El Vaticano no entra: no es miembro de la ONU.',
    },
    'no-army': {
      title: 'Sin ejército permanente',
      lead: 'Miembros de la ONU sin fuerzas armadas regulares: policía, guardia costera o un tratado de defensa.',
      note: 'El Vaticano no entra: no es miembro de la ONU. Islandia está en la OTAN; Panamá disolvió el ejército en 1990.',
    },
    landlocked: {
      title: 'Sin litoral',
      lead: 'Miembros de la ONU sin costa en un océano o mar abierto: solo fronteras terrestres.',
      note: 'El Caspio se cuenta como lago, así que Azerbaiyán, Kazajistán y Turkmenistán están en la lista.',
    },
    islands: {
      title: 'Países insulares',
      lead: 'Miembros de la ONU sin fronteras terrestres: todo el territorio está en islas.',
      note: 'Los vecinos cuentan solo por tierra. Un puente o un ferri no crean frontera terrestre.',
    },
    'double-landlocked': {
      title: 'Doblemente sin litoral',
      lead: 'Para llegar al océano hay que cruzar al menos dos países. Solo dos miembros de la ONU están así.',
      note: 'Liechtenstein está entre Suiza y Austria. Uzbekistán solo limita con países sin litoral.',
    },
    equator: {
      title: 'En el ecuador',
      lead: 'Países cuya tierra es atravesada por el ecuador.',
      note: 'Maldivas no entra: el ecuador pasa por el agua entre atolones, no por una isla.',
    },
    'two-capitals': {
      title: 'Dos capitales',
      lead: 'Países cuya capital constitucional y la sede del gobierno son ciudades distintas.',
      note: 'Sudáfrica tiene tres: Pretoria, Ciudad del Cabo y Bloemfontein.',
    },
    'one-neighbor': {
      title: 'Un vecino terrestre',
      lead: 'Miembros de la ONU con exactamente una frontera terrestre con otro país.',
      note: 'Gibraltar da al Reino Unido frontera con España, por eso no está en la lista.',
    },
    monarchies: {
      title: 'Monarquías',
      lead: 'Miembros de la ONU cuyo jefe de Estado es un monarca: rey, emir, sultán o príncipe.',
      note: 'Incluye monarquías constitucionales y absolutas, y el monarca electo de Malasia.',
    },
    'security-council': {
      title: 'P5 del Consejo de Seguridad',
      lead: 'Los cinco miembros permanentes con veto en el Consejo de Seguridad de la ONU.',
      note: 'Los asientos no han cambiado desde 1945, salvo el relevo de la ROC por la RPC en 1971.',
    },
  },
  hi: {
    microstates: {
      title: 'सूक्ष्म राज्य',
      lead: 'संयुक्त राष्ट्र के सदस्य जिनका क्षेत्रफल 1 000 वर्ग किमी से कम है।',
      note: 'क्षेत्रफल UN / CIA World Factbook के अनुसार। वेटिकन नहीं है: UN सदस्य नहीं।',
    },
    'no-army': {
      title: 'बिना स्थायी सेना',
      lead: 'नियमित सेना के बिना UN सदस्य: पुलिस, तटरक्षक या रक्षा संधि सेना की जगह।',
      note: 'वेटिकन नहीं है: UN सदस्य नहीं। आइसलैंड NATO में है; पनामा ने 1990 में सेना भंग की।',
    },
    landlocked: {
      title: 'स्थलरुद्ध',
      lead: 'महासागर या खुले सागर का तट न रखने वाले UN सदस्य — केवल स्थल सीमाएँ।',
      note: 'कैस्पियन को झील माना गया है, इसलिए अज़रबैजान, कज़ाखस्तान और तुर्कमेनिस्तान सूची में हैं।',
    },
    islands: {
      title: 'द्वीपीय देश',
      lead: 'स्थल सीमा के बिना UN सदस्य: सारा क्षेत्र द्वीपों पर है।',
      note: 'पड़ोसी केवल स्थल से गिने जाते हैं। पुल या फेरी स्थल सीमा नहीं बनाती।',
    },
    'double-landlocked': {
      title: 'दोहरी स्थलरुद्धता',
      lead: 'समुद्र तक पहुँचने के लिए कम से कम दो देश पार करने पड़ें। ऐसे UN सदस्य केवल दो हैं।',
      note: 'लिचटेंस्टाइन स्विट्ज़रलैंड और ऑस्ट्रिया से घिरा है। उज़्बेकिस्तान की सीमा केवल स्थलरुद्ध देशों से है।',
    },
    equator: {
      title: 'भूमध्य रेखा पर',
      lead: 'वे देश जिनकी भूमि भूमध्य रेखा काटती है।',
      note: 'मालदीव नहीं हैं: रेखा द्वीपों पर नहीं, एटॉल के बीच पानी से जाती है।',
    },
    'two-capitals': {
      title: 'दो राजधानियाँ',
      lead: 'जिन देशों में संवैधानिक राजधानी और शासन केंद्र अलग शहर हैं।',
      note: 'दक्षिण अफ़्रीका की तीन हैं: प्रिटोरिया, केप टाउन और ब्लूमफ़ोन्टेन।',
    },
    'one-neighbor': {
      title: 'एक स्थल पड़ोसी',
      lead: 'किसी अन्य देश से ठीक एक स्थल सीमा वाले UN सदस्य।',
      note: 'जिब्राल्टर से ब्रिटेन की स्पेन से सीमा है, इसलिए वह इस सूची में नहीं है।',
    },
    monarchies: {
      title: 'राजतंत्र',
      lead: 'वे UN सदस्य जिनके राज्य प्रमुख राजा, अमीर, सुल्तान या राजकुमार हैं।',
      note: 'संवैधानिक और निरंकुश राजतंत्र, तथा मलेशिया का निर्वाचित राजा भी शामिल।',
    },
    'security-council': {
      title: 'सुरक्षा परिषद के स्थायी सदस्य',
      lead: 'संयुक्त राष्ट्र सुरक्षा परिषद में वीटो वाले पाँच स्थायी सदस्य।',
      note: 'सीटें 1945 से वही हैं, केवल 1971 में ROC की जगह PRC आई।',
    },
  },
  ar: {
    microstates: {
      title: 'دول مصغّرة',
      lead: 'أعضاء الأمم المتحدة بمساحة أقل من 1 000 كم². مدن-دول وجزر وأصغر دول أوروبا.',
      note: 'المساحة وفق مراجع الأمم المتحدة / كتاب حقائق العالم. الفاتيكان غير مدرج: ليس عضواً في الأمم المتحدة.',
    },
    'no-army': {
      title: 'بلا جيش دائم',
      lead: 'أعضاء الأمم المتحدة بلا قوات مسلحة نظامية: شرطة أو خفر سواحل أو معاهدة دفاع بدلاً من الجيش.',
      note: 'الفاتيكان غير مدرج. آيسلندا في الناتو؛ بنما حلّت الجيش عام 1990.',
    },
    landlocked: {
      title: 'بلا منفذ بحري',
      lead: 'أعضاء الأمم المتحدة بلا ساحل على محيط أو بحر مفتوح — حدود برية فقط.',
      note: 'بحر قزوين يُعد بحيرة، لذا أذربيجان وكازاخستان وتركمانستان في القائمة.',
    },
    islands: {
      title: 'دول جزرية',
      lead: 'أعضاء الأمم المتحدة بلا حدود برية: أراضيها كلها على جزر.',
      note: 'الجيران يُحسبون براً فقط. الجسر أو العبّارة لا يصنعان حدوداً برية.',
    },
    'double-landlocked': {
      title: 'حبيسة مضاعفة',
      lead: 'للوصول إلى المحيط يجب عبور دولتين على الأقل. عضوان فقط في الأمم المتحدة كذلك.',
      note: 'ليختنشتاين بين سويسرا والنمسا. أوزبكستان تحدّ دولاً حبيسة فقط.',
    },
    equator: {
      title: 'على خط الاستواء',
      lead: 'دول يمر خط الاستواء بأرضها.',
      note: 'المالديف غير مدرجة: الخط يمر في الماء بين الحلقات لا عبر جزيرة.',
    },
    'two-capitals': {
      title: 'عاصمتان',
      lead: 'دول تختلف فيها العاصمة الدستورية عن مقر الحكومة.',
      note: 'لجنوب أفريقيا ثلاث عواصم: بريتوريا وكيب تاون وبلومفونتين.',
    },
    'one-neighbor': {
      title: 'جار بري واحد',
      lead: 'أعضاء الأمم المتحدة بحدود برية واحدة مع دولة أخرى.',
      note: 'جبل طارق يعطي المملكة المتحدة حدوداً مع إسبانيا، لذا ليست في القائمة.',
    },
    monarchies: {
      title: 'ملكيات',
      lead: 'أعضاء الأمم المتحدة رأس دولتهم ملك أو أمير أو سلطان أو أمير حاكم.',
      note: 'تشمل الملكيات الدستورية والمطلقة وملك ماليزيا المنتخب.',
    },
    'security-council': {
      title: 'الأعضاء الدائمون في مجلس الأمن',
      lead: 'الدول الخمس دائمة العضوية ذات حق النقض في مجلس الأمن.',
      note: 'المقاعد لم تتغير منذ 1945 إلا استبدال جمهورية الصين بجمهورية الصين الشعبية عام 1971.',
    },
  },
  bn: {
    microstates: {
      title: 'ক্ষুদ্র রাষ্ট্র',
      lead: 'জাতিসংঘের সদস্য যাদের স্থলভাগ ১ ০০০ বর্গ কিমির কম।',
      note: 'আয়তন UN / CIA World Factbook অনুসারে। ভ্যাটিকান নেই: জাতিসংঘের সদস্য নয়।',
    },
    'no-army': {
      title: 'স্থায়ী সেনা নেই',
      lead: 'নিয়মিত সেনা ছাড়া জাতিসংঘ সদস্য: পুলিশ, কোস্ট গার্ড বা প্রতিরক্ষা চুক্তি সেনার বদলে।',
      note: 'ভ্যাটিকান নেই। আইসল্যান্ড ন্যাটোতে; পানামা ১৯৯০-এ সেনা ভেঙে দেয়।',
    },
    landlocked: {
      title: 'স্থলবেষ্টিত',
      lead: 'মহাসাগর বা খোলা সমুদ্রের উপকূলহীন জাতিসংঘ সদস্য — শুধু স্থলসীমা।',
      note: 'কাস্পিয়ানকে হ্রদ ধরা হয়েছে, তাই আজারবাইজান, কাজাখস্তান ও তুর্কমেনিস্তান তালিকায়।',
    },
    islands: {
      title: 'দ্বীপরাষ্ট্র',
      lead: 'স্থলসীমাহীন জাতিসংঘ সদস্য: পুরো ভূখণ্ড দ্বীপে।',
      note: 'প্রতিবেশী শুধু স্থল দিয়ে গণনা। সেতু বা ফেরি স্থলসীমা দেয় না।',
    },
    'double-landlocked': {
      title: 'দ্বিগুণ স্থলবেষ্টিত',
      lead: 'মহাসাগরে যেতে অন্তত দুই দেশ পেরোতে হয়। এমন জাতিসংঘ সদস্য মাত্র দুটি।',
      note: 'লিখটেনস্টাইন সুইজারল্যান্ড ও অস্ট্রিয়ার মাঝে। উজবেকিস্তানের সীমানা শুধু স্থলবেষ্টিত দেশের সঙ্গে।',
    },
    equator: {
      title: 'নিরক্ষরেখায়',
      lead: 'যে দেশের স্থলভাগ নিরক্ষরেখা কাটে।',
      note: 'মালদ্বীপ নেই: রেখা দ্বীপে নয়, অ্যাটলের মাঝের জল দিয়ে যায়।',
    },
    'two-capitals': {
      title: 'দুই রাজধানী',
      lead: 'সাংবিধানিক রাজধানী ও শাসনকেন্দ্র আলাদা শহর এমন দেশ।',
      note: 'দক্ষিণ আফ্রিকার তিনটি: প্রিটোরিয়া, কেপ টাউন ও ব্লুমফোনটেইন।',
    },
    'one-neighbor': {
      title: 'এক স্থল প্রতিবেশী',
      lead: 'অন্য দেশের সঙ্গে ঠিক এক স্থলসীমা থাকা জাতিসংঘ সদস্য।',
      note: 'জিব্রাল্টারের জন্য যুক্তরাজ্যের স্পেনের সঙ্গে সীমানা আছে, তাই সে তালিকায় নেই।',
    },
    monarchies: {
      title: 'রাজতন্ত্র',
      lead: 'রাষ্ট্রপ্রধান রাজা, আমির, সুলতান বা রাজকুমার এমন জাতিসংঘ সদস্য।',
      note: 'সাংবিধানিক ও নিরঙ্কুশ রাজতন্ত্র এবং মালয়েশিয়ার নির্বাচিত রাজাও আছে।',
    },
    'security-council': {
      title: 'নিরাপত্তা পরিষদের স্থায়ী সদস্য',
      lead: 'জাতিসংঘ নিরাপত্তা পরিষদে ভেটো থাকা পাঁচ স্থায়ী সদস্য।',
      note: 'আসন ১৯৪৫ থেকে একই, শুধু ১৯৭১-এ ROC-এর জায়গায় PRC এসেছে।',
    },
  },
  pt: {
    microstates: {
      title: 'Microestados',
      lead: 'Membros da ONU com menos de 1 000 km². Cidades-Estado, ilhas e os países mais pequenos da Europa.',
      note: 'Área segundo ONU / CIA World Factbook. O Vaticano não entra: não é membro da ONU.',
    },
    'no-army': {
      title: 'Sem exército permanente',
      lead: 'Membros da ONU sem forças armadas regulares: polícia, guarda costeira ou tratado de defesa no lugar do exército.',
      note: 'O Vaticano não entra. A Islândia está na NATO; o Panamá dissolveu o exército em 1990.',
    },
    landlocked: {
      title: 'Sem litoral',
      lead: 'Membros da ONU sem costa num oceano ou mar aberto — só fronteiras terrestres.',
      note: 'O Cáspio conta como lago, por isso o Azerbaijão, o Cazaquistão e o Turquemenistão estão na lista.',
    },
    islands: {
      title: 'Países insulares',
      lead: 'Membros da ONU sem fronteiras terrestres: o território está todo em ilhas.',
      note: 'Vizinhos contam só por terra. Ponte ou ferry não criam fronteira terrestre.',
    },
    'double-landlocked': {
      title: 'Duplamente sem litoral',
      lead: 'Para chegar ao oceano é preciso cruzar pelo menos dois países. Só dois membros da ONU estão assim.',
      note: 'Liechtenstein fica entre a Suíça e a Áustria. O Usbequistão só faz fronteira com países sem litoral.',
    },
    equator: {
      title: 'No equador',
      lead: 'Países cuja terra é atravessada pelo equador.',
      note: 'Maldivas não entram: o equador passa na água entre atóis, não por uma ilha.',
    },
    'two-capitals': {
      title: 'Duas capitais',
      lead: 'Países em que a capital constitucional e a sede do governo são cidades diferentes.',
      note: 'A África do Sul tem três: Pretória, Cidade do Cabo e Bloemfontein.',
    },
    'one-neighbor': {
      title: 'Um vizinho terrestre',
      lead: 'Membros da ONU com exatamente uma fronteira terrestre com outro país.',
      note: 'Gibraltar dá ao Reino Unido fronteira com Espanha, por isso não está na lista.',
    },
    monarchies: {
      title: 'Monarquias',
      lead: 'Membros da ONU cujo chefe de Estado é um monarca: rei, emir, sultão ou príncipe.',
      note: 'Inclui monarquias constitucionais e absolutas, e o monarca eleito da Malásia.',
    },
    'security-council': {
      title: 'P5 do Conselho de Segurança',
      lead: 'Os cinco membros permanentes com veto no Conselho de Segurança da ONU.',
      note: 'Os lugares não mudaram desde 1945, salvo a troca da ROC pela RPC em 1971.',
    },
  },
  ja: {
    microstates: {
      title: 'ミニ国家',
      lead: '国土が 1 000 km² 未満の国連加盟国。都市国家、島、ヨーロッパの小国。',
      note: '面積は国連 / CIA World Factbook に基づく。バチカンは非加盟のため含みません。',
    },
    'no-army': {
      title: '常備軍がない国',
      lead: '正規の軍隊がない国連加盟国。警察、沿岸警備、防衛条約で代替する。',
      note: 'バチカンは非加盟。アイスランドはNATO加盟。パナマは1990年に軍を廃止した。',
    },
    landlocked: {
      title: '内陸国',
      lead: '外洋や外海の海岸がない国連加盟国。陸地の国境だけ。',
      note: 'カスピ海は湖とみなし、アゼルバイジャン、カザフスタン、トルクメニスタンを含む。',
    },
    islands: {
      title: '島国',
      lead: '陸上国境がない国連加盟国。領土はすべて島にある。',
      note: '隣国は陸続きだけ数える。橋やフェリーは陸上国境にならない。',
    },
    'double-landlocked': {
      title: '二重内陸国',
      lead: '海に出るには少なくとも2か国を通る必要がある。国連加盟は2か国だけ。',
      note: 'リヒテンシュタインはスイスとオーストリアに囲まれる。ウズベキスタンの隣国はすべて内陸国。',
    },
    equator: {
      title: '赤道が通る国',
      lead: '国土を赤道が横切る国。',
      note: 'モルディブは含まない。赤道は環礁の間の海を通り、島の上は通らない。',
    },
    'two-capitals': {
      title: '首都が二つ',
      lead: '憲法上の首都と実際の統治の中心が別の都市である国。',
      note: '南アフリカは三つ：プレトリア、ケープタウン、ブルームフォンテーン。',
    },
    'one-neighbor': {
      title: '陸上の隣国が一つ',
      lead: '他国との陸上国境がちょうど一つだけの国連加盟国。',
      note: 'ジブラルタルのため英国はスペインと接し、このリストには入らない。',
    },
    monarchies: {
      title: '君主国',
      lead: '元首が君主（王、首長、スルタン、公）である国連加盟国。',
      note: '立憲・絶対君主制と、マレーシアの選挙君主を含む。',
    },
    'security-council': {
      title: '安保理常任理事国',
      lead: '国連安全保障理事会で拒否権をもつ常任理事国5か国。',
      note: '議席は1945年から変わらず、1971年に中華民国から中華人民共和国へ代わっただけ。',
    },
  },
  he: {
    microstates: {
      title: 'מיקרו־מדינות',
      lead: 'חברות האו״ם ששטחן פחות מ־1 000 קמ״ר. ערי־מדינה, איים והמדינות הקטנות באירופה.',
      note: 'השטח לפי מקורות האו״ם / CIA World Factbook. הוותיקן לא ברשימה: אינו חבר באו״ם.',
    },
    'no-army': {
      title: 'בלי צבא קבע',
      lead: 'חברות האו״ם בלי כוחות מזוינים סדירים: משטרה, משמר חופים או הסכם הגנה במקום צבא.',
      note: 'הוותיקן לא ברשימה. איסלנד בנאט״ו; פנמה פיזרה את הצבא ב־1990.',
    },
    landlocked: {
      title: 'בלי מוצא לים',
      lead: 'חברות האו״ם בלי חוף לאוקיינוס או לים פתוח — רק גבולות יבשתיים.',
      note: 'הכספי נחשב לאגם, ולכן אזרבייג׳ן, קזחסטן וטורקמניסטן ברשימה.',
    },
    islands: {
      title: 'מדינות איים',
      lead: 'חברות האו״ם בלי גבול יבשתי: כל השטח על איים.',
      note: 'שכנים נספרים רק ביבשה. גשר או מעבורת אינם גבול יבשתי.',
    },
    'double-landlocked': {
      title: 'כפולות־יבשתיות',
      lead: 'כדי להגיע לאוקיינוס צריך לחצות לפחות שתי מדינות. רק שתי חברות או״ם כאלה.',
      note: 'ליכטנשטיין בין שווייץ לאוסטריה. אוזבקיסטן גובלת רק במדינות בלי ים.',
    },
    equator: {
      title: 'על קו המשווה',
      lead: 'מדינות שקו המשווה חוצה את היבשה שלהן.',
      note: 'המלדיביים לא ברשימה: הקו עובר במים בין האטולים, לא על אי.',
    },
    'two-capitals': {
      title: 'שתי בירות',
      lead: 'מדינות שהבירה החוקתית ומרכז השלטון הן ערים שונות.',
      note: 'לדרום אפריקה שלוש: פרטוריה, קייפטאון ובלומפונטיין.',
    },
    'one-neighbor': {
      title: 'שכן יבשתי אחד',
      lead: 'חברות האו״ם עם גבול יבשתי אחד בדיוק למדינה אחרת.',
      note: 'גיברלטר נותן לבריטניה גבול עם ספרד, ולכן היא לא ברשימה.',
    },
    monarchies: {
      title: 'מונרכיות',
      lead: 'חברות האו״ם שראש המדינה שלהן מונרך: מלך, אמיר, סולטן או נסיך.',
      note: 'כולל מונרכיות חוקתיות ומוחלטות, ואת המלך הנבחר של מלזיה.',
    },
    'security-council': {
      title: 'חברות הקבע במועצת הביטחון',
      lead: 'חמש החברות הקבועות עם זכות וטו במועצת הביטחון של האו״ם.',
      note: 'המושבים לא השתנו מאז 1945, מלבד החלפת הרפובליקה הסינית בסין העממית ב־1971.',
    },
  },
}
