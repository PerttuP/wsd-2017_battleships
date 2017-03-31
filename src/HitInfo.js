
/**
  HitInfo describes result for player's or AI's action.
  @param {boolean} ignored - True, if action was invalid and ignored. Defaults to false.
  @param {boolean} shipHit - True, if action damaged a ship. Defaults to false.
  @param {boolean} shipDestroyed - Truem if action destroyed a ship. Defaults to false.
*/
function HitInfo(ignored, shipHit, shipDestroyed)
{
    return {
        ignored: ignored === undefined ? false : ignored,
        shipHit: shipHit === undefined ? false : shipHit,
        shipDestroyed: shipDestroyed === undefined ? false : shipDestroyed
    };
}
