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
  | 'tourStepStateTitle'
  | 'tourStepStateBody'
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
    tourStepGeoBody:
      'Флаги, столицы, карты и коды. За верные ответы в зачёте падают марки стран — до пяти копий. Лишние копии кормят Государство.',
    tourStepStateTitle: 'Государство',
    tourStepStateBody:
      'Ваша страна. Лишние гео-марки меняют на жетоны казны или служащих. Министерства усиливают раунд правления.',
    tourStepDockTitle: 'Ещё',
    tourStepDockBody:
      'Штаб копит знание, магазин тратит жетоны, студия собирает свои колоды, мультиплеер — живые дуэли.',
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
    tourStepGeoBody:
      'Flags, capitals, maps and codes. Scored correct answers drop country stamps — up to five copies. Spare copies feed State.',
    tourStepStateTitle: 'State',
    tourStepStateBody:
      'Your country. Spare geography stamps become treasury tokens or clerks. Ministries power up the governing round.',
    tourStepDockTitle: 'More',
    tourStepDockBody:
      'HQ stores knowledge, the shop spends tokens, Studio builds your own decks, and multiplayer is live duels.',
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
    tourStepGeoBody:
      'Flaggen, Hauptstädte, Karten und Codes. Richtige Antworten in Wertungsrunden geben Ländermarken — bis zu fünf Kopien. Extra-Kopien füttern den Staat.',
    tourStepStateTitle: 'Staat',
    tourStepStateBody:
      'Dein Land. Extra-Geografie-Marken werden zu Kassen-Token oder Beamten. Ministerien stärken die Regierungsrunde.',
    tourStepDockTitle: 'Mehr',
    tourStepDockBody:
      'Das HQ sammelt Wissen, der Laden gibt Token aus, das Studio baut eigene Decks, Multiplayer sind Live-Duelle.',
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
    tourStepGeoBody:
      '旗帜、首都、地图和代码。计分答对会掉国家邮票，最多五份。多余的副本供给「国家」。',
    tourStepStateTitle: '国家',
    tourStepStateBody:
      '你的国家。多余的地理邮票可换成国库代币或职员。部委会加强执政回合。',
    tourStepDockTitle: '更多',
    tourStepDockBody: '总部积累知识，商店花代币，工作室做自己的牌组，多人是实时对决。',
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
    tourStepGeoBody:
      'Banderas, capitales, mapas y códigos. Los aciertos con puntuación sueltan sellos de países, hasta cinco copias. Las extra alimentan Estado.',
    tourStepStateTitle: 'Estado',
    tourStepStateBody:
      'Tu país. Los sellos extra de geografía se cambian por fichas de tesoro o funcionarios. Los ministerios refuerzan la ronda de gobierno.',
    tourStepDockTitle: 'Más',
    tourStepDockBody:
      'El cuartel guarda saber, la tienda gasta fichas, el estudio arma tus mazos y el multijugador son duelos en vivo.',
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
    tourStepGeoBody:
      'झंडे, राजधानियाँ, नक्शे और कोड। स्कोर वाले सही जवाब देश की टिकटें देते हैं — पाँच प्रतियाँ तक। अतिरिक्त प्रतियाँ राज्य चलाती हैं।',
    tourStepStateTitle: 'राज्य',
    tourStepStateBody:
      'आपका देश। अतिरिक्त भूगोल टिकटें खजाने के टोकन या क्लर्क बनती हैं। मंत्रालय शासन राउंड को मजबूत करते हैं।',
    tourStepDockTitle: 'और',
    tourStepDockBody:
      'मुख्यालय ज्ञान जमा करता है, दुकान टोकन खर्च करती है, स्टूडियो आपके डेक बनाता है, मल्टीप्लेयर लाइव द्वंद्व है।',
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
    tourStepGeoBody:
      'أعلام وعواصم وخرائط ورموز. الإجابات الصحيحة المحسوبة تسقط طوابع الدول — حتى خمس نسخ. الزائد يغذي الدولة.',
    tourStepStateTitle: 'الدولة',
    tourStepStateBody:
      'بلدك. طوابع الجغرافيا الزائدة تصبح رموز خزانة أو موظفين. الوزارات تقوّي جولة الحكم.',
    tourStepDockTitle: 'المزيد',
    tourStepDockBody:
      'المقر يخزن المعرفة، والمتجر يصرف الرموز، والاستوديو يبني مجموعاتك، واللعب الجماعي مبارزات مباشرة.',
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
    tourStepGeoBody:
      'পতাকা, রাজধানী, মানচিত্র ও কোড। স্কোর সঠিক উত্তরে দেশের স্ট্যাম্প পড়ে — পাঁচ কপি পর্যন্ত। বাড়তি কপি রাষ্ট্র চালায়।',
    tourStepStateTitle: 'রাষ্ট্র',
    tourStepStateBody:
      'আপনার দেশ। বাড়তি ভূগোল স্ট্যাম্প কোষাগার টোকেন বা কর্মচারী হয়। মন্ত্রণালয় শাসন রাউন্ড শক্ত করে।',
    tourStepDockTitle: 'আরও',
    tourStepDockBody:
      'সদর দপ্তর জ্ঞান জমায়, দোকান টোকেন খরচ করে, স্টুডিও আপনার ডেক বানায়, মাল্টিপ্লেয়ার লাইভ দ্বন্দ্ব।',
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
    tourStepGeoBody:
      'Bandeiras, capitais, mapas e códigos. Acertos com pontuação soltam selos de países — até cinco cópias. As extra alimentam o Estado.',
    tourStepStateTitle: 'Estado',
    tourStepStateBody:
      'O teu país. Selos extra de geografia viram fichas do tesouro ou funcionários. Os ministérios reforçam a ronda de governo.',
    tourStepDockTitle: 'Mais',
    tourStepDockBody:
      'O QG guarda saber, a loja gasta fichas, o estúdio monta os teus baralhos e o multijogador são duelos ao vivo.',
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
    tourStepGeoBody:
      '旗、首都、地図、コード。得点ラウンドの正解で国の切手が落ちます。最大5枚。余分なコピーは国家に使います。',
    tourStepStateTitle: '国家',
    tourStepStateBody:
      'あなたの国。余った地理の切手は国庫トークンか職員になります。省庁は統治ラウンドを強化します。',
    tourStepDockTitle: 'そのほか',
    tourStepDockBody:
      '本部は知識を貯め、店はトークンを使い、スタジオは自作デッキ、マルチはリアルタイム対戦です。',
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
    tourStepGeoBody:
      'דגלים, בירות, מפות וקודים. תשובות נכונות עם ניקוד מפילות בולי מדינות — עד חמישה עותקים. העודפים מזינים את המדינה.',
    tourStepStateTitle: 'מדינה',
    tourStepStateBody:
      'המדינה שלכם. בולי גיאו עודפים הופכים לטוקני אוצר או לפקידים. המשרדים מחזקים את סבב השלטון.',
    tourStepDockTitle: 'עוד',
    tourStepDockBody:
      'המטה אוגר ידע, החנות מוציאה טוקנים, הסטודיו בונה חפיסות, והמשחק המרובה הוא דו־קרב חי.',
  }),
}
