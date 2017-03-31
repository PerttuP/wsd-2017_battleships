
/**
  Creates a 2D-coordinate. Coordinate describes location on GameArea.
  x-coordinate increases to the right and y-coordinate increases to the down.
  Top left coordinate is {x:0, y:0}.
  @param {number} x - The x-coordinate (column).
  @param {number} y - The y-coordinate (row).
  @return {Coordinate} New coordinate with given x and y.
*/
function Coordinate(locX, locY)
{
    return {
        x : locX,
        y : locY,
    }
}

/**
  Searches for equal coordinate from array.
  Coordinates are equal, if they have same x and y.
  @param {Coordinate array} array - Array to be searched from.
  @param {Coordinate} coordinate - Coordinate to be searched for.
  @return {number} Index of first instance of equal coordinate. -1 if not found.
*/
function indexOfCoordinate(array, coordinate)
{
    var index = -1;
    for (var i = 0; i < array.length; ++i)
    {
        if (array[i].x === coordinate.x && array[i].y === coordinate.y)
        {
            index = i;
            break;
        }
    }
    return index;
}
