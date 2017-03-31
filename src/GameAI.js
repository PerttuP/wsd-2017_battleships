
    /**
      GameAI tries to sink the player's battleships.
      @param {GameArea} area - Player's area.
      @return {GameAI} New AI player.
    */
    function GameAI(area)
    {
        // Lists all coordinates on area.
        function getNotHitLocations(area)
        {
            var allLocations = [];
            for (var i = 0; i < area.squares.length; ++i)
            {
                for (var j = 0; j < area.squares[0].length; ++j)
                {
                    if (!area.squares[i][j].isHit)
                    {
                        allLocations.push(new Coordinate(i,j));
                    }
                }
            }
            return allLocations;
        }

        return {

            notHitSquares: getNotHitLocations(area),
            area: area,
            lastHitInfo: null,
            lastHitLoc: null,
            onGoingShip: {firstHit: null, direction: null},

            /**
              Select random target from candidates. Remove selected candidate.
              @param {Coordinate array} candidates - List of possible targets.
              @return {Coordinate} Randomly selected target.
            */
            getRandomLocation: function(candidates)
            {
                var randIndex = Math.floor(candidates.length * Math.random());
                var result = candidates[randIndex];
                candidates.splice(randIndex, 1);
                return result;
            },

            /**
              Remove loc from target candidates.
              @param {Coordinate} loc - Target to be removed.
            */
            removeHitCandidate: function(loc)
            {
                for (var i = 0; i < this.notHitSquares.length; ++i)
                {
                    if (this.notHitSquares[i].x === loc.x
                            && this.notHitSquares[i].y === loc.y)
                    {
                        this.notHitSquares.splice(i,1);
                        break;
                    }
                }
            },

            /**
              Perform action. Selects target on player area and hits it.
            */
            action: function()
            {
                // Hit random target. Called when there is no recently hit ship.
                function hitRandom(ai)
                {
                    var loc = ai.getRandomLocation(ai.notHitSquares);
                    var hitInfo = ai.area.hit(loc);
                    ai.lastHitInfo = hitInfo
                    ai.lastHitLoc = loc;

                    if (hitInfo.shipHit)
                    {
                        ai.onGoingShip.firstHit = loc;
                    }
                    return hitInfo;
                }

                // Guess ship direction by hitting neigbours of first hit.
                // This is called, when ship has been hit once.
                // TODO: Consider available space when guessing direction.
                function guessDirection(ai)
                {
                    var loc = null;
                    var dir = null;
                    if (indexOfCoordinate(ai.notHitSquares, new Coordinate(ai.onGoingShip.firstHit.x, ai.onGoingShip.firstHit.y+1)) !== -1)
                    {
                        loc = new Coordinate(ai.onGoingShip.firstHit.x, ai.onGoingShip.firstHit.y+1);
                        dir = ShipDirection.DOWN;
                    }
                    else if (indexOfCoordinate(ai.notHitSquares, new Coordinate(ai.onGoingShip.firstHit.x-1, ai.onGoingShip.firstHit.y)) !== -1)
                    {
                        loc = new Coordinate(ai.onGoingShip.firstHit.x-1, ai.onGoingShip.firstHit.y);
                        dir = ShipDirection.LEFT;
                    }
                    else if (indexOfCoordinate(ai.notHitSquares, new Coordinate(ai.onGoingShip.firstHit.x, ai.onGoingShip.firstHit.y-1)) !== -1)
                    {
                        loc = new Coordinate(ai.onGoingShip.firstHit.x, ai.onGoingShip.firstHit.y-1);
                        dir = ShipDirection.UP;
                    }
                    else
                    {
                        loc = new Coordinate(ai.onGoingShip.firstHit.x+1, ai.onGoingShip.firstHit.y);
                        dir = ShipDirection.RIGHT;
                    }

                    var hitInfo = ai.area.hit(loc);
                    if (hitInfo.shipHit)
                    {
                        ai.onGoingShip.direction = dir;
                    }

                    ai.lastHitInfo = hitInfo
                    ai.lastHitLoc = loc;
                    ai.removeHitCandidate(loc);
                    return hitInfo;
                }

                /**
                  Continue destroying ship of which direction has been deduced.
                  This is called, when ship is hit and it's direction has been deduced.
                */
                function hitInCurrentDirection(ai)
                {
                    // Change direction to opposite, if last action failed to hit ship.
                    if (!ai.lastHitInfo.shipHit)
                    {
                        ai.onGoingShip.direction = (ai.onGoingShip.direction + 2) % 4;
                        ai.lastHitLoc = ai.onGoingShip.firstHit;
                    }

                    // Select next target in ship direction.
                    var loc = null;
                    if (ai.onGoingShip.direction === ShipDirection.DOWN)
                    {
                        loc = new Coordinate(ai.lastHitLoc.x, ai.lastHitLoc.y+1);
                    }
                    else if (ai.onGoingShip.direction === ShipDirection.LEFT)
                    {
                        loc = new Coordinate(ai.lastHitLoc.x-1, ai.lastHitLoc.y);
                    }
                    else if (ai.onGoingShip.direction === ShipDirection.UP)
                    {
                        loc = new Coordinate(ai.lastHitLoc.x, ai.lastHitLoc.y-1);
                    }
                    else
                    {
                        loc = new Coordinate(ai.lastHitLoc.x+1, ai.lastHitLoc.y);
                    }

                    // if planned target has already been hit, change direction to opposite.
                    if (indexOfCoordinate(ai.notHitSquares, loc) === -1)
                    {
                        ai.onGoingShip.direction = (ai.onGoingShip.direction + 2) % 4;
                        ai.lastHitLoc = ai.onGoingShip.firstHit;
                        return hitInCurrentDirection(ai);
                    }

                    var hitInfo = ai.area.hit(loc);
                    ai.lastHitInfo = hitInfo
                    ai.lastHitLoc = loc;
                    ai.removeHitCandidate(loc);

                    return hitInfo;
                }

                // This is called, if last action did hit a ship, but did not destroy it.
                function continueDestroyingOngoingShip(ai)
                {
                    var hitInfo = null;
                    if (ai.onGoingShip.direction === null)
                    {
                        hitInfo = guessDirection(ai);
                    }
                    else
                    {
                        hitInfo = hitInCurrentDirection(ai);
                    }

                    return hitInfo;
                }

                // Removes ship neighbour squares from possible targets
                // (there is always at least 1 square between ships).
                // This is called after a ship has been destroyed.
                function removeShipNeighbours(ai)
                {
                    var ship = ai.area.squares[ai.lastHitLoc.x][ai.lastHitLoc.y].ship;
                    var firstX, firstY, lastX, lastY;

                    if (ship.direction === ShipDirection.DOWN)
                    {
                        firstX = ship.loc.x - 1;
                        firstY = ship.loc.y - 1;
                        lastX = ship.loc.x + 1;
                        lastY = ship.loc.y + ship.length;
                    }
                    else if (ship.direction === ShipDirection.UP)
                    {
                        firstX = ship.loc.x - 1;
                        firstY = ship.loc.y - ship.length;
                        lastX = ship.loc.x + 1;
                        lastY = ship.loc.y + 1;
                    }
                    else if (ship.direction === ShipDirection.RIGHT)
                    {
                        firstX = ship.loc.x - 1;
                        firstY = ship.loc.y - 1;
                        lastX = ship.loc.x + ship.length;
                        lastY = ship.loc.y + 1;
                    }
                    else
                    {
                        firstX = ship.loc.x - ship.length;
                        firstY = ship.loc.y - 1;
                        lastX = ship.loc.x + 1;
                        lastY = ship.loc.y + 1;
                    }

                    for (var x = firstX; x <= lastX; ++x)
                    {
                        for (var y = firstY; y <= lastY; ++y)
                        {
                            ai.removeHitCandidate(new Coordinate(x,y));
                        }
                    }
                }

                var hitInfo = null;
                if (this.onGoingShip.firstHit === null)
                {
                    // TODO: Make more educated guess based on remaining ship lengths.
                    hitInfo = hitRandom(this);
                }
                else
                {
                    hitInfo = continueDestroyingOngoingShip(this);
                }

                if (hitInfo.shipDestroyed)
                {
                    // Reset ongoing ship
                    this.onGoingShip.firstHit = null;
                    this.onGoingShip.direction = null;
                    removeShipNeighbours(this);
                }
                return hitInfo;
            },

            /**
              Get AI's state to be saved.
              @return: Object containing necessary data to later restore the state.
            */
            getState: function()
            {
                return {
                    hitOrgin: this.onGoingShip.firstHit,
                    hitDirection: this.onGoingShip.direction,
                    notHitSquares: this.notHitSquares,
                    lastHit: {
                        loc: this.lastHitLoc,
                        shipHit: this.lastHitInfo === null ? false : this.lastHitInfo.shipHit
                    }
                };
            },

            /**
              Restore saved AI state.
              @param {GameArea} area - New target area.
              @param state - Saved AI state.
            */
            restore: function(area, state)
            {
                this.notHitSquares = state.notHitSquares;
                this.area = area;
                this.onGoingShip.firstHit = state.hitOrgin;
                this.onGoingShip.direction = state.hitDirection;
                this.lastHitLoc = state.lastHit.loc;
                this.lastHitInfo = new HitInfo(false, state.lastHit.shipHit, false);
            }
        };
    }
