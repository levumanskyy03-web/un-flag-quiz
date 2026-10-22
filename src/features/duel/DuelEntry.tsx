'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DuelApp } from '@/features/duel/DuelApp'
import { normalizeDuelCode } from '@/features/duel/paths'

export function DuelEntry() {
  const router = useRouter()
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    const next = normalizeDuelCode(new URLSearchParams(window.location.search).get('code') ?? '')
    if (!next) {
      router.replace('/friend')
      return
    }
    setCode(next)
  }, [router])

  if (!code) return null
  return <DuelApp key={code} code={code} />
}
