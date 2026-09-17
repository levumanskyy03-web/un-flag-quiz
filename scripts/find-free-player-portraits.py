#!/usr/bin/env python3
"""Find a freely licensed Commons photo for every footballer row.

Prefer a single-person portrait (face toward camera, cropped) over
match action, objects, plaques, gloves, or group shots.
"""

from __future__ import annotations

import json
import re
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROWS = ROOT / "src/data/footballPlayerRows.ts"
CACHE = ROOT / "scripts/.free-portraits.json"
UA = "PassportCountry/1.0 (https://www.geoguiz.online; levumanskyy03@gmail.com)"
COMMONS = "https://commons.wikimedia.org/w/api.php"
WIKI = "https://en.wikipedia.org/w/api.php"
WD = "https://www.wikidata.org/w/api.php"

SKIP = re.compile(
    r"logo|crest|kit\b|wordmark|flag of|signature|autograph|coat of arms|\.svg$"
    r"|glove|placa|huellas|worn boots|shirt of|figurita|museum display"
    r"|catwalk|fashion students|obsèques|funeral|prefeito|candidato"
    r"|con air|remplaçants|goalpost|empty (net|goal)",
    re.I,
)
GROUPY = re.compile(
    r" and | y [A-Z]| e [A-Z]| with a fan|class of 92|"
    r"team brazil|substitutes|obsèques|remplaçants",
    re.I,
)
STOP = {"de", "da", "do", "dos", "van", "von", "di", "da", "la", "el", "al", "the", "jr", "junior", "san"}


def fold(value: str) -> str:
    return "".join(
        char for char in unicodedata.normalize("NFD", value) if unicodedata.category(char) != "Mn"
    ).lower()


def classify(short: str, license_url: str, copyrighted: str) -> str | None:
    url = license_url.strip().lower()
    if any(part in url for part in ("/licenses/by-nc", "/licenses/by-nd", "/licenses/nc", "/licenses/nd")):
        return None
    if "publicdomain/zero" in url or "publicdomain/mark" in url:
        return "pd"
    if "/licenses/by-sa" in url:
        return "cc-by-sa"
    if "/licenses/by/" in url:
        return "cc-by"
    name = re.sub(r"[_-]+", " ", short.strip().lower())
    blob = f"{name} {url}"
    if not name and copyrighted.strip().lower() != "false":
        return None
    if re.search(r"fair\s*use|non\s*free|all rights reserved", blob):
        return None
    if re.search(r"\bnc\b|non\s*commercial", blob):
        return None
    if re.search(r"\bnd\b|no\s*deriv", blob):
        return None
    if (
        copyrighted.strip().lower() == "false"
        or name == "public domain"
        or name == "pd"
        or name.startswith("pd ")
        or "cc0" in name
        or "cc 0" in name
    ):
        return "pd"
    if name.startswith("cc by sa") or "attribution share alike" in name:
        return "cc-by-sa"
    if name.startswith("cc by") and " sa" not in name and "nc" not in name and "nd" not in name:
        return "cc-by"
    if any(token in name for token in ("gfdl", "gnu free documentation", "free art license", "fal")):
        return "cc-by-sa"
    if "copyleft/fdl" in url or "free-art-license" in url:
        return "cc-by-sa"
    return None


def request(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    last: Exception | None = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as res:
                return json.loads(res.read().decode("utf-8"))
        except Exception as error:  # noqa: BLE001
            last = error
            time.sleep(0.7 * (attempt + 1))
    raise last  # type: ignore[misc]


def meta(info: dict, key: str) -> str:
    field = (info.get("extmetadata") or {}).get(key) or {}
    value = field.get("value")
    return value if isinstance(value, str) else ""


def file_ok(title: str, info: dict) -> bool:
    name = title.replace("File:", "").replace("_", " ")
    if SKIP.search(name):
        return False
    media = (info.get("mediatype") or "").upper()
    if media and media not in {"BITMAP", "DRAWING"}:
        return False
    kind = classify(meta(info, "LicenseShortName"), meta(info, "LicenseUrl"), meta(info, "Copyrighted"))
    return kind is not None


def search_files(query: str, limit: int = 20) -> list[str]:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "formatversion": 2,
            "list": "search",
            "srsearch": query,
            "srnamespace": 6,
            "srlimit": limit,
        }
    )
    data = request(f"{COMMONS}?{params}")
    titles: list[str] = []
    for hit in data.get("query", {}).get("search", []):
        title = hit.get("title")
        if isinstance(title, str) and title.startswith("File:"):
            titles.append(title)
    return titles


def category_files(name: str, limit: int = 40) -> list[str]:
    titles: list[str] = []
    for cat in (name, f"{name} (footballer)", f"{name} (soccer)"):
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "format": "json",
                "formatversion": 2,
                "list": "categorymembers",
                "cmtitle": f"Category:{cat}",
                "cmtype": "file",
                "cmlimit": limit,
            }
        )
        try:
            data = request(f"{COMMONS}?{params}")
        except Exception:  # noqa: BLE001
            continue
        for hit in data.get("query", {}).get("categorymembers", []):
            title = hit.get("title")
            if isinstance(title, str) and title.startswith("File:"):
                titles.append(title)
        if titles:
            break
        time.sleep(0.08)
    return titles


def file_infos(titles: list[str]) -> dict[str, dict]:
    if not titles:
        return {}
    out: dict[str, dict] = {}
    for offset in range(0, len(titles), 8):
        chunk = titles[offset : offset + 8]
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "format": "json",
                "formatversion": 2,
                "redirects": 1,
                "titles": "|".join(chunk),
                "prop": "imageinfo",
                "iiprop": "url|size|extmetadata|mediatype",
                "iiurlwidth": 480,
            }
        )
        data = request(f"{COMMONS}?{params}")
        for page in data.get("query", {}).get("pages", []):
            title = page.get("title")
            info = (page.get("imageinfo") or [None])[0]
            if isinstance(title, str) and isinstance(info, dict):
                out[title] = info
        time.sleep(0.08)
    return out


def name_parts(name: str) -> list[str]:
    parts = re.findall(r"[A-Za-zÀ-ÿ']+", name)
    return [part for part in parts if part.lower() not in STOP and len(part) >= 2]


def name_matches(name: str, title: str) -> bool:
    file_name = fold(title)
    parts = [fold(part) for part in name_parts(name)]
    if not parts:
        return False
    last = parts[-1]
    if len(last) >= 4:
        return last in file_name
    return all(part in file_name for part in parts)


def looks_group(title: str, name: str) -> bool:
    file_name = title.replace("File:", "").replace("_", " ")
    if not GROUPY.search(file_name):
        return False
    other = fold(file_name)
    for part in name_parts(name):
        other = other.replace(fold(part), " ")
    leftover = re.findall(r"[a-z]{4,}", other)
    skip_tokens = {
        "cropped",
        "football",
        "soccer",
        "player",
        "portrait",
        "wikiportraits",
        "award",
        "best",
        "young",
        "world",
        "cup",
        "match",
        "training",
        "national",
        "team",
        "july",
        "june",
        "final",
        "receive",
        "respectively",
    }
    leftover = [token for token in leftover if token not in skip_tokens]
    return len(leftover) >= 2


def score(title: str, name: str, info: dict | None) -> int:
    file_name = fold(title)
    person = fold(name)
    points = 0
    if SKIP.search(title) or looks_group(title, name):
        return -200
    if not name_matches(name, title):
        return -100
    if person in file_name:
        points += 10
    parts = [fold(part) for part in name_parts(name)]
    if parts and parts[-1] in file_name:
        points += 4
    if "wikiportraits" in file_name:
        points += 8
    if "portrait" in file_name or "headshot" in file_name:
        points += 6
    if "cropped" in file_name:
        points += 5
    if file_name.endswith((".jpg", ".jpeg", ".png")):
        points += 1
    if GROUPY.search(title):
        points -= 25
    if info:
        width = int(info.get("width") or 0)
        height = int(info.get("height") or 0)
        if width and height:
            ratio = height / width
            if ratio >= 1.15:
                points += 8
            elif ratio >= 0.9:
                points += 3
            elif ratio < 0.7:
                points -= 6
            if min(width, height) < 200:
                points -= 8
    return points


def wiki_images(titles: list[str]) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {title: [] for title in titles}
    qids: list[str] = []
    title_by_qid: dict[str, str] = {}
    for offset in range(0, len(titles), 40):
        chunk = titles[offset : offset + 40]
        params = urllib.parse.urlencode(
            {
                "action": "query",
                "format": "json",
                "formatversion": 2,
                "redirects": 1,
                "titles": "|".join(chunk),
                "prop": "pageimages|pageprops",
                "piprop": "name",
                "ppprop": "wikibase_item",
            }
        )
        data = request(f"{WIKI}?{params}")
        redirects = {item["from"]: item["to"] for item in data.get("query", {}).get("redirects", [])}
        normalized = {item["from"]: item["to"] for item in data.get("query", {}).get("normalized", [])}
        pages = {page.get("title"): page for page in data.get("query", {}).get("pages", []) if page.get("title")}
        for requested in chunk:
            resolved = redirects.get(normalized.get(requested, requested), normalized.get(requested, requested))
            page = pages.get(resolved) or {}
            files: list[str] = []
            image = page.get("pageimage")
            if isinstance(image, str) and image:
                files.append(f"File:{image.replace('_', ' ')}")
            qid = (page.get("pageprops") or {}).get("wikibase_item")
            if isinstance(qid, str):
                qids.append(qid)
                title_by_qid[qid] = requested
            out[requested] = files
        time.sleep(0.12)
    for offset in range(0, len(qids), 40):
        chunk = qids[offset : offset + 40]
        params = urllib.parse.urlencode(
            {
                "action": "wbgetentities",
                "format": "json",
                "ids": "|".join(chunk),
                "props": "claims",
            }
        )
        entities = request(f"{WD}?{params}").get("entities", {})
        for qid, entity in entities.items():
            requested = title_by_qid.get(qid)
            if not requested:
                continue
            image = (((entity.get("claims") or {}).get("P18") or [{}])[0].get("mainsnak") or {}).get("datavalue") or {}
            value = image.get("value") if isinstance(image, dict) else None
            if isinstance(value, str) and value.strip():
                file_title = f"File:{value.strip().replace('_', ' ')}"
                if file_title not in out[requested]:
                    out[requested].insert(0, file_title)
        time.sleep(0.12)
    return out


def unique_titles(titles: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for title in titles:
        key = title.replace("_", " ")
        if key in seen:
            continue
        seen.add(key)
        out.append(title if title.startswith("File:") else f"File:{title}")
    return out


def pick_file(name: str, wiki: str, current: str | None, extra: list[str]) -> str | None:
    short = re.sub(r"\s*\([^)]*\)\s*$", "", wiki or name).strip()
    titles: list[str] = []
    for item in extra:
        if item:
            titles.append(item if item.startswith("File:") else f"File:{item}")
    if current:
        titles.append(f"File:{current}")
    try:
        titles.extend(category_files(short, 30))
    except Exception as error:  # noqa: BLE001
        print(f"  category fail {short}: {error}", flush=True)
    queries = []
    for query in (
        f'"{name}" footballer portrait',
        f'"{short}" WikiPortraits',
        f'"{name}" cropped footballer',
        f'"{short}" footballer',
        f'"{name}"',
    ):
        if query not in queries:
            queries.append(query)
    for query in queries:
        try:
            titles.extend(search_files(query, 16))
        except Exception as error:  # noqa: BLE001
            print(f"  search fail {query}: {error}", flush=True)
        time.sleep(0.12)
        if len(titles) > 80:
            break
    unique = unique_titles(titles)
    infos = file_infos(unique)
    ranked = sorted(unique, key=lambda title: score(title, name, infos.get(title)), reverse=True)
    for title in ranked:
        info = infos.get(title)
        if not info:
            continue
        if file_ok(title, info) and name_matches(name, title) and score(title, name, info) >= 4:
            return title.replace("File:", "").replace("_", " ")
    for title in ranked:
        info = infos.get(title)
        if info and file_ok(title, info) and name_matches(name, title) and not looks_group(title, name):
            return title.replace("File:", "").replace("_", " ")
    return None


def parse_rows(text: str) -> tuple[str, list[str]]:
    head, *bodies = text.split("\n  {\n")
    return head, bodies


def field(block: str, key: str) -> str | None:
    match = re.search(rf'\b{key}: "((?:\\.|[^"\\])*)"', block)
    return match.group(1) if match else None


def upsert_file(block: str, value: str) -> str:
    quoted = value.replace("\\", "\\\\").replace('"', '\\"')
    if re.search(r'\bwikiFile: "', block):
        return re.sub(r'\bwikiFile: "[^"]*"', f'wikiFile: "{quoted}"', block, count=1)
    after = "wiki" if re.search(r"\bwiki:", block) else "ru"
    return re.sub(rf"({after}: [^\n]+\n)", rf'\1    wikiFile: "{quoted}",\n', block, count=1)


FORCE = {
    "ronaldo",
    "robertocarlos",
    "sesko",
    "kahn",
    "mbappe",
    "modric",
    "eusebio",
    "romario",
    "distefano",
    "stoichkov",
    "scholes",
    "dalglish",
    "vandijk",
    "hojlund",
    "gabriel",
    "brahimdiaz",
    "emrecan",
    "otavio",
    "barrios",
    "pele",
    "gento",
    "kopa",
    "rummenigge",
    "balde",
    "casado",
    "baidoo",
    "araujo",
    "ericgarcia",
    "rovella",
    "laimer",
    "boey",
    "adeyemi",
    "onyedika",
    "akpa",
    "mykolenko",
    "capaldo",
    "heynen",
    "villasanti",
    "gittens",
    "politano",
    "rrahmani",
    "demirovic",
    "ioannidis",
    "karetsas",
    "colidio",
    "cristaldo",
}


def file_bad(name: str, current: str | None) -> bool:
    if not current:
        return True
    if SKIP.search(current) or looks_group(current, name):
        return True
    if not name_matches(name, current):
        return True
    return False


def main() -> None:
    cache: dict[str, str] = {}
    if CACHE.exists():
        cache = json.loads(CACHE.read_text())
    text = ROWS.read_text()
    head, bodies = parse_rows(text)
    rows: list[tuple[str, str, str, str | None]] = []
    for body in bodies:
        pid = field(body, "id") or ""
        en = field(body, "en") or pid
        wiki = field(body, "wiki") or en
        current = field(body, "wikiFile")
        rows.append((pid, en, wiki, current))

    wiki_titles = unique_titles_plain([wiki for _, _, wiki, _ in rows])
    print(f"wikipedia images for {len(wiki_titles)} titles", flush=True)
    extras = wiki_images(wiki_titles)

    found = 0
    missing: list[str] = []
    replaced: list[str] = []
    out: list[str] = []
    used: dict[str, str] = {}
    for index, body in enumerate(bodies, start=1):
        pid, en, wiki, current = rows[index - 1]
        chosen = cache.get(pid)
        if chosen and file_bad(en, chosen):
            chosen = None
        if pid in FORCE and chosen and chosen == current:
            chosen = None
        if chosen and chosen in used and used[chosen] != pid:
            chosen = None
        need = not chosen
        if need:
            print(f"{index}/{len(bodies)} {en}", flush=True)
            extra = extras.get(wiki, [])
            keep_current = current if current and not file_bad(en, current) and pid not in FORCE else None
            try:
                chosen = pick_file(en, wiki, keep_current, extra)
            except Exception as error:  # noqa: BLE001
                print(f"  pick fail {en}: {error}", flush=True)
                chosen = keep_current or cache.get(pid)
            if chosen:
                cache[pid] = chosen
                CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2))
                if chosen != current:
                    replaced.append(f"{pid}\t{en}\t{current or '-'}\t{chosen}")
        if chosen and chosen in used and used[chosen] != pid:
            print(f"  duplicate file {chosen}, searching again", flush=True)
            extra = extras.get(wiki, [])
            chosen = pick_file(en, wiki, None, extra)
            if chosen:
                cache[pid] = chosen
                CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2))
        if chosen:
            found += 1
            used[chosen] = pid
            body = upsert_file(body, chosen)
        else:
            missing.append(f"{pid}\t{en}")
        out.append(body)
    ROWS.write_text("\n  {\n".join([head, *out]))
    print(
        json.dumps(
            {
                "found": found,
                "total": len(bodies),
                "replaced_n": len(replaced),
                "replaced": replaced[:60],
                "missing": missing,
                "missing_n": len(missing),
            },
            ensure_ascii=False,
        )
    )


def unique_titles_plain(titles: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for title in titles:
        if title in seen:
            continue
        seen.add(title)
        out.append(title)
    return out


if __name__ == "__main__":
    main()
