#!/usr/bin/env python3
"""Active players: last catalog club vs Wikidata current club (no national teams)."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROWS = ROOT / "src/data/footballPlayerRows.ts"
CLUBS = ROOT / "src/data/footballClubs.ts"
UA = "PassportCountry/1.0 (https://www.geoguiz.online; levumanskyy03@gmail.com)"
SPARQL = "https://query.wikidata.org/sparql"

ALIASES = {
    "al hilal sfc": "alhilal",
    "al-hilal fc": "alhilal",
    "al nassr fc": "alnassr",
    "al-nassr fc": "alnassr",
    "al-ittihad club (jeddah)": "alittihad",
    "al ittihad club": "alittihad",
    "al sadd sc": "alsadd",
    "al-sadd sc": "alsadd",
    "galatasaray s.k. (football)": "galatasaray",
    "fenerbahçe s.k. (football)": "fenerbahce",
    "beşiktaş j.k.": "besiktas",
    "besiktas j.k.": "besiktas",
    "trabzonspor": "trabzonspor",
    "inter miami cf": "miami",
    "fc barcelona": "barca",
    "real madrid cf": "real",
    "manchester city f.c.": "mancity",
    "manchester united f.c.": "manutd",
    "liverpool f.c.": "liverpool",
    "chelsea f.c.": "chelsea",
    "arsenal f.c.": "arsenal",
    "tottenham hotspur f.c.": "tottenham",
    "aston villa f.c.": "villa",
    "ac milan": "milan",
    "inter milan": "inter",
    "ssc napoli": "napoli",
    "as roma": "roma",
    "juventus fc": "juve",
    "paris saint-germain fc": "psg",
    "fc bayern munich": "bayern",
    "borussia dortmund": "dortmund",
    "bayer 04 leverkusen": "leverkusen",
    "afc ajax": "ajax",
    "sl benfica": "benfica",
    "s.l. benfica": "benfica",
    "atlético madrid": "atletico",
    "club brugge kv": "brugge",
    "santos fc": "santos",
    "fluminense fc": "fluminense",
    "sc corinthians paulista": "corinthians",
    "cruzeiro ec": "cruzeiro",
    "grêmio fbpa": "gremio",
    "boca juniors": "boca",
    "club universitario de deportes": "universitario",
    "estudiantes de la plata": "estudiantes",
    "panathinaikos f.c.": "panathinaikos",
    "villarreal cf": "villarreal",
    "fc nantes": "nantes",
    "fc twente": "twente",
    "real sociedad": "realsociedad",
    "ogc nice": "nice",
    "west ham united f.c.": "westham",
    "crystal palace f.c.": "palace",
    "sunderland a.f.c.": "sunderland",
    "paris fc": "parisfc",
    "neom sc": "neom",
    "al-ahli saudi fc": "alahli",
    "al ahli saudi fc": "alahli",
    "al shabab club": "alshabab",
    "diriyah club": "diriyah",
    "atlanta united fc": "atlanta",
    "botafogo fr": "botafogo",
    "al jazira club": "aljazira",
    "sakaryaspor": "sakaryaspor",
    "bodrum f.k.": "bodrum",
    "paok fc": "paok",
    "hnk rijeka": "rijeka",
    "al wasl f.c.": "alwasl",
    "shabab al ahli club": "shababalahli",
    "rcd mallorca": "mallorca",
    "c.f. monterrey": "monterrey",
    "club américa": "america",
    "deportivo de a coruña": "deportivo",
    "rb leipzig": "leipzig",
    "birmingham city f.c.": "birmingham",
    "newcastle united f.c.": "newcastle",
    "stade rennais fc": "rennes",
    "cerro porteño": "cerro",
}


def request(url: str, extra: dict[str, str] | None = None) -> bytes:
    headers = {"User-Agent": UA, "Accept": "application/json"}
    if extra:
        headers.update(extra)
    req = urllib.request.Request(url, headers=headers)
    last: Exception | None = None
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=90) as res:
                return res.read()
        except Exception as error:  # noqa: BLE001
            last = error
            time.sleep(1.4 * (attempt + 1))
    raise last  # type: ignore[misc]


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


def field_arr(block: str, key: str) -> list[str]:
    match = re.search(rf"{key}: \[([^\]]*)\]", block)
    if not match:
        return []
    return re.findall(r'"([^"]+)"', match.group(1))


def catalog_clubs() -> dict[str, str]:
    text = CLUBS.read_text()
    wiki_to_id: dict[str, str] = {}
    for match in re.finditer(
        r"(\w+):\s*\{\s*id:\s*'[^']+',\s*nation:\s*'[^']+',\s*nameEn:\s*'(?:\\.|[^'])*',\s*nameRu:\s*'(?:\\.|[^'])*',\s*wiki:\s*'((?:\\.|[^'])*)'",
        text,
    ):
        wiki_to_id[match.group(2).replace("\\'", "'").lower()] = match.group(1)
    return wiki_to_id


def map_club(wiki: str, label: str, catalog: dict[str, str]) -> str | None:
    for raw in (wiki, label):
        key = raw.lower().strip()
        if not key:
            continue
        if key in catalog:
            return catalog[key]
        if key in ALIASES:
            return ALIASES[key]
    return None


def sparql(titles: list[str]) -> dict[str, list[tuple[str, str, str]]]:
    values = " ".join(f'"{title.replace(chr(34), "")}"@en' for title in titles)
    query = f"""
    SELECT ?wiki ?clubWiki ?clubLabel ?start WHERE {{
      VALUES ?wiki {{ {values} }}
      ?sitelink schema:about ?item ;
        schema:isPartOf <https://en.wikipedia.org/> ;
        schema:name ?wiki .
      ?item p:P54 ?stmt .
      ?stmt ps:P54 ?club .
      FILTER NOT EXISTS {{ ?stmt pq:P582 ?end }}
      OPTIONAL {{ ?stmt pq:P580 ?start }}
      FILTER NOT EXISTS {{ ?club wdt:P31/wdt:P279* wd:Q6979593 }}
      FILTER NOT EXISTS {{ ?club wdt:P31/wdt:P279* wd:Q1194951 }}
      OPTIONAL {{
        ?clublink schema:about ?club ;
          schema:isPartOf <https://en.wikipedia.org/> ;
          schema:name ?clubWiki .
      }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    url = SPARQL + "?" + urllib.parse.urlencode({"format": "json", "query": query})
    data = json.loads(request(url, {"Accept": "application/sparql-results+json"}))
    found: dict[str, list[tuple[str, str, str]]] = {}
    for row in data.get("results", {}).get("bindings", []):
        wiki = row["wiki"]["value"]
        club_wiki = (row.get("clubWiki") or {}).get("value") or ""
        club_label = (row.get("clubLabel") or {}).get("value") or ""
        start = (row.get("start") or {}).get("value") or ""
        found.setdefault(wiki, []).append((club_wiki.replace("_", " "), club_label, start))
    return found


def main() -> None:
    catalog = catalog_clubs()
    objs = parse_objects(ROWS)
    players = []
    for idx, block in enumerate(objs, 1):
        if field_str(block, "era") != "active":
            continue
        wiki = field_str(block, "wiki") or field_str(block, "en") or ""
        clubs = field_arr(block, "clubs")
        players.append(
            {
                "n": idx,
                "id": field_str(block, "id"),
                "en": field_str(block, "en"),
                "wiki": wiki,
                "last": clubs[-1] if clubs else None,
                "clubs": clubs,
            }
        )

    by_wiki: dict[str, list[tuple[str, str, str]]] = {}
    titles = [p["wiki"] for p in players if p["wiki"]]
    for offset in range(0, len(titles), 35):
        chunk = titles[offset : offset + 35]
        by_wiki.update(sparql(chunk))
        print(f"fetched {min(offset + 35, len(titles))}/{len(titles)}", flush=True)
        time.sleep(0.35)

    lines = []
    for player in players:
        hits = by_wiki.get(player["wiki"], [])
        mapped = []
        raw = []
        latest = None
        latest_start = ""
        for club_wiki, club_label, start in hits:
            cid = map_club(club_wiki, club_label, catalog)
            raw.append(f"{club_wiki or club_label} ({start[:10]})")
            if cid:
                mapped.append(cid)
            if start >= latest_start:
                latest_start = start
                latest = cid or (club_wiki or club_label)
        if not hits:
            kind = "missing"
        elif player["last"] in mapped:
            kind = "ok"
        else:
            kind = "mismatch"
        if kind != "ok":
            lines.append(
                f"{kind}\t{player['n']}\t{player['id']}\t{player['en']}\tours={player['last']}\twd_latest={latest}\tmapped={mapped}\traw={raw}"
            )

    out = ROOT / "scripts/player-club-audit.txt"
    out.write_text("\n".join(lines) + "\n")
    print(f"wrote {out} ({len(lines)} issues, {sum(1 for l in lines if l.startswith('mismatch'))} mismatch)")


if __name__ == "__main__":
    main()
