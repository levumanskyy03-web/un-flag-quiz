import type { Lang } from './lang'
import type { Strings } from './strings'

export type AlbumCopy = Pick<
  Strings,
  | 'albumLootTitle'
  | 'albumLoot1'
  | 'albumLoot2'
  | 'albumLoot3'
  | 'albumLoot4'
  | 'albumLoot5'
  | 'albumLootNote'
  | 'albumLootNoteWorld'
>

function row(copy: AlbumCopy): AlbumCopy {
  return copy
}

export const ALBUM_COPY: Record<Lang, AlbumCopy> = {
  ru: row({
    albumLootTitle: 'Как лутать',
    albumLoot1: 'Первая копия — верный ответ в зачётной свободной игре или кампании.',
    albumLoot2: 'Вторая — та же карточка, но в другом режиме.',
    albumLoot3: 'Третья — сложность «сложно» или хардкор.',
    albumLoot4: 'Четвёртая — идеальный раунд, все ответы верные.',
    albumLoot5: 'Пятая — хардкор до конца.',
    albumLootNote: 'Училка и тренажёр ошибок марки не дают. Лишние гео-копии можно сдать в Государстве.',
    albumLootNoteWorld: 'Училка и тренажёр ошибок марки не дают. Копии остаются в альбоме этой темы.',
  }),
  en: row({
    albumLootTitle: 'How to loot',
    albumLoot1: 'First copy: a correct answer in scored free play or the campaign.',
    albumLoot2: 'Second: the same card, but in a different mode.',
    albumLoot3: 'Third: Hard or Hardcore difficulty.',
    albumLoot4: 'Fourth: a perfect round — every answer correct.',
    albumLoot5: 'Fifth: finish a Hardcore round.',
    albumLootNote: 'Learn and the mistakes trainer do not drop stamps. Spare geography copies can be spent in State.',
    albumLootNoteWorld: 'Learn and the mistakes trainer do not drop stamps. Copies stay in this world’s album.',
  }),
  de: row({
    albumLootTitle: 'So sammelt man',
    albumLoot1: 'Erste Kopie: richtige Antwort im Wertungs-Freispiel oder in der Kampagne.',
    albumLoot2: 'Zweite: dieselbe Karte, aber in einem anderen Modus.',
    albumLoot3: 'Dritte: Schwierigkeit Schwer oder Hardcore.',
    albumLoot4: 'Vierte: perfekte Runde — jede Antwort richtig.',
    albumLoot5: 'Fünfte: Hardcore bis zum Ende.',
    albumLootNote: 'Lernen und der Fehlertrainer geben keine Marken. Extra-Geografie-Kopien kann man im Staat ausgeben.',
    albumLootNoteWorld: 'Lernen und der Fehlertrainer geben keine Marken. Kopien bleiben im Album dieser Welt.',
  }),
  zh: row({
    albumLootTitle: '怎么掉落',
    albumLoot1: '第一份：计分自由对局或战役中答对。',
    albumLoot2: '第二份：同一张卡，但换一种模式。',
    albumLoot3: '第三份：困难或硬核难度。',
    albumLoot4: '第四份：完美一局，全部答对。',
    albumLoot5: '第五份：硬核通关。',
    albumLootNote: '学习和错题不掉邮票。多余的地理副本可在「国家」里兑换。',
    albumLootNoteWorld: '学习和错题不掉邮票。副本留在本主题相册里。',
  }),
  es: row({
    albumLootTitle: 'Cómo se consiguen',
    albumLoot1: 'Primera copia: acierto en juego libre con puntuación o en la campaña.',
    albumLoot2: 'Segunda: la misma carta, pero en otro modo.',
    albumLoot3: 'Tercera: dificultad Difícil o Hardcore.',
    albumLoot4: 'Cuarta: ronda perfecta, todas las respuestas bien.',
    albumLoot5: 'Quinta: terminar una ronda Hardcore.',
    albumLootNote: 'Aprender y el entrenador de fallos no sueltan sellos. Las copias extra de geografía se gastan en Estado.',
    albumLootNoteWorld: 'Aprender y el entrenador de fallos no sueltan sellos. Las copias se quedan en el álbum de este mundo.',
  }),
  hi: row({
    albumLootTitle: 'कैसे मिलती हैं',
    albumLoot1: 'पहली प्रति: स्कोर वाले फ्री प्ले या अभियान में सही जवाब।',
    albumLoot2: 'दूसरी: वही कार्ड, लेकिन दूसरे मोड में।',
    albumLoot3: 'तीसरी: कठिन या हार्डकोर कठिनाई।',
    albumLoot4: 'चौथी: परफेक्ट राउंड — हर जवाब सही।',
    albumLoot5: 'पाँचवीं: हार्डकोर राउंड पूरा करें।',
    albumLootNote: 'सीखें और गलती ट्रेनर टिकट नहीं देते। अतिरिक्त भूगोल प्रतियाँ राज्य में खर्च होती हैं।',
    albumLootNoteWorld: 'सीखें और गलती ट्रेनर टिकट नहीं देते। प्रतियाँ इसी विश्व के एल्बम में रहती हैं।',
  }),
  ar: row({
    albumLootTitle: 'كيف تُجمع',
    albumLoot1: 'النسخة الأولى: إجابة صحيحة في اللعب الحر المحسوب أو الحملة.',
    albumLoot2: 'الثانية: البطاقة نفسها لكن في وضع آخر.',
    albumLoot3: 'الثالثة: صعوبة صعب أو هاردكور.',
    albumLoot4: 'الرابعة: جولة مثالية — كل الإجابات صحيحة.',
    albumLoot5: 'الخامسة: إنهاء جولة هاردكور.',
    albumLootNote: 'التعلّم ومدرب الأخطاء لا يسقطان طوابع. النسخ الجغرافية الزائدة تُصرف في الدولة.',
    albumLootNoteWorld: 'التعلّم ومدرب الأخطاء لا يسقطان طوابع. النسخ تبقى في ألبوم هذا العالم.',
  }),
  bn: row({
    albumLootTitle: 'কীভাবে পাওয়া যায়',
    albumLoot1: 'প্রথম কপি: স্কোর ফ্রি প্লে বা ক্যাম্পেইনে সঠিক উত্তর।',
    albumLoot2: 'দ্বিতীয়: একই কার্ড, কিন্তু অন্য মোডে।',
    albumLoot3: 'তৃতীয়: কঠিন বা হার্ডকোর কঠিনতা।',
    albumLoot4: 'চতুর্থ: পারফেক্ট রাউন্ড — সব উত্তর সঠিক।',
    albumLoot5: 'পঞ্চম: হার্ডকোর রাউন্ড শেষ করুন।',
    albumLootNote: 'শেখা ও ভুল ট্রেনার স্ট্যাম্প দেয় না। বাড়তি ভূগোল কপি রাষ্ট্রে খরচ হয়।',
    albumLootNoteWorld: 'শেখা ও ভুল ট্রেনার স্ট্যাম্প দেয় না। কপি এই বিশ্বের অ্যালবামে থাকে।',
  }),
  pt: row({
    albumLootTitle: 'Como obter',
    albumLoot1: 'Primeira cópia: acerto no jogo livre com pontuação ou na campanha.',
    albumLoot2: 'Segunda: a mesma carta, mas noutro modo.',
    albumLoot3: 'Terceira: dificuldade Difícil ou Hardcore.',
    albumLoot4: 'Quarta: ronda perfeita — todas as respostas certas.',
    albumLoot5: 'Quinta: terminar uma ronda Hardcore.',
    albumLootNote: 'Aprender e o treino de erros não dão selos. Cópias extra de geografia gastam-se no Estado.',
    albumLootNoteWorld: 'Aprender e o treino de erros não dão selos. As cópias ficam no álbum deste mundo.',
  }),
  ja: row({
    albumLootTitle: '集め方',
    albumLoot1: '1枚目：得点のあるフリープレイかキャンペーンで正解。',
    albumLoot2: '2枚目：同じカードを別モードで。',
    albumLoot3: '3枚目：むずかしい、またはハードコア。',
    albumLoot4: '4枚目：パーフェクト（全問正解）。',
    albumLoot5: '5枚目：ハードコアを最後まで。',
    albumLootNote: '学習と間違い練習では切手は出ません。余った地理コピーは国家で使えます。',
    albumLootNoteWorld: '学習と間違い練習では切手は出ません。コピーはこの世界のアルバムに残ります。',
  }),
  he: row({
    albumLootTitle: 'איך אוספים',
    albumLoot1: 'עותק ראשון: תשובה נכונה במשחק חופשי עם ניקוד או במסע.',
    albumLoot2: 'שני: אותה כרטיסיה, אבל במצב אחר.',
    albumLoot3: 'שלישי: רמת קושי קשה או הארדקור.',
    albumLoot4: 'רביעי: סבב מושלם — כל התשובות נכונות.',
    albumLoot5: 'חמישי: לסיים סבב הארדקור.',
    albumLootNote: 'למידה ומאמן הטעויות לא מפילים בולים. עותקי גיאו עודפים מוציאים במדינה.',
    albumLootNoteWorld: 'למידה ומאמן הטעויות לא מפילים בולים. העותקים נשארים באלבום של העולם הזה.',
  }),
}
