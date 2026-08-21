import { flagUrl } from "../lib/quiz";

type FlagSize = "hero" | "option" | "card" | "thumb";

const COMPACT_FLAGS = new Set(["be", "ch", "mc"]);
const TALL_FLAGS = new Set(["np"]);
const BOOST_FLAGS = new Set(["mc", "np"]);

interface FlagProps {
  iso: string;
  name: string;
  size: FlagSize;
}

export function Flag({ iso, name, size }: FlagProps) {
  const classes = [
    "flag",
    `flag-${size}`,
    TALL_FLAGS.has(iso) ? "flag-tall" : "",
    COMPACT_FLAGS.has(iso) ? "flag-compact" : "",
    BOOST_FLAGS.has(iso) ? "flag-boost" : "",
    iso === "ne" ? "flag-niger" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={flagUrl(iso)} alt={name} className="flag-img" />
    </span>
  );
}
