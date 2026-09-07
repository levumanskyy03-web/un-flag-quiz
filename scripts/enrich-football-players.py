#!/usr/bin/env python3
"""Fill wiki titles and card fields from Wikidata / English Wikipedia."""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROWS = ROOT / "src/data/footballPlayerRows.ts"
UA = "PassportCountry/1.0 (https://un-flag-quiz.vercel.app; levumanskyy03@gmail.com)"
SPARQL = "https://query.wikidata.org/sparql"
WIKI = "https://en.wikipedia.org/w/api.php"
WD = "https://www.wikidata.org/w/api.php"

LEFT = {"Q1281916"}
RIGHT = {"Q1281912"}
BOTH = {"Q14565199", "Q1627714"}


def request(url: str, extra: dict[str, str] | None = None) -> bytes:
    headers = {"User-Agent": UA, "Accept": "application/json"}
    if extra:
        headers.update(extra)
    req = urllib.request.Request(url, headers=headers)
    last: Exception | None = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=45) as res:
                return res.read()
        except Exception as error:  # noqa: BLE001
            last = error
            time.sleep(0.8 * (attempt + 1))
    raise last  # type: ignore[misc]


def wiki_file_name(value: str) -> str | None:
    raw = value.strip()
    if not raw:
        return None
    if "FilePath/" in raw:
        raw = raw.split("FilePath/", 1)[1]
    raw = urllib.parse.unquote(raw).replace("_", " ")
    raw = re.sub(r"^File:", "", raw, flags=re.I)
    if "/" in raw or ".." in raw:
        return None
    return raw or None


def height_cm(value: object) -> int | None:
    try:
        number = float(str(value).replace(",", "."))
    except ValueError:
        return None
    if 1.2 <= number <= 2.4:
        number *= 100
    cm = int(round(number))
    return cm if 140 <= cm <= 220 else None


def parse_rows(text: str) -> tuple[str, list[str]]:
    head, *bodies = text.split("\n  {\n")
    return head, bodies


def field_str(block: str, key: str) -> str | None:
    match = re.search(rf'\b{key}: "([^"]*)"', block)
    return match.group(1) if match else None


def field_int(block: str, key: str) -> int | None:
    match = re.search(rf"\b{key}: (\d+)", block)
    return int(match.group(1)) if match else None


def sparql_chunk(pairs: list[tuple[str, int]]) -> dict[tuple[str, int], dict[str, object]]:
    values = " ".join(
        f'( "{name.replace(chr(34), "")}"@en {year} )' for name, year in pairs
    )
    query = f"""
    SELECT ?name ?year ?wiki ?image ?height ?caps ?goals ?death ?foot WHERE {{
      VALUES (?name ?year) {{ {values} }}
      ?item rdfs:label ?name .
      ?item wdt:P31 wd:Q5 .
      ?item wdt:P569 ?dob .
      FILTER(YEAR(?dob) = ?year)
      OPTIONAL {{
        ?sitelink schema:about ?item ;
          schema:isPartOf <https://en.wikipedia.org/> ;
          schema:name ?wiki .
      }}
      OPTIONAL {{ ?item wdt:P18 ?image . }}
      OPTIONAL {{ ?item wdt:P2048 ?height . }}
      OPTIONAL {{ ?item wdt:P1350 ?caps . }}
      OPTIONAL {{ ?item wdt:P1351 ?goals . }}
      OPTIONAL {{ ?item wdt:P570 ?death . }}
      OPTIONAL {{ ?item wdt:P423 ?foot . }}
    }}
    """
    url = SPARQL + "?" + urllib.parse.urlencode({"format": "json", "query": query})
    data = json.loads(request(url, {"Accept": "application/sparql-results+json"}))
    found: dict[tuple[str, int], dict[str, object]] = {}
    for row in data.get("results", {}).get("bindings", []):
        name = row["name"]["value"]
        year = int(float(row["year"]["value"]))
        key = (name, year)
        hit = found.setdefault(key, {})
        if "wiki" in row:
            hit["wiki"] = row["wiki"]["value"].replace("_", " ")
        if "image" in row:
            hit["wikiFile"] = wiki_file_name(row["image"]["value"])
        if "height" in row:
            hit["heightCm"] = height_cm(row["height"]["value"])
        if "caps" in row:
            try:
                hit["caps"] = int(float(row["caps"]["value"]))
            except ValueError:
                pass
        if "goals" in row:
            try:
                hit["intlGoals"] = int(float(row["goals"]["value"]))
            except ValueError:
                pass
        if "death" in row:
            death = row["death"]["value"]
            match = re.match(r"(\d{4})", death)
            if match:
                hit["died"] = int(match.group(1))
        if "foot" in row:
            qid = row["foot"]["value"].rsplit("/", 1)[-1]
            if qid in BOTH:
                hit["foot"] = "both"
            elif qid in LEFT:
                hit["foot"] = "left"
            elif qid.startswith("Q"):
                hit["foot"] = "right"
    return found


def wiki_search(name: str, year: int) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": f"{name} {year} footballer",
            "srlimit": 1,
            "srnamespace": 0,
        }
    )
    data = json.loads(request(f"{WIKI}?{params}"))
    hits = data.get("query", {}).get("search", [])
    if not hits:
        return None
    title = hits[0].get("title")
    return title if isinstance(title, str) else None


def wiki_entities(titles: list[str]) -> dict[str, dict[str, object]]:
    if not titles:
        return {}
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "formatversion": 2,
            "redirects": 1,
            "titles": "|".join(titles),
            "prop": "pageprops|pageimages",
            "piprop": "name",
            "ppprop": "wikibase_item",
        }
    )
    data = json.loads(request(f"{WIKI}?{params}"))
    pages = data.get("query", {}).get("pages", [])
    out: dict[str, dict[str, object]] = {}
    qids: list[str] = []
    title_by_qid: dict[str, str] = {}
    for page in pages:
        title = page.get("title")
        if not title or page.get("missing"):
            continue
        item: dict[str, object] = {"wiki": title}
        if page.get("pageimage"):
            item["wikiFile"] = wiki_file_name(str(page["pageimage"]))
        qid = (page.get("pageprops") or {}).get("wikibase_item")
        if qid:
            qids.append(qid)
            title_by_qid[qid] = title
        out[title] = item
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
        entities = json.loads(request(f"{WD}?{params}")).get("entities", {})
        for qid, entity in entities.items():
            title = title_by_qid.get(qid)
            if not title or title not in out:
                continue
            claims = entity.get("claims") or {}
            out[title].update(claims_fields(claims))
    return out


def claim_amount(claims: dict, prop: str) -> object | None:
    group = claims.get(prop) or []
    if not group:
        return None
    mainsnak = group[0].get("mainsnak") or {}
    datavalue = (mainsnak.get("datavalue") or {}).get("value")
    if isinstance(datavalue, dict) and "amount" in datavalue:
        return datavalue.get("amount")
    return None


def claim_year(claims: dict, prop: str) -> int | None:
    group = claims.get(prop) or []
    if not group:
        return None
    mainsnak = group[0].get("mainsnak") or {}
    datavalue = (mainsnak.get("datavalue") or {}).get("value")
    if not isinstance(datavalue, dict):
        return None
    time = str(datavalue.get("time") or "")
    match = re.search(r"(\d{4})", time)
    return int(match.group(1)) if match else None


def claim_item(claims: dict, prop: str) -> str | None:
    group = claims.get(prop) or []
    if not group:
        return None
    mainsnak = group[0].get("mainsnak") or {}
    datavalue = (mainsnak.get("datavalue") or {}).get("value")
    if isinstance(datavalue, dict):
        return datavalue.get("id")
    return None


def claims_fields(claims: dict) -> dict[str, object]:
    out: dict[str, object] = {}
    image = claims.get("P18") or []
    if image:
        datavalue = ((image[0].get("mainsnak") or {}).get("datavalue") or {}).get("value")
        if isinstance(datavalue, str):
            named = wiki_file_name(datavalue)
            if named:
                out["wikiFile"] = named
    height = height_cm(claim_amount(claims, "P2048") or "")
    if height:
        out["heightCm"] = height
    caps = claim_amount(claims, "P1350")
    if caps is not None:
        try:
            out["caps"] = int(float(str(caps).replace("+", "")))
        except ValueError:
            pass
    goals = claim_amount(claims, "P1351")
    if goals is not None:
        try:
            out["intlGoals"] = int(float(str(goals).replace("+", "")))
        except ValueError:
            pass
    died = claim_year(claims, "P570")
    if died:
        out["died"] = died
    foot_id = claim_item(claims, "P423")
    if foot_id in BOTH:
        out["foot"] = "both"
    elif foot_id in LEFT:
        out["foot"] = "left"
    elif foot_id:
        out["foot"] = "right"
    return out


def insert_after(block: str, after_key: str, line: str) -> str:
    pattern = rf"({after_key}: [^\n]+\n)"
    if re.search(pattern, block):
        return re.sub(pattern, rf"\1    {line}\n", block, count=1)
    return block


def upsert_string(block: str, key: str, value: str, after: str) -> str:
    quoted = value.replace("\\", "\\\\").replace('"', '\\"')
    if re.search(rf'\b{key}: "', block):
        return re.sub(rf'\b{key}: "[^"]*"', f'{key}: "{quoted}"', block, count=1)
    return insert_after(block, after, f'{key}: "{quoted}",')


def upsert_int(block: str, key: str, value: int, after: str) -> str:
    if re.search(rf"\b{key}: \d+", block):
        return re.sub(rf"\b{key}: \d+", f"{key}: {value}", block, count=1)
    return insert_after(block, after, f"{key}: {value},")


def upsert_foot(block: str, value: str) -> str:
    if re.search(r'\bfoot: "', block):
        return re.sub(r'\bfoot: "(left|right|both)"', f'foot: "{value}"', block, count=1)
    return insert_after(block, "heightCm", f'foot: "{value}",')


def apply_hit(block: str, hit: dict[str, object], en: str) -> str:
    wiki = hit.get("wiki")
    if isinstance(wiki, str) and wiki and wiki != en:
        block = upsert_string(block, "wiki", wiki, "ru")
    wiki_file = hit.get("wikiFile")
    if isinstance(wiki_file, str) and wiki_file:
        after = "wiki" if "wiki:" in block else "ru"
        block = upsert_string(block, "wikiFile", wiki_file, after)
    if hit.get("heightCm") and field_int(block, "heightCm") is None:
        block = upsert_int(block, "heightCm", int(hit["heightCm"]), "era")
    if hit.get("caps") and field_int(block, "caps") is None:
        after = "number" if "number:" in block else "heightCm"
        block = upsert_int(block, "caps", int(hit["caps"]), after)
    if hit.get("intlGoals") and field_int(block, "intlGoals") is None:
        after = "caps" if "caps:" in block else "number"
        block = upsert_int(block, "intlGoals", int(hit["intlGoals"]), after)
    if hit.get("died") and field_int(block, "died") is None:
        block = upsert_int(block, "died", int(hit["died"]), "born")
    if hit.get("foot") and not re.search(r'\bfoot: "', block):
        block = upsert_foot(block, str(hit["foot"]))
    return block


def main() -> None:
    text = ROWS.read_text()
    head, bodies = parse_rows(text)
    players: list[tuple[str, str, int]] = []
    for body in bodies:
        en = field_str(body, "en") or ""
        born = field_int(body, "born") or 0
        players.append((field_str(body, "id") or "", en, born))

    found: dict[tuple[str, int], dict[str, object]] = {}
    unique_pairs = list(dict.fromkeys((en, born) for _, en, born in players if en and born))
    for offset in range(0, len(unique_pairs), 25):
        chunk = unique_pairs[offset : offset + 25]
        try:
            found.update(sparql_chunk(chunk))
            print(f"sparql {offset + len(chunk)}/{len(unique_pairs)} hits={len(found)}", flush=True)
        except Exception as error:  # noqa: BLE001
            print(f"sparql chunk failed {offset}: {error}", flush=True)
        time.sleep(0.4)

    missing = [(en, born) for en, born in unique_pairs if (en, born) not in found or not found[(en, born)].get("wiki")]
    searched: dict[str, str] = {}
    for index, (en, born) in enumerate(missing, start=1):
        try:
            title = wiki_search(en, born)
        except Exception as error:  # noqa: BLE001
            print(f"search fail {en}: {error}", flush=True)
            title = None
        if title:
            searched[en] = title
            found.setdefault((en, born), {})["wiki"] = title
        if index % 25 == 0:
            print(f"search {index}/{len(missing)}", flush=True)
        time.sleep(0.12)

    titles = [title for title in searched.values() if title]
    extra: dict[str, dict[str, object]] = {}
    for offset in range(0, len(titles), 40):
        extra.update(wiki_entities(titles[offset : offset + 40]))
        time.sleep(0.2)
    for (en, born), hit in list(found.items()):
        title = hit.get("wiki")
        if isinstance(title, str) and title in extra:
            merged = dict(extra[title])
            merged.update({k: v for k, v in hit.items() if v})
            found[(en, born)] = merged

    out_bodies = []
    filled_wiki = 0
    for body, (_pid, en, born) in zip(bodies, players):
        hit = found.get((en, born), {})
        if hit.get("wiki"):
            filled_wiki += 1
        out_bodies.append(apply_hit(body, hit, en))
    ROWS.write_text("\n  {\n".join([head, *out_bodies]))
    print(json.dumps({"wiki_hits": filled_wiki, "sparql": len(found), "rows": len(bodies)}))


if __name__ == "__main__":
    main()
