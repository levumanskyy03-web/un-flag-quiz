#!/usr/bin/env python3
"""Build UN-member ranking orders from IMF WEO, passports, and Wikipedia tables."""
from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UA = "PassportCountry/1.0 (https://un-flag-quiz.vercel.app; levumanskyy03@gmail.com)"

ALIASES = {
    "united states": "us",
    "united states of america": "us",
    "usa": "us",
    "uk": "gb",
    "united kingdom": "gb",
    "great britain": "gb",
    "united kingdom of great britain and northern ireland": "gb",
    "russia": "ru",
    "russian federation": "ru",
    "south korea": "kr",
    "korea, south": "kr",
    "korea, republic of": "kr",
    "republic of korea": "kr",
    "north korea": "kp",
    "korea, north": "kp",
    "korea, democratic people's republic of": "kp",
    "democratic people's republic of korea": "kp",
    "czechia": "cz",
    "czech republic": "cz",
    "turkey": "tr",
    "türkiye": "tr",
    "turkiye": "tr",
    "ivory coast": "ci",
    "cote d'ivoire": "ci",
    "côte d'ivoire": "ci",
    "côte d’ivoire": "ci",
    "congo, democratic republic of the": "cd",
    "democratic republic of the congo": "cd",
    "dr congo": "cd",
    "congo (drc)": "cd",
    "drc": "cd",
    "congo, republic of the": "cg",
    "republic of the congo": "cg",
    "congo": "cg",
    "eswatini": "sz",
    "swaziland": "sz",
    "east timor": "tl",
    "timor-leste": "tl",
    "myanmar": "mm",
    "burma": "mm",
    "laos": "la",
    "lao pdr": "la",
    "lao people's democratic republic": "la",
    "vietnam": "vn",
    "viet nam": "vn",
    "syria": "sy",
    "syrian arab republic": "sy",
    "iran": "ir",
    "iran, islamic republic of": "ir",
    "moldova": "md",
    "republic of moldova": "md",
    "tanzania": "tz",
    "united republic of tanzania": "tz",
    "bolivia": "bo",
    "bolivia (plurinational state of)": "bo",
    "venezuela": "ve",
    "venezuela, bolivarian republic of": "ve",
    "gambia": "gm",
    "gambia, the": "gm",
    "the gambia": "gm",
    "bahamas": "bs",
    "bahamas, the": "bs",
    "the bahamas": "bs",
    "micronesia": "fm",
    "federated states of micronesia": "fm",
    "micronesia (federated states of)": "fm",
    "cabo verde": "cv",
    "cape verde": "cv",
    "kyrgyzstan": "kg",
    "kyrgyz republic": "kg",
    "slovakia": "sk",
    "slovak republic": "sk",
    "united arab emirates": "ae",
    "uae": "ae",
    "brunei": "bn",
    "brunei darussalam": "bn",
    "north macedonia": "mk",
    "macedonia": "mk",
    "palestine": None,
    "state of palestine": None,
    "west bank and gaza": None,
    "taiwan": None,
    "hong kong": None,
    "macao": None,
    "macau": None,
    "puerto rico": None,
    "kosovo": None,
    "vatican": None,
    "holy see": None,
    "cook islands": None,
    "niue": None,
    "aruba": None,
    "curaçao": None,
    "greenland": None,
    "guam": None,
    "new caledonia": None,
    "french polynesia": None,
    "world": None,
    "european union": None,
    "eu": None,
    "africa": None,
    "antarctica": None,
    "france and monaco": "fr",
    "italy, san marino and the holy see": "it",
    "switzerland and liechtenstein": "ch",
    "spain and andorra": "es",
}

SKIP = {"tw", "hk", "mo", "pr", "xk", "ps", "va"}

IOC_TO_ISO = {
    "USA": "us",
    "CHN": "cn",
    "GBR": "gb",
    "RUS": "ru",
    "GER": "de",
    "FRA": "fr",
    "ITA": "it",
    "JPN": "jp",
    "AUS": "au",
    "HUN": "hu",
    "SWE": "se",
    "NED": "nl",
    "NOR": "no",
    "KOR": "kr",
    "CAN": "ca",
    "ROU": "ro",
    "POL": "pl",
    "CUB": "cu",
    "ESP": "es",
    "SUI": "ch",
    "BRA": "br",
    "FIN": "fi",
    "DEN": "dk",
    "UKR": "ua",
    "NZL": "nz",
    "KEN": "ke",
    "TUR": "tr",
    "CZE": "cz",
    "GRE": "gr",
    "BEL": "be",
    "BLR": "by",
    "AUT": "at",
    "KAZ": "kz",
    "BUL": "bg",
    "IRI": "ir",
    "ETH": "et",
    "JAM": "jm",
    "CRO": "hr",
    "PRK": "kp",
    "SVK": "sk",
    "AZE": "az",
    "GEO": "ge",
    "UZB": "uz",
    "PR": "pr",
    "IND": "in",
    "RSA": "za",
    "IRL": "ie",
    "MEX": "mx",
    "ARG": "ar",
    "EGY": "eg",
    "INA": "id",
    "THA": "th",
    "COL": "co",
    "MAR": "ma",
    "TPE": None,
    "HKG": None,
    "KOS": None,
    "IOA": None,
    "EUN": None,
    "URS": "ru",
    "GDR": "de",
    "FRG": "de",
    "TCH": "cz",
    "YUG": None,
    "SCG": "rs",
    "ANZ": None,
    "BOH": "cz",
    "RU1": "ru",
    "ROC": None,
    "AIN": None,
    "AFG": "af",
    "ALB": "al",
    "ALG": "dz",
    "AND": "ad",
    "ANG": "ao",
    "ANT": None,
    "ARM": "am",
    "ARU": None,
    "ASA": None,
    "BAH": "bs",
    "BAN": "bd",
    "BAR": "bb",
    "BDI": "bi",
    "BEN": "bj",
    "BER": None,
    "BHU": "bt",
    "BIH": "ba",
    "BIZ": "bz",
    "BOL": "bo",
    "BOT": "bw",
    "BRN": "bh",
    "BRU": "bn",
    "BUR": "bf",
    "CAF": "cf",
    "CAM": "kh",
    "CAY": None,
    "CGO": "cg",
    "CHA": "td",
    "CHI": "cl",
    "CIV": "ci",
    "CMR": "cm",
    "COD": "cd",
    "COK": None,
    "COM": "km",
    "CPV": "cv",
    "CRC": "cr",
    "CYP": "cy",
    "DJI": "dj",
    "DMA": "dm",
    "DOM": "do",
    "ECU": "ec",
    "ERI": "er",
    "ESA": "sv",
    "EST": "ee",
    "FIJ": "fj",
    "FSM": "fm",
    "GAB": "ga",
    "GAM": "gm",
    "GBS": "gw",
    "GEO": "ge",
    "GEQ": "gq",
    "GHA": "gh",
    "GRN": "gd",
    "GUA": "gt",
    "GUI": "gn",
    "GUM": None,
    "GUY": "gy",
    "HAI": "ht",
    "HON": "hn",
    "IRQ": "iq",
    "ISR": "il",
    "ISV": None,
    "IVB": None,
    "JOR": "jo",
    "KGZ": "kg",
    "KIR": "ki",
    "KSA": "sa",
    "KUW": "kw",
    "LAO": "la",
    "LAT": "lv",
    "LBA": "ly",
    "LBR": "lr",
    "LCA": "lc",
    "LES": "ls",
    "LIE": "li",
    "LTU": "lt",
    "LUX": "lu",
    "MAD": "mg",
    "MAR": "ma",
    "MAS": "my",
    "MAW": "mw",
    "MDA": "md",
    "MDV": "mv",
    "MGL": "mn",
    "MHL": "mh",
    "MKD": "mk",
    "MLI": "ml",
    "MLT": "mt",
    "MNE": "me",
    "MON": "mc",
    "MOZ": "mz",
    "MRI": "mu",
    "MTN": "mr",
    "MYA": "mm",
    "NAM": "na",
    "NCA": "ni",
    "NEP": "np",
    "NGR": "ng",
    "NIG": "ne",
    "NRU": "nr",
    "OMA": "om",
    "PAK": "pk",
    "PAN": "pa",
    "PAR": "py",
    "PER": "pe",
    "PHI": "ph",
    "PLE": None,
    "PLW": "pw",
    "PNG": "pg",
    "POR": "pt",
    "PUR": None,
    "QAT": "qa",
    "RWA": "rw",
    "SAM": "ws",
    "SEN": "sn",
    "SEY": "sc",
    "SGP": "sg",
    "SKN": "kn",
    "SLE": "sl",
    "SLO": "si",
    "SMR": "sm",
    "SOL": "sb",
    "SOM": "so",
    "SRB": "rs",
    "SRI": "lk",
    "SSD": "ss",
    "STP": "st",
    "SUD": "sd",
    "SUR": "sr",
    "SWZ": "sz",
    "SYR": "sy",
    "TAN": "tz",
    "TGA": "to",
    "TJK": "tj",
    "TKM": "tm",
    "TLS": "tl",
    "TOG": "tg",
    "TTO": "tt",
    "TUN": "tn",
    "TUV": "tv",
    "UAE": "ae",
    "UGA": "ug",
    "URU": "uy",
    "VAN": "vu",
    "VEN": "ve",
    "VIE": "vn",
    "VIN": "vc",
    "YEM": "ye",
    "ZAM": "zm",
    "ZIM": "zw",
}


def load_countries() -> tuple[dict[str, str], set[str]]:
    text = (ROOT / "src/data/countries.ts").read_text()
    names: dict[str, str] = {}
    isos: set[str] = set()
    for iso, en in re.findall(r"iso: '([a-z]{2})', nameEn: '([^']+)'", text):
        isos.add(iso)
        names[en.lower()] = iso
        names[en.lower().replace(".", "")] = iso
    return names, isos


def norm(name: str) -> str:
    name = re.sub(r"\[[^\]]*\]", "", name)
    name = re.sub(r"\([^)]*\)", "", name)
    name = name.replace("\xa0", " ").replace("*", " ")
    name = re.sub(r"\s+", " ", name).strip().lower()
    return name


def resolve(name: str, names: dict[str, str]) -> str | None:
    key = norm(name)
    if not key:
        return None
    if key in ALIASES:
        return ALIASES[key]
    if key in names:
        return names[key]
    if key.startswith("the "):
        return resolve(key[4:], names)
    return None


class WikiTable(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.tables: list[list[list[str]]] = []
        self._table: list[list[str]] | None = None
        self._row: list[str] | None = None
        self._cell: list[str] | None = None
        self._skip = 0
        self._capture = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_d = dict(attrs)
        if tag == "table" and "wikitable" in (attrs_d.get("class") or ""):
            self._table = []
        elif tag == "tr" and self._table is not None:
            self._row = []
        elif tag in {"td", "th"} and self._row is not None:
            self._cell = []
            self._capture = True
            self._skip = 0
        elif tag in {"sup", "style"} and self._capture:
            self._skip += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"sup", "style"} and self._skip:
            self._skip -= 1
        elif tag in {"td", "th"} and self._cell is not None and self._row is not None:
            self._row.append(re.sub(r"\s+", " ", "".join(self._cell)).strip())
            self._cell = None
            self._capture = False
        elif tag == "tr" and self._row is not None and self._table is not None:
            if any(self._row):
                self._table.append(self._row)
            self._row = None
        elif tag == "table" and self._table is not None:
            if self._table:
                self.tables.append(self._table)
            self._table = None

    def handle_data(self, data: str) -> None:
        if self._capture and self._skip == 0 and self._cell is not None:
            self._cell.append(data)


def wiki(title: str, prop: str = "text") -> dict:
    q = urllib.parse.urlencode({"action": "parse", "page": title, "prop": prop, "format": "json", "redirects": "1"})
    req = urllib.request.Request(f"https://en.wikipedia.org/w/api.php?{q}", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as resp:
        return json.load(resp)["parse"]


def wiki_tables(title: str) -> list[list[list[str]]]:
    html = wiki(title)["text"]["*"]
    parser = WikiTable()
    parser.feed(html)
    return parser.tables


def keep(iso: str | None, isos: set[str], seen: set[str]) -> bool:
    return bool(iso) and iso in isos and iso not in seen and iso not in SKIP


def row_iso(row: list[str], names: dict[str, str]) -> str | None:
    for cell in row:
        iso = resolve(cell, names)
        if iso:
            return iso
    return None


def extract_in_order(table: list[list[str]], names: dict[str, str], isos: set[str]) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    for row in table:
        iso = row_iso(row, names)
        if keep(iso, isos, seen):
            seen.add(iso)  # type: ignore[arg-type]
            found.append(iso)  # type: ignore[arg-type]
    return found


def first_ranked_table(tables: list[list[list[str]]], names: dict[str, str], isos: set[str]) -> list[str]:
    for table in tables:
        for row in table:
            if row and re.sub(r"[^\d]", "", row[0]) == "1" and row_iso(row, names):
                return extract_in_order(table, names, isos)
    return []


def parse_amount(cell: str) -> float | None:
    cell = re.sub(r"\([^)]*\)", "", cell)
    if re.search(r"n/?a", cell, re.I):
        return None
    match = re.search(r"\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?", cell)
    if not match:
        return None
    try:
        return float(match.group(0).replace(",", ""))
    except ValueError:
        return None


def sort_by_column(
    table: list[list[str]],
    names: dict[str, str],
    isos: set[str],
    col: int,
    *,
    descending: bool,
) -> list[str]:
    scored: list[tuple[float, str]] = []
    seen: set[str] = set()
    for row in table:
        iso = row_iso(row, names)
        if not keep(iso, isos, seen) or col >= len(row):
            continue
        value = parse_amount(row[col])
        if value is None:
            continue
        seen.add(iso)  # type: ignore[arg-type]
        scored.append((value, iso))  # type: ignore[arg-type]
    scored.sort(key=lambda item: item[0], reverse=descending)
    return [iso for _, iso in scored]


def extract_ranked(tables: list[list[list[str]]], names: dict[str, str], isos: set[str]) -> list[str]:
    return first_ranked_table(tables, names, isos)


def extract_sorted_value(
    tables: list[list[list[str]]],
    names: dict[str, str],
    isos: set[str],
    *,
    descending: bool,
    lo: float = 0,
    hi: float = 1e12,
) -> list[str]:
    scored: list[tuple[float, str]] = []
    seen: set[str] = set()
    best_table: list[list[str]] = []
    for table in tables:
        countries = 0
        for row in table[1:]:
            if any(resolve(cell, names) for cell in row):
                countries += 1
        if countries > len(best_table):
            best_table = table
    for row in best_table[1:]:
        iso = None
        for cell in row:
            iso = resolve(cell, names)
            if iso:
                break
        if not keep(iso, isos, seen):
            continue
        value = None
        for cell in row:
            parsed = parse_amount(cell)
            if parsed is None:
                continue
            if lo <= parsed <= hi:
                value = parsed
                break
        if value is None:
            continue
        seen.add(iso)  # type: ignore[arg-type]
        scored.append((value, iso))  # type: ignore[arg-type]
    scored.sort(key=lambda item: item[0], reverse=descending)
    return [iso for _, iso in scored]


def gdp_from_visual(names: dict[str, str], isos: set[str]) -> list[str]:
    text = (ROOT / "scripts/imf-weo-gdp-april-2026.txt").read_text()
    found: list[str] = []
    seen: set[str] = set()
    for match in re.finditer(r"\|\s*\d+\s*\|\s*([^|]+)\|", text):
        raw = re.sub(r"[^\w .'-]+", " ", match.group(1), flags=re.UNICODE)
        raw = re.sub(r"\s+", " ", raw).strip()
        iso = resolve(raw, names)
        if keep(iso, isos, seen):
            seen.add(iso)  # type: ignore[arg-type]
            found.append(iso)  # type: ignore[arg-type]
    return found


def population_from_passports(isos: set[str]) -> list[str]:
    text = (ROOT / "src/data/passports.ts").read_text()
    rows: list[tuple[str, int]] = []
    for iso, pop in re.findall(r"^\s+([a-z]{2}): p\([^)]*?,\s*([\d_]+),", text, re.M):
        if iso in isos:
            rows.append((iso, int(pop.replace("_", ""))))
    rows.sort(key=lambda item: -item[1])
    return [iso for iso, _ in rows]


def olympics(isos: set[str]) -> list[str]:
    text = wiki("All-time Olympic Games medal table", "wikitext")["wikitext"]["*"]
    scored: list[tuple[int, int, str]] = []
    seen: set[str] = set()
    for match in re.finditer(r"\{\{flag IOC\|([A-Z0-9]+)\}\}(.*?)(?=\n\|-|\n\|\})", text, re.S):
        code = match.group(1)
        iso = IOC_TO_ISO.get(code)
        if iso is None:
            iso = code.lower() if len(code) == 2 else None
        if not keep(iso, isos, seen):
            continue
        rest = re.sub(r'style="[^"]*"', "", match.group(2))
        rest = re.sub(r"#[0-9a-fA-F]+", "", rest)
        nums = [int(x.replace(",", "")) for x in re.findall(r"\d[\d,]*", rest)]
        if len(nums) < 5:
            continue
        gold, total = nums[-4], nums[-1]
        seen.add(iso)  # type: ignore[arg-type]
        scored.append((gold, total, iso))  # type: ignore[arg-type]
    scored.sort(key=lambda item: (item[0], item[1]), reverse=True)
    return [iso for _, _, iso in scored]


def heritage(names: dict[str, str], isos: set[str]) -> list[str]:
    text = wiki("World Heritage Site", "wikitext")["wikitext"]["*"]
    start = text.find("15 or more")
    chunk = text[start : start + 8000] if start >= 0 else text
    found: list[str] = []
    seen: set[str] = set()
    for country, count in re.findall(
        r'text:"\[\[[^\|\]]+\|([^\]]+)\]\]"\s+\((\d+)\)',
        chunk,
    ):
        iso = resolve(country, names)
        if keep(iso, isos, seen):
            seen.add(iso)  # type: ignore[arg-type]
            found.append(iso)  # type: ignore[arg-type]
    return found


def write_ts(orders: dict[str, list[str]]) -> None:
    lines = [
        "/** Generated by scripts/fetch-rankings.py — UN members only, source order. */",
        "export const RANKING_ORDERS = {",
    ]
    for key, isos in orders.items():
        lines.append(f"  {key}: {json.dumps(isos)},")
    lines.append("} as { readonly [key: string]: readonly string[] }")
    lines.append("")
    (ROOT / "src/data/rankingOrders.ts").write_text("\n".join(lines))


def main() -> None:
    names, isos = load_countries()
    orders: dict[str, list[str]] = {
        "rankGdp": gdp_from_visual(names, isos),
        "rankPopulation": population_from_passports(isos),
    }

    ranked_pages = {
        "rankArea": "List of countries and dependencies by area",
        "rankHappiness": "World Happiness Report",
        "rankHdi": "List of countries by Human Development Index",
        "rankCpi": "Corruption Perceptions Index",
        "rankPassport": "Henley Passport Index",
        "rankPeace": "Global Peace Index",
        "rankBillionaires": "List of countries by number of billionaires",
    }
    for key, page in ranked_pages.items():
        tables = wiki_tables(page)
        orders[key] = extract_ranked(tables, names, isos)
        if len(orders[key]) < 20:
            orders[key] = extract_in_order(max(tables, key=len, default=[]), names, isos)
        print(f"{key}: {len(orders[key])} ranked from {page} first={orders[key][:5]}")

    ppp_tables = wiki_tables("List of countries by GDP (PPP)")
    orders["rankGdpPpp"] = extract_in_order(ppp_tables[0], names, isos) if ppp_tables else []
    print("rankGdpPpp", len(orders["rankGdpPpp"]), orders["rankGdpPpp"][:8])

    pc_tables = wiki_tables("List of countries by GDP (nominal) per capita")
    orders["rankGdpPc"] = sort_by_column(pc_tables[0], names, isos, 1, descending=True) if pc_tables else []
    print("rankGdpPc", len(orders["rankGdpPc"]), orders["rankGdpPc"][:8])

    life_tables = wiki_tables("List of countries by life expectancy")
    life_table = next((t for t in life_tables if len(t) > 100 and row_iso(t[2] if len(t) > 2 else t[0], names) == "jp"), None)
    if life_table is None:
        life_table = max(life_tables, key=len, default=[])
    orders["rankLife"] = extract_in_order(life_table, names, isos)
    print("rankLife", len(orders["rankLife"]), orders["rankLife"][:8])

    press_tables = wiki_tables("World Press Freedom Index")
    orders["rankPress"] = extract_in_order(press_tables[0], names, isos) if press_tables else []
    print("rankPress", len(orders["rankPress"]), orders["rankPress"][:8])

    co2_tables = wiki_tables("List of countries by carbon dioxide emissions")
    orders["rankCo2"] = extract_in_order(co2_tables[0], names, isos) if co2_tables else []
    print("rankCo2", len(orders["rankCo2"]), orders["rankCo2"][:8])

    gini_tables = wiki_tables("List of countries by income inequality")
    gini_rows: list[tuple[float, str]] = []
    gini_seen: set[str] = set()
    for row in gini_tables[0][2:] if gini_tables else []:
        iso = row_iso(row, names)
        if not keep(iso, isos, gini_seen) or len(row) < 6:
            continue
        value = parse_amount(row[3]) or parse_amount(row[5])
        if value is None or value < 15 or value > 80:
            continue
        gini_seen.add(iso)  # type: ignore[arg-type]
        gini_rows.append((value, iso))  # type: ignore[arg-type]
    gini_rows.sort(key=lambda item: item[0])
    orders["rankGini"] = [iso for _, iso in gini_rows]
    print("rankGini", len(orders["rankGini"]), orders["rankGini"][:8])

    mil_tables = wiki_tables("List of countries by number of millionaires")
    orders["rankMillionaires"] = extract_sorted_value(mil_tables, names, isos, descending=True, lo=1_000, hi=1e9)
    print("rankMillionaires", len(orders["rankMillionaires"]), orders["rankMillionaires"][:8])

    orders["rankOlympics"] = olympics(isos)
    print("rankOlympics", len(orders["rankOlympics"]), orders["rankOlympics"][:8])

    orders["rankHeritage"] = heritage(names, isos)
    print("rankHeritage", len(orders["rankHeritage"]), orders["rankHeritage"][:8])

    print("rankGdp", len(orders["rankGdp"]), orders["rankGdp"][:8])
    print("rankPopulation", len(orders["rankPopulation"]))

    out = ROOT / "scripts" / "ranking-orders.json"
    out.write_text(json.dumps(orders, ensure_ascii=False, indent=2))
    write_ts(orders)
    print("wrote", out, "and src/data/rankingOrders.ts")


if __name__ == "__main__":
    main()
