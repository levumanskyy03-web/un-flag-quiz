import { t11, type L11 } from '../math'
import type { ThemeItem, ThemeTier } from '../theme'
import { isThemeMode, type ThemeMode } from '../../lib/quiz/themeModes'

function item(
  id: string,
  mode: string,
  tier: ThemeTier,
  prompt: L11 | string,
  answer: L11 | string,
  key: string,
  extra: Partial<Pick<ThemeItem, 'wiki' | 'wikiFile'>> = {},
): ThemeItem | null {
  if (!isThemeMode(mode)) return null
  return { id, mode: mode as ThemeMode, tier, prompt, answer, key, ...extra }
}

function pair(
  forwardId: string,
  backId: string,
  forward: string,
  back: string,
  tier: ThemeTier,
  prompt: L11,
  answer: L11,
  forwardKey: string,
  backKey: string,
): Array<ThemeItem | null> {
  return [
    item(forwardId, forward, tier, prompt, answer, forwardKey),
    item(backId, back, tier, answer, prompt, backKey),
  ]
}

const ALGO = t11('алгоритм', 'algorithm', 'Algorithmus', '算法', 'algoritmo', 'एल्गोरिदम', 'خوارزمية', 'অ্যালগরিদম', 'algoritmo', 'アルゴリズム', 'אלגוריתם')
const VARB = t11('переменная', 'variable', 'Variable', '变量', 'variable', 'चर', 'متغير', 'ভেরিয়েবল', 'variável', '変数', 'משתנה')
const LOOP = t11('цикл', 'loop', 'Schleife', '循环', 'bucle', 'लूप', 'حلقة', 'লুপ', 'ciclo', 'ループ', 'לולאה')
const HTML = t11('HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML', 'HTML')
const HTTP = t11('HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP', 'HTTP')
const BIT = t11('бит', 'bit', 'Bit', '比特', 'bit', 'बिट', 'بت', 'বিট', 'bit', 'ビット', 'סיבית')
const CPU = t11('процессор', 'processor', 'Prozessor', '处理器', 'procesador', 'प्रोसेसर', 'معالج', 'প্রসেসর', 'processador', 'プロセッサ', 'מעבד')
const RAM = t11('оперативная память', 'RAM', 'Arbeitsspeicher', '内存', 'memoria RAM', 'रैम', 'ذاكرة الوصول العشوائي', 'র‍্যাম', 'memória RAM', 'メインメモリ', 'זיכרון עבודה')
const COMP = t11('компилятор', 'compiler', 'Compiler', '编译器', 'compilador', 'कंपाइलर', 'مُترجم', 'কম্পাইলার', 'compilador', 'コンパイラ', 'מהדר')
const BUG = t11('ошибка', 'bug', 'Fehler', '缺陷', 'error', 'बग', 'خطأ', 'বাগ', 'erro', 'バグ', 'באג')
const API = t11('API', 'API', 'API', 'API', 'API', 'API', 'API', 'API', 'API', 'API', 'API')
const DNS = t11('DNS', 'DNS', 'DNS', 'DNS', 'DNS', 'DNS', 'DNS', 'DNS', 'DNS', 'DNS', 'DNS')
const OS = t11('операционная система', 'operating system', 'Betriebssystem', '操作系统', 'sistema operativo', 'ऑपरेटिंग सिस्टम', 'نظام التشغيل', 'অপারেটিং সিস্টেম', 'sistema operativo', 'オペレーティングシステム', 'מערכת הפעלה')
const PIX = t11('пиксель', 'pixel', 'Pixel', '像素', 'píxel', 'पिक्सेल', 'بكسل', 'পিক্সেল', 'píxel', 'ピクセル', 'פיקסל')
const COOK = t11('cookie', 'cookie', 'Cookie', 'Cookie', 'cookie', 'कुकी', 'كوكي', 'কুকি', 'cookie', 'クッキー', 'עוגייה')
const SQL = t11('SQL', 'SQL', 'SQL', 'SQL', 'SQL', 'SQL', 'SQL', 'SQL', 'SQL', 'SQL', 'SQL')
const ENC = t11('шифрование', 'encryption', 'Verschlüsselung', '加密', 'cifrado', 'एन्क्रिप्शन', 'تشفير', 'এনক্রিপশন', 'cifragem', '暗号化', 'הצפנה')
const CACHE = t11('кэш', 'cache', 'Cache', '缓存', 'caché', 'कैश', 'ذاكرة مخبئية', 'ক্যাশ', 'cache', 'キャッシュ', 'מטמון')

const ALGOA = t11('пошаговый план решения', 'step-by-step solution plan', 'Schrittfolge zur Lösung', '逐步解题计划', 'plan paso a paso', 'चरणबद्ध हल', 'خطة حل خطوة بخطوة', 'ধাপে ধাপে সমাধান', 'plano passo a passo', '手順のある解法', 'תוכנית פתרון שלב-שלב')
const VARA = t11('именованное значение в памяти', 'named value in memory', 'benannter Speicherwert', '内存中的命名值', 'valor con nombre', 'स्मृति में नामित मान', 'قيمة مسماة في الذاكرة', 'মেমোরিতে নামযুক্ত মান', 'valor nomeado na memória', 'メモリ上の名前付き値', 'ערך בעל שם בזיכרון')
const LOOPA = t11('повтор действий', 'repeat actions', 'Aktionen wiederholen', '重复操作', 'repetir acciones', 'क्रिया दोहराना', 'تكرار الأفعال', 'কাজ পুনরাবৃত্তি', 'repetir ações', '処理の繰り返し', 'חזרה על פעולות')
const HTMLA = t11('язык разметки веб-страниц', 'web page markup language', 'Auszeichnungssprache für Seiten', '网页标记语言', 'lenguaje de marcado web', 'वेब मार्कअप भाषा', 'لغة ترميز الويب', 'ওয়েব মার্কআপ ভাষা', 'linguagem de marcação web', 'ウェブのマークアップ', 'שפת סימון לדפים')
const HTTPA = t11('протокол запроса страниц', 'page request protocol', 'Protokoll für Seitenabruf', '网页请求协议', 'protocolo de petición', 'पेज अनुरोध प्रोटोकॉल', 'بروتوكول طلب الصفحات', 'পেজ অনুরোধ প্রোটোকল', 'protocolo de pedido', 'ページ要求のプロトコル', 'פרוטוקול בקשת דפים')
const BITA = t11('0 или 1', '0 or 1', '0 oder 1', '0 或 1', '0 o 1', '0 या 1', '0 أو 1', '০ বা ১', '0 ou 1', '0か1', '0 או 1')
const CPUA = t11('выполняет команды', 'runs instructions', 'führt Befehle aus', '执行指令', 'ejecuta instrucciones', 'निर्देश चलाता है', 'ينفّذ الأوامر', 'নির্দেশ চালায়', 'executa instruções', '命令を実行', 'מריץ פקודות')
const RAMA = t11('память на время работы', 'memory while the computer is on', 'Speicher für die Laufzeit', '运行时的内存', 'memoria mientras funciona', 'चलते समय की स्मृति', 'ذاكرة أثناء التشغيل', 'চলার সময়ের স্মৃতি', 'memória enquanto trabalha', '動作中の記憶', 'זיכרון בזמן העבודה')
const COMPA = t11('код → команды машины', 'code → machine instructions', 'Code → Maschinenbefehle', '代码变成机器指令', 'código → instrucciones', 'कोड → मशीन आदेश', 'شفرة → أوامر الآلة', 'কোড → মেশিন নির্দেশ', 'código → instruções', 'コード→機械語', 'קוד → פקודות מכונה')
const BUGA = t11('сбой в программе', 'a fault in a program', 'Fehler im Programm', '程序中的错误', 'fallo en un programa', 'प्रोग्राम की गलती', 'خلل في برنامج', 'প্রোগ্রামের ত্রুটি', 'falha num programa', 'プログラムの不具合', 'תקלה בתוכנית')
const APIA = t11('способ общения программ', 'how programs talk', 'wie Programme sprechen', '程序交谈的方式', 'cómo hablan los programas', 'प्रोग्राम बात कैसे करें', 'كيف تتحدث البرامج', 'প্রোগ্রাম কথা বলে', 'como os programas falam', 'プログラムの会話方法', 'איך תוכנות מדברות')
const DNSA = t11('имя → адрес', 'name → address', 'Name → Adresse', '名字变成地址', 'nombre → dirección', 'नाम → पता', 'اسم → عنوان', 'নাম → ঠিকানা', 'nome → endereço', '名前→アドレス', 'שם → כתובת')
const OSA = t11('запускает программы и устройства', 'runs programs and devices', 'startet Programme und Geräte', '管理程序和设备', 'arranca programas y dispositivos', 'प्रोग्राम और उपकरण चलाता है', 'يشغّل البرامج والأجهزة', 'প্রোগ্রাম ও যন্ত্র চালায়', 'corre programas e dispositivos', 'プログラムと機器を動かす', 'מריץ תוכנות והתקנים')
const PIXA = t11('одна точка экрана', 'one screen dot', 'ein Bildpunkt', '屏幕上的一个点', 'un punto de la pantalla', 'स्क्रीन का एक बिंदु', 'نقطة على الشاشة', 'পর্দার এক বিন্দু', 'um ponto do ecrã', '画面の一点', 'נקודה על המסך')
const COOKA = t11('заметка сайта в браузере', "a site's note in the browser", 'Notiz der Seite im Browser', '网站留在浏览器的记录', 'nota del sitio en el navegador', 'ब्राउज़र में साइट का नोट', 'ملاحظة الموقع في المتصفح', 'ব্রাউজারে সাইটের নোট', 'nota do sítio no navegador', 'ブラウザに残すサイトのメモ', 'פתק של האתר בדפדפן')
const SQLA = t11('язык таблиц данных', 'language for data tables', 'Sprache für Datentabellen', '数据表的语言', 'lenguaje de tablas', 'डेटा तालिकाओं की भाषा', 'لغة جداول البيانات', 'ডেটা টেবিলের ভাষা', 'linguagem de tabelas', 'データ表の言語', 'שפת טבלאות נתונים')
const ENCA = t11('прячет данные', 'hides data', 'verbirgt Daten', '隐藏数据', 'oculta datos', 'डेटा छिपाता है', 'يخفي البيانات', 'ডেটা লুকায়', 'esconde dados', 'データを隠す', 'מסתיר נתונים')
const CACHEA = t11('быстрая копия недавнего', 'a fast copy of recent data', 'schnelle Kopie des Neuen', '最近数据的快副本', 'copia rápida de lo reciente', 'हाल के डेटा की तेज़ प्रति', 'نسخة سريعة للحديث', 'সাম্প্রতিকের দ্রুত কপি', 'cópia rápida do recente', '最近のデータの速い写し', 'עותק מהיר של מה שעכשיו')

const PY = t11('Python', 'Python', 'Python', 'Python', 'Python', 'पायथन', 'بايثون', 'পাইথন', 'Python', 'パイソン', 'פייתון')
const JS = t11('JavaScript', 'JavaScript', 'JavaScript', 'JavaScript', 'JavaScript', 'जावास्क्रिप्ट', 'جافاسكريبت', 'জাভাস্ক্রিপ্ট', 'JavaScript', 'JavaScript', 'ג׳אווהסקריפט')
const JAVA = t11('Java', 'Java', 'Java', 'Java', 'Java', 'जावा', 'جافا', 'জাভা', 'Java', 'Java', 'ג׳אווה')
const C = t11('C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C')
const GO = t11('Go', 'Go', 'Go', 'Go', 'Go', 'Go', 'Go', 'Go', 'Go', 'Go', 'Go')
const RB = t11('Ruby', 'Ruby', 'Ruby', 'Ruby', 'Ruby', 'रूबी', 'روبي', 'রুবি', 'Ruby', 'ルビー', 'רובי')
const PHP = t11('PHP', 'PHP', 'PHP', 'PHP', 'PHP', 'PHP', 'PHP', 'PHP', 'PHP', 'PHP', 'PHP')
const RUST = t11('Rust', 'Rust', 'Rust', 'Rust', 'Rust', 'रस्ट', 'رست', 'রাস্ট', 'Rust', 'ラスト', 'ראסט')
const CPP = t11('C++', 'C++', 'C++', 'C++', 'C++', 'C++', 'C++', 'C++', 'C++', 'C++', 'C++')
const KT = t11('Kotlin', 'Kotlin', 'Kotlin', 'Kotlin', 'Kotlin', 'कोटलिन', 'كوتلن', 'কোটলিন', 'Kotlin', 'コトリン', 'קוטלין')

const ARR = t11('массив', 'array', 'Array', '数组', 'arreglo', 'सरणी', 'مصفوفة', 'অ্যারে', 'vetor', '配列', 'מערך')
const STK = t11('стек', 'stack', 'Stapel', '栈', 'pila', 'स्टैक', 'مكدس', 'স্ট্যাক', 'pilha', 'スタック', 'מחסנית')
const QUE = t11('очередь', 'queue', 'Warteschlange', '队列', 'cola', 'कतार', 'طابور', 'সারি', 'fila', 'キュー', 'תור')
const HASH = t11('хеш-таблица', 'hash table', 'Hashtabelle', '哈希表', 'tabla hash', 'हैश तालिका', 'جدول تجزئة', 'হ্যাশ টেবিল', 'tabela de hash', 'ハッシュ表', 'טבלת גיבוב')
const TREE = t11('дерево', 'tree', 'Baum', '树', 'árbol', 'वृक्ष', 'شجرة', 'গাছ', 'árvore', '木', 'עץ')
const GRAPH = t11('граф', 'graph', 'Graph', '图', 'grafo', 'ग्राफ', 'بيان', 'গ্রাফ', 'grafo', 'グラフ', 'גרף')
const LIST = t11('связный список', 'linked list', 'verkettete Liste', '链表', 'lista enlazada', 'लिंक्ड लिस्ट', 'قائمة مترابطة', 'লিঙ্কড লিস্ট', 'lista ligada', '連結リスト', 'רשימה מקושרת')
const SET = t11('множество', 'set', 'Menge', '集合', 'conjunto', 'समुच्चय', 'مجموعة', 'সেট', 'conjunto', '集合', 'קבוצה')
const ARRA = t11('элементы по номеру', 'items by index', 'Elemente nach Nummer', '按编号取元素', 'elementos por número', 'क्रमांक से तत्व', 'عناصر برقم', 'নম্বর দিয়ে উপাদান', 'itens por número', '番号で要素', 'פריטים לפי מספר')
const STKA = t11('последний вошёл — первый вышел', 'last in, first out', 'zuletzt rein, zuerst raus', '后进先出', 'último en entrar, primero en salir', 'आखिरी आया, पहले गया', 'الأخير دخولاً يخرج أولاً', 'শেষে ঢোকা আগে বেরোয়', 'último a entrar sai primeiro', '後入れ先出し', 'אחרון נכנס, ראשון יוצא')
const QUEA = t11('первый вошёл — первый вышел', 'first in, first out', 'zuerst rein, zuerst raus', '先进先出', 'primero en entrar, primero en salir', 'पहले आया, पहले गया', 'الأول دخولاً يخرج أولاً', 'আগে ঢোকা আগে বেরোয়', 'primeiro a entrar sai primeiro', '先入れ先出し', 'ראשון נכנס, ראשון יוצא')
const HASHA = t11('ключ находит значение', 'a key finds a value', 'Schlüssel findet Wert', '键找到值', 'una clave halla un valor', 'कुंजी मान ढूँढती है', 'مفتاح يجد قيمة', 'চাবি মান খুঁজে', 'uma chave acha um valor', '鍵で値を見つける', 'מפתח מוצא ערך')
const TREEA = t11('родитель и дети', 'a parent and children', 'Eltern und Kinder', '父节点和子节点', 'padre e hijos', 'माता-पिता और बच्चे', 'أب وأبناء', 'পিতা ও সন্তান', 'pai e filhos', '親と子', 'הורה וילדים')
const GRAPHA = t11('узлы и связи', 'nodes and links', 'Knoten und Kanten', '节点和连线', 'nodos y enlaces', 'नोड और कड़ियाँ', 'عُقد وروابط', 'নোড ও সংযোগ', 'nós e ligações', '節点と辺', 'צמתים וקשתות')
const LISTA = t11('элемент указывает на следующий', 'each item points to the next', 'jedes Element zeigt auf das nächste', '每项指向下一项', 'cada elemento señala al siguiente', 'हर तत्व अगले की ओर', 'كل عنصر يشير للتالي', 'প্রতিটি উপাদান পরের দিকে', 'cada item aponta para o seguinte', '各要素が次を指す', 'כל פריט מצביע לבא')
const SETA = t11('каждый элемент один раз', 'each item once', 'jedes Element einmal', '每个元素只一次', 'cada elemento una vez', 'हर तत्व एक बार', 'كل عنصر مرة', 'প্রতিটি উপাদান একবার', 'cada item uma vez', '要素は一度だけ', 'כל פריט פעם אחת')

const TURING = t11('Тьюринг', 'Turing', 'Turing', '图灵', 'Turing', 'ट्यूरिंग', 'تورنغ', 'টিউরিং', 'Turing', 'チューリング', 'טיורינג')
const ADA = t11('Лавлейс', 'Lovelace', 'Lovelace', '洛夫莱斯', 'Lovelace', 'लवलेस', 'لافليس', 'লাভলেস', 'Lovelace', 'ラブレース', 'לאבלייס')
const TBL = t11('Бернерс-Ли', 'Berners-Lee', 'Berners-Lee', '伯纳斯-李', 'Berners-Lee', 'बर्नर्स-ली', 'بيرنرز-لي', 'বার্নাস-লি', 'Berners-Lee', 'バーナーズ＝リー', 'ברנרס-לי')
const HOPPER = t11('Хоппер', 'Hopper', 'Hopper', '霍珀', 'Hopper', 'हॉपर', 'هوبر', 'হপার', 'Hopper', 'ホッパー', 'הופר')
const BABBAGE = t11('Бэббидж', 'Babbage', 'Babbage', '巴贝奇', 'Babbage', 'बैबेज', 'بابيج', 'ব্যাবেজ', 'Babbage', 'バベッジ', 'בבג׳')
const SHANNON = t11('Шеннон', 'Shannon', 'Shannon', '香农', 'Shannon', 'शैनन', 'شانون', 'শ্যানন', 'Shannon', 'シャノン', 'שאנון')
const NEUMANN = t11('фон Нейман', 'von Neumann', 'von Neumann', '冯·诺伊曼', 'von Neumann', 'वॉन नॉयमन', 'فون نيومان', 'ফন নয়মান', 'von Neumann', 'ノイマン', 'פון נוימן')
const LINUS = t11('Торвальдс', 'Torvalds', 'Torvalds', '托瓦兹', 'Torvalds', 'टॉर्वाल्ड्स', 'تورفالدس', 'টরভাল্ডস', 'Torvalds', 'トーバルズ', 'טורוולדס')
const HAMILTON = t11('Хэмилтон', 'Hamilton', 'Hamilton', '汉密尔顿', 'Hamilton', 'हैमिल्टन', 'هاميلتون', 'হ্যামিল্টন', 'Hamilton', 'ハミルトン', 'המילטון')
const RITCHIE = t11('Ритчи', 'Ritchie', 'Ritchie', '里奇', 'Ritchie', 'रिची', 'ريتشي', 'রিচি', 'Ritchie', 'リッチー', 'ריצ׳י')
const CERF = t11('Серф', 'Cerf', 'Cerf', '瑟夫', 'Cerf', 'सर्फ', 'سيرف', 'সার্ফ', 'Cerf', 'サーフ', 'סרף')
const DIJK = t11('Дейкстра', 'Dijkstra', 'Dijkstra', '迪杰斯特拉', 'Dijkstra', 'डिज्कस्ट्रा', 'ديكسترا', 'ডিজকস্ট্রা', 'Dijkstra', 'ダイクストラ', 'דייקסטרה')
const KNUTH = t11('Кнут', 'Knuth', 'Knuth', '高德纳', 'Knuth', 'नुथ', 'كنوث', 'নুথ', 'Knuth', 'クヌース', 'קנות')
const LISKOV = t11('Лисков', 'Liskov', 'Liskov', '利斯科夫', 'Liskov', 'लिस्कोव', 'ليسكوف', 'লিস্কভ', 'Liskov', 'リスコフ', 'ליסקוב')
const PERLMAN = t11('Перлман', 'Perlman', 'Perlman', '珀尔曼', 'Perlman', 'पर्लमैन', 'بيرلمان', 'পার্লম্যান', 'Perlman', 'パールマン', 'פרלמן')
const GUIDO = t11('ван Россум', 'van Rossum', 'van Rossum', '范罗苏姆', 'van Rossum', 'वैन रोसुम', 'فان روسم', 'ভ্যান রোসাম', 'van Rossum', 'ヴァンロッサム', 'ואן רוסום')
const STROU = t11('Страуструп', 'Stroustrup', 'Stroustrup', '斯特劳斯特鲁普', 'Stroustrup', 'स्ट्रॉस्ट्रुप', 'ستروستروب', 'স্ট্রস্ট্রুপ', 'Stroustrup', 'ストラウストラップ', 'סטראוסטרופ')

const W_TUR = t11('машина Тьюринга', 'Turing machine', 'Turingmaschine', '图灵机', 'máquina de Turing', 'ट्यूरिंग मशीन', 'آلة تورنغ', 'টিউরিং মেশিন', 'máquina de Turing', 'チューリング機械', 'מכונת טיורינג')
const W_ADA = t11('первая опубликованная программа', 'first published program', 'erstes veröffentlichtes Programm', '最早发表的程序', 'primer programa publicado', 'पहला प्रकाशित प्रोग्राम', 'أول برنامج منشور', 'প্রথম প্রকাশিত প্রোগ্রাম', 'primeiro programa publicado', '最初の公開プログラム', 'התוכנית שפורסמה ראשונה')
const W_WEB = t11('Всемирная паутина', 'World Wide Web', 'World Wide Web', '万维网', 'Web mundial', 'वर्ल्ड वाइड वेब', 'الشبكة العالمية', 'ওয়ার্ল্ড ওয়াইড ওয়েব', 'Web mundial', 'ワールドワイドウェブ', 'הרשת העולמית')
const W_HOP = t11('компилятор', 'the compiler', 'der Compiler', '编译器', 'el compilador', 'कंपाइलर', 'المُترجم', 'কম্পাইলার', 'o compilador', 'コンパイラ', 'המהדר')
const W_BAB = t11('аналитическая машина', 'Analytical Engine', 'Analytical Engine', '分析机', 'máquina analítica', 'विश्लेषण इंजन', 'المحرك التحليلي', 'অ্যানালিটিক্যাল ইঞ্জিন', 'máquina analítica', '解析機関', 'המנוע האנליטי')
const W_SHA = t11('теория информации', 'information theory', 'Informationstheorie', '信息论', 'teoría de la información', 'सूचना सिद्धांत', 'نظرية المعلومات', 'তথ্য তত্ত্ব', 'teoria da informação', '情報理論', 'תורת האינפורמציה')
const W_NEU = t11('программа в памяти компьютера', 'stored-program computer', 'speicherprogrammierter Rechner', '存储程序计算机', 'computador de programa almacenado', 'संग्रहित प्रोग्राम वाला कंप्यूटर', 'حاسوب ببرنامج مخزّن', 'সঞ্চিত প্রোগ্রামের কম্পিউটার', 'computador de programa armazenado', 'プログラム内蔵方式', 'מחשב עם תוכנית בזיכרון')
const W_LIN = t11('Linux', 'Linux', 'Linux', 'Linux', 'Linux', 'लिनक्स', 'لينكس', 'লিনাক্স', 'Linux', 'Linux', 'לינוקס')
const W_HAM = t11('софт «Аполлона»', 'Apollo flight software', 'Apollo-Flugsoftware', '阿波罗飞行软件', 'software de vuelo del Apolo', 'अपोलो उड़ान सॉफ़्टवेयर', 'برمجيات رحلة أبولو', 'অ্যাপোলো ফ্লাইট সফটওয়্যার', 'software de voo da Apollo', 'アポロ飛行ソフト', 'תוכנת הטיסה של אפולו')
const W_RIT = t11('язык C', 'the C language', 'die Sprache C', 'C 语言', 'el lenguaje C', 'C भाषा', 'لغة C', 'C ভাষা', 'a linguagem C', 'C言語', 'שפת C')
const W_CER = t11('TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP', 'TCP/IP')
const W_DIJ = t11('кратчайший путь', 'shortest paths', 'kürzeste Wege', '最短路径', 'caminos más cortos', 'सबसे छोटा रास्ता', 'أقصر المسارات', 'ক্ষুদ্রতম পথ', 'caminhos mais curtos', '最短経路', 'המסלול הקצר ביותר')
const W_KNU = t11('разбор алгоритмов', 'analysis of algorithms', 'Analyse von Algorithmen', '算法分析', 'análisis de algoritmos', 'एल्गोरिदम विश्लेषण', 'تحليل الخوارزميات', 'অ্যালগরিদম বিশ্লেষণ', 'análise de algoritmos', '算法の解析', 'ניתוח אלגוריתמים')
const W_LIS = t11('абстракция данных', 'data abstraction', 'Datenabstraktion', '数据抽象', 'abstracción de datos', 'डेटा अमूर्तता', 'تجريد البيانات', 'ডেটা বিমূর্তন', 'abstração de dados', 'データ抽象', 'הפשטת נתונים')
const W_PER = t11('протокол связующего дерева', 'spanning tree protocol', 'Spanning-Tree-Protokoll', '生成树协议', 'protocolo de árbol de expansión', 'स्पैनिंग ट्री प्रोटोकॉल', 'بروتوكول الشجرة الممتدة', 'স্প্যানিং ট্রি প্রোটোকল', 'protocolo spanning tree', 'スパニングツリー', 'פרוטוקול העץ הפורש')
const W_GUI = t11('язык Python', 'the Python language', 'die Sprache Python', 'Python 语言', 'el lenguaje Python', 'Python भाषा', 'لغة بايثون', 'পাইথন ভাষা', 'a linguagem Python', 'Python言語', 'שפת פייתון')
const W_STR = t11('язык C++', 'the C++ language', 'die Sprache C++', 'C++ 语言', 'el lenguaje C++', 'C++ भाषा', 'لغة ++C', 'C++ ভাষা', 'a linguagem C++', 'C++言語', 'שפת ++C')

function binaryRows(): Array<ThemeItem | null> {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 32, 64, 128, 255]
  return nums.flatMap((n) => {
    const bits = n.toString(2)
    const dec = String(n)
    const bin = `${bits}₂`
    const tier: ThemeTier = n <= 8 ? 'easy' : n <= 16 ? 'medium' : 'hard'
    return [
      item(`d-${n}`, 'decToBinary', tier, dec, bin, `b${bits}`),
      item(`b-${n}`, 'binaryToDec', tier, bin, dec, `d${n}`),
    ]
  })
}

export function csGeneratedRows(): ThemeItem[] {
  return [
    ...pair('t-al', 'm-al', 'csTermToMeaning', 'meaningToCsTerm', 'easy', ALGO, ALGOA, 'algoa', 'algo'),
    ...pair('t-va', 'm-va', 'csTermToMeaning', 'meaningToCsTerm', 'easy', VARB, VARA, 'vara', 'var'),
    ...pair('t-lo', 'm-lo', 'csTermToMeaning', 'meaningToCsTerm', 'easy', LOOP, LOOPA, 'loopa', 'loop'),
    ...pair('t-ht', 'm-ht', 'csTermToMeaning', 'meaningToCsTerm', 'medium', HTML, HTMLA, 'htmla', 'html'),
    ...pair('t-hp', 'm-hp', 'csTermToMeaning', 'meaningToCsTerm', 'medium', HTTP, HTTPA, 'httpa', 'http'),
    ...pair('t-bi', 'm-bi', 'csTermToMeaning', 'meaningToCsTerm', 'easy', BIT, BITA, 'bita', 'bit'),
    ...pair('t-cpu', 'm-cpu', 'csTermToMeaning', 'meaningToCsTerm', 'easy', CPU, CPUA, 'cpua', 'cpu'),
    ...pair('t-ram', 'm-ram', 'csTermToMeaning', 'meaningToCsTerm', 'easy', RAM, RAMA, 'rama', 'ram'),
    ...pair('t-co', 'm-co', 'csTermToMeaning', 'meaningToCsTerm', 'medium', COMP, COMPA, 'compa', 'comp'),
    ...pair('t-bug', 'm-bug', 'csTermToMeaning', 'meaningToCsTerm', 'easy', BUG, BUGA, 'buga', 'bug'),
    ...pair('t-api', 'm-api', 'csTermToMeaning', 'meaningToCsTerm', 'medium', API, APIA, 'apia', 'api'),
    ...pair('t-dns', 'm-dns', 'csTermToMeaning', 'meaningToCsTerm', 'medium', DNS, DNSA, 'dnsa', 'dns'),
    ...pair('t-os', 'm-os', 'csTermToMeaning', 'meaningToCsTerm', 'easy', OS, OSA, 'osa', 'os'),
    ...pair('t-px', 'm-px', 'csTermToMeaning', 'meaningToCsTerm', 'easy', PIX, PIXA, 'pixa', 'pix'),
    ...pair('t-ck', 'm-ck', 'csTermToMeaning', 'meaningToCsTerm', 'medium', COOK, COOKA, 'cooka', 'cook'),
    ...pair('t-sql', 'm-sql', 'csTermToMeaning', 'meaningToCsTerm', 'medium', SQL, SQLA, 'sqla', 'sql'),
    ...pair('t-enc', 'm-enc', 'csTermToMeaning', 'meaningToCsTerm', 'hard', ENC, ENCA, 'enca', 'enc'),
    ...pair('t-ca', 'm-ca', 'csTermToMeaning', 'meaningToCsTerm', 'hard', CACHE, CACHEA, 'cachea', 'cache'),

    item('lg-py', 'codeToLang', 'easy', 'print("hi")', PY, 'py'),
    item('lg-js', 'codeToLang', 'easy', 'console.log(1)', JS, 'js'),
    item('lg-jv', 'codeToLang', 'easy', 'System.out.println(1)', JAVA, 'java'),
    item('lg-c', 'codeToLang', 'medium', 'printf("hi");', C, 'c'),
    item('lg-go', 'codeToLang', 'medium', 'fmt.Println(1)', GO, 'go'),
    item('lg-rb', 'codeToLang', 'medium', 'puts "hi"', RB, 'rb'),
    item('lg-php', 'codeToLang', 'medium', 'echo "hi";', PHP, 'php'),
    item('lg-sql', 'codeToLang', 'easy', 'SELECT 1', SQL, 'sql'),
    item('lg-rs', 'codeToLang', 'hard', 'fn main()', RUST, 'rs'),
    item('lg-html', 'codeToLang', 'easy', '<h1>Hi</h1>', HTML, 'html'),
    item('lg-cpp', 'codeToLang', 'hard', 'std::cout', CPP, 'cpp'),
    item('lg-kt', 'codeToLang', 'hard', 'fun main()', KT, 'kt'),

    ...pair('st-arr', 'us-arr', 'structToUse', 'useToStruct', 'easy', ARR, ARRA, 'arra', 'arr'),
    ...pair('st-stk', 'us-stk', 'structToUse', 'useToStruct', 'easy', STK, STKA, 'stka', 'stk'),
    ...pair('st-que', 'us-que', 'structToUse', 'useToStruct', 'easy', QUE, QUEA, 'quea', 'que'),
    ...pair('st-hash', 'us-hash', 'structToUse', 'useToStruct', 'medium', HASH, HASHA, 'hasha', 'hash'),
    ...pair('st-tree', 'us-tree', 'structToUse', 'useToStruct', 'medium', TREE, TREEA, 'treea', 'tree'),
    ...pair('st-gr', 'us-gr', 'structToUse', 'useToStruct', 'hard', GRAPH, GRAPHA, 'grapha', 'graph'),
    ...pair('st-list', 'us-list', 'structToUse', 'useToStruct', 'medium', LIST, LISTA, 'lista', 'list'),
    ...pair('st-set', 'us-set', 'structToUse', 'useToStruct', 'easy', SET, SETA, 'seta', 'set'),

    ...binaryRows(),

    item('ph-tu', 'csPhotoToName', 'easy', TURING, TURING, 'tur', { wiki: 'Alan Turing', wikiFile: 'Alan Turing Aged 16.jpg' }),
    item('ph-ad', 'csPhotoToName', 'easy', ADA, ADA, 'ada', { wiki: 'Ada Lovelace', wikiFile: 'Ada Lovelace portrait.jpg' }),
    item('ph-tb', 'csPhotoToName', 'medium', TBL, TBL, 'tbl', { wiki: 'Tim Berners-Lee', wikiFile: 'Sir Tim Berners-Lee (cropped).jpg' }),
    item('ph-ho', 'csPhotoToName', 'medium', HOPPER, HOPPER, 'hop', { wiki: 'Grace Hopper', wikiFile: 'Commodore Grace M. Hopper, USN (covered).jpg' }),
    item('ph-bab', 'csPhotoToName', 'medium', BABBAGE, BABBAGE, 'bab', { wiki: 'Charles Babbage', wikiFile: 'Charles Babbage - 1860.jpg' }),
    item('ph-sha', 'csPhotoToName', 'hard', SHANNON, SHANNON, 'sha', { wiki: 'Claude Shannon', wikiFile: 'C.E. Shannon. Tekniska museet 43069 (cropped).jpg' }),
    item('ph-neu', 'csPhotoToName', 'medium', NEUMANN, NEUMANN, 'neu', { wiki: 'John von Neumann', wikiFile: 'John von Neumann.jpg' }),
    item('ph-lin', 'csPhotoToName', 'easy', LINUS, LINUS, 'lin', { wiki: 'Linus Torvalds', wikiFile: 'Linus Torvalds.jpeg' }),
    item('ph-ham', 'csPhotoToName', 'medium', HAMILTON, HAMILTON, 'ham', { wiki: 'Margaret Hamilton (software engineer)', wikiFile: 'Margaret Hamilton - restoration.jpg' }),
    item('ph-rit', 'csPhotoToName', 'medium', RITCHIE, RITCHIE, 'rit', { wiki: 'Dennis Ritchie', wikiFile: 'Dennis Ritchie 2011.jpg' }),
    item('ph-cer', 'csPhotoToName', 'medium', CERF, CERF, 'cer', { wiki: 'Vint Cerf', wikiFile: 'Dr Vint Cerf ForMemRS.jpg' }),
    item('ph-dij', 'csPhotoToName', 'hard', DIJK, DIJK, 'dij', { wiki: 'Edsger W. Dijkstra', wikiFile: 'Edsger Wybe Dijkstra.jpg' }),
    item('ph-knu', 'csPhotoToName', 'hard', KNUTH, KNUTH, 'knu', { wiki: 'Donald Knuth', wikiFile: 'KnuthAtOpenContentAlliance.jpg' }),
    item('ph-lis', 'csPhotoToName', 'hard', LISKOV, LISKOV, 'lis', { wiki: 'Barbara Liskov', wikiFile: 'Barbara Liskov MIT computer scientist 2010.jpg' }),
    item('ph-per', 'csPhotoToName', 'hard', PERLMAN, PERLMAN, 'per', { wiki: 'Radia Perlman', wikiFile: 'Radia Perlman 2009.jpg' }),
    item('ph-gui', 'csPhotoToName', 'easy', GUIDO, GUIDO, 'gui', { wiki: 'Guido van Rossum', wikiFile: 'Guido-portrait-2014-drc.jpg' }),
    item('ph-str', 'csPhotoToName', 'medium', STROU, STROU, 'str', { wiki: 'Bjarne Stroustrup', wikiFile: 'Bjarne-stroustrup (cropped).jpg' }),

    ...pair('pw-tu', 'wp-tu', 'personToWork', 'workToPerson', 'easy', TURING, W_TUR, 'wtur', 'tur'),
    ...pair('pw-ad', 'wp-ad', 'personToWork', 'workToPerson', 'easy', ADA, W_ADA, 'wada', 'ada'),
    ...pair('pw-tb', 'wp-tb', 'personToWork', 'workToPerson', 'easy', TBL, W_WEB, 'wweb', 'tbl'),
    ...pair('pw-ho', 'wp-ho', 'personToWork', 'workToPerson', 'medium', HOPPER, W_HOP, 'whop', 'hop'),
    ...pair('pw-bab', 'wp-bab', 'personToWork', 'workToPerson', 'medium', BABBAGE, W_BAB, 'wbab', 'bab'),
    ...pair('pw-sha', 'wp-sha', 'personToWork', 'workToPerson', 'hard', SHANNON, W_SHA, 'wsha', 'sha'),
    ...pair('pw-neu', 'wp-neu', 'personToWork', 'workToPerson', 'hard', NEUMANN, W_NEU, 'wneu', 'neu'),
    ...pair('pw-lin', 'wp-lin', 'personToWork', 'workToPerson', 'easy', LINUS, W_LIN, 'wlin', 'lin'),
    ...pair('pw-ham', 'wp-ham', 'personToWork', 'workToPerson', 'medium', HAMILTON, W_HAM, 'wham', 'ham'),
    ...pair('pw-rit', 'wp-rit', 'personToWork', 'workToPerson', 'medium', RITCHIE, W_RIT, 'writ', 'rit'),
    ...pair('pw-cer', 'wp-cer', 'personToWork', 'workToPerson', 'medium', CERF, W_CER, 'wcer', 'cer'),
    ...pair('pw-dij', 'wp-dij', 'personToWork', 'workToPerson', 'hard', DIJK, W_DIJ, 'wdij', 'dij'),
    ...pair('pw-knu', 'wp-knu', 'personToWork', 'workToPerson', 'hard', KNUTH, W_KNU, 'wknu', 'knu'),
    ...pair('pw-lis', 'wp-lis', 'personToWork', 'workToPerson', 'hard', LISKOV, W_LIS, 'wlis', 'lis'),
    ...pair('pw-per', 'wp-per', 'personToWork', 'workToPerson', 'hard', PERLMAN, W_PER, 'wper', 'per'),
    ...pair('pw-gui', 'wp-gui', 'personToWork', 'workToPerson', 'easy', GUIDO, W_GUI, 'wgpu', 'gui'),
    ...pair('pw-str', 'wp-str', 'personToWork', 'workToPerson', 'medium', STROU, W_STR, 'wstr', 'str'),
  ].filter((row): row is ThemeItem => row !== null)
}
