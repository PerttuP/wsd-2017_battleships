var fs = require("fs");
var coordinateModule = fs.readFileSync("./src/Coordinate.js", "utf-8");
var shipModule = fs.readFileSync("./src/Ship.js", "utf-8");
eval(coordinateModule);
eval(shipModule);

describe("Ship", function(){

    it("has given length", function(){
        ship1 = new Ship(3);
        expect(ship1.length).toEqual(3);

        ship2 = new Ship(5);
        expect(ship2.length).toEqual(5);
    })

    it("has initial direction DOWN", function(){
        ship = new Ship(3);
        expect(ship.direction).toEqual(ShipDirection.DOWN);
    })

    it("initially has x and y as 0", function(){
        ship = new Ship(3);
        expect(ship.loc.x).toEqual(0);
        expect(ship.loc.y).toEqual(0);
    })

    it("initially has 0 damage", function(){
        ship = new Ship(3);
        expect(ship.damage).toEqual(0);
        expect(ship.isDestroyed()).toBe(false);
    })

    it ("will be destroyed when damage gets to length", function(){
        ship = new Ship(3);
        ship.damage = 1;
        expect(ship.isDestroyed()).toBe(false);
        ship.damage = 3;
        expect(ship.isDestroyed()).toBe(true);
    })

    it("can have new x and y", function(){
        ship = new Ship(3);
        ship.setLocation(1,2);
        expect(ship.loc.x).toEqual(1);
        expect(ship.loc.y).toEqual(2);
        expect(ship.length).toEqual(3);
    })

    it("occupies locations depending on x, y, length and direction DOWN", function(){
        ship = new Ship(3);
        locations = ship.occupiedLocations();
        expect(locations).toContain({x:0, y:0});
        expect(locations).toContain({x:0, y:1});
        expect(locations).toContain({x:0, y:2});
    })

    it("occupies locations depending on x, y, length and direction RIGHT", function(){
        ship = new Ship(3);
        ship.direction = ShipDirection.RIGHT;
        locations1 = ship.occupiedLocations();
        expect(locations).toContain({x:0, y:0});
        expect(locations).toContain({x:1, y:0});
        expect(locations).toContain({x:2, y:0});
    })

    it("occupies locations depending on x, y, length and direction UP", function(){
        ship = new Ship(5);
        ship.setLocation(4, 4);
        ship.direction = ShipDirection.UP;
        locations = ship.occupiedLocations();
        expect(locations).toContain({x:4, y:4});
        expect(locations).toContain({x:4, y:3});
        expect(locations).toContain({x:4, y:2});
        expect(locations).toContain({x:4, y:1});
        expect(locations).toContain({x:4, y:0});
    })

    it("occupies locations depending on x, y, length and direction LEFT", function(){
        ship = new Ship(5);
        ship.setLocation(4, 4);
        ship.direction = ShipDirection.LEFT;
        locations = ship.occupiedLocations();
        expect(locations).toContain({x:4, y:4});
        expect(locations).toContain({x:3, y:4});
        expect(locations).toContain({x:2, y:4});
        expect(locations).toContain({x:1, y:4});
        expect(locations).toContain({x:0, y:4});
    })

    it ("takes damage on hit", function()
    {
        var ship = new Ship(5);

        expect(ship.damage).toEqual(0);
        ship.hit();
        expect(ship.damage).toEqual(1);
    })

    it ("may get new direction", function()
    {
        var ship = new Ship(5);

        expect(ship.direction).toEqual(ShipDirection.DOWN);
        ship.setDirection(ShipDirection.UP);
        expect(ship.direction).toEqual(ShipDirection.UP);
    })

})
