import type { Lang } from './lang'
import type { Strings } from './strings'

export type TourCopy = Pick<
  Strings,
  | 'tourSkip'
  | 'tourNext'
  | 'tourBack'
  | 'tourDone'
  | 'tourReplay'
  | 'tourStepWorldsTitle'
  | 'tourStepWorldsBody'
  | 'tourStepGeoTitle'
  | 'tourStepGeoBody'
  | 'tourStepEmpireTitle'
  | 'tourStepEmpireBody'
  | 'tourStepDockTitle'
  | 'tourStepDockBody'
>

function row(copy: TourCopy): TourCopy {
  return copy
}

export const TOUR_COPY: Record<Lang, TourCopy> = {
  ru: row({
    tourSkip: 'Пропустить',
    tourNext: 'Дальше',
    tourBack: 'Назад',
    tourDone: 'Понятно',
    tourReplay: 'Показать гид',
    tourStepWorldsTitle: 'Темы',
    tourStepWorldsBody:
      'Это хаб. Выберите предмет — флаги, футбол, лидеры, математика и другие. В каждом мире есть свободная игра, кампания и альбом марок.',
    tourStepGeoTitle: 'География',
    tourStepGeoBody: 'Флаги, столицы, карты и коды. За верные ответы в зачёте падают марки стран — до пяти копий, а Империя получает специалистов и монеты.',
    tourStepEmpireTitle: 'Империя',
    tourStepEmpireBody: 'Ваша страна. Девять зданий по темам растут от зачётных раундов, монеты и ресурсы капают сами, эпохи открывают сложность, уровни и подборки.',
    tourStepDockTitle: 'Ещё',
    tourStepDockBody: 'Студия собирает свои колоды, мультиплеер — живые дуэли. Казна Империи — рамки, темы и ускорения.',
  }),
  en: row({
    tourSkip: 'Skip',
    tourNext: 'Next',
    tourBack: 'Back',
    tourDone: 'Got it',
    tourReplay: 'Show the guide',
    tourStepWorldsTitle: 'Subjects',
    tourStepWorldsBody:
      'This is the hub. Pick a subject — flags, football, leaders, math and more. Each world has free play, a campaign, and a stamp album.',
    tourStepGeoTitle: 'Geography',
    tourStepGeoBody: 'Flags, capitals, maps and codes. Scored correct answers drop country stamps — up to five copies — and the Empire gains specialists and coins.',
    tourStepEmpireTitle: 'Empire',
    tourStepEmpireBody: 'Your country. Nine buildings by subject grow from scored rounds, coins and resources trickle in on their own, eras unlock difficulty, levels and collections.',
    tourStepDockTitle: 'More',
    tourStepDockBody: 'Studio builds your own decks, multiplayer is live duels. The Empire treasury sells frames, themes and boosts.',
  }),
  de: row({
    tourSkip: 'Überspringen',
    tourNext: 'Weiter',
    tourBack: 'Zurück',
    tourDone: 'Verstanden',
    tourReplay: 'Guide zeigen',
    tourStepWorldsTitle: 'Themen',
    tourStepWorldsBody:
      'Das ist die Zentrale. Wähle ein Fach — Flaggen, Fußball, Herrscher, Mathe und mehr. Jede Welt hat Freispiel, Kampagne und Markenalbum.',
    tourStepGeoTitle: 'Geografie',
    tourStepGeoBody: 'Flaggen, Hauptstädte, Karten und Codes. Gewertete richtige Antworten bringen Ländermarken — bis zu fünf Kopien — und das Imperium bekommt Spezialisten und Münzen.',
    tourStepEmpireTitle: 'Imperium',
    tourStepEmpireBody: 'Dein Land. Neun Gebäude nach Fach wachsen durch gewertete Runden, Münzen und Ressourcen tropfen von selbst, Epochen öffnen Schwierigkeit, Level und Sammlungen.',
    tourStepDockTitle: 'Mehr',
    tourStepDockBody: 'Das Studio baut eigene Decks, Multiplayer sind Live-Duelle. Die Schatzkammer des Imperiums verkauft Rahmen, Designs und Schübe.',
  }),
  zh: row({
    tourSkip: '跳过',
    tourNext: '下一步',
    tourBack: '上一步',
    tourDone: '明白了',
    tourReplay: '再看指南',
    tourStepWorldsTitle: '主题',
    tourStepWorldsBody:
      '这是大厅。选一个科目：旗帜、足球、领袖、数学等。每个世界都有自由对局、战役和邮票相册。',
    tourStepGeoTitle: '地理',
    tourStepGeoBody: '国旗、首都、地图和代码。计分答对掉落国家邮票（最多五份），帝国获得专家和金币。',
    tourStepEmpireTitle: '帝国',
    tourStepEmpireBody: '你的国家。九座按学科的建筑随计分回合成长，金币和资源自动累积，时代解锁难度、关卡和合集。',
    tourStepDockTitle: '更多',
    tourStepDockBody: '工作室做自己的牌组，多人是实时对决。帝国国库出售边框、主题和加速。',
  }),
  es: row({
    tourSkip: 'Saltar',
    tourNext: 'Siguiente',
    tourBack: 'Atrás',
    tourDone: 'Entendido',
    tourReplay: 'Ver la guía',
    tourStepWorldsTitle: 'Temas',
    tourStepWorldsBody:
      'Este es el hub. Elige una materia: banderas, fútbol, líderes, mates y más. Cada mundo tiene juego libre, campaña y álbum de sellos.',
    tourStepGeoTitle: 'Geografía',
    tourStepGeoBody: 'Banderas, capitales, mapas y códigos. Los aciertos puntuados dan sellos de países —hasta cinco copias— y el Imperio gana especialistas y monedas.',
    tourStepEmpireTitle: 'Imperio',
    tourStepEmpireBody: 'Tu país. Nueve edificios por materia crecen con rondas puntuadas, las monedas y recursos gotean solos, las eras abren dificultad, niveles y colecciones.',
    tourStepDockTitle: 'Más',
    tourStepDockBody: 'El Estudio arma tus propias barajas, el multijugador son duelos en vivo. El tesoro del Imperio vende marcos, temas e impulsos.',
  }),
  hi: row({
    tourSkip: 'छोड़ें',
    tourNext: 'आगे',
    tourBack: 'पीछे',
    tourDone: 'समझ गया',
    tourReplay: 'गाइड दिखाएँ',
    tourStepWorldsTitle: 'विषय',
    tourStepWorldsBody:
      'यह हब है। विषय चुनें — झंडे, फुटबॉल, नेता, गणित और और। हर विश्व में फ्री प्ले, अभियान और टिकट एल्बम है।',
    tourStepGeoTitle: 'भूगोल',
    tourStepGeoBody: 'झंडे, राजधानियाँ, नक्शे और कोड। स्कोर वाले सही उत्तर देश की डाक टिकटें देते हैं — पाँच प्रतियों तक — और साम्राज्य को विशेषज्ञ और सिक्के मिलते हैं।',
    tourStepEmpireTitle: 'साम्राज्य',
    tourStepEmpireBody: 'आपका देश। विषय के अनुसार नौ भवन स्कोर वाले राउंड से बढ़ते हैं, सिक्के और संसाधन अपने आप आते हैं, युग कठिनाई, स्तर और संग्रह खोलते हैं।',
    tourStepDockTitle: 'और',
    tourStepDockBody: 'स्टूडियो अपने डेक बनाता है, मल्टीप्लेयर लाइव द्वंद्व है। साम्राज्य का कोष फ्रेम, थीम और बूस्ट बेचता है।',
  }),
  ar: row({
    tourSkip: 'تخطي',
    tourNext: 'التالي',
    tourBack: 'رجوع',
    tourDone: 'حسناً',
    tourReplay: 'عرض الدليل',
    tourStepWorldsTitle: 'المواضيع',
    tourStepWorldsBody:
      'هذه الساحة. اختر مادة: أعلام، كرة قدم، قادة، رياضيات وغيرها. لكل عالم لعب حر وحملة وألبوم طوابع.',
    tourStepGeoTitle: 'الجغرافيا',
    tourStepGeoBody: 'الأعلام والعواصم والخرائط والرموز. الإجابات الصحيحة المحتسبة تمنح طوابع الدول — حتى خمس نسخ — وتكسب الإمبراطورية متخصصين وعملات.',
    tourStepEmpireTitle: 'الإمبراطورية',
    tourStepEmpireBody: 'بلدك. تسعة مبانٍ حسب المادة تنمو من الجولات المحتسبة، والعملات والموارد تتراكم وحدها، والعصور تفتح الصعوبة والمستويات والمجموعات.',
    tourStepDockTitle: 'المزيد',
    tourStepDockBody: 'الاستوديو يبني مجموعاتك، واللعب الجماعي مبارزات مباشرة. خزانة الإمبراطورية تبيع الإطارات والسِمات والتعزيزات.',
  }),
  bn: row({
    tourSkip: 'এড়িয়ে যান',
    tourNext: 'পরবর্তী',
    tourBack: 'পিছনে',
    tourDone: 'বুঝেছি',
    tourReplay: 'গাইড দেখান',
    tourStepWorldsTitle: 'বিষয়',
    tourStepWorldsBody:
      'এটি হাব। একটি বিষয় বেছে নিন — পতাকা, ফুটবল, নেতা, গণিত ও আরও। প্রতি বিশ্বে ফ্রি প্লে, ক্যাম্পেইন ও স্ট্যাম্প অ্যালবাম আছে।',
    tourStepGeoTitle: 'ভূগোল',
    tourStepGeoBody: 'পতাকা, রাজধানী, মানচিত্র ও কোড। স্কোরযুক্ত সঠিক উত্তরে দেশের ডাকটিকিট পড়ে — পাঁচ কপি পর্যন্ত — আর সাম্রাজ্য পায় বিশেষজ্ঞ ও মুদ্রা।',
    tourStepEmpireTitle: 'সাম্রাজ্য',
    tourStepEmpireBody: 'আপনার দেশ। বিষয় অনুযায়ী নয়টি ভবন স্কোরযুক্ত রাউন্ডে বাড়ে, মুদ্রা ও সম্পদ নিজে থেকে জমে, যুগ খোলে কঠিনতা, স্তর ও সংগ্রহ।',
    tourStepDockTitle: 'আরও',
    tourStepDockBody: 'স্টুডিও নিজের ডেক বানায়, মাল্টিপ্লেয়ার লাইভ দ্বৈরথ। সাম্রাজ্যের কোষাগার বিক্রি করে ফ্রেম, থিম ও বুস্ট।',
  }),
  pt: row({
    tourSkip: 'Saltar',
    tourNext: 'Seguinte',
    tourBack: 'Voltar',
    tourDone: 'Percebi',
    tourReplay: 'Mostrar o guia',
    tourStepWorldsTitle: 'Temas',
    tourStepWorldsBody:
      'Este é o hub. Escolhe uma matéria — bandeiras, futebol, líderes, matemática e mais. Cada mundo tem jogo livre, campanha e álbum de selos.',
    tourStepGeoTitle: 'Geografia',
    tourStepGeoBody: 'Bandeiras, capitais, mapas e códigos. Acertos pontuados dão selos de países — até cinco cópias — e o Império ganha especialistas e moedas.',
    tourStepEmpireTitle: 'Império',
    tourStepEmpireBody: 'Seu país. Nove prédios por matéria crescem com rodadas pontuadas, moedas e recursos pingam sozinhos, eras abrem dificuldade, níveis e coleções.',
    tourStepDockTitle: 'Mais',
    tourStepDockBody: 'O Estúdio monta seus próprios baralhos, o multijogador são duelos ao vivo. O tesouro do Império vende molduras, temas e impulsos.',
  }),
  ja: row({
    tourSkip: 'スキップ',
    tourNext: '次へ',
    tourBack: '戻る',
    tourDone: 'わかった',
    tourReplay: 'ガイドを見る',
    tourStepWorldsTitle: 'テーマ',
    tourStepWorldsBody:
      'ここがハブです。旗、サッカー、指導者、数学など科目を選びます。各世界にフリープレイ、キャンペーン、切手アルバムがあります。',
    tourStepGeoTitle: '地理',
    tourStepGeoBody: '国旗、首都、地図、コード。スコア対象の正解で国の切手（最大 5 枚）が手に入り、帝国は専門家とコインを得ます。',
    tourStepEmpireTitle: '帝国',
    tourStepEmpireBody: 'あなたの国。教科別の 9 つの建物がスコア対象ラウンドで育ち、コインと資源は自動で貯まり、時代が難易度・レベル・コレクションを解放します。',
    tourStepDockTitle: 'そのほか',
    tourStepDockBody: 'スタジオは自分のデッキを作り、マルチプレイはライブ対戦。帝国の宝物庫ではフレーム、テーマ、ブーストを販売。',
  }),
  he: row({
    tourSkip: 'דילוג',
    tourNext: 'הבא',
    tourBack: 'חזרה',
    tourDone: 'הבנתי',
    tourReplay: 'להציג את המדריך',
    tourStepWorldsTitle: 'נושאים',
    tourStepWorldsBody:
      'זה ההאב. בחרו נושא — דגלים, כדורגל, מנהיגים, מתמטיקה ועוד. לכל עולם יש משחק חופשי, מסע ואלבום בולים.',
    tourStepGeoTitle: 'גיאוגרפיה',
    tourStepGeoBody: 'דגלים, בירות, מפות וקודים. תשובות נכונות במשחק מדורג מפילות בולי מדינות — עד חמישה עותקים — והאימפריה מקבלת מומחים ומטבעות.',
    tourStepEmpireTitle: 'אימפריה',
    tourStepEmpireBody: 'המדינה שלך. תשעה בניינים לפי נושא צומחים מסבבים מדורגים, מטבעות ומשאבים נצברים לבד, ותקופות פותחות רמת קושי, שלבים ואוספים.',
    tourStepDockTitle: 'עוד',
    tourStepDockBody: 'הסטודיו בונה חפיסות משלך, מרובה משתתפים הוא דו־קרב חי. אוצר האימפריה מוכר מסגרות, ערכות נושא והאצות.',
  }),
}
