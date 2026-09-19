import { playerCatalogNo, SHOW_PLAYER_CATALOG_NOS } from '../data/footballPlayers'

export function PlayerCatalogNo({
  id,
  onPhoto = false,
}: {
  id: string
  onPhoto?: boolean
}) {
  if (!SHOW_PLAYER_CATALOG_NOS) return null
  const n = playerCatalogNo(id)
  if (!n) return null
  return <p className={`player-catalog-no${onPhoto ? ' is-on-photo' : ''}`}>{n}</p>
}
