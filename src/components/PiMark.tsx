interface PiMarkProps {
  size?: number
}

export function PiMark({ size = 220 }: PiMarkProps) {
  return (
    <svg
      className="pi-mark"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="π"
    >
      <circle cx="50" cy="50" r="42" fill="#14244a" stroke="#f0d78c" strokeWidth="1.7" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#f0d78c" strokeOpacity="0.35" strokeWidth="0.7" />
      <path d="M27 37 H73" stroke="#f0d78c" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M36 37 V74" stroke="#f0d78c" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M63 37 V70" stroke="#f0d78c" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}
