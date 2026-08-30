'use client'

import { useEffect } from 'react'
import { collectStamp } from '../lib/stamps'

export function StampCollector({ iso }: { iso: string }) {
  useEffect(() => {
    collectStamp(iso)
  }, [iso])
  return null
}
