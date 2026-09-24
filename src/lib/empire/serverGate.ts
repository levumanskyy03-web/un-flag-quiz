import { accountFromRequest } from '../authStore'
import { readEmpire } from '../empireServerStore'
import { access, type GateFeature } from './gates'

/**
 * Серверная проверка гейта для роутов вне `/api/empire`.
 * Возвращает `null`, если доступ есть, иначе готовый ответ 401/403.
 * Без аккаунта — 401: закрытый контент требует входа (гость видит гейт на клиенте).
 */
export async function requireGate(request: Request, feature: GateFeature): Promise<Response | null> {
  const account = await accountFromRequest(request).catch(() => null)
  if (!account) return Response.json({ error: 'auth' }, { status: 401 })
  const state = await readEmpire(account.id).catch(() => null)
  // Хранилище недоступно — не блокируем игру.
  if (!state) return null
  if (access(state, feature) === 'locked') return Response.json({ error: 'locked' }, { status: 403 })
  return null
}
