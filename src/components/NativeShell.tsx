'use client'

import { useEffect } from 'react'
import { appLang, isDailyRemindOn, isNativeApp, setDailyRemind, watchRemindTaps } from '../lib/nativeFeel'

export function NativeShell() {
  useEffect(() => {
    if (!isNativeApp()) return
    let removeTaps = () => {}
    void watchRemindTaps().then((remove) => {
      removeTaps = remove
    })
    const sync = () => {
      if (!isDailyRemindOn()) return
      void setDailyRemind(true, appLang())
    }
    sync()
    window.addEventListener('storage', sync)
    return () => {
      removeTaps()
      window.removeEventListener('storage', sync)
    }
  }, [])
  return null
}
