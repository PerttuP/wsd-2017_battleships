var fs = require("fs");
var coordinateModule = fs.readFileSync("./src/Coordinate.js", "utf-8");
var hitInfoModule = fs.readFileSync("./src/HitInfo.js", "utf-8");
var gameStateModule = fs.readFileSync("./src/GameState.js", "utf-8");
var shipModule = fs.readFileSync("./src/Ship.js", "utf-8");
var gameSquareModule = fs.readFileSync("./src/GameSquare.js", "utf-8");
var gameAreaModule = fs.readFileSync("./src/GameArea.js", "utf-8");
var squareMockModule = require("./helpers/SquareStub");

eval(coordinateModule);
eval(hitInfoModule);
eval(gameStateModule);
eval(shipModule);
eval(gameSquareModule);
eval(gameAreaModule);
var SquareStub = squareMockModule.SquareStub;

describe("GameArea", function()
{

    it ("consists of 2d array of squares", function()
    {
        var rows = 3;
        var cols = 4;
        var sqrWidth = 40;
        var x0 = 10;
        var y0 = 5;
        var showShips = true;
        var area = new GameArea(x0, y0, rows, cols, sqrWidth, showShips);

        expect(area.squares.length).toEqual(cols);
        for (var i = 0; i < area.squares.length; i++)
        {
            expect(area.squares[i].length).toEqual(rows);
        }

        for (var row = 0; row < rows; row++)
        {
            for (var col = 0; col < cols; col++)
            {
                var sqr = area.squares[col][row];
                expect(sqr).toBeDefined();
                expect(sqr.width).toEqual(sqrWidth);
                expect(sqr.x).toEqual(x0 + col*sqrWidth);
                expect(sqr.y).toEqual(y0 + row*sqrWidth);
                expect(sqr.isHit).toBe(false);
                expect(sqr.ship).toBe(null);
                expect(sqr.showShips).toBe(showShips);
            }
        }
    })

    it ("hides ships if told to", function()
    {
        var rows = 3;
        var cols = 4;
        var sqrWidth = 40;
        var x0 = 10;
        var y0 = 5;
        var showShips = false;
        var area = new GameArea(x0, y0, rows, cols, sqrWidth, showShips);

        expect(area.squares.length).toEqual(cols);
        for (var i = 0; i < area.squares.length; i++)
        {
            expect(area.squares[i].length).toEqual(rows);
        }

        for (var row = 0; row < rows; row++)
        {
            for (var col = 0; col < cols; col++)
            {
                var sqr = area.squares[col][row];
                expect(sqr).toBeDefined();
                expect(sqr.width).toEqual(sqrWidth);
                expect(sqr.x).toEqual(x0 + col*sqrWidth);
                expect(sqr.y).toEqual(y0 + row*sqrWidth);
                expect(sqr.isHit).toBe(false);
                expect(sqr.ship).toBe(null);
                expect(sqr.showShips).toBe(showShips);
            }
        }
    })


    it ("initially has no ships or hits", function()
    {
        var area = new GameArea(0, 0, 10, 20, 40);
        expect(area.ships.length).toEqual(0);
        expect(area.hitSquares.length).toEqual(0);
    })

    it ("should set target square to been hit", function()
    {
        var area = new GameArea(0, 0, 10, 20, 40);
        var hitInfo = area.hit(new Coordinate(3,4));

        expect(hitInfo.ignored).toBe(false);
        expect(area.hitSquares.length).toEqual(1);
        expect(area.hitSquares).toContain(new Coordinate(3,4));
        expect(area.squares[3][4].isHit).toBe(true);

    })

    it ("should ignore hit if target square is already hit", function()
    {
        var area = new GameArea(0, 0, 10, 20, 40);
        area.hit(new Coordinate(3,4));
        var ship = new Ship(3);
        ship.setLocation(2,4);
        area.ships.push(ship);
        spyOn(ship, "hit");
        spyOn(ship, "isDestroyed");

        var hitInfo = area.hit(new Coordinate(3,4));
        expect(hitInfo.ignored).toBe(true);
        expect(area.hitSquares.length).toEqual(1);
        expect(area.hitSquares).toContain(new Coordinate(3,4));
        expect(area.squares[3][4].isHit).toBe(true);
        expect(ship.hit).not.toHaveBeenCalled();
        expect(ship.isDestroyed).not.toHaveBeenCalled();
    })

    it ("should damage ship in hit location", function()
    {
        var area = new GameArea(0, 0, 10, 20, 40);
        var ship = new Ship(3);
        ship.setLocation(2,4);
        area.ships.push(ship);
        for (var i = 0; i < ship.occupiedLocations().length; ++i)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        spyOn(ship, "hit");
        spyOn(ship, "isDestroyed").and.returnValue(false);

        var hitInfo = area.hit( new Coordinate(2,5) );
        expect(ship.hit).toHaveBeenCalled();
        expect(ship.isDestroyed).toHaveBeenCalled();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);

    })

    it ("should destroy hit ship in target location", function()
    {
        var area = new GameArea(0, 0, 10, 20, 40);
        var ship = new Ship(3);
        ship.setLocation(2,4);
        area.ships.push(ship);
        for (var i = 0; i < ship.occupiedLocations().length; ++i)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }
        spyOn(ship, "hit");
        spyOn(ship, "isDestroyed").and.returnValue(true);

        var hitInfo = area.hit( new Coordinate(2,5));
        expect(ship.hit).toHaveBeenCalled();
        expect(ship.isDestroyed).toHaveBeenCalled();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
    })


    it ("should set ship location and direction", function()
    {
        var area = new GameArea(0, 0, 10, 20, 40);
        var ship1 = new Ship(2);
        var ship2 = new Ship(3);
        var ship3 = new Ship(5);
        spyOn(ship1, "setDirection");
        spyOn(ship2, "setDirection");
        spyOn(ship3, "setDirection");
        spyOn(ship1, "setLocation");
        spyOn(ship2, "setLocation");
        spyOn(ship3, "setLocation");
        spyOn(ship1, "occupiedLocations").and.returnValue([new Coordinate(0,0), new Coordinate(0,1)]);
        spyOn(ship2, "occupiedLocations").and.returnValue([new Coordinate(0,3), new Coordinate(0,4), new Coordinate(0,5)]);
        spyOn(ship3, "occupiedLocations").and.returnValue([new Coordinate(15,8), new Coordinate(15,7), new Coordinate(15,6), new Coordinate(15,5), new Coordinate(15,4)]);

        area.setShips([ship1, ship2, ship3]);
        expect(ship1.setDirection).toHaveBeenCalled();
        expect(ship1.setLocation).toHaveBeenCalled();
        expect(ship1.occupiedLocations).toHaveBeenCalled();
        expect(ship2.setDirection).toHaveBeenCalled();
        expect(ship2.setLocation).toHaveBeenCalled();
        expect(ship2.occupiedLocations).toHaveBeenCalled();
        expect(ship3.setDirection).toHaveBeenCalled();
        expect(ship3.setLocation).toHaveBeenCalled();
        expect(ship3.occupiedLocations).toHaveBeenCalled();
    })



    it ("should place ships legally", function()
    {
        var area = new GameArea(0, 0, 10, 20, 40);
        var ship1 = new Ship(2);
        var ship2 = new Ship(3);
        var ship3 = new Ship(5);

        // Ships can be set successfully
        area.setShips([ship1, ship2, ship3]);
        expect(area.ships).toContain(ship1);
        expect(area.ships).toContain(ship2);
        expect(area.ships).toContain(ship3);

        var locs1 = ship1.occupiedLocations();
        var locs2 = ship2.occupiedLocations();
        var locs3 = ship3.occupiedLocations();

        // All locations are within area bounds
        // Ships are assigned to their occupied squares.
        expect(locs1.length).toEqual(2);
        for (var i = 0; i < locs1.length; i++) {
            expect(locs1[i].x >= 0 && locs1[i].x < 20).toBe(true);
            expect(locs1[i].y >= 0 && locs1[i].y < 10).toBe(true);
            expect( area.squares[locs1[i].x][locs1[i].y].ship ).toBe(ship1);
        }
        expect(locs2.length).toEqual(3);
        for (i = 0; i < locs1.length; i++) {
            expect(locs2[i].x >= 0 && locs2[i].x < 20).toBe(true);
            expect(locs2[i].y >= 0 && locs2[i].y < 10).toBe(true);
            expect( area.squares[locs2[i].x][locs2[i].y].ship ).toBe(ship2);
        }
        expect(locs3.length).toEqual(5);
        for (i = 0; i < locs1.length; i++) {
            expect(locs3[i].x >= 0 && locs3[i].x < 20).toBe(true);
            expect(locs3[i].y >= 0 && locs3[i].y < 10).toBe(true);
            expect( area.squares[locs3[i].x][locs3[i].y].ship ).toBe(ship3);
        }

        // There is at least 1 square between ships
        for (i = 0; i < locs1.length; i++)
        {
            for (var j = 0; j < locs2.length; j++)
            {
                var diffX = Math.abs(locs1[i].x - locs2[j].x);
                var diffY = Math.abs(locs1[i].y - locs2[j].y);
                expect(diffX > 1 || diffY > 1).toBe(true);
            }
            for (j = 0; j < locs3.length; j++)
            {
                diffX = Math.abs(locs1[i].x - locs3[j].x);
                diffY = Math.abs(locs1[i].y - locs3[j].y);
                expect(diffX > 1 || diffY > 1).toBe(true);
            }
        }
        for (i = 0; i < locs2.length; i++)
        {
            for (j = 0; j < locs3.length; j++)
            {
                diffX = Math.abs(locs2[i].x - locs3[j].x);
                diffY = Math.abs(locs2[i].y - locs3[j].y);
                expect(diffX > 1 || diffY > 1).toBe(true);
            }
        }

    })

    it ("should draw all the squares", function()
    {
        area = new GameArea(0, 0, 3, 4, 40);

        for (var i = 0; i < area.squares.length; i++)
        {
            for (var j = 0; j < area.squares[0].length; j++)
            {
                sqr = new SquareStub();
                spyOn(sqr, "draw");
                area.squares[i][j] = sqr;
            }
        }

        var ctx = {};
        area.draw(ctx);

        for (i = 0; i < area.squares.length; i++)
        {
            for (j = 0; j < area.squares[0].length; j++)
            {
                expect(area.squares[i][j].draw).toHaveBeenCalledWith(ctx);
            }
        }
    })

    it ("can be restored from saved state", function()
    {
        var area = new GameArea(0, 0, 20, 10, 40, false);
        var ship1 = new Ship(2);
        ship1.setLocation(1,2);
        ship1.setDirection(ShipDirection.UP);
        var ship2 = new Ship(3);
        ship2.setLocation(10, 9);
        ship2.setDirection(ShipDirection.LEFT);
        var hitSquares = [new Coordinate(1,1), new Coordinate(1,2), new Coordinate(1,3), new Coordinate(10,9)];
        var areaState = new AreaState(10, 20, 13, 12, 50, [ship1, ship2], hitSquares, true);

        area.restore(areaState.simplify());

        expect(area.squares.length).toEqual(13);
        expect(area.squares[0].length).toEqual(12);
        expect(area.squares[0][0].x).toEqual(10);
        expect(area.squares[0][0].y).toEqual(20);

        expect(area.ships.length).toEqual(2);
        expect(area.ships[0].damage).toEqual(2);
        expect(area.ships[0].isDestroyed()).toBe(true);
        expect(area.ships[1].damage).toEqual(1);
        expect(area.ships[1].isDestroyed()).toBe(false);

        expect(area.ships[0].loc.x).toEqual(1);
        expect(area.ships[0].loc.y).toEqual(2);
        expect(area.ships[1].loc.x).toEqual(10);
        expect(area.ships[1].loc.y).toEqual(9);

        expect(area.squares[1][1].isHit).toBe(true);
        expect(area.squares[1][2].isHit).toBe(true);
        expect(area.squares[1][3].isHit).toBe(true);
        expect(area.squares[10][9].isHit).toBe(true);

        for (var i = 0; i < area.squares.length; i++)
        {
            for(var j = 0; j < area.squares[0].length; j++)
            {
                expect(area.squares[i][j].width).toEqual(50);
                expect(area.squares[i][j].showShips).toBe(true);
            }
        }
    })


    it ("can be asked to give area state.", function()
    {
        var area = new GameArea(10, 20, 12, 13, 50, false);
        var ship1 = new Ship(2);
        ship1.setLocation(1,2);
        ship1.setDirection(ShipDirection.UP);
        var ship2 = new Ship(3);
        ship2.setLocation(10,10);
        ship2.setDirection(ShipDirection.LEFT);
        area.ships = [ship1, ship2];

        for (var i = 0; i < ship1.occupiedLocations(); ++i)
        {
            var loc = ship1.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship1;
        }
        for (i = 0; i < ship2.occupiedLocations(); ++i)
        {
            loc = ship2.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship2;
        }

        area.hit(new Coordinate(1,1));
        area.hit(new Coordinate(1,2));
        area.hit(new Coordinate(1,3));
        area.hit(new Coordinate(10,10));

        var areaState = area.getAreaState();

        expect(areaState.x).toEqual(10);
        expect(areaState.y).toEqual(20);
        expect(areaState.areaWidth).toEqual(13);
        expect(areaState.areaHeight).toEqual(12);
        expect(areaState.squareWidth).toEqual(50);
        expect(areaState.ships).toContain(ship1);
        expect(areaState.ships).toContain(ship2);
        expect(areaState.hits).toContain(new Coordinate(1,1));
        expect(areaState.hits).toContain(new Coordinate(1,2));
        expect(areaState.hits).toContain(new Coordinate(1,3));
        expect(areaState.hits).toContain(new Coordinate(10,10));
        expect(areaState.showShips).toBe(false);
    })

    it ("should not declare all ships destroyed if they are not", function()
    {
        var area = new GameArea(0, 0, 10, 5, 40, true);
        var ship1 = new Ship(3);
        var ship2 = new Ship(2);
        var ship3 = new Ship(5);
        spyOn(ship1, "isDestroyed").and.returnValue(true);
        spyOn(ship2, "isDestroyed").and.returnValue(false);
        spyOn(ship3, "isDestroyed").and.returnValue(true);
        area.ships = [ship1, ship2, ship3];

        var allDestroyed = area.allShipsDestroyed();
        expect(ship1.isDestroyed).toHaveBeenCalled();
        expect(ship2.isDestroyed).toHaveBeenCalled();
        expect(ship3.isDestroyed).toHaveBeenCalled();
        expect(allDestroyed).toBe(false);
    })

    it ("should declare all ships destroyed if they are", function()
    {
        var area = new GameArea(0, 0, 10, 5, 40, true);
        var ship1 = new Ship(3);
        var ship2 = new Ship(2);
        var ship3 = new Ship(5);
        spyOn(ship1, "isDestroyed").and.returnValue(true);
        spyOn(ship2, "isDestroyed").and.returnValue(true);
        spyOn(ship3, "isDestroyed").and.returnValue(true);
        area.ships = [ship1, ship2, ship3];

        var allDestroyed = area.allShipsDestroyed();
        expect(ship1.isDestroyed).toHaveBeenCalled();
        expect(ship2.isDestroyed).toHaveBeenCalled();
        expect(ship3.isDestroyed).toHaveBeenCalled();
        expect(allDestroyed).toBe(true);
    })

    it ("should tell clicked square coordinates", function()
    {
        var area = new GameArea(0, 0, 10, 5, 40, true);

        var loc = area.getClickedSquare(0, 0);
        expect(loc.x).toEqual(0);
        expect(loc.y).toEqual(0);

        loc = area.getClickedSquare(39, 39);
        expect(loc.x).toEqual(0);
        expect(loc.y).toEqual(0);

        loc = area.getClickedSquare(40, 40);
        expect(loc.x).toEqual(1);
        expect(loc.y).toEqual(1);

        loc = area.getClickedSquare(380, 180);
        expect(loc.x).toEqual(9);
        expect(loc.y).toEqual(4);
    })

})

