#!/usr/bin/env python3
"""Build public/football/squads/{id}.json from Wikidata P54 stints for GREAT_CLUBS."""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLUBS = ROOT / "src/data/footballClubs.ts"
GREAT = ROOT / "src/data/footballGreatClubs.ts"
ROWS = ROOT / "src/data/footballPlayerRows.ts"
OUT = ROOT / "public/football/squads"
UA = "PassportCountry/1.0 (https://www.geoguiz.online; levumanskyy03@gmail.com)"
SPARQL = "https://query.wikidata.org/sparql"
WD = "https://www.wikidata.org/w/api.php"
ENWIKI = "https://en.wikipedia.org/w/api.php"
YEAR_MIN = 1860
YEAR_MAX = 2026

POS_MAP = {
    "goalkeeper": "gk",
    "keeper": "gk",
    "defender": "df",
    "back": "df",
    "sweeper": "df",
    "midfielder": "mf",
    "midfield": "mf",
    "winger": "fw",
    "forward": "fw",
    "striker": "fw",
    "attacker": "fw",
}


def request(url: str, extra: dict[str, str] | None = None) -> bytes:
    headers = {"User-Agent": UA, "Accept": "application/json"}
    if extra:
        headers.update(extra)
    req = urllib.request.Request(url, headers=headers)
    last: Exception | None = None
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=120) as res:
                return res.read()
        except Exception as error:  # noqa: BLE001
            last = error
            time.sleep(1.6 * (attempt + 1))
    raise last  # type: ignore[misc]


def year_of(value: str) -> int | None:
    match = re.match(r"(-?\d{4})", value or "")
    if not match:
        return None
    year = int(match.group(1))
    if year < YEAR_MIN or year > YEAR_MAX:
        return None
    return year


def pos_of(label: str) -> str | None:
    blob = label.lower()
    for key, pos in POS_MAP.items():
        if key in blob:
            return pos
    return None


def parse_great_clubs() -> list[tuple[str, int]]:
    text = GREAT.read_text()
    return [(m.group(1), int(m.group(2))) for m in re.finditer(r"id:\s*'(\w+)',\s*founded:\s*(\d{4})", text)]


def club_wikis() -> dict[str, str]:
    text = CLUBS.read_text()
    found: dict[str, str] = {}
    for match in re.finditer(
        r"(\w+):\s*\{\s*id:\s*'[^']+',\s*nation:\s*'[^']+',\s*nameEn:\s*'(?:\\.|[^'])*',\s*nameRu:\s*'(?:\\.|[^'])*',\s*wiki:\s*'((?:\\.|[^'])*)'",
        text,
    ):
        found[match.group(1)] = match.group(2).replace("\\'", "'")
    return found


def parse_objects(path: Path) -> list[str]:
    text = path.read_text()
    start = text.find("[", text.find("export const FOOTBALL_PLAYER_ROWS"))
    body = text[start + 1 :]
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
    return objs


def field_str(block: str, key: str) -> str | None:
    match = re.search(rf'\b{key}: "([^"]*)"', block)
    return match.group(1) if match else None


def catalog_players() -> tuple[dict[str, str], dict[str, str]]:
    by_wiki: dict[str, str] = {}
    by_name: dict[str, str] = {}
    for block in parse_objects(ROWS):
        pid = field_str(block, "id")
        if not pid:
            continue
        en = (field_str(block, "en") or "").lower().strip()
        wiki = (field_str(block, "wiki") or field_str(block, "en") or "").replace("_", " ").lower().strip()
        if wiki:
            by_wiki[wiki] = pid
            bare = re.sub(r"\s*\([^)]*\)\s*$", "", wiki).strip()
            if bare:
                by_wiki.setdefault(bare, pid)
        if en:
            by_name[en] = pid
    return by_wiki, by_name


def qid_for_wiki(title: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "redirects": "1",
            "titles": title,
            "prop": "pageprops",
            "ppprop": "wikibase_item",
        }
    )
    data = json.loads(request(f"{ENWIKI}?{params}"))
    pages = (data.get("query") or {}).get("pages") or {}
    for page in pages.values():
        qid = ((page.get("pageprops") or {}).get("wikibase_item"))
        if qid:
            return qid
    wd_params = urllib.parse.urlencode(
        {
            "action": "wbgetentities",
            "sites": "enwiki",
            "titles": title,
            "props": "ids",
            "format": "json",
        }
    )
    data = json.loads(request(f"{WD}?{wd_params}"))
    entities = data.get("entities") or {}
    for key, entity in entities.items():
        if key.startswith("-"):
            continue
        qid = entity.get("id")
        if qid:
            return qid
    return None


def sparql_stints(qid: str) -> list[dict[str, str]]:
    query = f"""
    SELECT ?wiki ?playerLabel ?start ?end ?posLabel WHERE {{
      ?player p:P54 ?stmt .
      ?stmt ps:P54 wd:{qid} .
      OPTIONAL {{ ?stmt pq:P580 ?start }}
      OPTIONAL {{ ?stmt pq:P582 ?end }}
      OPTIONAL {{ ?stmt pq:P413 ?pos }}
      OPTIONAL {{
        ?sitelink schema:about ?player ;
          schema:isPartOf <https://en.wikipedia.org/> ;
          schema:name ?wiki .
      }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    try:
        return decode_stints(query)
    except json.JSONDecodeError:
        slim = f"""
        SELECT ?wiki ?playerLabel ?start ?end WHERE {{
          ?player p:P54 ?stmt .
          ?stmt ps:P54 wd:{qid} .
          OPTIONAL {{ ?stmt pq:P580 ?start }}
          OPTIONAL {{ ?stmt pq:P582 ?end }}
          OPTIONAL {{
            ?sitelink schema:about ?player ;
              schema:isPartOf <https://en.wikipedia.org/> ;
              schema:name ?wiki .
          }}
          SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
        }}
        """
        rows = decode_stints(slim)
        for row in rows:
            row["pos"] = ""
        return rows


def decode_stints(query: str) -> list[dict[str, str]]:
    url = SPARQL + "?" + urllib.parse.urlencode({"format": "json", "query": query})
    data = json.loads(request(url, {"Accept": "application/sparql-results+json"}))
    rows = []
    for row in data.get("results", {}).get("bindings", []):
        rows.append(
            {
                "wiki": (row.get("wiki") or {}).get("value") or "",
                "name": (row.get("playerLabel") or {}).get("value") or "",
                "start": (row.get("start") or {}).get("value") or "",
                "end": (row.get("end") or {}).get("value") or "",
                "pos": (row.get("posLabel") or {}).get("value") or "",
            }
        )
    return rows


def merge_stints(
    raw: list[dict[str, str]],
    by_wiki: dict[str, str],
    by_name: dict[str, str],
) -> list[dict]:
    seen: set[tuple] = set()
    stints: list[dict] = []
    for row in raw:
        wiki = row["wiki"].replace("_", " ").strip()
        name = row["name"].strip()
        if name.startswith("Q") and name[1:].isdigit():
            if not wiki:
                continue
            name = wiki
        if not name and not wiki:
            continue
        start = year_of(row["start"])
        end = year_of(row["end"])
        if start is None and end is None:
            continue
        key = (wiki.lower() or name.lower(), start, end)
        if key in seen:
            continue
        seen.add(key)
        catalog = None
        if wiki:
            catalog = by_wiki.get(wiki.lower()) or by_wiki.get(re.sub(r"\s*\([^)]*\)\s*$", "", wiki.lower()).strip())
        if not catalog:
            catalog = by_name.get(name.lower())
        item: dict = {"name": name or wiki}
        if wiki:
            item["wiki"] = wiki
        if catalog:
            item["id"] = catalog
        pos = pos_of(row["pos"])
        if pos:
            item["pos"] = pos
        if start is not None:
            item["from"] = start
        if end is not None:
            item["to"] = end
        stints.append(item)
    stints.sort(key=lambda row: (row.get("from") or 0, row["name"]))
    return stints


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    wikis = club_wikis()
    by_wiki, by_name = catalog_players()
    clubs = parse_great_clubs()
    if sys.argv[1:]:
        want = set(sys.argv[1:])
        clubs = [item for item in clubs if item[0] in want]
    print(f"clubs={len(clubs)} catalog={len(by_wiki)}", flush=True)
    for idx, (club_id, founded) in enumerate(clubs, 1):
        title = wikis.get(club_id)
        if not title:
            print(f"{idx}/{len(clubs)} {club_id} missing wiki", flush=True)
            continue
        qid = qid_for_wiki(title)
        if not qid:
            print(f"{idx}/{len(clubs)} {club_id} no qid for {title}", flush=True)
            (OUT / f"{club_id}.json").write_text(json.dumps({"clubId": club_id, "stints": []}, ensure_ascii=False) + "\n")
            continue
        try:
            raw = sparql_stints(qid)
        except Exception as error:  # noqa: BLE001
            print(f"{idx}/{len(clubs)} {club_id} sparql fail {error}", flush=True)
            time.sleep(2)
            try:
                raw = sparql_stints(qid)
            except Exception as retry_error:  # noqa: BLE001
                print(f"{idx}/{len(clubs)} {club_id} sparql retry fail {retry_error}", flush=True)
                raw = []
        stints = merge_stints(raw, by_wiki, by_name)
        payload = {"clubId": club_id, "qid": qid, "stints": stints}
        (OUT / f"{club_id}.json").write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n")
        linked = sum(1 for row in stints if "id" in row)
        print(f"{idx}/{len(clubs)} {club_id} {qid} stints={len(stints)} linked={linked} founded={founded}", flush=True)
        time.sleep(0.45)


if __name__ == "__main__":
    main()
