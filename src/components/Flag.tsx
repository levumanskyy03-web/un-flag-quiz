import Image from "next/image";
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
      <Image
        src={flagUrl(iso)}
        alt={name}
        fill
        unoptimized
        sizes={
          size === "hero"
            ? "(max-width: 420px) 100vw, 420px"
            : size === "thumb"
              ? "64px"
              : "(max-width: 640px) 100vw, 50vw"
        }
        priority={size === "hero"}
        className="flag-img"
      />
    </span>
  );
}
