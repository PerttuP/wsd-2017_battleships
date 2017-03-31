
/**
  Creates new game area. GameArea contains player's (real or AI) ships,
  and remembers hit squares.
  @param {number} x - Top left corner pixel x-coordinate.
  @param {number} y - Top left corner pixel y-coordinate.
  @param {number} rows - Number of squares in vertical direction.
  @param {number} columns - Number of squares in horisontal direction.
  @param {number} sqrWidth - Width of a single square in pixels.
  @param {boolean} showShips - True, if ships are drawn (player's area).
  @return {GameArea} New area without ships.
*/
function GameArea(x, y, rows, columns, sqrWidth, showShips)
{
    // Create 2D array of squares.
    function createSquares(x0, y0, rows, columns, sqrWidth, showShips)
    {
        var allSquares = [];
        for (var col = 0; col < columns; col++)
        {
            var squaresOnCol = [];
            for (var row = 0; row < rows; row++)
            {
                var sqr = new GameSquare(x0 + col*sqrWidth, y0 + row * sqrWidth, sqrWidth);
                sqr.showShips = showShips;
                squaresOnCol.push(sqr);
            }
            allSquares.push(squaresOnCol);
        }
        return allSquares;
    }

    return {
        squares: createSquares(x, y, rows, columns, sqrWidth, showShips),
        hitSquares: [],
        ships: [],

        /**
          Hit given location.
          @param {Coordinate} location - Target location.
          @return {HitInfo} Hit result.
        */
        hit: function(location)
        {
            var hitInfo = new HitInfo();

            if (!this.squares[location.x][location.y].isHit)
            {
                this.hitSquares.push(location);
                this.squares[location.x][location.y].isHit = true;
                var ship = this.squares[location.x][location.y].ship;
                if (ship !== null)
                {
                    ship.hit();
                    hitInfo.shipHit = true;
                    hitInfo.shipDestroyed = ship.isDestroyed();
                }
            }
            else
            {
                hitInfo.ignored = true;
            }

            return hitInfo;
        },

        /**
          Set all ships to random locations.
          Ships must be completely within game area.
          There has to be at least 1 empty square between ships.
          Game area has to be large enough to legally place all ships. Else gets stuck.
          @param {Ship Array} ships - List of ships to be placed.
        */
        setShips : function(ships)
        {
            // Get squares that are too close to already placed ships.
            function getIllegalSquares(area)
            {
                var illegalSquares = []
                for (var i = 0; i < area.ships.length; i++)
                {
                    var locs = area.ships[i].occupiedLocations();
                    for (var j = 0; j < locs.length; j++)
                    {
                        for (var x = locs[j].x-1; x <= locs[j].x+1; x++)
                        {
                            for (var y = locs[j].y-1; y <= locs[j].y+1; y++)
                            {
                                illegalSquares.push( {x:x, y:y} );
                            }
                        }
                    }
                }

                return illegalSquares;
            }

            // Place one ship.
            function setShip(ship, restrictedSquares, area)
            {
                // Select random location within game area.
                dir = Math.floor(4 * Math.random());
                minX = dir === ShipDirection.LEFT ? ship.length-1 : 0;
                minY = dir === ShipDirection.UP ? ship.length -1 : 0;
                maxX = dir === ShipDirection.RIGHT ? area.squares.length - ship.length : area.squares.length-1;
                maxY = dir === ShipDirection.DOWN ? area.squares[0].length - ship.length : area.squares[0].length-1;

                x = Math.floor((maxX-minX)*Math.random() + minX);
                y = Math.floor((maxY-minY)*Math.random() + minY);

                ship.setLocation(x, y);
                ship.setDirection(dir);

                // Check that randomly selected square is valid.
                var locs = ship.occupiedLocations();
                var illegal = false;
                for (var i = 0; i < locs.length; i++)
                {
                    var tested = locs[i];
                    illegal = indexOfCoordinate(illegalSquares, tested) !== -1;
                    if (illegal){
                        break;
                    }

                }
                if (illegal)
                {
                    // If location was illegal, try again (this should not take too many tries).
                    setShip(ship, restrictedSquares, area);
                }
                else
                {
                    // Add ship to game area.
                    area.ships.push(ship);
                    var occupiedSquares = ship.occupiedLocations();
                    for (i = 0; i < occupiedSquares.length; i++)
                    {
                        var sqrLoc = occupiedSquares[i];
                        area.squares[sqrLoc.x][sqrLoc.y].ship = ship;
                    }

                }
            }

            // Individually place each ship.
            for (var i = 0; i < ships.length; i++)
            {
                var ship = ships[i];
                var illegalSquares = getIllegalSquares(this);
                setShip(ship, illegalSquares, this);
            }
        },


        /**
          Draw the game area
          @param ctx - Canvas 2D context.
        */
        draw: function(ctx)
        {
            for (var i = 0; i < this.squares.length; i++)
            {
                for (var j = 0; j < this.squares[0].length; j++){
                    this.squares[i][j].draw(ctx);
                }
            }
        },


        /**
          Restore game area state.
          @param {AreaState} areaState - Saved area state.
        */
        restore: function(areaState)
        {
            this.squares = createSquares(areaState.x, areaState.y, areaState.areaHeight,
                                         areaState.areaWidth, areaState.squareWidth, areaState.showShips);
            // Set ships.
            this.ships = [];
            for (var i = 0; i < areaState.ships.length; ++i)
            {
                var ship = new Ship(areaState.ships[i].length);
                ship.setLocation(areaState.ships[i].loc.x, areaState.ships[i].loc.y);
                ship.setDirection(areaState.ships[i].direction);
                this.ships.push(ship);
            }

            for (i = 0; i < this.ships.length; ++i)
            {
                var occupiedSquares = this.ships[i].occupiedLocations();
                for (var j = 0; j < occupiedSquares.length; j++)
                {
                    var loc = occupiedSquares[j];
                    this.squares[loc.x][loc.y].ship = this.ships[i];
                }
            }

            // Repeat hits.
            for (i = 0; i < areaState.hits.length; i++)
            {
                loc = areaState.hits[i];
                this.hit(loc);
            }
        },


        /**
          Get current area state for saving.
          @return {AreaState} Current area state.
        */
        getAreaState: function()
        {
            return new AreaState(this.squares[0][0].x,
                                 this.squares[0][0].y,
                                 this.squares.length,
                                 this.squares[0].length,
                                 this.squares[0][0].width,
                                 this.ships,
                                 this.hitSquares,
                                 this.squares[0][0].showShips);
        },


        /**
          Check if all ships are destroyed.
          @return {boolean} True, if all ships are destroyed.
        */
        allShipsDestroyed: function()
        {
            var allDestroyed = true;
            for (var i = 0; i < this.ships.length; ++i)
            {
                allDestroyed = this.ships[i].isDestroyed() && allDestroyed;
            }
            return allDestroyed;
        },

        /**
          Get game coordinate at clicked point
          @param {number} clickX - Clicked x-coordinate (related to game area top left corner).
          @param {number} clickY - Clicked y-coordinate (related to game area top left corner).
          @return {Coordinate} Corresponding game coordinate.
        */
        getClickedSquare: function(clickX, clickY)
        {
            var sqrWidth = this.squares[0][0].width;
            var xloc = Math.floor((clickX) / sqrWidth);
            var yloc = Math.floor((clickY) / sqrWidth);
            return new Coordinate(xloc, yloc);
        }
    }
}

