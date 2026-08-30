/* Unicode CLDR 48 territoryInfo + language names (Unicode License).
   Official languages: Wikidata P37, fallback CLDR officialStatus=official.
   Spoken share: CLDR languagePopulation (people who speak the language). */
export interface LanguageInfo {
  nameEn: string
  nameRu: string
}

export interface SpokenShare {
  id: string
  pct: number
}

export interface CountryLangs {
  official: string[]
  spoken: SpokenShare[]
}

export const LANGUAGES: Record<string, LanguageInfo> = {
  "aa": {
    "nameEn": "Afar",
    "nameRu": "афарский"
  },
  "ab": {
    "nameEn": "Abkhazian",
    "nameRu": "абхазский"
  },
  "ace": {
    "nameEn": "Acehnese",
    "nameRu": "ачехский"
  },
  "ach": {
    "nameEn": "Acoli",
    "nameRu": "ачоли"
  },
  "ada": {
    "nameEn": "Adangme",
    "nameRu": "адангме"
  },
  "aeb": {
    "nameEn": "Tunisian Arabic",
    "nameRu": "Tunisian Arabic"
  },
  "af": {
    "nameEn": "Afrikaans",
    "nameRu": "африкаанс"
  },
  "ak": {
    "nameEn": "Akan",
    "nameRu": "акан"
  },
  "am": {
    "nameEn": "Amharic",
    "nameRu": "амхарский"
  },
  "ar": {
    "nameEn": "Arabic",
    "nameRu": "арабский"
  },
  "arn": {
    "nameEn": "Mapuche",
    "nameRu": "мапуче"
  },
  "arq": {
    "nameEn": "Algerian Arabic",
    "nameRu": "Algerian Arabic"
  },
  "ars": {
    "nameEn": "Najdi Arabic",
    "nameRu": "недждийский арабский"
  },
  "ary": {
    "nameEn": "Moroccan Arabic",
    "nameRu": "Moroccan Arabic"
  },
  "arz": {
    "nameEn": "Egyptian Arabic",
    "nameRu": "Egyptian Arabic"
  },
  "as": {
    "nameEn": "Assamese",
    "nameRu": "ассамский"
  },
  "asa": {
    "nameEn": "Asu",
    "nameRu": "асу"
  },
  "ast": {
    "nameEn": "Asturian",
    "nameRu": "астурийский"
  },
  "awa": {
    "nameEn": "Awadhi",
    "nameRu": "авадхи"
  },
  "ay": {
    "nameEn": "Aymara",
    "nameRu": "аймара"
  },
  "az": {
    "nameEn": "Azerbaijani",
    "nameRu": "азербайджанский"
  },
  "ba": {
    "nameEn": "Bashkir",
    "nameRu": "башкирский"
  },
  "bal": {
    "nameEn": "Baluchi",
    "nameRu": "белуджский"
  },
  "ban": {
    "nameEn": "Balinese",
    "nameRu": "балийский"
  },
  "bar": {
    "nameEn": "Bavarian",
    "nameRu": "Bavarian"
  },
  "bas": {
    "nameEn": "Basaa",
    "nameRu": "баса"
  },
  "bax": {
    "nameEn": "Bamun",
    "nameRu": "бамум"
  },
  "bbj": {
    "nameEn": "Ghomala",
    "nameRu": "гомала"
  },
  "be": {
    "nameEn": "Belarusian",
    "nameRu": "белорусский"
  },
  "bej": {
    "nameEn": "Beja",
    "nameRu": "беджа"
  },
  "bem": {
    "nameEn": "Bemba",
    "nameRu": "бемба"
  },
  "bew": {
    "nameEn": "Betawi",
    "nameRu": "Betawi"
  },
  "bez": {
    "nameEn": "Bena",
    "nameRu": "бена"
  },
  "bg": {
    "nameEn": "Bulgarian",
    "nameRu": "болгарский"
  },
  "bgc": {
    "nameEn": "Haryanvi",
    "nameRu": "харианви"
  },
  "bho": {
    "nameEn": "Bhojpuri",
    "nameRu": "бходжпури"
  },
  "bi": {
    "nameEn": "Bislama",
    "nameRu": "бислама"
  },
  "bik": {
    "nameEn": "Bikol",
    "nameRu": "бикольский"
  },
  "bjn": {
    "nameEn": "Banjar",
    "nameRu": "Banjar"
  },
  "bkm": {
    "nameEn": "Kom",
    "nameRu": "ком"
  },
  "bm": {
    "nameEn": "Bambara",
    "nameRu": "бамбара"
  },
  "bn": {
    "nameEn": "Bangla",
    "nameRu": "бенгальский"
  },
  "bqi": {
    "nameEn": "Bakhtiari",
    "nameRu": "Bakhtiari"
  },
  "brh": {
    "nameEn": "Brahui",
    "nameRu": "Brahui"
  },
  "bs": {
    "nameEn": "Bosnian",
    "nameRu": "боснийский"
  },
  "bug": {
    "nameEn": "Buginese",
    "nameRu": "бугийский"
  },
  "bum": {
    "nameEn": "Bulu",
    "nameRu": "булу"
  },
  "byn": {
    "nameEn": "Blin",
    "nameRu": "билин"
  },
  "byv": {
    "nameEn": "Medumba",
    "nameRu": "медумба"
  },
  "ca": {
    "nameEn": "Catalan",
    "nameRu": "каталанский"
  },
  "ceb": {
    "nameEn": "Cebuano",
    "nameRu": "себуано"
  },
  "cgg": {
    "nameEn": "Chiga",
    "nameRu": "кига"
  },
  "chk": {
    "nameEn": "Chuukese",
    "nameRu": "чукотский"
  },
  "ckb": {
    "nameEn": "Central Kurdish",
    "nameRu": "центральнокурдский"
  },
  "cop": {
    "nameEn": "Coptic",
    "nameRu": "коптский"
  },
  "crs": {
    "nameEn": "Seselwa Creole French",
    "nameRu": "сейшельский креольский"
  },
  "cs": {
    "nameEn": "Czech",
    "nameRu": "чешский"
  },
  "cv": {
    "nameEn": "Chuvash",
    "nameRu": "чувашский"
  },
  "cy": {
    "nameEn": "Welsh",
    "nameRu": "валлийский"
  },
  "da": {
    "nameEn": "Danish",
    "nameRu": "датский"
  },
  "de": {
    "nameEn": "German",
    "nameRu": "немецкий"
  },
  "dje": {
    "nameEn": "Zarma",
    "nameRu": "джерма"
  },
  "dv": {
    "nameEn": "Divehi",
    "nameRu": "мальдивский"
  },
  "dyo": {
    "nameEn": "Jola-Fonyi",
    "nameRu": "диола-фоньи"
  },
  "dyu": {
    "nameEn": "Dyula",
    "nameRu": "диула"
  },
  "dz": {
    "nameEn": "Dzongkha",
    "nameRu": "дзонг-кэ"
  },
  "ebu": {
    "nameEn": "Embu",
    "nameRu": "эмбу"
  },
  "ee": {
    "nameEn": "Ewe",
    "nameRu": "эве"
  },
  "efi": {
    "nameEn": "Efik",
    "nameRu": "эфик"
  },
  "el": {
    "nameEn": "Greek",
    "nameRu": "греческий"
  },
  "en": {
    "nameEn": "English",
    "nameRu": "английский"
  },
  "es": {
    "nameEn": "Spanish",
    "nameRu": "испанский"
  },
  "et": {
    "nameEn": "Estonian",
    "nameRu": "эстонский"
  },
  "eu": {
    "nameEn": "Basque",
    "nameRu": "баскский"
  },
  "ewo": {
    "nameEn": "Ewondo",
    "nameRu": "эвондо"
  },
  "fa": {
    "nameEn": "Persian",
    "nameRu": "персидский"
  },
  "fan": {
    "nameEn": "Fang",
    "nameRu": "фанг"
  },
  "ff": {
    "nameEn": "Fula",
    "nameRu": "фулах"
  },
  "fi": {
    "nameEn": "Finnish",
    "nameRu": "финский"
  },
  "fil": {
    "nameEn": "Filipino",
    "nameRu": "филиппинский"
  },
  "fj": {
    "nameEn": "Fijian",
    "nameRu": "фиджи"
  },
  "fon": {
    "nameEn": "Fon",
    "nameRu": "фон"
  },
  "fr": {
    "nameEn": "French",
    "nameRu": "французский"
  },
  "fy": {
    "nameEn": "Western Frisian",
    "nameRu": "западнофризский"
  },
  "ga": {
    "nameEn": "Irish",
    "nameRu": "ирландский"
  },
  "gaa": {
    "nameEn": "Ga",
    "nameRu": "га"
  },
  "gag": {
    "nameEn": "Gagauz",
    "nameRu": "гагаузский"
  },
  "gan": {
    "nameEn": "Gan Chinese",
    "nameRu": "гань"
  },
  "gil": {
    "nameEn": "Gilbertese",
    "nameRu": "гилбертский"
  },
  "gl": {
    "nameEn": "Galician",
    "nameRu": "галисийский"
  },
  "glk": {
    "nameEn": "Gilaki",
    "nameRu": "Gilaki"
  },
  "gn": {
    "nameEn": "Guarani",
    "nameRu": "гуарани"
  },
  "grb": {
    "nameEn": "Grebo",
    "nameRu": "гребо"
  },
  "gsw": {
    "nameEn": "Swiss German",
    "nameRu": "швейцарский немецкий"
  },
  "gu": {
    "nameEn": "Gujarati",
    "nameRu": "гуджарати"
  },
  "gur": {
    "nameEn": "Frafra",
    "nameRu": "Frafra"
  },
  "guz": {
    "nameEn": "Gusii",
    "nameRu": "гусии"
  },
  "ha": {
    "nameEn": "Hausa",
    "nameRu": "хауса"
  },
  "hak": {
    "nameEn": "Hakka Chinese",
    "nameRu": "хакка"
  },
  "he": {
    "nameEn": "Hebrew",
    "nameRu": "иврит"
  },
  "hi": {
    "nameEn": "Hindi",
    "nameRu": "хинди"
  },
  "hif": {
    "nameEn": "Fiji Hindi",
    "nameRu": "Fiji Hindi"
  },
  "hil": {
    "nameEn": "Hiligaynon",
    "nameRu": "хилигайнон"
  },
  "hnj": {
    "nameEn": "Hmong Njua",
    "nameRu": "Hmong Njua"
  },
  "ho": {
    "nameEn": "Hiri Motu",
    "nameRu": "хиримоту"
  },
  "hr": {
    "nameEn": "Croatian",
    "nameRu": "хорватский"
  },
  "hsn": {
    "nameEn": "Xiang Chinese",
    "nameRu": "сян"
  },
  "ht": {
    "nameEn": "Haitian Creole",
    "nameRu": "гаитянский"
  },
  "hu": {
    "nameEn": "Hungarian",
    "nameRu": "венгерский"
  },
  "hy": {
    "nameEn": "Armenian",
    "nameRu": "армянский"
  },
  "hz": {
    "nameEn": "Herero",
    "nameRu": "гереро"
  },
  "iba": {
    "nameEn": "Iban",
    "nameRu": "ибанский"
  },
  "ibb": {
    "nameEn": "Ibibio",
    "nameRu": "ибибио"
  },
  "id": {
    "nameEn": "Indonesian",
    "nameRu": "индонезийский"
  },
  "ig": {
    "nameEn": "Igbo",
    "nameRu": "игбо"
  },
  "ilo": {
    "nameEn": "Iloko",
    "nameRu": "илоко"
  },
  "is": {
    "nameEn": "Icelandic",
    "nameRu": "исландский"
  },
  "it": {
    "nameEn": "Italian",
    "nameRu": "итальянский"
  },
  "ja": {
    "nameEn": "Japanese",
    "nameRu": "японский"
  },
  "jam": {
    "nameEn": "Jamaican Creole English",
    "nameRu": "Jamaican Creole English"
  },
  "jv": {
    "nameEn": "Javanese",
    "nameRu": "яванский"
  },
  "ka": {
    "nameEn": "Georgian",
    "nameRu": "грузинский"
  },
  "kaa": {
    "nameEn": "Kara-Kalpak",
    "nameRu": "каракалпакский"
  },
  "kab": {
    "nameEn": "Kabyle",
    "nameRu": "кабильский"
  },
  "kac": {
    "nameEn": "Kachin",
    "nameRu": "качинский"
  },
  "kam": {
    "nameEn": "Kamba",
    "nameRu": "камба"
  },
  "kde": {
    "nameEn": "Makonde",
    "nameRu": "маконде"
  },
  "kea": {
    "nameEn": "Kabuverdianu",
    "nameRu": "кабувердьяну"
  },
  "kek": {
    "nameEn": "Qʼeqchiʼ",
    "nameRu": "Qʼeqchiʼ"
  },
  "kg": {
    "nameEn": "Kongo",
    "nameRu": "конго"
  },
  "khq": {
    "nameEn": "Koyra Chiini",
    "nameRu": "койра чиини"
  },
  "ki": {
    "nameEn": "Kikuyu",
    "nameRu": "кикуйю"
  },
  "kj": {
    "nameEn": "Kuanyama",
    "nameRu": "кунама"
  },
  "kk": {
    "nameEn": "Kazakh",
    "nameRu": "казахский"
  },
  "kln": {
    "nameEn": "Kalenjin",
    "nameRu": "календжин"
  },
  "km": {
    "nameEn": "Khmer",
    "nameRu": "кхмерский"
  },
  "kmb": {
    "nameEn": "Kimbundu",
    "nameRu": "кимбунду"
  },
  "kn": {
    "nameEn": "Kannada",
    "nameRu": "каннада"
  },
  "ko": {
    "nameEn": "Korean",
    "nameRu": "корейский"
  },
  "kos": {
    "nameEn": "Kosraean",
    "nameRu": "косраенский"
  },
  "kpe": {
    "nameEn": "Kpelle",
    "nameRu": "кпелле"
  },
  "kri": {
    "nameEn": "Krio",
    "nameRu": "Krio"
  },
  "ksb": {
    "nameEn": "Shambala",
    "nameRu": "шамбала"
  },
  "ku": {
    "nameEn": "Kurdish",
    "nameRu": "курдский"
  },
  "ky": {
    "nameEn": "Kyrgyz",
    "nameRu": "киргизский"
  },
  "lad": {
    "nameEn": "Ladino",
    "nameRu": "ладино"
  },
  "lah": {
    "nameEn": "Western Panjabi",
    "nameRu": "лахнда"
  },
  "lb": {
    "nameEn": "Luxembourgish",
    "nameRu": "люксембургский"
  },
  "lg": {
    "nameEn": "Ganda",
    "nameRu": "ганда"
  },
  "li": {
    "nameEn": "Limburgish",
    "nameRu": "лимбургский"
  },
  "lmo": {
    "nameEn": "Lombard",
    "nameRu": "ломбардский"
  },
  "ln": {
    "nameEn": "Lingala",
    "nameRu": "лингала"
  },
  "lo": {
    "nameEn": "Lao",
    "nameRu": "лаосский"
  },
  "loz": {
    "nameEn": "Lozi",
    "nameRu": "лози"
  },
  "lrc": {
    "nameEn": "Northern Luri",
    "nameRu": "севернолурский"
  },
  "lt": {
    "nameEn": "Lithuanian",
    "nameRu": "литовский"
  },
  "ltg": {
    "nameEn": "Latgalian",
    "nameRu": "Latgalian"
  },
  "lu": {
    "nameEn": "Luba-Katanga",
    "nameRu": "луба-катанга"
  },
  "lua": {
    "nameEn": "Luba-Lulua",
    "nameRu": "луба-лулуа"
  },
  "lun": {
    "nameEn": "Lunda",
    "nameRu": "лунда"
  },
  "luo": {
    "nameEn": "Luo",
    "nameRu": "луо"
  },
  "luy": {
    "nameEn": "Luyia",
    "nameRu": "лухья"
  },
  "lv": {
    "nameEn": "Latvian",
    "nameRu": "латышский"
  },
  "mad": {
    "nameEn": "Madurese",
    "nameRu": "мадурский"
  },
  "mag": {
    "nameEn": "Magahi",
    "nameRu": "магахи"
  },
  "mai": {
    "nameEn": "Maithili",
    "nameRu": "майтхили"
  },
  "man": {
    "nameEn": "Mandingo",
    "nameRu": "мандинго"
  },
  "mas": {
    "nameEn": "Masai",
    "nameRu": "масаи"
  },
  "men": {
    "nameEn": "Mende",
    "nameRu": "менде"
  },
  "mer": {
    "nameEn": "Meru",
    "nameRu": "меру"
  },
  "mfe": {
    "nameEn": "Morisyen",
    "nameRu": "маврикийский креольский"
  },
  "mg": {
    "nameEn": "Malagasy",
    "nameRu": "малагасийский"
  },
  "mgh": {
    "nameEn": "Makhuwa-Meetto",
    "nameRu": "макуа-меетто"
  },
  "mh": {
    "nameEn": "Marshallese",
    "nameRu": "маршалльский"
  },
  "mi": {
    "nameEn": "Māori",
    "nameRu": "маори"
  },
  "min": {
    "nameEn": "Minangkabau",
    "nameRu": "минангкабау"
  },
  "mk": {
    "nameEn": "Macedonian",
    "nameRu": "македонский"
  },
  "ml": {
    "nameEn": "Malayalam",
    "nameRu": "малаялам"
  },
  "mn": {
    "nameEn": "Mongolian",
    "nameRu": "монгольский"
  },
  "mos": {
    "nameEn": "Mossi",
    "nameRu": "моси"
  },
  "mr": {
    "nameEn": "Marathi",
    "nameRu": "маратхи"
  },
  "ms": {
    "nameEn": "Malay",
    "nameRu": "малайский"
  },
  "mt": {
    "nameEn": "Maltese",
    "nameRu": "мальтийский"
  },
  "mua": {
    "nameEn": "Mundang",
    "nameRu": "мунданг"
  },
  "mwr": {
    "nameEn": "Marwari",
    "nameRu": "марвари"
  },
  "my": {
    "nameEn": "Burmese",
    "nameRu": "бирманский"
  },
  "mzn": {
    "nameEn": "Mazanderani",
    "nameRu": "мазандеранский"
  },
  "na": {
    "nameEn": "Nauru",
    "nameRu": "науру"
  },
  "nan": {
    "nameEn": "Min Nan Chinese",
    "nameRu": "миньнань"
  },
  "naq": {
    "nameEn": "Nama",
    "nameRu": "нама"
  },
  "nb": {
    "nameEn": "Norwegian Bokmål",
    "nameRu": "норвежский букмол"
  },
  "nd": {
    "nameEn": "North Ndebele",
    "nameRu": "северный ндебеле"
  },
  "nds": {
    "nameEn": "Low German",
    "nameRu": "нижненемецкий"
  },
  "ne": {
    "nameEn": "Nepali",
    "nameRu": "непальский"
  },
  "new": {
    "nameEn": "Newari",
    "nameRu": "неварский"
  },
  "ng": {
    "nameEn": "Ndonga",
    "nameRu": "ндонга"
  },
  "nl": {
    "nameEn": "Dutch",
    "nameRu": "нидерландский"
  },
  "nn": {
    "nameEn": "Norwegian Nynorsk",
    "nameRu": "нюнорск"
  },
  "nnh": {
    "nameEn": "Ngiemboon",
    "nameRu": "нгиембунд"
  },
  "no": {
    "nameEn": "Norwegian",
    "nameRu": "норвежский"
  },
  "nqo": {
    "nameEn": "N’Ko",
    "nameRu": "нко"
  },
  "nr": {
    "nameEn": "South Ndebele",
    "nameRu": "южный ндебеле"
  },
  "nso": {
    "nameEn": "Northern Sotho",
    "nameRu": "северный сото"
  },
  "nus": {
    "nameEn": "Nuer",
    "nameRu": "нуэр"
  },
  "ny": {
    "nameEn": "Nyanja",
    "nameRu": "ньянджа"
  },
  "nym": {
    "nameEn": "Nyamwezi",
    "nameRu": "ньямвези"
  },
  "nyn": {
    "nameEn": "Nyankole",
    "nameRu": "ньянколе"
  },
  "nzi": {
    "nameEn": "Nzima",
    "nameRu": "нзима"
  },
  "oc": {
    "nameEn": "Occitan",
    "nameRu": "окситанский"
  },
  "om": {
    "nameEn": "Oromo",
    "nameRu": "оромо"
  },
  "or": {
    "nameEn": "Odia",
    "nameRu": "ория"
  },
  "os": {
    "nameEn": "Ossetic",
    "nameRu": "осетинский"
  },
  "pa": {
    "nameEn": "Punjabi",
    "nameRu": "панджаби"
  },
  "pag": {
    "nameEn": "Pangasinan",
    "nameRu": "пангасинан"
  },
  "pam": {
    "nameEn": "Pampanga",
    "nameRu": "пампанга"
  },
  "pau": {
    "nameEn": "Palauan",
    "nameRu": "палау"
  },
  "pcd": {
    "nameEn": "Picard",
    "nameRu": "Picard"
  },
  "pcm": {
    "nameEn": "Nigerian Pidgin",
    "nameRu": "нигерийско-креольский"
  },
  "pis": {
    "nameEn": "Pijin",
    "nameRu": "соломонский пиджин"
  },
  "pl": {
    "nameEn": "Polish",
    "nameRu": "польский"
  },
  "pms": {
    "nameEn": "Piedmontese",
    "nameRu": "Piedmontese"
  },
  "pnt": {
    "nameEn": "Pontic",
    "nameRu": "Pontic"
  },
  "pon": {
    "nameEn": "Pohnpeian",
    "nameRu": "понапе"
  },
  "ps": {
    "nameEn": "Pashto",
    "nameRu": "пушту"
  },
  "pt": {
    "nameEn": "Portuguese",
    "nameRu": "португальский"
  },
  "qu": {
    "nameEn": "Quechua",
    "nameRu": "кечуа"
  },
  "quc": {
    "nameEn": "Kʼicheʼ",
    "nameRu": "киче"
  },
  "qug": {
    "nameEn": "Chimborazo Highland Quichua",
    "nameRu": "Chimborazo Highland Quichua"
  },
  "rhg": {
    "nameEn": "Rohingya",
    "nameRu": "рохинджа"
  },
  "rif": {
    "nameEn": "Riffian",
    "nameRu": "Riffian"
  },
  "rm": {
    "nameEn": "Romansh",
    "nameRu": "романшский"
  },
  "rn": {
    "nameEn": "Rundi",
    "nameRu": "рунди"
  },
  "ro": {
    "nameEn": "Romanian",
    "nameRu": "румынский"
  },
  "ru": {
    "nameEn": "Russian",
    "nameRu": "русский"
  },
  "rue": {
    "nameEn": "Rusyn",
    "nameRu": "Rusyn"
  },
  "rug": {
    "nameEn": "Roviana",
    "nameRu": "Roviana"
  },
  "rw": {
    "nameEn": "Kinyarwanda",
    "nameRu": "киньяруанда"
  },
  "sc": {
    "nameEn": "Sardinian",
    "nameRu": "сардинский"
  },
  "sco": {
    "nameEn": "Scots",
    "nameRu": "шотландский"
  },
  "sd": {
    "nameEn": "Sindhi",
    "nameRu": "синдхи"
  },
  "sdh": {
    "nameEn": "Southern Kurdish",
    "nameRu": "южнокурдский"
  },
  "seh": {
    "nameEn": "Sena",
    "nameRu": "сена"
  },
  "ses": {
    "nameEn": "Koyraboro Senni",
    "nameRu": "койраборо сенни"
  },
  "sg": {
    "nameEn": "Sango",
    "nameRu": "санго"
  },
  "shi": {
    "nameEn": "Tachelhit",
    "nameRu": "ташельхит"
  },
  "shn": {
    "nameEn": "Shan",
    "nameRu": "шанский"
  },
  "si": {
    "nameEn": "Sinhala",
    "nameRu": "сингальский"
  },
  "sid": {
    "nameEn": "Sidamo",
    "nameRu": "сидама"
  },
  "sk": {
    "nameEn": "Slovak",
    "nameRu": "словацкий"
  },
  "sl": {
    "nameEn": "Slovenian",
    "nameRu": "словенский"
  },
  "sm": {
    "nameEn": "Samoan",
    "nameRu": "самоанский"
  },
  "sn": {
    "nameEn": "Shona",
    "nameRu": "шона"
  },
  "snk": {
    "nameEn": "Soninke",
    "nameRu": "сонинке"
  },
  "so": {
    "nameEn": "Somali",
    "nameRu": "сомали"
  },
  "sq": {
    "nameEn": "Albanian",
    "nameRu": "албанский"
  },
  "sr": {
    "nameEn": "Serbian",
    "nameRu": "сербский"
  },
  "srn": {
    "nameEn": "Sranan Tongo",
    "nameRu": "сранан-тонго"
  },
  "srr": {
    "nameEn": "Serer",
    "nameRu": "серер"
  },
  "ss": {
    "nameEn": "Swati",
    "nameRu": "свази"
  },
  "ssy": {
    "nameEn": "Saho",
    "nameRu": "сахо"
  },
  "st": {
    "nameEn": "Southern Sotho",
    "nameRu": "южный сото"
  },
  "su": {
    "nameEn": "Sundanese",
    "nameRu": "сунданский"
  },
  "suk": {
    "nameEn": "Sukuma",
    "nameRu": "сукума"
  },
  "sus": {
    "nameEn": "Susu",
    "nameRu": "сусу"
  },
  "sv": {
    "nameEn": "Swedish",
    "nameRu": "шведский"
  },
  "sw": {
    "nameEn": "Swahili",
    "nameRu": "суахили"
  },
  "szl": {
    "nameEn": "Silesian",
    "nameRu": "силезский"
  },
  "ta": {
    "nameEn": "Tamil",
    "nameRu": "тамильский"
  },
  "te": {
    "nameEn": "Telugu",
    "nameRu": "телугу"
  },
  "tem": {
    "nameEn": "Timne",
    "nameRu": "темне"
  },
  "teo": {
    "nameEn": "Teso",
    "nameRu": "тесо"
  },
  "tet": {
    "nameEn": "Tetum",
    "nameRu": "тетум"
  },
  "tg": {
    "nameEn": "Tajik",
    "nameRu": "таджикский"
  },
  "th": {
    "nameEn": "Thai",
    "nameRu": "тайский"
  },
  "ti": {
    "nameEn": "Tigrinya",
    "nameRu": "тигринья"
  },
  "tig": {
    "nameEn": "Tigre",
    "nameRu": "тигре"
  },
  "tiv": {
    "nameEn": "Tiv",
    "nameRu": "тиви"
  },
  "tk": {
    "nameEn": "Turkmen",
    "nameRu": "туркменский"
  },
  "tly": {
    "nameEn": "Talysh",
    "nameRu": "Talysh"
  },
  "tmh": {
    "nameEn": "Tamashek",
    "nameRu": "тамашек"
  },
  "tn": {
    "nameEn": "Tswana",
    "nameRu": "тсвана"
  },
  "to": {
    "nameEn": "Tongan",
    "nameRu": "тонганский"
  },
  "tpi": {
    "nameEn": "Tok Pisin",
    "nameRu": "ток-писин"
  },
  "tr": {
    "nameEn": "Turkish",
    "nameRu": "турецкий"
  },
  "ts": {
    "nameEn": "Tsonga",
    "nameRu": "тсонга"
  },
  "tt": {
    "nameEn": "Tatar",
    "nameRu": "татарский"
  },
  "tum": {
    "nameEn": "Tumbuka",
    "nameRu": "тумбука"
  },
  "tvl": {
    "nameEn": "Tuvalu",
    "nameRu": "тувалу"
  },
  "tzm": {
    "nameEn": "Central Atlas Tamazight",
    "nameRu": "среднеатласский тамазигхтский"
  },
  "ug": {
    "nameEn": "Uyghur",
    "nameRu": "уйгурский"
  },
  "uk": {
    "nameEn": "Ukrainian",
    "nameRu": "украинский"
  },
  "umb": {
    "nameEn": "Umbundu",
    "nameRu": "умбунду"
  },
  "ur": {
    "nameEn": "Urdu",
    "nameRu": "урду"
  },
  "uz": {
    "nameEn": "Uzbek",
    "nameRu": "узбекский"
  },
  "vai": {
    "nameEn": "Vai",
    "nameRu": "ваи"
  },
  "ve": {
    "nameEn": "Venda",
    "nameRu": "венда"
  },
  "vec": {
    "nameEn": "Venetian",
    "nameRu": "венецианский"
  },
  "vi": {
    "nameEn": "Vietnamese",
    "nameRu": "вьетнамский"
  },
  "vls": {
    "nameEn": "West Flemish",
    "nameRu": "West Flemish"
  },
  "vmf": {
    "nameEn": "Main-Franconian",
    "nameRu": "Main-Franconian"
  },
  "vmw": {
    "nameEn": "Makhuwa",
    "nameRu": "макуа"
  },
  "vro": {
    "nameEn": "Võro",
    "nameRu": "Võro"
  },
  "wa": {
    "nameEn": "Walloon",
    "nameRu": "валлонский"
  },
  "wal": {
    "nameEn": "Wolaytta",
    "nameRu": "воламо"
  },
  "war": {
    "nameEn": "Waray",
    "nameRu": "варай"
  },
  "wo": {
    "nameEn": "Wolof",
    "nameRu": "волоф"
  },
  "wuu": {
    "nameEn": "Wu Chinese",
    "nameRu": "у"
  },
  "xh": {
    "nameEn": "Xhosa",
    "nameRu": "коса"
  },
  "xmf": {
    "nameEn": "Mingrelian",
    "nameRu": "Mingrelian"
  },
  "xog": {
    "nameEn": "Soga",
    "nameRu": "сога"
  },
  "yao": {
    "nameEn": "Yao",
    "nameRu": "яо"
  },
  "yap": {
    "nameEn": "Yapese",
    "nameRu": "яп"
  },
  "ybb": {
    "nameEn": "Yemba",
    "nameRu": "йемба"
  },
  "yi": {
    "nameEn": "Yiddish",
    "nameRu": "идиш"
  },
  "yo": {
    "nameEn": "Yoruba",
    "nameRu": "йоруба"
  },
  "yue": {
    "nameEn": "Cantonese",
    "nameRu": "кантонский"
  },
  "zea": {
    "nameEn": "Zeelandic",
    "nameRu": "Zeelandic"
  },
  "zgh": {
    "nameEn": "Standard Moroccan Tamazight",
    "nameRu": "тамазигхтский"
  },
  "zh": {
    "nameEn": "Chinese",
    "nameRu": "китайский"
  },
  "zu": {
    "nameEn": "Zulu",
    "nameRu": "зулу"
  },
  "zza": {
    "nameEn": "Zaza",
    "nameRu": "заза"
  }
}

export const COUNTRY_LANGS: Record<string, CountryLangs> = {
  "dz": {
    "official": [
      "ar",
      "fr"
    ],
    "spoken": [
      {
        "id": "arq",
        "pct": 83
      },
      {
        "id": "ar",
        "pct": 74
      },
      {
        "id": "fr",
        "pct": 33
      },
      {
        "id": "kab",
        "pct": 7.8
      },
      {
        "id": "en",
        "pct": 7
      }
    ]
  },
  "ao": {
    "official": [
      "pt"
    ],
    "spoken": [
      {
        "id": "pt",
        "pct": 67
      },
      {
        "id": "umb",
        "pct": 29
      },
      {
        "id": "kmb",
        "pct": 25
      }
    ]
  },
  "bj": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 34
      },
      {
        "id": "fon",
        "pct": 25
      },
      {
        "id": "yo",
        "pct": 6.7
      }
    ]
  },
  "bw": {
    "official": [
      "en",
      "tn"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 81
      },
      {
        "id": "tn",
        "pct": 62
      }
    ]
  },
  "bf": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "mos",
        "pct": 40
      },
      {
        "id": "dyu",
        "pct": 32
      },
      {
        "id": "fr",
        "pct": 25
      }
    ]
  },
  "bi": {
    "official": [
      "rn",
      "fr",
      "en"
    ],
    "spoken": [
      {
        "id": "rn",
        "pct": 63
      },
      {
        "id": "fr",
        "pct": 59
      }
    ]
  },
  "cv": {
    "official": [
      "pt"
    ],
    "spoken": [
      {
        "id": "kea",
        "pct": 91
      },
      {
        "id": "pt",
        "pct": 76
      }
    ]
  },
  "cm": {
    "official": [
      "fr",
      "en"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 68
      },
      {
        "id": "en",
        "pct": 38
      },
      {
        "id": "bum",
        "pct": 4.6
      },
      {
        "id": "ff",
        "pct": 3.6
      },
      {
        "id": "ewo",
        "pct": 3.1
      },
      {
        "id": "ybb",
        "pct": 1.6
      },
      {
        "id": "bbj",
        "pct": 1.4
      },
      {
        "id": "nnh",
        "pct": 1.4
      },
      {
        "id": "bkm",
        "pct": 1.3
      },
      {
        "id": "bas",
        "pct": 1.2
      },
      {
        "id": "bax",
        "pct": 1.2
      },
      {
        "id": "byv",
        "pct": 1.1
      },
      {
        "id": "mua",
        "pct": 1
      }
    ]
  },
  "cf": {
    "official": [
      "sg",
      "fr"
    ],
    "spoken": [
      {
        "id": "sg",
        "pct": 49
      },
      {
        "id": "fr",
        "pct": 29
      }
    ]
  },
  "td": {
    "official": [
      "ar",
      "fr"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 17
      },
      {
        "id": "fr",
        "pct": 13
      }
    ]
  },
  "km": {
    "official": [
      "ar",
      "fr"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 66
      },
      {
        "id": "fr",
        "pct": 26
      }
    ]
  },
  "cg": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 61
      },
      {
        "id": "ln",
        "pct": 2.4
      }
    ]
  },
  "ci": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 34
      }
    ]
  },
  "cd": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 51
      },
      {
        "id": "sw",
        "pct": 50
      },
      {
        "id": "lua",
        "pct": 9.6
      },
      {
        "id": "ln",
        "pct": 3.1
      },
      {
        "id": "lu",
        "pct": 2.3
      },
      {
        "id": "kg",
        "pct": 1.5
      }
    ]
  },
  "dj": {
    "official": [
      "fr",
      "ar"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 50
      },
      {
        "id": "aa",
        "pct": 42
      },
      {
        "id": "so",
        "pct": 41
      },
      {
        "id": "ar",
        "pct": 7.3
      }
    ]
  },
  "eg": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 94
      },
      {
        "id": "arz",
        "pct": 64
      },
      {
        "id": "en",
        "pct": 35
      },
      {
        "id": "cop",
        "pct": 6
      }
    ]
  },
  "gq": {
    "official": [
      "es",
      "fr",
      "pt"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 87
      },
      {
        "id": "fan",
        "pct": 51
      },
      {
        "id": "fr",
        "pct": 29
      }
    ]
  },
  "er": {
    "official": [
      "en",
      "ar"
    ],
    "spoken": [
      {
        "id": "ti",
        "pct": 60
      },
      {
        "id": "en",
        "pct": 59
      },
      {
        "id": "tig",
        "pct": 18
      },
      {
        "id": "ar",
        "pct": 4.9
      },
      {
        "id": "aa",
        "pct": 3.6
      },
      {
        "id": "ssy",
        "pct": 3.6
      },
      {
        "id": "byn",
        "pct": 1.3
      }
    ]
  },
  "sz": {
    "official": [
      "en",
      "ss"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 80
      },
      {
        "id": "ss",
        "pct": 58
      },
      {
        "id": "zu",
        "pct": 6.8
      },
      {
        "id": "ts",
        "pct": 1.7
      }
    ]
  },
  "et": {
    "official": [
      "am"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 43
      },
      {
        "id": "am",
        "pct": 33
      },
      {
        "id": "om",
        "pct": 32
      },
      {
        "id": "so",
        "pct": 6
      },
      {
        "id": "ti",
        "pct": 6
      },
      {
        "id": "sid",
        "pct": 3.5
      },
      {
        "id": "wal",
        "pct": 1.8
      },
      {
        "id": "aa",
        "pct": 1.4
      }
    ]
  },
  "ga": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 63
      }
    ]
  },
  "gm": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "man",
        "pct": 58
      },
      {
        "id": "en",
        "pct": 40
      }
    ]
  },
  "gh": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "ak",
        "pct": 39
      },
      {
        "id": "en",
        "pct": 21
      },
      {
        "id": "ee",
        "pct": 11
      },
      {
        "id": "gur",
        "pct": 3.5
      },
      {
        "id": "ada",
        "pct": 3
      },
      {
        "id": "gaa",
        "pct": 2.8
      },
      {
        "id": "nzi",
        "pct": 1
      }
    ]
  },
  "gn": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "man",
        "pct": 46
      },
      {
        "id": "fr",
        "pct": 27
      },
      {
        "id": "ff",
        "pct": 26
      },
      {
        "id": "sus",
        "pct": 11
      },
      {
        "id": "nqo",
        "pct": 5
      },
      {
        "id": "kpe",
        "pct": 3.8
      }
    ]
  },
  "gw": {
    "official": [
      "pt"
    ],
    "spoken": [
      {
        "id": "pt",
        "pct": 100
      },
      {
        "id": "fr",
        "pct": 15
      }
    ]
  },
  "ke": {
    "official": [
      "sw",
      "en"
    ],
    "spoken": [
      {
        "id": "sw",
        "pct": 66
      },
      {
        "id": "en",
        "pct": 19
      },
      {
        "id": "ki",
        "pct": 17
      },
      {
        "id": "luy",
        "pct": 11
      },
      {
        "id": "luo",
        "pct": 9.8
      },
      {
        "id": "kam",
        "pct": 7.6
      },
      {
        "id": "kln",
        "pct": 7.6
      },
      {
        "id": "guz",
        "pct": 4.9
      },
      {
        "id": "mer",
        "pct": 4
      },
      {
        "id": "mas",
        "pct": 1.6
      },
      {
        "id": "ebu",
        "pct": 1.5
      },
      {
        "id": "so",
        "pct": 1.3
      }
    ]
  },
  "ls": {
    "official": [
      "st",
      "en"
    ],
    "spoken": [
      {
        "id": "st",
        "pct": 98
      },
      {
        "id": "en",
        "pct": 27
      },
      {
        "id": "zu",
        "pct": 14
      },
      {
        "id": "ss",
        "pct": 2.4
      }
    ]
  },
  "lr": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 83
      },
      {
        "id": "kpe",
        "pct": 20
      },
      {
        "id": "grb",
        "pct": 9.9
      },
      {
        "id": "vai",
        "pct": 3.8
      },
      {
        "id": "men",
        "pct": 1.7
      }
    ]
  },
  "ly": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 74
      }
    ]
  },
  "mg": {
    "official": [
      "mg",
      "fr",
      "en"
    ],
    "spoken": [
      {
        "id": "mg",
        "pct": 90
      },
      {
        "id": "fr",
        "pct": 27
      },
      {
        "id": "en",
        "pct": 18
      }
    ]
  },
  "mw": {
    "official": [
      "en",
      "ny"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 63
      },
      {
        "id": "ny",
        "pct": 63
      },
      {
        "id": "tum",
        "pct": 8.4
      }
    ]
  },
  "ml": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "bm",
        "pct": 48
      },
      {
        "id": "fr",
        "pct": 17
      },
      {
        "id": "snk",
        "pct": 5.9
      },
      {
        "id": "ses",
        "pct": 3.4
      },
      {
        "id": "tmh",
        "pct": 2.1
      },
      {
        "id": "khq",
        "pct": 1.7
      }
    ]
  },
  "mr": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 85
      },
      {
        "id": "fr",
        "pct": 13
      },
      {
        "id": "ff",
        "pct": 5.7
      }
    ]
  },
  "mu": {
    "official": [
      "fr",
      "en"
    ],
    "spoken": [
      {
        "id": "mfe",
        "pct": 90
      },
      {
        "id": "fr",
        "pct": 73
      },
      {
        "id": "en",
        "pct": 72
      },
      {
        "id": "bho",
        "pct": 8.6
      },
      {
        "id": "ur",
        "pct": 5.2
      },
      {
        "id": "ta",
        "pct": 2.5
      }
    ]
  },
  "ma": {
    "official": [
      "ar",
      "tzm"
    ],
    "spoken": [
      {
        "id": "ary",
        "pct": 87
      },
      {
        "id": "ar",
        "pct": 62
      },
      {
        "id": "fr",
        "pct": 36
      },
      {
        "id": "zgh",
        "pct": 22
      },
      {
        "id": "shi",
        "pct": 17.4
      },
      {
        "id": "en",
        "pct": 14
      },
      {
        "id": "rif",
        "pct": 9.8
      },
      {
        "id": "tzm",
        "pct": 9.8
      }
    ]
  },
  "mz": {
    "official": [
      "pt"
    ],
    "spoken": [
      {
        "id": "pt",
        "pct": 27
      },
      {
        "id": "vmw",
        "pct": 13
      },
      {
        "id": "ts",
        "pct": 7.9
      },
      {
        "id": "seh",
        "pct": 4.6
      },
      {
        "id": "mgh",
        "pct": 4.5
      },
      {
        "id": "ny",
        "pct": 2.6
      },
      {
        "id": "yao",
        "pct": 2.4
      }
    ]
  },
  "na": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "af",
        "pct": 75
      },
      {
        "id": "kj",
        "pct": 35
      },
      {
        "id": "ng",
        "pct": 21
      },
      {
        "id": "naq",
        "pct": 11
      },
      {
        "id": "hz",
        "pct": 9.1
      },
      {
        "id": "en",
        "pct": 7
      }
    ]
  },
  "ne": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "ha",
        "pct": 41
      },
      {
        "id": "dje",
        "pct": 17
      },
      {
        "id": "fr",
        "pct": 13
      },
      {
        "id": "tmh",
        "pct": 6
      }
    ]
  },
  "ng": {
    "official": [
      "en",
      "yo"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 53
      },
      {
        "id": "pcm",
        "pct": 21
      },
      {
        "id": "ha",
        "pct": 14
      },
      {
        "id": "ig",
        "pct": 13
      },
      {
        "id": "yo",
        "pct": 13
      },
      {
        "id": "tiv",
        "pct": 1.6
      },
      {
        "id": "efi",
        "pct": 1.4
      },
      {
        "id": "ibb",
        "pct": 1.4
      }
    ]
  },
  "rw": {
    "official": [
      "rw",
      "en",
      "fr"
    ],
    "spoken": [
      {
        "id": "rw",
        "pct": 77
      },
      {
        "id": "en",
        "pct": 15
      },
      {
        "id": "fr",
        "pct": 5.8
      }
    ]
  },
  "st": {
    "official": [
      "pt"
    ],
    "spoken": [
      {
        "id": "pt",
        "pct": 85
      },
      {
        "id": "fr",
        "pct": 20
      }
    ]
  },
  "sn": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "wo",
        "pct": 70
      },
      {
        "id": "fr",
        "pct": 26
      },
      {
        "id": "ff",
        "pct": 21
      },
      {
        "id": "srr",
        "pct": 11
      },
      {
        "id": "dyo",
        "pct": 2.6
      }
    ]
  },
  "sc": {
    "official": [
      "fr",
      "en"
    ],
    "spoken": [
      {
        "id": "crs",
        "pct": 98
      },
      {
        "id": "fr",
        "pct": 53
      },
      {
        "id": "en",
        "pct": 38
      }
    ]
  },
  "sl": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "kri",
        "pct": 95
      },
      {
        "id": "en",
        "pct": 35
      },
      {
        "id": "men",
        "pct": 27
      },
      {
        "id": "tem",
        "pct": 26
      }
    ]
  },
  "so": {
    "official": [
      "so",
      "ar"
    ],
    "spoken": [
      {
        "id": "so",
        "pct": 78
      },
      {
        "id": "ar",
        "pct": 34
      },
      {
        "id": "sw",
        "pct": 2
      }
    ]
  },
  "za": {
    "official": [
      "en",
      "zu",
      "xh",
      "af",
      "nso",
      "tn",
      "st",
      "ts",
      "ss",
      "ve",
      "nr"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 31
      },
      {
        "id": "zu",
        "pct": 24
      },
      {
        "id": "xh",
        "pct": 18
      },
      {
        "id": "af",
        "pct": 13
      },
      {
        "id": "nso",
        "pct": 9.4
      },
      {
        "id": "tn",
        "pct": 8.2
      },
      {
        "id": "st",
        "pct": 7.9
      },
      {
        "id": "ts",
        "pct": 4.4
      },
      {
        "id": "ss",
        "pct": 2.7
      },
      {
        "id": "ve",
        "pct": 2.3
      },
      {
        "id": "hi",
        "pct": 2
      },
      {
        "id": "nr",
        "pct": 1.6
      }
    ]
  },
  "ss": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 27
      },
      {
        "id": "en",
        "pct": 27
      },
      {
        "id": "nus",
        "pct": 5.6
      }
    ]
  },
  "sd": {
    "official": [
      "ar",
      "en"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 61
      },
      {
        "id": "en",
        "pct": 61
      },
      {
        "id": "bej",
        "pct": 5.4
      },
      {
        "id": "ha",
        "pct": 1.8
      }
    ]
  },
  "tz": {
    "official": [
      "sw",
      "en"
    ],
    "spoken": [
      {
        "id": "sw",
        "pct": 90
      },
      {
        "id": "en",
        "pct": 69
      },
      {
        "id": "suk",
        "pct": 8.7
      },
      {
        "id": "nym",
        "pct": 3.3
      },
      {
        "id": "kde",
        "pct": 2.5
      },
      {
        "id": "bez",
        "pct": 1.7
      },
      {
        "id": "ksb",
        "pct": 1.7
      },
      {
        "id": "mas",
        "pct": 1.5
      },
      {
        "id": "asa",
        "pct": 1.2
      }
    ]
  },
  "tg": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 41
      },
      {
        "id": "ee",
        "pct": 17
      }
    ]
  },
  "tn": {
    "official": [
      "ar",
      "fr"
    ],
    "spoken": [
      {
        "id": "aeb",
        "pct": 90
      },
      {
        "id": "ar",
        "pct": 90
      },
      {
        "id": "fr",
        "pct": 53
      }
    ]
  },
  "ug": {
    "official": [
      "sw",
      "en"
    ],
    "spoken": [
      {
        "id": "sw",
        "pct": 75
      },
      {
        "id": "lg",
        "pct": 13
      },
      {
        "id": "nyn",
        "pct": 6.3
      },
      {
        "id": "cgg",
        "pct": 5.4
      },
      {
        "id": "xog",
        "pct": 5.3
      },
      {
        "id": "en",
        "pct": 3.9
      },
      {
        "id": "teo",
        "pct": 3.9
      },
      {
        "id": "ach",
        "pct": 3.7
      },
      {
        "id": "rw",
        "pct": 2.1
      }
    ]
  },
  "zm": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "bem",
        "pct": 34
      },
      {
        "id": "ny",
        "pct": 19
      },
      {
        "id": "en",
        "pct": 16
      },
      {
        "id": "loz",
        "pct": 5.5
      },
      {
        "id": "tum",
        "pct": 2.6
      },
      {
        "id": "lun",
        "pct": 1.9
      }
    ]
  },
  "zw": {
    "official": [
      "sn",
      "en",
      "nd"
    ],
    "spoken": [
      {
        "id": "sn",
        "pct": 81
      },
      {
        "id": "en",
        "pct": 42
      },
      {
        "id": "nd",
        "pct": 12
      },
      {
        "id": "ny",
        "pct": 1.9
      }
    ]
  },
  "af": {
    "official": [
      "fa",
      "ps",
      "uz",
      "tk"
    ],
    "spoken": [
      {
        "id": "fa",
        "pct": 50
      },
      {
        "id": "ps",
        "pct": 43
      },
      {
        "id": "uz",
        "pct": 4.7
      },
      {
        "id": "tk",
        "pct": 1.7
      }
    ]
  },
  "am": {
    "official": [
      "hy"
    ],
    "spoken": [
      {
        "id": "hy",
        "pct": 99
      },
      {
        "id": "ru",
        "pct": 65
      },
      {
        "id": "ku",
        "pct": 6.6
      }
    ]
  },
  "az": {
    "official": [
      "az"
    ],
    "spoken": [
      {
        "id": "az",
        "pct": 98.9
      },
      {
        "id": "tly",
        "pct": 9.8
      }
    ]
  },
  "bh": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 87
      },
      {
        "id": "ml",
        "pct": 3.3
      }
    ]
  },
  "bd": {
    "official": [
      "bn"
    ],
    "spoken": [
      {
        "id": "bn",
        "pct": 98
      },
      {
        "id": "en",
        "pct": 18
      }
    ]
  },
  "bt": {
    "official": [
      "dz"
    ],
    "spoken": [
      {
        "id": "dz",
        "pct": 47
      },
      {
        "id": "ne",
        "pct": 17
      },
      {
        "id": "en",
        "pct": 11
      }
    ]
  },
  "bn": {
    "official": [
      "ms"
    ],
    "spoken": [
      {
        "id": "ms",
        "pct": 98
      },
      {
        "id": "zh",
        "pct": 11
      },
      {
        "id": "en",
        "pct": 1.6
      }
    ]
  },
  "kh": {
    "official": [
      "km"
    ],
    "spoken": [
      {
        "id": "km",
        "pct": 89
      }
    ]
  },
  "cn": {
    "official": [
      "zh"
    ],
    "spoken": [
      {
        "id": "zh",
        "pct": 90
      },
      {
        "id": "yue",
        "pct": 10.4
      },
      {
        "id": "wuu",
        "pct": 6
      },
      {
        "id": "hsn",
        "pct": 2.9
      },
      {
        "id": "hak",
        "pct": 2.3
      },
      {
        "id": "nan",
        "pct": 1.9
      },
      {
        "id": "gan",
        "pct": 1.7
      }
    ]
  },
  "cy": {
    "official": [
      "el",
      "tr"
    ],
    "spoken": [
      {
        "id": "el",
        "pct": 95
      },
      {
        "id": "en",
        "pct": 73
      },
      {
        "id": "tr",
        "pct": 23
      },
      {
        "id": "fr",
        "pct": 6.6
      }
    ]
  },
  "ge": {
    "official": [
      "ka"
    ],
    "spoken": [
      {
        "id": "ka",
        "pct": 86
      },
      {
        "id": "xmf",
        "pct": 11
      },
      {
        "id": "ru",
        "pct": 9
      },
      {
        "id": "hy",
        "pct": 7
      },
      {
        "id": "ab",
        "pct": 2.2
      },
      {
        "id": "os",
        "pct": 2.2
      }
    ]
  },
  "in": {
    "official": [
      "hi",
      "en"
    ],
    "spoken": [
      {
        "id": "hi",
        "pct": 41.1
      },
      {
        "id": "en",
        "pct": 19
      },
      {
        "id": "bn",
        "pct": 8.1
      },
      {
        "id": "te",
        "pct": 7.2
      },
      {
        "id": "mr",
        "pct": 7
      },
      {
        "id": "ta",
        "pct": 5.9
      },
      {
        "id": "ur",
        "pct": 5
      },
      {
        "id": "gu",
        "pct": 4.5
      },
      {
        "id": "kn",
        "pct": 3.7
      },
      {
        "id": "ml",
        "pct": 3.2
      },
      {
        "id": "or",
        "pct": 3.2
      },
      {
        "id": "pa",
        "pct": 2.8
      },
      {
        "id": "bho",
        "pct": 2.3
      },
      {
        "id": "awa",
        "pct": 1.9
      },
      {
        "id": "as",
        "pct": 1.3
      },
      {
        "id": "bgc",
        "pct": 1.2
      },
      {
        "id": "mag",
        "pct": 1.2
      },
      {
        "id": "mai",
        "pct": 1.2
      },
      {
        "id": "mwr",
        "pct": 1.2
      }
    ]
  },
  "id": {
    "official": [
      "id"
    ],
    "spoken": [
      {
        "id": "id",
        "pct": 64
      },
      {
        "id": "jv",
        "pct": 34
      },
      {
        "id": "su",
        "pct": 12
      },
      {
        "id": "mad",
        "pct": 6.3
      },
      {
        "id": "ms",
        "pct": 4.6
      },
      {
        "id": "min",
        "pct": 3
      },
      {
        "id": "bew",
        "pct": 2.1
      },
      {
        "id": "ban",
        "pct": 1.8
      },
      {
        "id": "bug",
        "pct": 1.6
      },
      {
        "id": "bjn",
        "pct": 1.5
      },
      {
        "id": "ace",
        "pct": 1.4
      }
    ]
  },
  "ir": {
    "official": [
      "fa"
    ],
    "spoken": [
      {
        "id": "fa",
        "pct": 75
      },
      {
        "id": "az",
        "pct": 24
      },
      {
        "id": "mzn",
        "pct": 5
      },
      {
        "id": "glk",
        "pct": 4.6
      },
      {
        "id": "sdh",
        "pct": 4.5
      },
      {
        "id": "tk",
        "pct": 2.8
      },
      {
        "id": "lrc",
        "pct": 2.1
      },
      {
        "id": "ar",
        "pct": 2
      },
      {
        "id": "bal",
        "pct": 2
      },
      {
        "id": "bqi",
        "pct": 1.4
      }
    ]
  },
  "iq": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 68
      },
      {
        "id": "en",
        "pct": 35
      },
      {
        "id": "ckb",
        "pct": 12
      },
      {
        "id": "ku",
        "pct": 10
      },
      {
        "id": "az",
        "pct": 1.8
      }
    ]
  },
  "il": {
    "official": [
      "he",
      "ar"
    ],
    "spoken": [
      {
        "id": "he",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 85
      },
      {
        "id": "ar",
        "pct": 20
      },
      {
        "id": "ru",
        "pct": 11
      },
      {
        "id": "ro",
        "pct": 3.7
      },
      {
        "id": "yi",
        "pct": 3
      },
      {
        "id": "pl",
        "pct": 1.5
      },
      {
        "id": "lad",
        "pct": 1.3
      },
      {
        "id": "hu",
        "pct": 1
      }
    ]
  },
  "jp": {
    "official": [
      "ja"
    ],
    "spoken": [
      {
        "id": "ja",
        "pct": 95
      }
    ]
  },
  "jo": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 45
      }
    ]
  },
  "kz": {
    "official": [
      "ru",
      "kk"
    ],
    "spoken": [
      {
        "id": "ru",
        "pct": 72
      },
      {
        "id": "kk",
        "pct": 64
      },
      {
        "id": "en",
        "pct": 15
      },
      {
        "id": "de",
        "pct": 6.4
      },
      {
        "id": "ug",
        "pct": 2
      }
    ]
  },
  "kw": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 100
      }
    ]
  },
  "kg": {
    "official": [
      "ky",
      "ru"
    ],
    "spoken": [
      {
        "id": "ky",
        "pct": 48
      },
      {
        "id": "ru",
        "pct": 36
      }
    ]
  },
  "la": {
    "official": [
      "lo"
    ],
    "spoken": [
      {
        "id": "lo",
        "pct": 69
      },
      {
        "id": "hnj",
        "pct": 3
      }
    ]
  },
  "lb": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 86
      },
      {
        "id": "en",
        "pct": 40
      },
      {
        "id": "fr",
        "pct": 38
      },
      {
        "id": "hy",
        "pct": 5.2
      },
      {
        "id": "ku",
        "pct": 1.7
      }
    ]
  },
  "my": {
    "official": [
      "ms"
    ],
    "spoken": [
      {
        "id": "ms",
        "pct": 75
      },
      {
        "id": "en",
        "pct": 21
      },
      {
        "id": "zh",
        "pct": 17
      },
      {
        "id": "ta",
        "pct": 4.2
      },
      {
        "id": "iba",
        "pct": 2.5
      },
      {
        "id": "jv",
        "pct": 1.2
      }
    ]
  },
  "mv": {
    "official": [
      "dv"
    ],
    "spoken": [
      {
        "id": "dv",
        "pct": 98
      },
      {
        "id": "en",
        "pct": 75
      }
    ]
  },
  "mn": {
    "official": [
      "mn"
    ],
    "spoken": [
      {
        "id": "mn",
        "pct": 93
      },
      {
        "id": "kk",
        "pct": 7.2
      },
      {
        "id": "zh",
        "pct": 1.4
      }
    ]
  },
  "mm": {
    "official": [
      "my"
    ],
    "spoken": [
      {
        "id": "my",
        "pct": 64
      },
      {
        "id": "shn",
        "pct": 6.4
      },
      {
        "id": "kac",
        "pct": 1.7
      },
      {
        "id": "rhg",
        "pct": 1.7
      }
    ]
  },
  "np": {
    "official": [
      "ne"
    ],
    "spoken": [
      {
        "id": "ne",
        "pct": 44
      },
      {
        "id": "mai",
        "pct": 11
      },
      {
        "id": "bho",
        "pct": 6.8
      },
      {
        "id": "new",
        "pct": 3.3
      },
      {
        "id": "en",
        "pct": 3
      },
      {
        "id": "awa",
        "pct": 2.2
      }
    ]
  },
  "kp": {
    "official": [
      "ko"
    ],
    "spoken": [
      {
        "id": "ko",
        "pct": 88
      }
    ]
  },
  "om": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 81
      },
      {
        "id": "bal",
        "pct": 4.9
      }
    ]
  },
  "pk": {
    "official": [
      "ur",
      "en"
    ],
    "spoken": [
      {
        "id": "ur",
        "pct": 95
      },
      {
        "id": "pa",
        "pct": 70
      },
      {
        "id": "en",
        "pct": 50
      },
      {
        "id": "lah",
        "pct": 40
      },
      {
        "id": "ps",
        "pct": 16
      },
      {
        "id": "sd",
        "pct": 15
      },
      {
        "id": "bal",
        "pct": 2.6
      },
      {
        "id": "brh",
        "pct": 1.3
      }
    ]
  },
  "ph": {
    "official": [
      "en",
      "fil"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 64
      },
      {
        "id": "fil",
        "pct": 60
      },
      {
        "id": "es",
        "pct": 31
      },
      {
        "id": "ceb",
        "pct": 24
      },
      {
        "id": "ilo",
        "pct": 9.6
      },
      {
        "id": "hil",
        "pct": 8.4
      },
      {
        "id": "bik",
        "pct": 3
      },
      {
        "id": "war",
        "pct": 2.9
      },
      {
        "id": "pam",
        "pct": 2.3
      },
      {
        "id": "pag",
        "pct": 1.4
      }
    ]
  },
  "qa": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 89
      },
      {
        "id": "fa",
        "pct": 11
      }
    ]
  },
  "sa": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 100
      },
      {
        "id": "ars",
        "pct": 3
      }
    ]
  },
  "sg": {
    "official": [
      "en",
      "zh",
      "ms",
      "ta"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 93
      },
      {
        "id": "zh",
        "pct": 77
      },
      {
        "id": "ms",
        "pct": 14
      },
      {
        "id": "ta",
        "pct": 2.1
      }
    ]
  },
  "kr": {
    "official": [
      "ko"
    ],
    "spoken": [
      {
        "id": "ko",
        "pct": 100
      }
    ]
  },
  "lk": {
    "official": [
      "si",
      "ta"
    ],
    "spoken": [
      {
        "id": "si",
        "pct": 68
      },
      {
        "id": "ta",
        "pct": 15
      },
      {
        "id": "en",
        "pct": 10
      }
    ]
  },
  "sy": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 80
      },
      {
        "id": "ku",
        "pct": 8
      },
      {
        "id": "fr",
        "pct": 5.9
      },
      {
        "id": "hy",
        "pct": 1.8
      }
    ]
  },
  "tj": {
    "official": [
      "tg"
    ],
    "spoken": [
      {
        "id": "tg",
        "pct": 100
      },
      {
        "id": "ru",
        "pct": 12
      }
    ]
  },
  "th": {
    "official": [
      "th"
    ],
    "spoken": [
      {
        "id": "th",
        "pct": 80
      },
      {
        "id": "en",
        "pct": 27
      },
      {
        "id": "zh",
        "pct": 1.8
      }
    ]
  },
  "tl": {
    "official": [
      "pt",
      "tet"
    ],
    "spoken": [
      {
        "id": "pt",
        "pct": 59
      },
      {
        "id": "tet",
        "pct": 59
      }
    ]
  },
  "tr": {
    "official": [
      "tr"
    ],
    "spoken": [
      {
        "id": "tr",
        "pct": 93
      },
      {
        "id": "en",
        "pct": 17
      },
      {
        "id": "ku",
        "pct": 5.5
      },
      {
        "id": "az",
        "pct": 1.4
      },
      {
        "id": "zza",
        "pct": 1.4
      }
    ]
  },
  "tm": {
    "official": [
      "tk"
    ],
    "spoken": [
      {
        "id": "tk",
        "pct": 70
      },
      {
        "id": "ru",
        "pct": 12
      },
      {
        "id": "uz",
        "pct": 9
      }
    ]
  },
  "ae": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 78
      },
      {
        "id": "en",
        "pct": 50
      },
      {
        "id": "ml",
        "pct": 7
      },
      {
        "id": "ps",
        "pct": 2.9
      },
      {
        "id": "bal",
        "pct": 2.3
      },
      {
        "id": "fa",
        "pct": 1.9
      }
    ]
  },
  "uz": {
    "official": [
      "uz"
    ],
    "spoken": [
      {
        "id": "uz",
        "pct": 100
      },
      {
        "id": "ru",
        "pct": 14
      },
      {
        "id": "kaa",
        "pct": 2.1
      }
    ]
  },
  "vn": {
    "official": [
      "vi"
    ],
    "spoken": [
      {
        "id": "vi",
        "pct": 86
      },
      {
        "id": "zh",
        "pct": 1.1
      }
    ]
  },
  "ye": {
    "official": [
      "ar"
    ],
    "spoken": [
      {
        "id": "ar",
        "pct": 74
      },
      {
        "id": "en",
        "pct": 9
      }
    ]
  },
  "al": {
    "official": [
      "sq"
    ],
    "spoken": [
      {
        "id": "sq",
        "pct": 100
      },
      {
        "id": "el",
        "pct": 1.9
      }
    ]
  },
  "ad": {
    "official": [
      "ca"
    ],
    "spoken": [
      {
        "id": "ca",
        "pct": 51
      },
      {
        "id": "es",
        "pct": 43
      },
      {
        "id": "fr",
        "pct": 6.8
      }
    ]
  },
  "at": {
    "official": [
      "de"
    ],
    "spoken": [
      {
        "id": "de",
        "pct": 97
      },
      {
        "id": "bar",
        "pct": 95
      },
      {
        "id": "en",
        "pct": 73
      },
      {
        "id": "fr",
        "pct": 13
      },
      {
        "id": "it",
        "pct": 9
      },
      {
        "id": "hr",
        "pct": 1.2
      }
    ]
  },
  "by": {
    "official": [
      "ru",
      "be"
    ],
    "spoken": [
      {
        "id": "ru",
        "pct": 71
      },
      {
        "id": "be",
        "pct": 26
      }
    ]
  },
  "be": {
    "official": [
      "nl",
      "fr",
      "de"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 59
      },
      {
        "id": "nl",
        "pct": 55
      },
      {
        "id": "fr",
        "pct": 38
      },
      {
        "id": "de",
        "pct": 22
      },
      {
        "id": "vls",
        "pct": 10
      },
      {
        "id": "wa",
        "pct": 5.8
      }
    ]
  },
  "ba": {
    "official": [
      "bs",
      "sr",
      "hr"
    ],
    "spoken": [
      {
        "id": "bs",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 45
      },
      {
        "id": "sr",
        "pct": 20
      },
      {
        "id": "hr",
        "pct": 12
      }
    ]
  },
  "bg": {
    "official": [
      "bg"
    ],
    "spoken": [
      {
        "id": "bg",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 25
      },
      {
        "id": "ru",
        "pct": 23
      },
      {
        "id": "tr",
        "pct": 11
      },
      {
        "id": "de",
        "pct": 8
      }
    ]
  },
  "hr": {
    "official": [
      "hr"
    ],
    "spoken": [
      {
        "id": "hr",
        "pct": 99
      },
      {
        "id": "en",
        "pct": 49
      },
      {
        "id": "it",
        "pct": 1.6
      }
    ]
  },
  "cz": {
    "official": [
      "cs"
    ],
    "spoken": [
      {
        "id": "cs",
        "pct": 98
      },
      {
        "id": "en",
        "pct": 27
      },
      {
        "id": "sk",
        "pct": 16
      },
      {
        "id": "de",
        "pct": 15
      }
    ]
  },
  "dk": {
    "official": [
      "da"
    ],
    "spoken": [
      {
        "id": "da",
        "pct": 93
      },
      {
        "id": "en",
        "pct": 86
      },
      {
        "id": "de",
        "pct": 47
      },
      {
        "id": "sv",
        "pct": 13
      }
    ]
  },
  "ee": {
    "official": [
      "et"
    ],
    "spoken": [
      {
        "id": "et",
        "pct": 71
      },
      {
        "id": "ru",
        "pct": 56
      },
      {
        "id": "en",
        "pct": 50
      },
      {
        "id": "fi",
        "pct": 21
      },
      {
        "id": "vro",
        "pct": 5.7
      }
    ]
  },
  "fi": {
    "official": [
      "fi",
      "sv"
    ],
    "spoken": [
      {
        "id": "fi",
        "pct": 94
      },
      {
        "id": "en",
        "pct": 70
      },
      {
        "id": "sv",
        "pct": 44
      },
      {
        "id": "de",
        "pct": 18
      }
    ]
  },
  "fr": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 97
      },
      {
        "id": "en",
        "pct": 39
      },
      {
        "id": "es",
        "pct": 13
      },
      {
        "id": "de",
        "pct": 5
      },
      {
        "id": "oc",
        "pct": 3
      },
      {
        "id": "it",
        "pct": 1.7
      },
      {
        "id": "pt",
        "pct": 1.3
      },
      {
        "id": "pcd",
        "pct": 1.1
      }
    ]
  },
  "de": {
    "official": [
      "de"
    ],
    "spoken": [
      {
        "id": "de",
        "pct": 91
      },
      {
        "id": "en",
        "pct": 64
      },
      {
        "id": "fr",
        "pct": 18
      },
      {
        "id": "bar",
        "pct": 17
      },
      {
        "id": "nds",
        "pct": 12
      },
      {
        "id": "nl",
        "pct": 9
      },
      {
        "id": "it",
        "pct": 7
      },
      {
        "id": "es",
        "pct": 6
      },
      {
        "id": "ru",
        "pct": 6
      },
      {
        "id": "vmf",
        "pct": 6
      },
      {
        "id": "tr",
        "pct": 2.5
      },
      {
        "id": "gsw",
        "pct": 2.3
      },
      {
        "id": "da",
        "pct": 2
      }
    ]
  },
  "gr": {
    "official": [
      "el"
    ],
    "spoken": [
      {
        "id": "el",
        "pct": 99
      },
      {
        "id": "en",
        "pct": 51
      },
      {
        "id": "fr",
        "pct": 7.3
      },
      {
        "id": "de",
        "pct": 5
      },
      {
        "id": "pnt",
        "pct": 3.7
      },
      {
        "id": "mk",
        "pct": 1.6
      },
      {
        "id": "tr",
        "pct": 1.2
      }
    ]
  },
  "hu": {
    "official": [
      "hu"
    ],
    "spoken": [
      {
        "id": "hu",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 20
      },
      {
        "id": "de",
        "pct": 18
      },
      {
        "id": "fr",
        "pct": 1.2
      }
    ]
  },
  "is": {
    "official": [
      "is"
    ],
    "spoken": [
      {
        "id": "is",
        "pct": 100
      }
    ]
  },
  "ie": {
    "official": [
      "en",
      "ga"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 98
      },
      {
        "id": "ga",
        "pct": 22
      },
      {
        "id": "fr",
        "pct": 13
      }
    ]
  },
  "it": {
    "official": [
      "it"
    ],
    "spoken": [
      {
        "id": "it",
        "pct": 95
      },
      {
        "id": "en",
        "pct": 34
      },
      {
        "id": "fr",
        "pct": 20
      },
      {
        "id": "lmo",
        "pct": 5.7
      },
      {
        "id": "sc",
        "pct": 1.7
      },
      {
        "id": "de",
        "pct": 1.6
      },
      {
        "id": "vec",
        "pct": 1.3
      },
      {
        "id": "pms",
        "pct": 1.1
      }
    ]
  },
  "lv": {
    "official": [
      "lv"
    ],
    "spoken": [
      {
        "id": "lv",
        "pct": 61
      },
      {
        "id": "en",
        "pct": 46
      },
      {
        "id": "ru",
        "pct": 38
      },
      {
        "id": "ltg",
        "pct": 8.9
      }
    ]
  },
  "li": {
    "official": [
      "de"
    ],
    "spoken": [
      {
        "id": "de",
        "pct": 100
      },
      {
        "id": "gsw",
        "pct": 85
      }
    ]
  },
  "lt": {
    "official": [
      "lt"
    ],
    "spoken": [
      {
        "id": "lt",
        "pct": 86
      },
      {
        "id": "ru",
        "pct": 80
      },
      {
        "id": "en",
        "pct": 38
      },
      {
        "id": "de",
        "pct": 14
      }
    ]
  },
  "lu": {
    "official": [
      "fr",
      "lb",
      "de"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 92
      },
      {
        "id": "lb",
        "pct": 67
      },
      {
        "id": "de",
        "pct": 63
      },
      {
        "id": "en",
        "pct": 56
      },
      {
        "id": "pt",
        "pct": 16
      }
    ]
  },
  "mt": {
    "official": [
      "mt",
      "en"
    ],
    "spoken": [
      {
        "id": "mt",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 88
      },
      {
        "id": "it",
        "pct": 56
      },
      {
        "id": "fr",
        "pct": 13
      }
    ]
  },
  "md": {
    "official": [
      "ro"
    ],
    "spoken": [
      {
        "id": "ro",
        "pct": 63
      },
      {
        "id": "uk",
        "pct": 14
      },
      {
        "id": "bg",
        "pct": 9.4
      },
      {
        "id": "gag",
        "pct": 3.3
      },
      {
        "id": "ru",
        "pct": 3
      }
    ]
  },
  "mc": {
    "official": [
      "fr"
    ],
    "spoken": [
      {
        "id": "fr",
        "pct": 97
      }
    ]
  },
  "me": {
    "official": [
      "sr"
    ],
    "spoken": [
      {
        "id": "sr",
        "pct": 100
      },
      {
        "id": "sq",
        "pct": 7.9
      }
    ]
  },
  "nl": {
    "official": [
      "nl"
    ],
    "spoken": [
      {
        "id": "nl",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 90
      },
      {
        "id": "de",
        "pct": 71
      },
      {
        "id": "fr",
        "pct": 19
      },
      {
        "id": "nds",
        "pct": 11
      },
      {
        "id": "li",
        "pct": 5.5
      },
      {
        "id": "fy",
        "pct": 4.3
      },
      {
        "id": "id",
        "pct": 1.8
      },
      {
        "id": "zea",
        "pct": 1.4
      },
      {
        "id": "rif",
        "pct": 1.2
      },
      {
        "id": "tr",
        "pct": 1.2
      }
    ]
  },
  "mk": {
    "official": [
      "mk"
    ],
    "spoken": [
      {
        "id": "mk",
        "pct": 67
      },
      {
        "id": "sq",
        "pct": 25
      },
      {
        "id": "tr",
        "pct": 3.5
      }
    ]
  },
  "no": {
    "official": [
      "nb",
      "no",
      "nn"
    ],
    "spoken": [
      {
        "id": "nb",
        "pct": 100
      },
      {
        "id": "no",
        "pct": 100
      },
      {
        "id": "nn",
        "pct": 25
      }
    ]
  },
  "pl": {
    "official": [
      "pl"
    ],
    "spoken": [
      {
        "id": "pl",
        "pct": 96
      },
      {
        "id": "en",
        "pct": 33
      },
      {
        "id": "de",
        "pct": 19
      },
      {
        "id": "ru",
        "pct": 18
      },
      {
        "id": "szl",
        "pct": 1.3
      }
    ]
  },
  "pt": {
    "official": [
      "pt"
    ],
    "spoken": [
      {
        "id": "pt",
        "pct": 96
      },
      {
        "id": "en",
        "pct": 27
      },
      {
        "id": "fr",
        "pct": 15
      },
      {
        "id": "es",
        "pct": 10
      }
    ]
  },
  "ro": {
    "official": [
      "ro"
    ],
    "spoken": [
      {
        "id": "ro",
        "pct": 90
      },
      {
        "id": "en",
        "pct": 31
      },
      {
        "id": "fr",
        "pct": 12
      },
      {
        "id": "es",
        "pct": 10
      },
      {
        "id": "hu",
        "pct": 6.6
      }
    ]
  },
  "ru": {
    "official": [
      "ru"
    ],
    "spoken": [
      {
        "id": "ru",
        "pct": 94
      },
      {
        "id": "tt",
        "pct": 1.4
      },
      {
        "id": "ba",
        "pct": 1.3
      },
      {
        "id": "cv",
        "pct": 1.3
      }
    ]
  },
  "sm": {
    "official": [
      "it"
    ],
    "spoken": [
      {
        "id": "it",
        "pct": 89
      }
    ]
  },
  "rs": {
    "official": [
      "sr"
    ],
    "spoken": [
      {
        "id": "sr",
        "pct": 100
      },
      {
        "id": "sq",
        "pct": 19
      },
      {
        "id": "hu",
        "pct": 4.8
      },
      {
        "id": "ro",
        "pct": 2.1
      }
    ]
  },
  "sk": {
    "official": [
      "sk"
    ],
    "spoken": [
      {
        "id": "sk",
        "pct": 90
      },
      {
        "id": "cs",
        "pct": 47
      },
      {
        "id": "en",
        "pct": 26
      },
      {
        "id": "de",
        "pct": 22
      },
      {
        "id": "hu",
        "pct": 11
      },
      {
        "id": "uk",
        "pct": 1.9
      }
    ]
  },
  "si": {
    "official": [
      "sl"
    ],
    "spoken": [
      {
        "id": "sl",
        "pct": 87
      },
      {
        "id": "hr",
        "pct": 61
      },
      {
        "id": "en",
        "pct": 59
      },
      {
        "id": "de",
        "pct": 42
      },
      {
        "id": "vec",
        "pct": 1.4
      }
    ]
  },
  "es": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 99
      },
      {
        "id": "en",
        "pct": 24
      },
      {
        "id": "ca",
        "pct": 17
      },
      {
        "id": "gl",
        "pct": 7
      },
      {
        "id": "eu",
        "pct": 2
      },
      {
        "id": "ast",
        "pct": 1.3
      }
    ]
  },
  "se": {
    "official": [
      "sv"
    ],
    "spoken": [
      {
        "id": "sv",
        "pct": 95
      },
      {
        "id": "en",
        "pct": 86
      },
      {
        "id": "fi",
        "pct": 2.2
      }
    ]
  },
  "ch": {
    "official": [
      "de",
      "fr",
      "it",
      "rm"
    ],
    "spoken": [
      {
        "id": "de",
        "pct": 76
      },
      {
        "id": "gsw",
        "pct": 66
      },
      {
        "id": "en",
        "pct": 45
      },
      {
        "id": "fr",
        "pct": 39
      },
      {
        "id": "it",
        "pct": 15
      },
      {
        "id": "lmo",
        "pct": 4.1
      },
      {
        "id": "pt",
        "pct": 3.4
      }
    ]
  },
  "ua": {
    "official": [
      "uk"
    ],
    "spoken": [
      {
        "id": "uk",
        "pct": 65
      },
      {
        "id": "ru",
        "pct": 46
      },
      {
        "id": "pl",
        "pct": 2.4
      },
      {
        "id": "yi",
        "pct": 1.3
      },
      {
        "id": "rue",
        "pct": 1.2
      }
    ]
  },
  "gb": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 98
      },
      {
        "id": "fr",
        "pct": 17
      },
      {
        "id": "de",
        "pct": 9
      },
      {
        "id": "es",
        "pct": 8
      },
      {
        "id": "pl",
        "pct": 4
      },
      {
        "id": "pa",
        "pct": 3.6
      },
      {
        "id": "ur",
        "pct": 3.5
      },
      {
        "id": "ta",
        "pct": 3.2
      },
      {
        "id": "gu",
        "pct": 2.9
      },
      {
        "id": "sco",
        "pct": 2.5
      },
      {
        "id": "cy",
        "pct": 1.3
      }
    ]
  },
  "ag": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 86
      }
    ]
  },
  "ar": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 100
      },
      {
        "id": "en",
        "pct": 7
      }
    ]
  },
  "bs": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 100
      }
    ]
  },
  "bb": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 100
      }
    ]
  },
  "bz": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 77
      },
      {
        "id": "es",
        "pct": 55
      },
      {
        "id": "kek",
        "pct": 6.5
      }
    ]
  },
  "bo": {
    "official": [
      "es",
      "qu",
      "ay"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 61
      },
      {
        "id": "qu",
        "pct": 32
      },
      {
        "id": "ay",
        "pct": 20
      }
    ]
  },
  "br": {
    "official": [
      "pt"
    ],
    "spoken": [
      {
        "id": "pt",
        "pct": 91
      },
      {
        "id": "en",
        "pct": 8
      }
    ]
  },
  "ca": {
    "official": [
      "en",
      "fr"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 87
      },
      {
        "id": "fr",
        "pct": 29
      },
      {
        "id": "es",
        "pct": 3.2
      },
      {
        "id": "zh",
        "pct": 2.7
      },
      {
        "id": "pa",
        "pct": 2.6
      },
      {
        "id": "ar",
        "pct": 2.3
      },
      {
        "id": "hi",
        "pct": 2.1
      },
      {
        "id": "fil",
        "pct": 2
      },
      {
        "id": "yue",
        "pct": 2
      },
      {
        "id": "it",
        "pct": 1.5
      },
      {
        "id": "de",
        "pct": 1.2
      },
      {
        "id": "ur",
        "pct": 1.1
      }
    ]
  },
  "cl": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 98
      },
      {
        "id": "en",
        "pct": 9.5
      },
      {
        "id": "arn",
        "pct": 1.5
      }
    ]
  },
  "co": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 93
      }
    ]
  },
  "cr": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 95
      }
    ]
  },
  "cu": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 100
      }
    ]
  },
  "dm": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 94
      }
    ]
  },
  "do": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 78
      }
    ]
  },
  "ec": {
    "official": [
      "es",
      "qu"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 96
      },
      {
        "id": "qu",
        "pct": 17
      },
      {
        "id": "qug",
        "pct": 5.7
      }
    ]
  },
  "sv": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 89
      }
    ]
  },
  "gd": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 96
      }
    ]
  },
  "gt": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 88
      },
      {
        "id": "kek",
        "pct": 8.8
      },
      {
        "id": "quc",
        "pct": 8.6
      },
      {
        "id": "en",
        "pct": 3.1
      }
    ]
  },
  "gy": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 100
      }
    ]
  },
  "ht": {
    "official": [
      "ht",
      "fr"
    ],
    "spoken": [
      {
        "id": "ht",
        "pct": 81
      },
      {
        "id": "fr",
        "pct": 42
      }
    ]
  },
  "hn": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 91
      }
    ]
  },
  "jm": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 98
      },
      {
        "id": "jam",
        "pct": 95
      }
    ]
  },
  "mx": {
    "official": [],
    "spoken": [
      {
        "id": "es",
        "pct": 83
      },
      {
        "id": "en",
        "pct": 13
      }
    ]
  },
  "ni": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 78
      }
    ]
  },
  "pa": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 69
      },
      {
        "id": "en",
        "pct": 14
      }
    ]
  },
  "py": {
    "official": [
      "gn",
      "es"
    ],
    "spoken": [
      {
        "id": "gn",
        "pct": 80
      },
      {
        "id": "es",
        "pct": 3.2
      },
      {
        "id": "de",
        "pct": 2.9
      }
    ]
  },
  "pe": {
    "official": [
      "es",
      "qu"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 73
      },
      {
        "id": "qu",
        "pct": 15
      },
      {
        "id": "ay",
        "pct": 1.6
      }
    ]
  },
  "kn": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 98
      }
    ]
  },
  "lc": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 90
      }
    ]
  },
  "vc": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 96
      }
    ]
  },
  "sr": {
    "official": [
      "nl"
    ],
    "spoken": [
      {
        "id": "nl",
        "pct": 90
      },
      {
        "id": "srn",
        "pct": 68
      },
      {
        "id": "zh",
        "pct": 1.1
      }
    ]
  },
  "tt": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 88
      }
    ]
  },
  "us": {
    "official": [],
    "spoken": [
      {
        "id": "en",
        "pct": 96
      },
      {
        "id": "es",
        "pct": 9.6
      }
    ]
  },
  "uy": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 88
      }
    ]
  },
  "ve": {
    "official": [
      "es"
    ],
    "spoken": [
      {
        "id": "es",
        "pct": 82
      }
    ]
  },
  "au": {
    "official": [],
    "spoken": [
      {
        "id": "en",
        "pct": 96
      },
      {
        "id": "zh",
        "pct": 2.1
      },
      {
        "id": "it",
        "pct": 1.9
      }
    ]
  },
  "fj": {
    "official": [
      "en",
      "hif",
      "fj"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 94
      },
      {
        "id": "hi",
        "pct": 44
      },
      {
        "id": "hif",
        "pct": 41
      },
      {
        "id": "fj",
        "pct": 39
      }
    ]
  },
  "ki": {
    "official": [
      "en",
      "gil"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 100
      },
      {
        "id": "gil",
        "pct": 60
      }
    ]
  },
  "mh": {
    "official": [
      "en",
      "mh"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 93
      },
      {
        "id": "mh",
        "pct": 73
      }
    ]
  },
  "fm": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 57
      },
      {
        "id": "chk",
        "pct": 30
      },
      {
        "id": "pon",
        "pct": 23
      },
      {
        "id": "kos",
        "pct": 8
      },
      {
        "id": "yap",
        "pct": 6.6
      }
    ]
  },
  "nr": {
    "official": [
      "en",
      "na"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 95
      },
      {
        "id": "na",
        "pct": 70
      }
    ]
  },
  "nz": {
    "official": [
      "mi"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 98
      },
      {
        "id": "mi",
        "pct": 2.8
      }
    ]
  },
  "pw": {
    "official": [
      "pau",
      "en"
    ],
    "spoken": [
      {
        "id": "pau",
        "pct": 74
      }
    ]
  },
  "pg": {
    "official": [
      "tpi",
      "en",
      "ho"
    ],
    "spoken": [
      {
        "id": "tpi",
        "pct": 71
      },
      {
        "id": "en",
        "pct": 50
      },
      {
        "id": "ho",
        "pct": 2.1
      }
    ]
  },
  "ws": {
    "official": [
      "sm",
      "en"
    ],
    "spoken": [
      {
        "id": "sm",
        "pct": 100
      }
    ]
  },
  "sb": {
    "official": [
      "en"
    ],
    "spoken": [
      {
        "id": "en",
        "pct": 100
      },
      {
        "id": "pis",
        "pct": 82
      },
      {
        "id": "rug",
        "pct": 1.4
      }
    ]
  },
  "to": {
    "official": [
      "to",
      "en"
    ],
    "spoken": [
      {
        "id": "to",
        "pct": 95
      },
      {
        "id": "en",
        "pct": 28
      }
    ]
  },
  "tv": {
    "official": [
      "tvl",
      "en"
    ],
    "spoken": [
      {
        "id": "tvl",
        "pct": 85
      }
    ]
  },
  "vu": {
    "official": [
      "bi",
      "en",
      "fr"
    ],
    "spoken": [
      {
        "id": "bi",
        "pct": 90
      },
      {
        "id": "en",
        "pct": 83
      },
      {
        "id": "fr",
        "pct": 31
      }
    ]
  }
}
