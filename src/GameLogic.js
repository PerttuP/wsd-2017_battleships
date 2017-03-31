
/**
  Creates top level game logic component.
  GameLogic is responsible for initializing the game, saving and loading game,
  controlling AI and counting the score.
  @param {number} areaWidth - number of squares on row on each area.
  @param {number} areaHeight - number of squares on column on each area.
  @param playerAreaCtx - 2D canvas context for player area.
  @param enemyAreaCtx - 2D canvas context for enemy area.
  @return {GameLogic} Uninitialized game logic.
*/
function GameLogic(areaWidht, areaHeight, playerAreaCtx, enemyAreaCtx)
{
    return {

        enemyArea: new GameArea(0, 0, areaHeight, areaWidht, 40, false),
        playerArea: new GameArea(0, 0, areaHeight, areaWidht, 40, true),
        enemy: null,
        playerAreaCtx: playerAreaCtx,
        enemyAreaCtx: enemyAreaCtx,
        actionCount: 0,

        /**
          Initializes both game areas with random ship locations.
          Initializes the AI player. Draws the game areas.
        */
        init: function()
        {
            var playerShips = [new Ship(5), new Ship(3), new Ship(2)];
            this.playerArea.setShips(playerShips);
            var enemyShips = [new Ship(5), new Ship(3), new Ship(2)];
            this.enemyArea.setShips(enemyShips);
            this.enemy = new GameAI(this.playerArea);
            this.playerArea.draw(this.playerAreaCtx);
            this.enemyArea.draw(this.enemyAreaCtx);
        },

        /**
          Gets current game state for saving.
          @return {GameState} Current game state.
        */
        save: function()
        {
            var playerAreaState = this.playerArea.getAreaState();
            var enemyAreaState = this.enemyArea.getAreaState();
            var aiState = this.enemy.getState();
            return new GameState(this.actionCount, playerAreaState, enemyAreaState, aiState);
        },

        /**
          Sets up the game based on saved game state
          @param {GameState} gameState - state to be loaded.
        */
        load: function(gameState)
        {
            if (this.enemy === null)
            {
                this.init();
            }

            this.actionCount = gameState.actionCount;
            this.playerArea.restore(gameState.playerArea);
            this.enemyArea.restore(gameState.enemyArea);
            this.enemy.restore(this.playerArea, gameState.aiState);
            this.playerArea.draw(this.playerAreaCtx);
            this.enemyArea.draw(this.enemyAreaCtx);
        },

        /**
          Get current score. Score is 0 until player wins.
          Winning scores are between 100 - 1000 depending on used actions.
          @return {number} Current score.
        */
        score: function()
        {
            var score = 0;
            if (this.enemyArea.allShipsDestroyed())
            {
                var maximumActions = this.enemyArea.squares.length*this.enemyArea.squares[0].length;
                var minimumActions = 0;
                for (var i = 0; i < this.enemyArea.ships.length; ++i)
                {
                    minimumActions += this.enemyArea.ships[i].length;
                }

                var maxDiff = maximumActions-minimumActions;
                var ratio = (maxDiff - (this.actionCount-minimumActions)) / (maxDiff);
                score = 100 + Math.floor(ratio*900);
            }
            else
            {
                score = 0;
            }
            return score;
        },

        /**
          Check if game is over.
          @return {boolean} True, if game is over. See score for result.
        */
        isGameOver: function()
        {
            return this.playerArea.allShipsDestroyed() || this.enemyArea.allShipsDestroyed();
        },

        /**
          Execute player action.
          @param {Coordinate} target - Player's target coordinate on enemy area.
          @return {HitInfo} The result for player's action.
        */
        playerAction: function(target)
        {
            var hitInfo = this.enemyArea.hit(target);
            if (!hitInfo.ignored)
            {
                this.actionCount += 1;
                this.enemyArea.draw(this.enemyAreaCtx);
            }
            return hitInfo;
        },

        /**
          Execute AI player action. AI makes its action.
          @return {HitInfo} The result of AI player's action.
        */
        enemyAction: function()
        {
            var hitInfo = this.enemy.action();
            this.playerArea.draw(this.playerAreaCtx);
            return hitInfo;
        }
    }
}

