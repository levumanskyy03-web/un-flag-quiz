declare module 'canvas-confetti' {
  type ConfettiOptions = {
    particleCount?: number
    spread?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
  }

  interface ConfettiFn {
    (options?: ConfettiOptions): Promise<undefined> | null
    reset: () => void
  }

  const confetti: ConfettiFn
  export default confetti
}
