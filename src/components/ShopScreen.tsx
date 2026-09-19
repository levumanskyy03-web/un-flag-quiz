import { SHOP_ITEMS, TOKEN_COST, TOKEN_DAY_CAP, type ShopItem, type ShopItemId } from '../data/tokens'
import { STRINGS, type Lang } from '../i18n/strings'
import { useCompany } from './CompanyScreen'
import { buyShopItem, tokenKnowledgeBoostActive, tokenXpBoostActive, useTokens, type TokenState } from '../lib/tokenStore'
import { GeoIcon } from './GeoIcon'
import { WorldsBack } from './WorldsBack'

function shopLabel(item: ShopItem, lang: Lang) {
  const t = STRINGS[lang]
  if (item.id === 'frame-laurel') return t.shopFrameLaurel
  if (item.id === 'frame-gold') return t.shopFrameGold
  if (item.id === 'frame-night') return t.shopFrameNight
  if (item.id === 'frame-orbit') return t.shopFrameOrbit
  if (item.id === 'share-ink') return t.shopShareInk
  if (item.id === 'share-gold') return t.shopShareGold
  if (item.id === 'share-night') return t.shopShareNight
  if (item.id === 'hq-skin') return t.shopHqSkin
  if (item.id === 'boost-knowledge') return t.shopBoostKnowledge
  return t.shopBoostXp
}

function owned(state: TokenState, item: ShopItem) {
  if (item.kind === 'frame' && item.frame) return state.ownedFrames.includes(item.frame)
  if (item.kind === 'share' && item.share) return state.ownedShare.includes(item.share)
  if (item.kind === 'hqSkin') return state.hqSkin
  return false
}

function equipped(state: TokenState, item: ShopItem) {
  if (item.kind === 'frame') return state.frame === item.frame
  if (item.kind === 'share') return state.shareTheme === item.share
  return false
}

export function ShopScreen({ lang, onWorlds }: { lang: Lang; onWorlds: () => void }) {
  const t = STRINGS[lang]
  const state = useTokens()
  const company = useCompany()
  const now = Date.now()
  const knowledgeOn = tokenKnowledgeBoostActive(now)
  const xpOn = tokenXpBoostActive(now)

  function buy(id: ShopItemId) {
    buyShopItem(id, company.claimed)
  }

  return (
    <div className="screen home-screen shop-screen">
      <header className="home-header">
        <WorldsBack lang={lang} onClick={onWorlds} />
        <h1>{t.shop}</h1>
        <p className="subtitle">{t.shopHint}</p>
      </header>

      <section className="card settings-card">
        <p className="company-knowledge">
          <GeoIcon name="pin" size={22} />
          <span>{t.tokensBalance(state.balance)}</span>
        </p>
        <p className="setting-hint">{t.tokensDayCap(state.earnedToday, TOKEN_DAY_CAP)}</p>
        {knowledgeOn || xpOn ? <p className="setting-hint">{t.shopBoostActive}</p> : null}
      </section>

      <section className="card settings-card">
        <h2>{t.shopCosmetics}</h2>
        <div className="shop-grid">
          {SHOP_ITEMS.filter((item) => item.kind !== 'boost').map((item) => {
            const have = owned(state, item)
            const on = equipped(state, item)
            const locked = Boolean(item.requiresStages && company.claimed < item.requiresStages)
            const can = have || (!locked && state.balance >= item.cost)
            return (
              <button
                key={item.id}
                type="button"
                className={`choice shop-item${on ? ' is-active' : ''}`}
                disabled={!can}
                onClick={() => buy(item.id)}
              >
                <span>{shopLabel(item, lang)}</span>
                <span className="choice-note">
                  {locked
                    ? t.shopLocked
                    : have
                      ? on
                        ? t.shopEquipped
                        : t.shopEquip
                      : `${t.shopBuy} · ${item.cost}`}
                </span>
                {item.id === 'hq-skin' ? <span className="choice-note">{t.shopHqSkinHint}</span> : null}
              </button>
            )
          })}
        </div>
      </section>

      <section className="card settings-card">
        <h2>{t.shopBoosts}</h2>
        <div className="shop-grid">
          {SHOP_ITEMS.filter((item) => item.kind === 'boost').map((item) => (
            <button
              key={item.id}
              type="button"
              className="choice shop-item"
              disabled={state.balance < item.cost}
              onClick={() => buy(item.id)}
            >
              <span>{shopLabel(item, lang)}</span>
              <span className="choice-note">{`${t.shopBuy} · ${item.cost}`}</span>
            </button>
          ))}
        </div>
        <p className="setting-hint">
          {t.quizHint} {TOKEN_COST.hint} · {t.quizSkip} {TOKEN_COST.skip} · {t.quizExtraLife} {TOKEN_COST.life}
        </p>
      </section>
    </div>
  )
}
