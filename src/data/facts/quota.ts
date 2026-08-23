/** Total area, km² (CIA / UN rounded). Used only to size fact pools. */
export const AREA_KM2: Record<string, number> = {
  af: 652230, al: 28748, dz: 2381741, ad: 468, ao: 1246700, ag: 443, ar: 2780400, am: 29743,
  au: 7741220, at: 83871, az: 86600, bs: 13880, bh: 760, bd: 148460, bb: 430, by: 207600,
  be: 30528, bz: 22966, bj: 112622, bt: 38394, bo: 1098581, ba: 51197, bw: 581730, br: 8515767,
  bn: 5765, bg: 110879, bf: 274200, bi: 27834, cv: 4033, kh: 181035, cm: 475440, ca: 9984670,
  cf: 622984, td: 1284000, cl: 756102, cn: 9596961, co: 1141748, km: 2235, cg: 342000, cd: 2344858,
  cr: 51100, ci: 322463, hr: 56594, cu: 109884, cy: 9251, cz: 78867, dk: 43094, dj: 23200,
  dm: 751, do: 48670, ec: 283561, eg: 1001450, sv: 21041, gq: 28051, er: 117600, ee: 45228,
  sz: 17364, et: 1104300, fj: 18274, fi: 338145, fr: 551695, ga: 267667, gm: 11295, ge: 69700,
  de: 357022, gh: 238533, gr: 131957, gd: 344, gt: 108889, gn: 245857, gw: 36125, gy: 214969,
  ht: 27750, hn: 112090, hu: 93028, is: 103000, in: 3287263, id: 1904569, ir: 1648195, iq: 438317,
  ie: 70273, il: 20770, it: 301340, jm: 10991, jp: 377930, jo: 89342, kz: 2724900, ke: 580367,
  ki: 811, kw: 17818, kg: 199951, la: 236800, lv: 64589, lb: 10400, ls: 30355, lr: 111369,
  ly: 1759540, li: 160, lt: 65300, lu: 2586, mg: 587041, mw: 118484, my: 330803, mv: 298,
  ml: 1240192, mt: 316, mh: 181, mr: 1030700, mu: 2040, mx: 1964375, fm: 702, md: 33851,
  mc: 2, mn: 1564116, me: 13812, ma: 446550, mz: 799380, mm: 676578, na: 824292, nr: 21,
  np: 147181, nl: 41543, nz: 268838, ni: 130373, ne: 1267000, ng: 923768, kp: 120538, mk: 25713,
  no: 323802, om: 309500, pk: 881913, pw: 459, pa: 75417, pg: 462840, py: 406752, pe: 1285216,
  ph: 300000, pl: 312685, pt: 92090, qa: 11586, ro: 238391, ru: 17098242, rw: 26338, kn: 261,
  lc: 616, vc: 389, ws: 2842, sm: 61, st: 964, sa: 2149690, sn: 196722, rs: 77474, sc: 455,
  sl: 71740, sg: 728, sk: 49035, si: 20273, sb: 28896, so: 637657, za: 1219090, kr: 100210,
  ss: 644329, es: 505992, lk: 65610, sd: 1861484, sr: 163820, se: 450295, ch: 41277, sy: 185180,
  tj: 144100, tz: 947300, th: 513120, tl: 14874, tg: 56785, to: 747, tt: 5128, tn: 163610,
  tr: 783562, tm: 488100, tv: 26, ug: 241038, ua: 603550, ae: 83600, gb: 243610, us: 9833517,
  uy: 176215, uz: 447400, vu: 12189, ve: 912050, vn: 331212, ye: 527968, zm: 752618, zw: 390757,
}

export type FactSize = 'large' | 'medium' | 'small' | 'micro'

export function factSize(iso: string): FactSize {
  const area = AREA_KM2[iso] ?? 50_000
  if (area < 3_000) return 'micro'
  if (area >= 1_000_000) return 'large'
  if (area >= 50_000) return 'medium'
  return 'small'
}

export function factQuota(iso: string): number {
  const size = factSize(iso)
  if (size === 'large') return 50
  if (size === 'medium') return 30
  if (size === 'micro') return 30
  return 10
}
