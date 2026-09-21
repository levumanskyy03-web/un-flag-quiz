import { findCountry } from '../data/extras'
import {
  EXCHANGE_TOKEN_PACK,
  KNOWLEDGE_DAY_FROM_TOKENS,
  KNOWLEDGE_TO_TOKEN,
  TOKEN_TO_KNOWLEDGE,
  TOKENS_DAY_FROM_KNOWLEDGE,
  weekMarketLots,
  type EconomyContract,
  type MarketLot,
} from '../data/economy'
import { SHOP_ITEMS, TOKEN_COST, TOKEN_DAY_CAP, type ShopItem, type ShopItemId } from '../data/tokens'
import { STRINGS, type Lang } from '../i18n/strings'
import { countryName } from '../lib/quiz'
import {
  buyMarketLot,
  buyTokenFromKnowledge,
  sellTokenPack,
  takeContract,
  useEconomy,
} from '../lib/economyStore'
import { useCompany, worldTitle } from './CompanyScreen'
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

function lotLabel(lot: MarketLot, lang: Lang) {
  const t = STRINGS[lang]
  if (lot.kind === 'knowledge') return t.shopLotKnowledge(lot.knowledge ?? 0)
  if (lot.kind === 'worldGrant') return t.shopLotWorld(worldTitle(lot.world ?? 'geo', lang), lot.knowledge ?? 0)
  return t.shopLotBoost
}

function contractLabel(item: EconomyContract, lang: Lang) {
  const t = STRINGS[lang]
  const world = worldTitle(item.world, lang)
  if (item.kind === 'worldRounds') return t.shopContractWorldRounds(item.goal, world)
  if (item.kind === 'worldComplete') return t.shopContractWorldComplete(item.goal, world)
  if (item.kind === 'perfect') return t.shopContractPerfect(world)
  return t.shopContractStampGeo(item.goal)
}

export function ShopScreen({ lang, onWorlds, onState }: { lang: Lang; onWorlds: () => void; onState: () => void }) {
  const t = STRINGS[lang]
  const state = useTokens()
  const company = useCompany()
  const economy = useEconomy()
  const knowledgeOn = tokenKnowledgeBoostActive()
  const xpOn = tokenXpBoostActive()
  const knowledgeLeft = Math.max(0, KNOWLEDGE_DAY_FROM_TOKENS - economy.knowledgeFromTokensToday)
  const tokensLeft = Math.max(0, TOKENS_DAY_FROM_KNOWLEDGE - economy.tokensFromKnowledgeToday)
  const packKnowledge = EXCHANGE_TOKEN_PACK * TOKEN_TO_KNOWLEDGE
  const canSell = state.balance >= EXCHANGE_TOKEN_PACK && knowledgeLeft >= packKnowledge
  const canBuy = company.knowledge >= KNOWLEDGE_TO_TOKEN && tokensLeft >= 1
  const vaultCountry = economy.vaultIso ? findCountry(economy.vaultIso) : undefined
  const lots = weekMarketLots(economy.weekStamp)

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
        <h2>{t.shopDesk}</h2>
        <p className="setting-hint">{t.shopDeskHint}</p>
        <p className="setting-hint">{t.shopExchangeLeft(knowledgeLeft, tokensLeft)}</p>
        <div className="shop-grid">
          <button type="button" className="choice shop-item" disabled={!canSell} onClick={() => sellTokenPack()}>
            <span>{t.shopSellTokens(EXCHANGE_TOKEN_PACK, packKnowledge)}</span>
            <span className="choice-note">{t.shopBuy}</span>
          </button>
          <button type="button" className="choice shop-item" disabled={!canBuy} onClick={() => buyTokenFromKnowledge()}>
            <span>{t.shopBuyTokens(KNOWLEDGE_TO_TOKEN, 1)}</span>
            <span className="choice-note">{t.shopBuy}</span>
          </button>
        </div>
      </section>

      <section className="card settings-card">
        <h2>{t.shopMarket}</h2>
        <p className="setting-hint">{t.shopMarketHint}</p>
        <div className="shop-grid">
          {lots.map((lot) => {
            const claimed = economy.claimedLots.includes(lot.id)
            const worldNeed = lot.worldNeed ?? 0
            const earned = lot.world ? (economy.worldEarned[lot.world] ?? 0) : worldNeed
            const locked = Boolean(lot.world && earned < worldNeed)
            const can = !claimed && !locked && state.balance >= lot.cost
            return (
              <button
                key={lot.id}
                type="button"
                className="choice shop-item"
                disabled={!can}
                onClick={() => buyMarketLot(lot.id)}
              >
                <span>{lotLabel(lot, lang)}</span>
                <span className="choice-note">
                  {claimed
                    ? t.shopMarketSold
                    : locked && lot.world
                      ? t.shopMarketNeedWorld(worldNeed, worldTitle(lot.world, lang))
                      : `${t.shopBuy} · ${lot.cost}`}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="card settings-card">
        <h2>{t.shopContracts}</h2>
        <p className="setting-hint">{t.shopContractsHint}</p>
        <div className="shop-grid">
          {economy.contracts.map((item) => {
            const open = item.status === 'open'
            const canTake = open && (item.stamp ? Boolean(economy.vaultIso) : state.balance >= item.stake)
            return (
              <button
                key={item.id}
                type="button"
                className={`choice shop-item${item.status === 'active' ? ' is-active' : ''}`}
                disabled={!canTake}
                onClick={() => takeContract(item.id)}
              >
                <span>{contractLabel(item, lang)}</span>
                <span className="choice-note">
                  {item.status === 'won'
                    ? t.shopContractWon
                    : item.status === 'lost'
                      ? t.shopContractLost
                      : item.status === 'active'
                        ? `${t.shopContractActive} · ${t.shopContractProgress(item.progress, item.goal)}`
                        : t.shopContractTake}
                </span>
                <span className="choice-note">
                  {item.stamp ? t.shopContractStampStake : t.shopContractStake(item.stake)} · {t.shopContractPayout(item.payout)}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="card settings-card">
        <h2>{t.shopVault}</h2>
        <p className="setting-hint">{t.stateShopVaultHint}</p>
        {vaultCountry ? (
          <p className="setting-hint">{t.shopVaultOn(countryName(vaultCountry, lang))}</p>
        ) : (
          <p className="setting-hint">{t.stateNeedCountry}</p>
        )}
        <button type="button" className="btn-secondary" onClick={onState}>
          {t.stateShopOpen}
        </button>
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
