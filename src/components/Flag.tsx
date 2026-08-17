import { flagUrl } from "../lib/quiz";

type FlagSize = "hero" | "option" | "thumb";

interface FlagProps {
  iso: string;
  name: string;
  size: FlagSize;
}

export function Flag({ iso, name, size }: FlagProps) {
  return (
    <span className={`flag flag-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={flagUrl(iso)} alt={name} className="flag-img" />
    </span>
  );
}
