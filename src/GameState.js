

/**
  Stores state of game area (player's or AI-player's).
  @param {number} x - X-coordinate of area's top left corner. Default: 0.
  @param {number} y - Y-coordinate of area's top left corner. Default: 0.
  @param {number} areaWidth - Number of squares on row. Default: 0.
  @param {number} areaHeight - Number of squares on column. Default: 0.
  @param {number} squareWidth - Width of a single square (px). Default: 0.
  @param {Ship array} ships - Array containing all ships on area. Default: empty.
  @param {Coordinate array} hits - Array of hit squares on area. Default: empty.
  @param {boolean} showShips - True, if ships are supposed to be drawn (player's area). Default: false.
  @return {AreaState} Object containing given parameters.
*/
function AreaState(x, y, areaWidth, areaHeight, squareWidth, ships, hits, showShips)
{
    return {
        x: x === undefined ? 0 : x,
        y: y === undefined ? 0 : y,
        areaWidth: areaWidth === undefined ? 0 : areaWidth,
        areaHeight: areaHeight === undefined ? 0 : areaHeight,
        squareWidth: squareWidth === undefined ? 0 : squareWidth,
        ships: ships === undefined ? [] : ships,
        hits: hits === undefined ? [] : hits,
        showShips: showShips === undefined ? false : showShips,

        /**
          Simplifies area state so that is can be serialized.
        */
        simplify: function()
        {
            var simplified = {
                x: this.x,
                y: this.y,
                areaWidth: this.areaWidth,
                areaHeight: this.areaHeight,
                squareWidth: this.squareWidth,
                ships: [],
                hits: this.hits,
                showShips: this.showShips
            };

            for (var i = 0; i < this.ships.length; ++i)
            {
                var ship = this.ships[i];
                var simplifiedShip = {
                    loc: {x: ship.loc.x, y: ship.loc.y},
                    direction: ship.direction,
                    length: ship.length
                };
                simplified.ships.push(simplifiedShip);
            }

            return simplified;

        }
    };
}


/**
  Stores the whole game state.
  @param {number} actionCount - Number of executed actions for each player (always saved at even). Default: 0.
  @param {AreaState} playerArea - State of player's area. Default: null.
  @param {AreaState} enemyArea - State of AI player's area. Default: null.
  @return {GameState} Object containing stored parameters.
*/
function GameState(actionCount, playerArea, enemyArea, aiState)
{
    return {
        actionCount: actionCount === undefined ? 0 : actionCount,
        playerArea: playerArea === undefined ? null : playerArea,
        enemyArea: enemyArea === undefined ? null : enemyArea,
        aiState: aiState === undefined ? null : aiState,

        /**
          Simplifies game state so that it can be serialized.
        */
        simplify: function()
        {
            return {
                actionCount: this.actionCount,
                playerArea: this.playerArea.simplify(),
                enemyArea: this.enemyArea.simplify(),
                aiState: this.aiState
            };
        }
    };
}
