import Image from "next/image";
import { flagUrl } from "../lib/quiz";

type FlagSize = "hero" | "option" | "thumb";

const WIDTH: Record<FlagSize, number> = {
  hero: 640,
  option: 320,
  thumb: 80,
};

interface FlagProps {
  iso: string;
  name: string;
  size: FlagSize;
}

export function Flag({ iso, name, size }: FlagProps) {
  const width = WIDTH[size];
  return (
    <span className={`flag flag-${size}`}>
      <Image
        src={flagUrl(iso, width)}
        alt={name}
        width={width}
        height={Math.round(width * 0.67)}
        sizes={
          size === "hero"
            ? "(max-width: 420px) 100vw, 420px"
            : size === "thumb"
              ? "64px"
              : "(max-width: 640px) 100vw, 50vw"
        }
        priority={size === "hero"}
      />
    </span>
  );
}
