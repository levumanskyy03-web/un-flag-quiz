import { readLangCookie, readStoredLang } from '../i18n/persistLang'
import type { Lang } from '../i18n/lang'
import { todayDailyDone } from './dailyChallenge'
import type { SfxName } from './sfx'

const REMIND_KEY = 'un-flag-quiz-daily-remind'
const REMIND_ASKED_KEY = 'un-flag-quiz-remind-asked'
const REMIND_EVENT = 'un-flag-quiz-remind'
const HAPTICS_KEY = 'un-flag-quiz-haptics'
const HAPTICS_EVENT = 'un-flag-quiz-haptics'
const REMIND_ID = 418
const TEST_ID = 419
const REMIND_HOUR = 18

const REMIND_COPY: Record<Lang, { title: string; body: string }> = {
  ru: { title: 'Челлендж дня', body: 'Новая страна уже ждёт в Паспорте.' },
  en: { title: 'Daily challenge', body: 'A new country is waiting in Country Passport.' },
  de: { title: 'Tageschallenge', body: 'Ein neues Land wartet im Länderpass.' },
  zh: { title: '今日挑战', body: '国家护照里有一个新的国家在等你。' },
  es: { title: 'Reto del día', body: 'Un país nuevo te espera en el pasaporte.' },
  hi: { title: 'आज की चुनौती', body: 'कंट्री पासपोर्ट में एक नया देश इंतज़ार कर रहा है।' },
  ar: { title: 'تحدي اليوم', body: 'بلد جديد بانتظارك في جواز البلد.' },
  bn: { title: 'আজকের চ্যালেঞ্জ', body: 'কান্ট্রি পাসপোর্টে একটি নতুন দেশ অপেক্ষা করছে।' },
  pt: { title: 'Desafio do dia', body: 'Um país novo espera no passaporte.' },
  ja: { title: '今日のチャレンジ', body: 'カントリーパスポートに新しい国が待っています。' },
  he: { title: 'אתגר היום', body: 'מדינה חדשה מחכה בדרכון המדינה.' },
}

type CapacitorGlobal = {
  isNativePlatform?: () => boolean
  getPlatform?: () => string
}

function capacitor(): CapacitorGlobal | null {
  if (typeof window === 'undefined') return null
  return (window as Window & { Capacitor?: CapacitorGlobal }).Capacitor ?? null
}

export function isNativeApp(): boolean {
  return Boolean(capacitor()?.isNativePlatform?.())
}

export function appLang(): Lang {
  return readStoredLang() ?? readLangCookie() ?? 'en'
}

export function isDailyRemindOn(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(REMIND_KEY) !== '0'
}

export function subscribeDailyRemind(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(REMIND_EVENT, onChange)
  return () => window.removeEventListener(REMIND_EVENT, onChange)
}

function emitRemind() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(REMIND_EVENT))
}

export function isHapticsOn(): boolean {
  if (typeof localStorage === 'undefined') return true
  return localStorage.getItem(HAPTICS_KEY) !== '0'
}

export function setHapticsOn(on: boolean) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(HAPTICS_KEY, on ? '1' : '0')
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(HAPTICS_EVENT))
  if (on) tap()
}

export function subscribeHaptics(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(HAPTICS_EVENT, onChange)
  return () => window.removeEventListener(HAPTICS_EVENT, onChange)
}

export function feel(name: SfxName) {
  if (!isNativeApp() || !isHapticsOn()) return
  void buzz(name)
}

export function tap() {
  if (!isNativeApp() || !isHapticsOn()) return
  void click()
}

async function click() {
  try {
    const { Haptics } = await import('@capacitor/haptics')
    await Haptics.selectionChanged()
  } catch {
    // The website in a browser has no haptic engine.
  }
}

async function buzz(name: SfxName) {
  try {
    const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics')
    if (name === 'wrong' || name === 'fail') {
      await Haptics.notification({ type: NotificationType.Error })
      return
    }
    if (name === 'correct') {
      await Haptics.impact({ style: ImpactStyle.Light })
      return
    }
    await Haptics.notification({ type: NotificationType.Success })
  } catch {
    // The website in a browser has no haptic engine.
  }
}

function nextRemindAt() {
  const at = new Date()
  at.setHours(REMIND_HOUR, 0, 0, 0)
  if (todayDailyDone() || at.getTime() <= Date.now()) {
    at.setDate(at.getDate() + 1)
  }
  return at
}

async function scheduleDaily(lang: Lang) {
  const { LocalNotifications } = await import('@capacitor/local-notifications')
  const copy = REMIND_COPY[lang]
  await LocalNotifications.cancel({ notifications: [{ id: REMIND_ID }] }).catch(() => {})
  let channelId: string | undefined
  if (capacitor()?.getPlatform?.() === 'android') {
    channelId = 'daily'
    await LocalNotifications.createChannel({
      id: channelId,
      name: copy.title,
      description: copy.body,
      importance: 4,
    }).catch(() => {
      channelId = undefined
    })
  }
  const skipToday = todayDailyDone()
  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMIND_ID,
        title: copy.title,
        body: copy.body,
        channelId,
        extra: { path: '/today' },
        schedule: skipToday
          ? { at: nextRemindAt(), allowWhileIdle: true }
          : { on: { hour: REMIND_HOUR, minute: 0 }, allowWhileIdle: true },
      },
    ],
  })
}

export async function refreshDailyRemind(lang: Lang = appLang()): Promise<boolean> {
  if (!isNativeApp() || !isDailyRemindOn()) return false
  const { LocalNotifications } = await import('@capacitor/local-notifications')
  const perm = await LocalNotifications.checkPermissions()
  if (perm.display !== 'granted') return false
  try {
    await scheduleDaily(lang)
  } catch {
    return false
  }
  return true
}

export async function maybeAskDailyRemind(lang: Lang = appLang()): Promise<boolean> {
  if (!isNativeApp()) return false
  if (localStorage.getItem(REMIND_KEY) === '0') return false
  if (localStorage.getItem(REMIND_ASKED_KEY) === '1') {
    return refreshDailyRemind(lang)
  }
  localStorage.setItem(REMIND_ASKED_KEY, '1')
  return setDailyRemind(true, lang)
}

export async function sendTestRemind(lang: Lang = appLang()): Promise<boolean> {
  if (!isNativeApp()) return false
  const { LocalNotifications } = await import('@capacitor/local-notifications')
  const perm = await LocalNotifications.requestPermissions()
  if (perm.display !== 'granted') return false
  const copy = REMIND_COPY[lang]
  try {
    await LocalNotifications.cancel({ notifications: [{ id: TEST_ID }] }).catch(() => {})
    await LocalNotifications.schedule({
      notifications: [
        {
          id: TEST_ID,
          title: copy.title,
          body: copy.body,
          extra: { path: '/today' },
          schedule: { at: new Date(Date.now() + 3000), allowWhileIdle: true },
        },
      ],
    })
  } catch {
    return false
  }
  return true
}

export async function setDailyRemind(on: boolean, lang: Lang = appLang()): Promise<boolean> {
  if (!isNativeApp()) return false
  const { LocalNotifications } = await import('@capacitor/local-notifications')
  if (!on) {
    localStorage.setItem(REMIND_KEY, '0')
    await LocalNotifications.cancel({ notifications: [{ id: REMIND_ID }] }).catch(() => {})
    emitRemind()
    return false
  }
  localStorage.setItem(REMIND_ASKED_KEY, '1')
  const perm = await LocalNotifications.requestPermissions()
  if (perm.display !== 'granted') {
    if (perm.display === 'denied') {
      localStorage.setItem(REMIND_KEY, '0')
      emitRemind()
    }
    return false
  }
  try {
    await scheduleDaily(lang)
  } catch {
    return false
  }
  localStorage.setItem(REMIND_KEY, '1')
  emitRemind()
  return true
}

export async function watchRemindTaps() {
  if (!isNativeApp()) return () => {}
  const { LocalNotifications } = await import('@capacitor/local-notifications')
  const handle = await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
    const path = action.notification.extra?.path
    if (typeof path === 'string' && path.startsWith('/')) window.location.assign(path)
  })
  return () => {
    void handle.remove()
  }
}
