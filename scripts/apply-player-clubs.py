#!/usr/bin/env python3
"""Apply 2025+ current-club updates from scripts/player-club-audit.txt."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROWS = ROOT / "src/data/footballPlayerRows.ts"
CLUBS_TS = ROOT / "src/data/footballClubs.ts"
CLUBS_I18N = ROOT / "src/data/i18n/clubs.json"
AUDIT = ROOT / "scripts/player-club-audit.txt"

MANUAL = {
    "benzema": "alhilal",  # left Al-Hilal as free agent Aug 2026; last club is Al-Hilal not Al-Ittihad
}

NEW_CLUBS: dict[str, dict[str, str]] = {
    "trabzonspor": {
        "nation": "tr",
        "nameEn": "Trabzonspor",
        "nameRu": "Трабзонспор",
        "wiki": "Trabzonspor",
        "de": "Trabzonspor",
        "zh": "特拉布宗体育",
        "es": "Trabzonspor",
        "hi": "ट्रैबज़ोंस्पोर",
        "ar": "طرابزون سبور",
        "bn": "ট্রাবজনস্পোর",
        "pt": "Trabzonspor",
        "ja": "トラブゾンスポル",
        "he": "טרבזונספור",
    },
    "fenerbahce": {
        "nation": "tr",
        "nameEn": "Fenerbahçe",
        "nameRu": "Фенербахче",
        "wiki": "Fenerbahçe S.K. (football)",
        "de": "Fenerbahçe",
        "zh": "费内巴切",
        "es": "Fenerbahçe",
        "hi": "फेनरबहचे",
        "ar": "فنربخشة",
        "bn": "ফেনেরবাহচে",
        "pt": "Fenerbahçe",
        "ja": "フェネルバフチェ",
        "he": "פנרבחצ'ה",
    },
    "besiktas": {
        "nation": "tr",
        "nameEn": "Beşiktaş",
        "nameRu": "Бешикташ",
        "wiki": "Beşiktaş J.K.",
        "de": "Beşiktaş",
        "zh": "贝西克塔斯",
        "es": "Beşiktaş",
        "hi": "बेसिक्टास",
        "ar": "بشكتاش",
        "bn": "বেশিকতাশ",
        "pt": "Beşiktaş",
        "ja": "ベシクタシュ",
        "he": "בשיקטש",
    },
    "lafc": {
        "nation": "us",
        "nameEn": "Los Angeles FC",
        "nameRu": "Лос-Анджелес ФК",
        "wiki": "Los Angeles FC",
        "de": "Los Angeles FC",
        "zh": "洛杉矶FC",
        "es": "Los Angeles FC",
        "hi": "लॉस एंजेलिस एफसी",
        "ar": "لوس أنجلوس إف سي",
        "bn": "লস অ্যাঞ্জেলেস এফসি",
        "pt": "Los Angeles FC",
        "ja": "ロサンゼルスFC",
        "he": "לוס אנג'לס FC",
    },
    "chicagofire": {
        "nation": "us",
        "nameEn": "Chicago Fire",
        "nameRu": "Чикаго Файр",
        "wiki": "Chicago Fire FC",
        "de": "Chicago Fire",
        "zh": "芝加哥火焰",
        "es": "Chicago Fire",
        "hi": "शिकागो फ़ायर",
        "ar": "شيكاغو فاير",
        "bn": "শিকাগো ফায়ার",
        "pt": "Chicago Fire",
        "ja": "シカゴ・ファイアー",
        "he": "שיקגו פייר",
    },
    "orlando": {
        "nation": "us",
        "nameEn": "Orlando City",
        "nameRu": "Орландо Сити",
        "wiki": "Orlando City SC",
        "de": "Orlando City",
        "zh": "奥兰多城",
        "es": "Orlando City",
        "hi": "ऑरलैंडो सिटी",
        "ar": "أورلاندو سيتي",
        "bn": "অরল্যান্ডো সিটি",
        "pt": "Orlando City",
        "ja": "オーランド・シティ",
        "he": "אורלנדו סיטי",
    },
    "atlanta": {
        "nation": "us",
        "nameEn": "Atlanta United",
        "nameRu": "Атланта Юнайтед",
        "wiki": "Atlanta United FC",
        "de": "Atlanta United",
        "zh": "亚特兰大联",
        "es": "Atlanta United",
        "hi": "अटलांटा यूनाइटेड",
        "ar": "أتلانتا يونايتد",
        "bn": "আটলান্টা ইউনাইটেড",
        "pt": "Atlanta United",
        "ja": "アトランタ・ユナイテッド",
        "he": "אטלנטה יונייטד",
    },
    "burnley": {
        "nation": "eng",
        "nameEn": "Burnley",
        "nameRu": "Бернли",
        "wiki": "Burnley F.C.",
        "de": "Burnley",
        "zh": "伯恩利",
        "es": "Burnley",
        "hi": "बर्न्ली",
        "ar": "بيرنلي",
        "bn": "বার্নলি",
        "pt": "Burnley",
        "ja": "バーンリー",
        "he": "ברנלי",
    },
    "palace": {
        "nation": "eng",
        "nameEn": "Crystal Palace",
        "nameRu": "Кристал Пэлас",
        "wiki": "Crystal Palace F.C.",
        "de": "Crystal Palace",
        "zh": "水晶宫",
        "es": "Crystal Palace",
        "hi": "क्रिस्टल पैलेस",
        "ar": "كريستال بالاس",
        "bn": "ক্রিস্টাল প্যালেস",
        "pt": "Crystal Palace",
        "ja": "クリスタル・パレス",
        "he": "קריסטל פאלאס",
    },
    "sunderland": {
        "nation": "eng",
        "nameEn": "Sunderland",
        "nameRu": "Сандерленд",
        "wiki": "Sunderland A.F.C.",
        "de": "Sunderland",
        "zh": "桑德兰",
        "es": "Sunderland",
        "hi": "संडरलैंड",
        "ar": "سندرلاند",
        "bn": "সান্ডারল্যান্ড",
        "pt": "Sunderland",
        "ja": "サンダーランド",
        "he": "סנדרלנד",
    },
    "westham": {
        "nation": "eng",
        "nameEn": "West Ham",
        "nameRu": "Вест Хэм",
        "wiki": "West Ham United F.C.",
        "de": "West Ham United",
        "zh": "西汉姆联",
        "es": "West Ham",
        "hi": "वेस्ट हैम",
        "ar": "وست هام",
        "bn": "ওয়েস্ট হ্যাম",
        "pt": "West Ham",
        "ja": "ウェストハム",
        "he": "וסטהאם",
    },
    "birmingham": {
        "nation": "eng",
        "nameEn": "Birmingham City",
        "nameRu": "Бирмингем",
        "wiki": "Birmingham City F.C.",
        "de": "Birmingham City",
        "zh": "伯明翰城",
        "es": "Birmingham City",
        "hi": "बर्मिंघम सिटी",
        "ar": "برمنغهام سيتي",
        "bn": "বার্মিংহাম সিটি",
        "pt": "Birmingham City",
        "ja": "バーミンガム・シティ",
        "he": "בירמינגהאם",
    },
    "rennes": {
        "nation": "fr",
        "nameEn": "Rennes",
        "nameRu": "Ренн",
        "wiki": "Stade Rennais FC",
        "de": "Rennes",
        "zh": "雷恩",
        "es": "Rennes",
        "hi": "रेन",
        "ar": "رين",
        "bn": "রেন",
        "pt": "Rennes",
        "ja": "レンヌ",
        "he": "רן",
    },
    "parisfc": {
        "nation": "fr",
        "nameEn": "Paris FC",
        "nameRu": "Пари ФК",
        "wiki": "Paris FC",
        "de": "Paris FC",
        "zh": "巴黎FC",
        "es": "Paris FC",
        "hi": "पेरिस एफसी",
        "ar": "باريس إف سي",
        "bn": "প্যারিস এফসি",
        "pt": "Paris FC",
        "ja": "パリFC",
        "he": "פריז FC",
    },
    "leipzig": {
        "nation": "de",
        "nameEn": "RB Leipzig",
        "nameRu": "РБ Лейпциг",
        "wiki": "RB Leipzig",
        "de": "RB Leipzig",
        "zh": "莱比锡红牛",
        "es": "RB Leipzig",
        "hi": "आरबी लाइपज़िग",
        "ar": "آر بي لايبزيغ",
        "bn": "আরবি লাইপচিগ",
        "pt": "RB Leipzig",
        "ja": "RBライプツィヒ",
        "he": "רד בול לייפציג",
    },
    "neom": {
        "nation": "sa",
        "nameEn": "Neom",
        "nameRu": "Неом",
        "wiki": "Neom SC",
        "de": "Neom",
        "zh": "内奥姆",
        "es": "Neom",
        "hi": "नियोम",
        "ar": "نيوم",
        "bn": "নিওম",
        "pt": "Neom",
        "ja": "ネオム",
        "he": "נאום",
    },
    "alahli": {
        "nation": "sa",
        "nameEn": "Al-Ahli",
        "nameRu": "Аль-Ахли",
        "wiki": "Al-Ahli Saudi FC",
        "de": "Al-Ahli",
        "zh": "阿尔阿赫利",
        "es": "Al-Ahli",
        "hi": "अल-अहली",
        "ar": "الأهلي",
        "bn": "আল-আহলি",
        "pt": "Al-Ahli",
        "ja": "アル・アハリ",
        "he": "אל-אהלי",
    },
    "alshabab": {
        "nation": "sa",
        "nameEn": "Al-Shabab",
        "nameRu": "Аш-Шабаб",
        "wiki": "Al Shabab FC (Riyadh)",
        "de": "Al-Shabab",
        "zh": "阿尔沙巴布",
        "es": "Al-Shabab",
        "hi": "अल-शबाब",
        "ar": "الشباب",
        "bn": "আল-শাবাব",
        "pt": "Al-Shabab",
        "ja": "アル・シャバブ",
        "he": "אל-שבאב",
    },
    "diriyah": {
        "nation": "sa",
        "nameEn": "Diriyah",
        "nameRu": "Дирия",
        "wiki": "Diriyah Club",
        "de": "Diriyah",
        "zh": "迪里耶",
        "es": "Diriyah",
        "hi": "दिरियाह",
        "ar": "الدرعية",
        "bn": "দিরিয়া",
        "pt": "Diriyah",
        "ja": "ディリヤ",
        "he": "דיריה",
    },
    "alqadsiah": {
        "nation": "sa",
        "nameEn": "Al-Qadsiah",
        "nameRu": "Аль-Кадисия",
        "wiki": "Al-Qadsiah FC",
        "de": "Al-Qadsiah",
        "zh": "卡迪西亚",
        "es": "Al-Qadsiah",
        "hi": "अल-कादसियाह",
        "ar": "القادسية",
        "bn": "আল-কাদসিয়া",
        "pt": "Al-Qadsiah",
        "ja": "アル・カディシヤ",
        "he": "אל-קדיסיה",
    },
    "sakaryaspor": {
        "nation": "tr",
        "nameEn": "Sakaryaspor",
        "nameRu": "Сакарьяспор",
        "wiki": "Sakaryaspor",
        "de": "Sakaryaspor",
        "zh": "萨卡里亚体育",
        "es": "Sakaryaspor",
        "hi": "सकार्यास्पोर",
        "ar": "ساكاريا سبور",
        "bn": "সাকারিয়াস্পোর",
        "pt": "Sakaryaspor",
        "ja": "サカリヤスポル",
        "he": "סאקריאספור",
    },
    "bodrum": {
        "nation": "tr",
        "nameEn": "Bodrum FK",
        "nameRu": "Бодрум",
        "wiki": "Bodrum F.K.",
        "de": "Bodrum FK",
        "zh": "博德鲁姆",
        "es": "Bodrum FK",
        "hi": "बोद्रुम",
        "ar": "بودروم",
        "bn": "বোদ্রুম",
        "pt": "Bodrum FK",
        "ja": "ボドルム",
        "he": "בודרום",
    },
    "aljazira": {
        "nation": "ae",
        "nameEn": "Al Jazira",
        "nameRu": "Аль-Джазира",
        "wiki": "Al Jazira Club",
        "de": "Al Jazira",
        "zh": "贾济拉",
        "es": "Al Jazira",
        "hi": "अल जज़ीरा",
        "ar": "الجزيرة",
        "bn": "আল জাজিরা",
        "pt": "Al Jazira",
        "ja": "アル・ジャジーラ",
        "he": "אל-ג'זירה",
    },
    "alwasl": {
        "nation": "ae",
        "nameEn": "Al Wasl",
        "nameRu": "Аль-Васл",
        "wiki": "Al Wasl F.C.",
        "de": "Al Wasl",
        "zh": "瓦斯尔",
        "es": "Al Wasl",
        "hi": "अल वासल",
        "ar": "الوصل",
        "bn": "আল ওয়াসল",
        "pt": "Al Wasl",
        "ja": "アル・ワスル",
        "he": "אל-ואסל",
    },
    "shababalahli": {
        "nation": "ae",
        "nameEn": "Shabab Al Ahli",
        "nameRu": "Шабаб Аль-Ахли",
        "wiki": "Shabab Al Ahli Club",
        "de": "Shabab Al Ahli",
        "zh": "青年阿赫利",
        "es": "Shabab Al Ahli",
        "hi": "शबाब अल अहली",
        "ar": "شباب الأهلي",
        "bn": "শাবাব আল আহলি",
        "pt": "Shabab Al Ahli",
        "ja": "シャバーブ・アル・アハリ",
        "he": "שבאב אל-אהלי",
    },
    "sanfrecce": {
        "nation": "jp",
        "nameEn": "Sanfrecce Hiroshima",
        "nameRu": "Санфречче Хиросима",
        "wiki": "Sanfrecce Hiroshima",
        "de": "Sanfrecce Hiroshima",
        "zh": "广岛三箭",
        "es": "Sanfrecce Hiroshima",
        "hi": "सानफ्रेच्चे हिरोशिमा",
        "ar": "سانفريتشي هيروشيما",
        "bn": "সানফ্রেচে হিরোশিমা",
        "pt": "Sanfrecce Hiroshima",
        "ja": "サンフレッチェ広島",
        "he": "סנפרצ'ה הירושימה",
    },
    "clubamerica": {
        "nation": "mx",
        "nameEn": "Club América",
        "nameRu": "Америка",
        "wiki": "Club América",
        "de": "Club América",
        "zh": "美洲俱乐部",
        "es": "Club América",
        "hi": "क्लब अमेरिका",
        "ar": "كلوب أمريكا",
        "bn": "ক্লাব আমেরিকা",
        "pt": "Club América",
        "ja": "クラブ・アメリカ",
        "he": "קלאב אמריקה",
    },
    "monterrey": {
        "nation": "mx",
        "nameEn": "Monterrey",
        "nameRu": "Монтеррей",
        "wiki": "C.F. Monterrey",
        "de": "Monterrey",
        "zh": "蒙特雷",
        "es": "Monterrey",
        "hi": "मोंटेरे",
        "ar": "مونتيري",
        "bn": "মন্টেরি",
        "pt": "Monterrey",
        "ja": "モンテレイ",
        "he": "מונטריי",
    },
}

UNMAPPED = {
    "Chicago Fire FC": "chicagofire",
    "Los Angeles FC": "lafc",
    "Orlando City SC": "orlando",
    "Burnley F.C.": "burnley",
    "Al Qadsiah FC": "alqadsiah",
    "Sanfrecce Hiroshima": "sanfrecce",
}


def parse_audit() -> dict[str, str]:
    updates: dict[str, str] = {}
    for line in AUDIT.read_text().splitlines():
        if not line.startswith("mismatch\t"):
            continue
        parts = line.split("\t")
        pid = parts[2]
        raw = parts[-1]
        # raw=['Trabzonspor (2026-08-06)']
        hits = re.findall(r"'([^']+) \((\d{4}-\d{2}-\d{2}|)\)'", raw)
        dated = [(name, date) for name, date in hits if date and date[:4] >= "2025"]
        if not dated:
            continue
        dated.sort(key=lambda item: item[1])
        latest_name = dated[-1][0]
        mapped = re.search(r"mapped=\[([^\]]*)\]", line)
        mapped_ids = re.findall(r"'([^']+)'", mapped.group(1) if mapped else "")
        # pick mapped id whose raw name matches latest, else last mapped with latest start
        chosen = None
        aliases = {
            "trabzonspor": "trabzonspor",
            "fenerbahçe s.k. (football)": "fenerbahce",
            "beşiktaş j.k.": "besiktas",
            "al hilal sfc": "alhilal",
            "al-nassr fc": "alnassr",
            "al-ittihad club (jeddah)": "alittihad",
            "al sadd sc": "alsadd",
            "crystal palace f.c.": "palace",
            "sunderland a.f.c.": "sunderland",
            "stade rennais fc": "rennes",
            "paris fc": "parisfc",
            "neom sc": "neom",
            "al-ahli saudi fc": "alahli",
            "al shabab club": "alshabab",
            "diriyah club": "diriyah",
            "atlanta united fc": "atlanta",
            "sakaryaspor": "sakaryaspor",
            "al jazira club": "aljazira",
            "bodrum f.k.": "bodrum",
            "shabab al ahli club": "shababalahli",
            "al wasl f.c.": "alwasl",
            "west ham united f.c.": "westham",
            "rb leipzig": "leipzig",
            "birmingham city f.c.": "birmingham",
            "club américa": "clubamerica",
            "c.f. monterrey": "monterrey",
            "los angeles fc": "lafc",
            "chicago fire fc": "chicagofire",
            "orlando city sc": "orlando",
            "burnley f.c.": "burnley",
            "al qadsiah fc": "alqadsiah",
            "sanfrecce hiroshima": "sanfrecce",
        }
        key = latest_name.lower()
        if key in aliases:
            chosen = aliases[key]
        elif latest_name in UNMAPPED:
            chosen = UNMAPPED[latest_name]
        elif mapped_ids:
            # if only one dated mapped club, use the latest dated among mapped by matching names loosely
            chosen = mapped_ids[-1]
            for mid in mapped_ids:
                if mid in latest_name.lower().replace(" ", "").replace("-", "") or mid in key:
                    chosen = mid
        remap = {"america": "clubamerica"}
        if chosen:
            updates[pid] = remap.get(chosen, chosen)
    updates.update(MANUAL)
    return updates


def set_clubs(block: str, new_last: str) -> str:
    match = re.search(r"clubs: \[([^\]]*)\]", block)
    if not match:
        return block
    clubs = re.findall(r'"([^"]+)"', match.group(1))
    if not clubs:
        return block
    if clubs[-1] == new_last:
        return block
    # Neymar-style return: keep history, append current even if it appeared earlier.
    # Drop a false current (never-played last stop) when replacing with a different 2025+ club
    # if that last stop is a "destination" that WD replaced.
    clubs = clubs + [new_last]
    rendered = ", ".join(f'"{item}"' for item in clubs)
    return block[: match.start()] + f"clubs: [{rendered}]" + block[match.end() :]


def split_rows(text: str) -> tuple[str, list[str], str]:
    marker = "export const FOOTBALL_PLAYER_ROWS: FootballPlayerRow[] = ["
    idx = text.find(marker)
    head = text[: idx + len(marker)]
    rest = text[idx + len(marker) :]
    # last closing
    end = rest.rfind("]")
    body, tail = rest[:end], rest[end:]
    objs: list[str] = []
    i = 0
    while True:
        j = body.find("{", i)
        if j < 0:
            break
        depth = 0
        for k in range(j, len(body)):
            if body[k] == "{":
                depth += 1
            elif body[k] == "}":
                depth -= 1
                if depth == 0:
                    objs.append(body[j : k + 1])
                    i = k + 1
                    break
        else:
            break
    between = []
    cursor = 0
    pieces = []
    # reconstruct with original separators: keep prefix before first { and between objects
    first = body.find("{")
    prefix = body[:first]
    seps = []
    pos = 0
    for obj in objs:
        at = body.find(obj, pos)
        seps.append(body[pos:at])
        pos = at + len(obj)
    suffix = body[pos:]
    return head, objs, prefix, seps, suffix, tail


def main() -> None:
    updates = parse_audit()
    # Kanté never played for Al-Hilal: keep chelsea then alittihad path by replacing last before append
    text = ROWS.read_text()
    marker = "export const FOOTBALL_PLAYER_ROWS: FootballPlayerRow[] = ["
    idx = text.find(marker)
    head = text[: idx + len(marker)]
    rest = text[idx + len(marker) :]
    end = rest.rfind("\n]")
    body, tail = rest[:end], rest[end:]

    changed = 0
    needed_clubs = set()

    def patch_object(obj: str) -> str:
        nonlocal changed
        pid = re.search(r'id: "([^"]+)"', obj)
        if not pid or pid.group(1) not in updates:
            return obj
        new_last = updates[pid.group(1)]
        needed_clubs.add(new_last)
        match = re.search(r"clubs: \[([^\]]*)\]", obj)
        if not match:
            return obj
        clubs = re.findall(r'"([^"]+)"', match.group(1))
        if clubs[-1] == new_last:
            return obj
        # known false last clubs
        if pid.group(1) == "kante" and clubs[-1] == "alhilal":
            clubs[-1] = "alittihad"
        if pid.group(1) == "salah" and clubs[-1] == "alittihad":
            clubs[-1] = new_last
            rendered = ", ".join(f'"{item}"' for item in clubs)
            changed += 1
            return obj[: match.start()] + f"clubs: [{rendered}]" + obj[match.end() :]
        clubs.append(new_last)
        rendered = ", ".join(f'"{item}"' for item in clubs)
        changed += 1
        return obj[: match.start()] + f"clubs: [{rendered}]" + obj[match.end() :]

    # walk objects
    out_body = []
    i = 0
    while True:
        j = body.find("{", i)
        if j < 0:
            out_body.append(body[i:])
            break
        out_body.append(body[i:j])
        depth = 0
        for k in range(j, len(body)):
            if body[k] == "{":
                depth += 1
            elif body[k] == "}":
                depth -= 1
                if depth == 0:
                    obj = body[j : k + 1]
                    out_body.append(patch_object(obj))
                    i = k + 1
                    break
        else:
            out_body.append(body[j:])
            break

    ROWS.write_text(head + "".join(out_body) + tail)
    print(f"updated {changed} players, {len(updates)} planned")

    # add clubs
    clubs_ts = CLUBS_TS.read_text()
    i18n = json.loads(CLUBS_I18N.read_text())
    added = 0
    insert_at = clubs_ts.rfind("\n}")
    # FOOTBALL_CLUBS object ends at first `\n}` after dnipro - the Record closer
    rec_end = clubs_ts.find("\n}\n\nexport function footballClub")
    block = ""
    for cid, meta in NEW_CLUBS.items():
        if f"  {cid}:" in clubs_ts:
            continue
        if cid not in needed_clubs:
            continue
        wiki = meta["wiki"].replace("'", "\\'")
        name_en = meta["nameEn"].replace("'", "\\'")
        name_ru = meta["nameRu"].replace("'", "\\'")
        block += (
            f"  {cid}: {{ id: '{cid}', nation: '{meta['nation']}', "
            f"nameEn: '{name_en}', nameRu: '{name_ru}', wiki: '{wiki}' }},\n"
        )
        i18n[cid] = {k: meta[k] for k in ("de", "zh", "es", "hi", "ar", "bn", "pt", "ja", "he")}
        added += 1
    if block:
        clubs_ts = clubs_ts[:rec_end] + "\n" + block.rstrip("\n") + clubs_ts[rec_end:]
        CLUBS_TS.write_text(clubs_ts)
        CLUBS_I18N.write_text(json.dumps(i18n, ensure_ascii=False, indent=2) + "\n")
    print(f"added {added} clubs")
    missing = sorted(c for c in needed_clubs if c not in NEW_CLUBS and f"  {c}:" not in Path(CLUBS_TS).read_text())
    if missing:
        print("still missing club defs", missing)


if __name__ == "__main__":
    main()
