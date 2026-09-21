import type { Lang } from './lang'
import type { Strings } from './strings'

export type ThemeCopy = Pick<
  Strings,
  | 'biology'
  | 'bioSubtitle'
  | 'bioFamilyCell'
  | 'bioFamilyBody'
  | 'bioFamilyLife'
  | 'bioEasyMixNote'
  | 'bioHardMixNote'
  | 'organelleToRole'
  | 'roleToOrganelle'
  | 'organToSystem'
  | 'photoStepToName'
  | 'kingdomToExample'
  | 'bioOrganellePrompt'
  | 'bioRolePrompt'
  | 'bioOrganPrompt'
  | 'bioPhotoPrompt'
  | 'bioKingdomPrompt'
  | 'olympics'
  | 'olySubtitle'
  | 'olyFamilyHosts'
  | 'olyFamilySports'
  | 'olyFamilyNoc'
  | 'olyEasyMixNote'
  | 'olyHardMixNote'
  | 'olyYearToHost'
  | 'olyHostToYear'
  | 'olyHostCount'
  | 'sportToCategory'
  | 'nocToName'
  | 'olyYearPrompt'
  | 'olyHostPrompt'
  | 'olyCountPrompt'
  | 'olySportPrompt'
  | 'olyNocPrompt'
  | 'cs'
  | 'csSubtitle'
  | 'csFamilyCode'
  | 'csFamilyBinary'
  | 'csFamilyPeople'
  | 'csEasyMixNote'
  | 'csHardMixNote'
  | 'csTermToMeaning'
  | 'meaningToCsTerm'
  | 'decToBinary'
  | 'binaryToDec'
  | 'csPhotoToName'
  | 'csTermPrompt'
  | 'csMeaningPrompt'
  | 'csDecPrompt'
  | 'csBinPrompt'
  | 'csPhotoPrompt'
  | 'food'
  | 'foodSubtitle'
  | 'foodFamilyDishes'
  | 'foodFamilyOrigin'
  | 'foodEasyMixNote'
  | 'foodHardMixNote'
  | 'dishToCuisine'
  | 'cuisineToDish'
  | 'foodToOrigin'
  | 'foodDishPrompt'
  | 'foodCuisinePrompt'
  | 'foodOriginPrompt'
  | 'transport'
  | 'transportSubtitle'
  | 'transFamilyVehicles'
  | 'transFamilyPeople'
  | 'transEasyMixNote'
  | 'transHardMixNote'
  | 'vehicleToKind'
  | 'kindToVehicle'
  | 'inventorToVehicle'
  | 'transVehiclePrompt'
  | 'transKindPrompt'
  | 'transInventorPrompt'
>

function pack(row: ThemeCopy): ThemeCopy {
  return row
}

const ru: ThemeCopy = pack({
  biology: 'Биология',
  bioSubtitle: 'Клетка, органы, фотосинтез и царства. Школьный курс, без патогенов.',
  bioFamilyCell: 'Клетка',
  bioFamilyBody: 'Тело',
  bioFamilyLife: 'Царства',
  bioEasyMixNote: 'Органеллы, органы и царства.',
  bioHardMixNote: 'Все школьные режимы биологии.',
  organelleToRole: 'Органелла → роль',
  roleToOrganelle: 'Роль → органелла',
  organToSystem: 'Орган → система',
  photoStepToName: 'Процесс → название',
  kingdomToExample: 'Царство → пример',
  bioOrganellePrompt: 'Какая роль?',
  bioRolePrompt: 'Что это за органелла?',
  bioOrganPrompt: 'К какой системе относится?',
  bioPhotoPrompt: 'Как называется процесс?',
  bioKingdomPrompt: 'Кто из этого царства?',
  olympics: 'Олимпиада',
  olySubtitle: 'Города-хозяева, виды спорта и коды НОК. Без медалей.',
  olyFamilyHosts: 'Хозяева',
  olyFamilySports: 'Виды',
  olyFamilyNoc: 'НОК',
  olyEasyMixNote: 'Годы Игр, виды и коды НОК.',
  olyHardMixNote: 'Хозяева, счёт Игр, спорт и НОК.',
  olyYearToHost: 'Год → хозяин',
  olyHostToYear: 'Хозяин → год',
  olyHostCount: 'Страна → сколько Игр',
  sportToCategory: 'Вид → группа',
  nocToName: 'НОК → страна',
  olyYearPrompt: 'Где прошли эти Игры?',
  olyHostPrompt: 'В каком году?',
  olyCountPrompt: 'Сколько летних Игр принимала?',
  olySportPrompt: 'К какой группе вид?',
  olyNocPrompt: 'Какая страна у этого кода?',
  cs: 'Информатика',
  csSubtitle: 'Термины, двоичная система и пионеры компьютеров.',
  csFamilyCode: 'Понятия',
  csFamilyBinary: 'Двоичная',
  csFamilyPeople: 'Люди',
  csEasyMixNote: 'Термины и перевод в двоичную.',
  csHardMixNote: 'Все режимы, кроме портретов.',
  csTermToMeaning: 'Термин → смысл',
  meaningToCsTerm: 'Смысл → термин',
  decToBinary: 'Число → двоичное',
  binaryToDec: 'Двоичное → число',
  csPhotoToName: 'Портрет → информатик',
  csTermPrompt: 'Что это значит?',
  csMeaningPrompt: 'Как это называется?',
  csDecPrompt: 'Как в двоичной?',
  csBinPrompt: 'Какое это число?',
  csPhotoPrompt: 'Кто на портрете?',
  food: 'Еда',
  foodSubtitle: 'Блюда, кухни и продукты. Без споров о «настоящем» рецепте.',
  foodFamilyDishes: 'Блюда',
  foodFamilyOrigin: 'Состав',
  foodEasyMixNote: 'Блюдо и страна, плюс состав.',
  foodHardMixNote: 'Все кулинарные режимы.',
  dishToCuisine: 'Блюдо → страна',
  cuisineToDish: 'Страна → блюдо',
  foodToOrigin: 'Состав → блюдо',
  foodDishPrompt: 'Откуда блюдо?',
  foodCuisinePrompt: 'Какое блюдо?',
  foodOriginPrompt: 'Что из этого готовят?',
  transport: 'Транспорт',
  transportSubtitle: 'Виды машин и кто их придумал.',
  transFamilyVehicles: 'Машины',
  transFamilyPeople: 'Изобретатели',
  transEasyMixNote: 'Суша, рельсы, вода, воздух.',
  transHardMixNote: 'Все транспортные режимы.',
  vehicleToKind: 'Транспорт → среда',
  kindToVehicle: 'Среда → транспорт',
  inventorToVehicle: 'Изобретатель → машина',
  transVehiclePrompt: 'Где это ходит?',
  transKindPrompt: 'Что из этой среды?',
  transInventorPrompt: 'Что изобрёл?',
})

const en: ThemeCopy = pack({
  biology: 'Biology',
  bioSubtitle: 'Cells, organs, photosynthesis, and kingdoms. School level, no pathogens.',
  bioFamilyCell: 'Cell',
  bioFamilyBody: 'Body',
  bioFamilyLife: 'Kingdoms',
  bioEasyMixNote: 'Organelles, organs, and kingdoms.',
  bioHardMixNote: 'All school biology modes.',
  organelleToRole: 'Organelle → role',
  roleToOrganelle: 'Role → organelle',
  organToSystem: 'Organ → system',
  photoStepToName: 'Process → name',
  kingdomToExample: 'Kingdom → example',
  bioOrganellePrompt: 'What is its role?',
  bioRolePrompt: 'Which organelle?',
  bioOrganPrompt: 'Which system?',
  bioPhotoPrompt: 'What process is this?',
  bioKingdomPrompt: 'Who belongs here?',
  olympics: 'Olympics',
  olySubtitle: 'Host cities, sports, and NOC codes. No medals.',
  olyFamilyHosts: 'Hosts',
  olyFamilySports: 'Sports',
  olyFamilyNoc: 'NOC',
  olyEasyMixNote: 'Games years, sports, and NOC codes.',
  olyHardMixNote: 'Hosts, host counts, sports, and NOCs.',
  olyYearToHost: 'Year → host',
  olyHostToYear: 'Host → year',
  olyHostCount: 'Country → Games hosted',
  sportToCategory: 'Sport → group',
  nocToName: 'NOC → country',
  olyYearPrompt: 'Who hosted these Games?',
  olyHostPrompt: 'Which year?',
  olyCountPrompt: 'How many Summer Games hosted?',
  olySportPrompt: 'Which group?',
  olyNocPrompt: 'Which country is this code?',
  cs: 'Computer science',
  csSubtitle: 'Terms, binary numbers, and computing pioneers.',
  csFamilyCode: 'Ideas',
  csFamilyBinary: 'Binary',
  csFamilyPeople: 'People',
  csEasyMixNote: 'Terms and decimal-to-binary.',
  csHardMixNote: 'All modes except portraits.',
  csTermToMeaning: 'Term → meaning',
  meaningToCsTerm: 'Meaning → term',
  decToBinary: 'Number → binary',
  binaryToDec: 'Binary → number',
  csPhotoToName: 'Portrait → computer scientist',
  csTermPrompt: 'What does it mean?',
  csMeaningPrompt: 'What is this called?',
  csDecPrompt: 'What is it in binary?',
  csBinPrompt: 'What number is this?',
  csPhotoPrompt: 'Who is in the portrait?',
  food: 'Food',
  foodSubtitle: 'Dishes, cuisines, and ingredients.',
  foodFamilyDishes: 'Dishes',
  foodFamilyOrigin: 'Ingredients',
  foodEasyMixNote: 'Dish and country, plus ingredients.',
  foodHardMixNote: 'All food modes.',
  dishToCuisine: 'Dish → country',
  cuisineToDish: 'Country → dish',
  foodToOrigin: 'Ingredients → dish',
  foodDishPrompt: 'Where is this from?',
  foodCuisinePrompt: 'Which dish?',
  foodOriginPrompt: 'What is made from this?',
  transport: 'Transport',
  transportSubtitle: 'Vehicles and who invented them.',
  transFamilyVehicles: 'Vehicles',
  transFamilyPeople: 'Inventors',
  transEasyMixNote: 'Land, rail, water, air.',
  transHardMixNote: 'All transport modes.',
  vehicleToKind: 'Vehicle → medium',
  kindToVehicle: 'Medium → vehicle',
  inventorToVehicle: 'Inventor → vehicle',
  transVehiclePrompt: 'Where does it travel?',
  transKindPrompt: 'Which vehicle fits?',
  transInventorPrompt: 'What did they invent?',
})

export const THEME_MODE_COPY: Record<Lang, ThemeCopy> = {
  ru,
  en,
  de: pack({
    ...en,
    biology: 'Biologie',
    bioSubtitle: 'Zelle, Organe, Fotosynthese und Reiche. Schulstoff, keine Erreger.',
    bioFamilyCell: 'Zelle',
    bioFamilyBody: 'Körper',
    bioFamilyLife: 'Reiche',
    olympics: 'Olympia',
    olySubtitle: 'Gastgeber, Sportarten und NOK-Codes. Keine Medaillen.',
    cs: 'Informatik',
    food: 'Essen',
    transport: 'Verkehr',
    organelleToRole: 'Organell → Rolle',
    roleToOrganelle: 'Rolle → Organell',
    organToSystem: 'Organ → System',
    photoStepToName: 'Prozess → Name',
    kingdomToExample: 'Reich → Beispiel',
    olyYearToHost: 'Jahr → Gastgeber',
    olyHostToYear: 'Gastgeber → Jahr',
    olyHostCount: 'Land → wie viele Spiele',
    sportToCategory: 'Sport → Gruppe',
    nocToName: 'NOK → Land',
    csTermToMeaning: 'Begriff → Sinn',
    meaningToCsTerm: 'Sinn → Begriff',
    decToBinary: 'Zahl → binär',
    binaryToDec: 'Binär → Zahl',
    csPhotoToName: 'Porträt → Informatiker',
    dishToCuisine: 'Gericht → Land',
    cuisineToDish: 'Land → Gericht',
    foodToOrigin: 'Zutaten → Gericht',
    vehicleToKind: 'Fahrzeug → Medium',
    kindToVehicle: 'Medium → Fahrzeug',
    inventorToVehicle: 'Erfinder → Fahrzeug',
  }),
  zh: pack({
    ...en,
    biology: '生物',
    bioSubtitle: '细胞、器官、光合作用与界。中学程度，不含病原体。',
    bioFamilyCell: '细胞',
    bioFamilyBody: '人体',
    bioFamilyLife: '界',
    olympics: '奥运',
    olySubtitle: '主办城市、项目与国家奥委会代码。不含奖牌。',
    cs: '计算机',
    food: '食物',
    transport: '交通',
    organelleToRole: '细胞器 → 功能',
    roleToOrganelle: '功能 → 细胞器',
    organToSystem: '器官 → 系统',
    photoStepToName: '过程 → 名称',
    kingdomToExample: '界 → 例子',
    olyYearToHost: '年份 → 主办',
    olyHostToYear: '主办 → 年份',
    olyHostCount: '国家 → 主办次数',
    sportToCategory: '项目 → 类别',
    nocToName: 'NOC → 国家',
    csTermToMeaning: '术语 → 含义',
    meaningToCsTerm: '含义 → 术语',
    decToBinary: '十进制 → 二进制',
    binaryToDec: '二进制 → 十进制',
    csPhotoToName: '肖像 → 计算机先驱',
    dishToCuisine: '菜肴 → 国家',
    cuisineToDish: '国家 → 菜肴',
    foodToOrigin: '食材 → 菜肴',
    vehicleToKind: '载具 → 介质',
    kindToVehicle: '介质 → 载具',
    inventorToVehicle: '发明者 → 载具',
  }),
  es: pack({
    ...en,
    biology: 'Biología',
    bioSubtitle: 'Célula, órganos, fotosíntesis y reinos. Nivel escolar, sin patógenos.',
    olympics: 'Olimpiadas',
    cs: 'Informática',
    food: 'Comida',
    transport: 'Transporte',
    organelleToRole: 'Orgánulo → función',
    roleToOrganelle: 'Función → orgánulo',
    organToSystem: 'Órgano → sistema',
    olyYearToHost: 'Año → sede',
    nocToName: 'COI → país',
    dishToCuisine: 'Plato → país',
    vehicleToKind: 'Vehículo → medio',
  }),
  hi: pack({
    ...en,
    biology: 'जीव विज्ञान',
    olympics: 'ओलंपिक',
    cs: 'कंप्यूटर विज्ञान',
    food: 'खाना',
    transport: 'यातायात',
  }),
  ar: pack({
    ...en,
    biology: 'علم الأحياء',
    olympics: 'الأولمبياد',
    cs: 'علوم الحاسوب',
    food: 'طعام',
    transport: 'نقل',
    organelleToRole: 'عضية → دور',
    olyYearToHost: 'سنة → مضيف',
    dishToCuisine: 'طبق → بلد',
    vehicleToKind: 'مركبة → وسط',
  }),
  bn: pack({
    ...en,
    biology: 'জীববিজ্ঞান',
    olympics: 'অলিম্পিক',
    cs: 'কম্পিউটার বিজ্ঞান',
    food: 'খাবার',
    transport: 'পরিবহন',
  }),
  pt: pack({
    ...en,
    biology: 'Biologia',
    olympics: 'Olimpíadas',
    cs: 'Informática',
    food: 'Comida',
    transport: 'Transportes',
    organelleToRole: 'Organelo → papel',
    olyYearToHost: 'Ano → anfitrião',
    dishToCuisine: 'Prato → país',
    vehicleToKind: 'Veículo → meio',
  }),
  ja: pack({
    ...en,
    biology: '生物',
    olympics: 'オリンピック',
    cs: '情報',
    food: '食べ物',
    transport: '交通',
    organelleToRole: '細胞小器官 → 役割',
    olyYearToHost: '年 → 開催地',
    dishToCuisine: '料理 → 国',
    vehicleToKind: '乗り物 → 環境',
  }),
  he: pack({
    ...en,
    biology: 'ביולוגיה',
    olympics: 'אולימפיאדה',
    cs: 'מדעי המחשב',
    food: 'אוכל',
    transport: 'תחבורה',
    organelleToRole: 'אברון → תפקיד',
    olyYearToHost: 'שנה → מארחת',
    dishToCuisine: 'מאכל → מדינה',
    vehicleToKind: 'רכב → תווך',
  }),
}
