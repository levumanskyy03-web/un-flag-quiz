'use client'

import { useEffect } from 'react'
import { startBgm } from '../lib/bgm'

export function SiteAudio() {
  useEffect(() => startBgm(), [])
  return null
}
