
/**
  Enumeration for ship orientation.
*/
ShipDirection = {
    DOWN : 0,
    LEFT : 1,
    UP : 2,
    RIGHT : 3
}

/**
  Create new Ship.
  @param {number} length - Ship length (in squares).
  @return {Ship} New ship with given length.
  Ship has full hit points and has default location (0,0) and direction DOWN.
*/
function Ship(shipLength)
{
    return {
        length : shipLength,
        loc : new Coordinate(0,0),
        direction : ShipDirection.DOWN,
        damage : 0,

        /**
          Check if ship is destroyed.
          @return {boolean} True, if ship is destroyed.
        */
        isDestroyed : function()
        {
            return this.damage === this.length;
        },

        /**
          Set ship location.
          @param {number} newX - new x-coordinate.
          @param {number} newY - new y-coordinate.
        */
        setLocation : function(newX, newY)
        {
            this.loc = new Coordinate(newX, newY);
        },

        /**
          Hit ship. Ship takes one more damage.
        */
        hit: function()
        {
            this.damage += 1;
        },

        /**
          Set ship direction.
          @param {ShipDirection} newDir - new direction.
        */
        setDirection: function(newDir)
        {
            this.direction = newDir;
        },

        /**
          Get list of location occupied by the ship.
          @return {Coordinate list} List of occupied squares.
        */
        occupiedLocations : function()
        {
            function stopCondition(iterator, ship)
            {
                switch (ship.direction)
                {
                case ShipDirection.DOWN:
                    return iterator.y === ship.loc.y + ship.length;
                case ShipDirection.UP:
                    return iterator.y === ship.loc.y - ship.length;
                case ShipDirection.LEFT:
                    return iterator.x === ship.loc.x - ship.length;
                default:
                    return iterator.x === ship.loc.x + ship.length;
                }
            }

            function increaseIterator(iterator, ship)
            {
                switch (ship.direction)
                {
                case ShipDirection.DOWN:
                    return new Coordinate(iterator.x, iterator.y+1);
                case ShipDirection.UP:
                    return new Coordinate(iterator.x, iterator.y-1);
                case ShipDirection.LEFT:
                    return new Coordinate(iterator.x-1, iterator.y);
                default:
                    return new Coordinate(iterator.x+1, iterator.y);
                }
            }

            locations = [];
            var it = this.loc;
            while (!stopCondition(it, this))
            {
                locations.push(it);
                it = increaseIterator(it, this)
            }
            return locations;
        }
    }
}
