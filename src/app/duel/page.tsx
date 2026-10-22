import type { Metadata } from 'next'
import { DuelEntry } from '@/features/duel/DuelEntry'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DuelQueryPage() {
  return <DuelEntry />
}
