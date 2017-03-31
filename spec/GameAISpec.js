var fs = require("fs");
var coordinateModule = fs.readFileSync("./src/Coordinate.js", "utf-8");
var hitInfoModule = fs.readFileSync("./src/HitInfo.js", "utf-8");
var gameSquareModule = fs.readFileSync("./src/GameSquare.js", "utf-8");
var shipModule = fs.readFileSync("./src/Ship.js", "utf-8");
var gameAreaModule = fs.readFileSync("./src/GameArea.js", "utf-8");
var gameAIModule = fs.readFileSync("./src/GameAI.js", "utf-8");

eval(coordinateModule);
eval(hitInfoModule);
eval(gameSquareModule);
eval(shipModule);
eval(gameAreaModule);
eval(gameAIModule);


describe ("GameAI", function()
{
    it ("Initially has not hit any squares", function()
    {
        var area = new GameArea(0, 0, 10, 12, 20, true);
        var ai = new GameAI(area);
        expect(ai.notHitSquares.length).toEqual(10*12);
        expect(ai.lastHitInfo).toBe(null);
        expect(ai.lastHitLoc).toBe(null);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })


    it ("Always hits new square", function()
    {
        area = new GameArea(0, 0, 10, 12, 40, true);
        spyOn(area, "hit").and.returnValue({ignored: false, shipHit: false, shipDestroyed: false});
        ai = new GameAI(area);

        for (var i = 0; i < 10*12; i++)
        {
            var hitInfo = ai.action();
            expect(ai.lastHitInfo).toBe(hitInfo);
            expect(ai.lastHitLocation).not.toBe(null);
            expect(area.hit).toHaveBeenCalled();
            expect(hitInfo.ignored).toBe(false);
            expect(hitInfo.shipHit).toBe(false);
            expect(hitInfo.shipDestroyed).toBe(false);
            expect(ai.notHitSquares.length).toBe(10*12 - (i+1));
            expect(ai.onGoingShip.firstHit).toBe(null);
            expect(ai.onGoingShip.direction).toBe(null);
        }
    })


    it ("remembers hitting ship", function()
    {
        area = new GameArea(0, 0, 10, 12, 40, true);
        spyOn(area, "hit").and.returnValue({ignored: false, shipHit: true, shipDestroyed: false});
        ai = new GameAI(area);

        var hitInfo = ai.action();
        expect(ai.lastHitInfo).toBe(hitInfo);
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.notHitSquares.length).toEqual(10*12-1);
        expect(ai.onGoingShip.firstHit).toBe(ai.lastHitLoc);
        expect(ai.onGoingShip.direction).toBe(null);
    })

    it ("Should deduce that ship direction is DOWN", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.DOWN);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        var hitInfo = ai.action();
        expect(ai.getRandomLocation).toHaveBeenCalled();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(null);

        hitInfo = ai.action();
        expect(ai.getRandomLocation.calls.count()).toEqual(1);
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.lastHitLoc.x).toEqual(5);
        expect(ai.lastHitLoc.y).toEqual(6);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(ShipDirection.DOWN);
        expect(ai.notHitSquares.length).toEqual(10*12-2);
    })

    it ("Should deduce that ship direction is LEFT", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.LEFT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        var hitInfo = ai.action();
        expect(ai.getRandomLocation).toHaveBeenCalled();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(null);

        hitInfo = ai.action();
        hitInfo = ai.action();
        expect(ai.getRandomLocation.calls.count()).toEqual(1);
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.lastHitLoc.x).toEqual(4);
        expect(ai.lastHitLoc.y).toEqual(5);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(ShipDirection.LEFT);
        expect(ai.notHitSquares.length).toEqual(10*12-3);
    })

    it ("Should deduce that ship direction is UP", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.UP);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        var hitInfo = ai.action();
        expect(ai.getRandomLocation).toHaveBeenCalled();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(null);

        hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();
        expect(ai.getRandomLocation.calls.count()).toEqual(1);
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.lastHitLoc.x).toEqual(5);
        expect(ai.lastHitLoc.y).toEqual(4);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(ShipDirection.UP);
        expect(ai.notHitSquares.length).toEqual(10*12-4);
    })

    it ("Should deduce that ship direction is RIGHT", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.RIGHT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        var hitInfo = ai.action();
        expect(ai.getRandomLocation).toHaveBeenCalled();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(null);

        hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();
        expect(ai.getRandomLocation.calls.count()).toEqual(1);
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.lastHitLoc.x).toEqual(6);
        expect(ai.lastHitLoc.y).toEqual(5);
        expect(ai.onGoingShip.firstHit.x).toBe(5);
        expect(ai.onGoingShip.firstHit.y).toBe(5);
        expect(ai.onGoingShip.direction).toBe(ShipDirection.RIGHT);
        expect(ai.notHitSquares.length).toEqual(10*12-5);
    })

    it ("Should skip testing DOWN if already hit", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.RIGHT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }
        area.hit(new Coordinate(5,6));

        var ai = new GameAI(area);
        ai.removeHitCandidate(new Coordinate(5,6));
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        var hitInfo = ai.action();
        hitInfo = ai.action();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(false);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.getRandomLocation.calls.count()).toEqual(1);
        expect(ai.onGoingShip.firstHit.x).toEqual(5);
        expect(ai.onGoingShip.firstHit.y).toEqual(5);
        expect(ai.onGoingShip.direction).toBe(null);
        expect(ai.lastHitInfo).toBe(hitInfo);
        expect(ai.lastHitLoc.x).toEqual(4);
        expect(ai.lastHitLoc.y).toEqual(5);
    })

    it ("Should skip testing LEFT if already hit", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.RIGHT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }
        area.hit(new Coordinate(5,6));
        area.hit(new Coordinate(4,5));

        var ai = new GameAI(area);
        ai.removeHitCandidate(new Coordinate(5,6));
        ai.removeHitCandidate(new Coordinate(4,5));
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        var hitInfo = ai.action();
        hitInfo = ai.action();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(false);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.getRandomLocation.calls.count()).toEqual(1);
        expect(ai.onGoingShip.firstHit.x).toEqual(5);
        expect(ai.onGoingShip.firstHit.y).toEqual(5);
        expect(ai.onGoingShip.direction).toBe(null);
        expect(ai.lastHitInfo).toBe(hitInfo);
        expect(ai.lastHitLoc.x).toEqual(5);
        expect(ai.lastHitLoc.y).toEqual(4);
    })

    it ("Should skip testing UP if already hit", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.RIGHT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }
        area.hit(new Coordinate(5,6));
        area.hit(new Coordinate(4,5));
        area.hit(new Coordinate(5,4));

        var ai = new GameAI(area);
        ai.removeHitCandidate(new Coordinate(5,6));
        ai.removeHitCandidate(new Coordinate(4,5));
        ai.removeHitCandidate(new Coordinate(5,4));
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        var hitInfo = ai.action();
        hitInfo = ai.action();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(ai.getRandomLocation.calls.count()).toEqual(1);
        expect(ai.onGoingShip.firstHit.x).toEqual(5);
        expect(ai.onGoingShip.firstHit.y).toEqual(5);
        expect(ai.onGoingShip.direction).toBe(ShipDirection.RIGHT);
        expect(ai.lastHitInfo).toBe(hitInfo);
        expect(ai.lastHitLoc.x).toEqual(6);
        expect(ai.lastHitLoc.y).toEqual(5);
    })

    it ("Should destroy vertical ship starting from head", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.DOWN);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 3 actions.
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })

    it ("Should destroy vertical ship starting from bottom", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.UP);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 5 actions.
        ai.action();
        ai.action();
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })

    it ("Should destroy horisontal ship starting from head", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.LEFT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 4 actions.
        ai.action();
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })

    it ("Should destroy horisontal ship starting from bottom", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.RIGHT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 6 actions.
        ai.action();
        ai.action();
        ai.action();
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })

    it ("Should destroy vertical ship starting from middle", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,4);
        ship.setDirection(ShipDirection.DOWN);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 4 actions.
        var hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();

        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })

    it ("Should destroy horisontal ship starting from middle", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(4,5);
        ship.setDirection(ShipDirection.RIGHT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 5 actions.
        var hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();

        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })

    it ("should change direction if next square is already hit", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,4);
        ship.setDirection(ShipDirection.DOWN);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }
        area.hit(new Coordinate(5,7));

        var ai = new GameAI(area);
        ai.removeHitCandidate(new Coordinate(5,7));
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 3 actions.
        var hitInfo = ai.action();
        hitInfo = ai.action();
        hitInfo = ai.action();

        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);
    })


    it ("Should remove neighbour squares from candidates after downward ship is destroyed", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.DOWN);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 3 actions.
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);

        for (i = 4; i < 7; ++i)
        {
            for (var j = 4; j < 9; ++j)
            {
                expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(i,j))).toEqual(-1);
            }
        }
    })

    it ("Should remove neighbour squares from candidates after upward ship is destroyed", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.UP);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 5 actions.
        ai.action();
        ai.action();
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);

        for (i = 4; i < 7; ++i)
        {
            for (var j = 2; j < 7; ++j)
            {
                expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(i,j))).toEqual(-1);
            }
        }
    })


    it ("Should remove neighbour squares from candidates after rightward ship is destroyed", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.RIGHT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 6 actions.
        ai.action();
        ai.action();
        ai.action();
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);

        for (i = 4; i < 9; ++i)
        {
            for (var j = 4; j < 7; ++j)
            {
                expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(i,j))).toEqual(-1);
            }
        }
    })

    it ("Should remove neighbour squares from candidates after leftward ship is destroyed", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ship = new Ship(3);
        ship.setLocation(5,5);
        ship.setDirection(ShipDirection.LEFT);
        area.ships = [ship];
        for (var i = 0; i < ship.occupiedLocations().length; i++)
        {
            var loc = ship.occupiedLocations()[i];
            area.squares[loc.x][loc.y].ship = ship;
        }

        var ai = new GameAI(area);
        spyOn(ai, "getRandomLocation").and.callFake( function(foo){
            ai.removeHitCandidate(new Coordinate(5,5));
            return new Coordinate(5,5)
        });

        // Destroying ship should take 4 actions.
        ai.action();
        ai.action();
        ai.action();
        var hitInfo = ai.action();

        expect(hitInfo.shipDestroyed).toBe(true);
        expect(ai.onGoingShip.firstHit).toBe(null);
        expect(ai.onGoingShip.direction).toBe(null);

        for (i = 2; i < 7; ++i)
        {
            for (var j = 4; j < 7; ++j)
            {
                expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(i,j))).toEqual(-1);
            }
        }
    })

    it ("should give current state to be saved", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ai = new GameAI(area);

        ai.onGoingShip.firstHit = null;
        ai.onGoingShip.firstHit = null;
        ai.lastHitLoc = null;
        ai.lastHitInfo = new HitInfo(false, false, false)
        ai.notHitLocations = [new Coordinate(0,0), new Coordinate(0,1), new Coordinate(1,1)]

        var state = ai.getState();
        expect(state.hitOrgin).toBe(null);
        expect(state.hitDirection).toBe(null);
        expect(state.lastHit.loc).toBe(null);
        expect(state.lastHit.shipHit).toBe(false);

        ai.onGoingShip.firstHit = new Coordinate(3,4);
        ai.lastHitInfo = new HitInfo(false, true, false)
        ai.lastHitLoc = new Coordinate(3,4);
        state = ai.getState();
        expect(state.hitOrgin.x).toEqual(3);
        expect(state.hitOrgin.y).toEqual(4);
        expect(state.hitDirection).toBe(null);
        expect(state.lastHit.loc.x).toEqual(3);
        expect(state.lastHit.loc.y).toEqual(4);
        expect(state.lastHit.shipHit).toBe(true);

        ai.onGoingShip.direction = ShipDirection.UP;
        ai.lastHitInfo = new HitInfo(false, true, false)
        ai.lastHitLoc = new Coordinate(3,3);
        state = ai.getState();
        expect(state.hitOrgin.x).toEqual(3);
        expect(state.hitOrgin.y).toEqual(4);
        expect(state.hitDirection).toBe(ShipDirection.UP);
        expect(state.lastHit.loc.x).toEqual(3);
        expect(state.lastHit.loc.y).toEqual(3);
        expect(state.lastHit.shipHit).toBe(true);
        expect(state.notHitSquares.length).toEqual(120);
    })


    it ("should restore saved state", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ai = new GameAI(area);
        var notHitLocations = [new Coordinate(0,0), new Coordinate(0,1), new Coordinate(1,1)];

        var area2 = new GameArea(0, 0, 10, 12, 40, true);
        var aiState = {
            hitOrgin: new Coordinate(5,6),
            hitDirection: ShipDirection.LEFT,
            lastHit: {
                loc: new Coordinate(6,7),
                shipHit: true
            },
            notHitSquares: notHitLocations
        };

        ai.restore(area2, aiState);

        expect(ai.area).toBe(area2);
        expect(ai.onGoingShip.firstHit.x).toEqual(5);
        expect(ai.onGoingShip.firstHit.y).toEqual(6);
        expect(ai.onGoingShip.direction).toEqual(ShipDirection.LEFT);
        expect(ai.lastHitLoc.x).toEqual(6);
        expect(ai.lastHitLoc.y).toEqual(7);
        expect(ai.lastHitInfo.shipHit).toBe(true);
        expect(ai.notHitSquares.length).toEqual(3);
        expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(0,0)) ).not.toEqual(-1);
        expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(0,1)) ).not.toEqual(-1);
        expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(1,1)) ).not.toEqual(-1);
    })

    it ("can remove candidates", function()
    {
        var area = new GameArea(0, 0, 10, 12, 40, true);
        var ai = new GameAI(area);
        ai.notHitSquares = [new Coordinate(0,0), new Coordinate(0,1), new Coordinate(1,1)];

        ai.removeHitCandidate(new Coordinate(0,0));
        expect(ai.notHitSquares.length).toEqual(2);
        expect(indexOfCoordinate(ai.notHitSquares, new Coordinate(0,0)) ).toEqual(-1);
    })
})
