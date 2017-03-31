var fs = require("fs");
var coordinateModule = fs.readFileSync("./src/Coordinate.js", "utf-8");
var shipModule = fs.readFileSync("./src/Ship.js", "utf-8");
var gameStateModule = fs.readFileSync("./src/GameState.js", "utf-8");

eval(coordinateModule);
eval(shipModule);
eval(gameStateModule);

describe("AreaState", function()
{
    it ("is empty by default", function()
    {
        var areaState = new AreaState();
        expect(areaState.x).toEqual(0);
        expect(areaState.y).toEqual(0);
        expect(areaState.areaWidth).toEqual(0);
        expect(areaState.areaHeight).toEqual(0);
        expect(areaState.squareWidth).toEqual(0);
        expect(areaState.ships.length).toEqual(0);
        expect(areaState.hits.length).toEqual(0);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other x than default", function()
    {
        var areaState = new AreaState(1);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(0);
        expect(areaState.areaWidth).toEqual(0);
        expect(areaState.areaHeight).toEqual(0);
        expect(areaState.squareWidth).toEqual(0);
        expect(areaState.ships.length).toEqual(0);
        expect(areaState.hits.length).toEqual(0);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other y than default", function()
    {
        var areaState = new AreaState(1, 2);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(2);
        expect(areaState.areaWidth).toEqual(0);
        expect(areaState.areaHeight).toEqual(0);
        expect(areaState.squareWidth).toEqual(0);
        expect(areaState.ships.length).toEqual(0);
        expect(areaState.hits.length).toEqual(0);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other areaWidth than default", function()
    {
        var areaState = new AreaState(1, 2, 12);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(2);
        expect(areaState.areaWidth).toEqual(12);
        expect(areaState.areaHeight).toEqual(0);
        expect(areaState.squareWidth).toEqual(0);
        expect(areaState.ships.length).toEqual(0);
        expect(areaState.hits.length).toEqual(0);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other areaHeight than default", function()
    {
        var areaState = new AreaState(1, 2, 12, 10);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(2);
        expect(areaState.areaWidth).toEqual(12);
        expect(areaState.areaHeight).toEqual(10);
        expect(areaState.squareWidth).toEqual(0);
        expect(areaState.ships.length).toEqual(0);
        expect(areaState.hits.length).toEqual(0);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other squareWidth than default", function()
    {
        var areaState = new AreaState(1, 2, 12, 10, 40);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(2);
        expect(areaState.areaWidth).toEqual(12);
        expect(areaState.areaHeight).toEqual(10);
        expect(areaState.squareWidth).toEqual(40);
        expect(areaState.ships.length).toEqual(0);
        expect(areaState.hits.length).toEqual(0);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other ships than default", function()
    {
        var areaState = new AreaState(1, 2, 12, 10, 40, [{}]);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(2);
        expect(areaState.areaWidth).toEqual(12);
        expect(areaState.areaHeight).toEqual(10);
        expect(areaState.squareWidth).toEqual(40);
        expect(areaState.ships.length).toEqual(1);
        expect(areaState.hits.length).toEqual(0);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other hits than default", function()
    {
        var areaState = new AreaState(1, 2, 12, 10, 40, [{}], [{x:1,y:2},{x:2,y:1}]);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(2);
        expect(areaState.areaWidth).toEqual(12);
        expect(areaState.areaHeight).toEqual(10);
        expect(areaState.squareWidth).toEqual(40);
        expect(areaState.ships.length).toEqual(1);
        expect(areaState.hits.length).toEqual(2);
        expect(areaState.showShips).toBe(false);
    })

    it ("may have other showShips than default", function()
    {
        var areaState = new AreaState(1, 2, 12, 10, 40, [{}], [{x:1,y:2},{x:2,y:1}], true);
        expect(areaState.x).toEqual(1);
        expect(areaState.y).toEqual(2);
        expect(areaState.areaWidth).toEqual(12);
        expect(areaState.areaHeight).toEqual(10);
        expect(areaState.squareWidth).toEqual(40);
        expect(areaState.ships.length).toEqual(1);
        expect(areaState.hits.length).toEqual(2);
        expect(areaState.showShips).toBe(true);
    })

    it ("can be simplified", function()
    {
        var ship1 = new Ship(2);
        ship1.setLocation(0,0);
        ship1.setDirection(ShipDirection.DOWN);

        var ship2 = new Ship(3);
        ship2.setLocation(5,4);
        ship2.setDirection(ShipDirection.UP);

        var ship3 = new Ship(5);
        ship3.setLocation(9,0);
        ship3.setDirection(ShipDirection.LEFT);

        var ships = [ship1, ship2, ship3];
        var hitLocations = [new Coordinate(0,0), new Coordinate(0,1), new Coordinate(3,3)];

        var area = new AreaState(1, 2, 10, 5, 40, ships, hitLocations, true);
        var simplified = area.simplify();

        expect(simplified.x).toEqual(1);
        expect(simplified.y).toEqual(2);
        expect(simplified.areaWidth).toEqual(10);
        expect(simplified.areaHeight).toEqual(5);
        expect(simplified.squareWidth).toEqual(40);
        expect(simplified.showShips).toBe(true);

        expect(simplified.ships[0].loc.x).toEqual(0);
        expect(simplified.ships[0].loc.y).toEqual(0);
        expect(simplified.ships[0].direction).toEqual(ShipDirection.DOWN);

        expect(simplified.ships[1].loc.x).toEqual(5);
        expect(simplified.ships[1].loc.y).toEqual(4);
        expect(simplified.ships[1].direction).toEqual(ShipDirection.UP);

        expect(simplified.ships[2].loc.x).toEqual(9);
        expect(simplified.ships[2].loc.y).toEqual(0);
        expect(simplified.ships[2].direction).toEqual(ShipDirection.LEFT);
    })
})


describe ("GameState", function()
{
    it ("Has null game areas and 0 action count by default", function()
    {
        var gameState = new GameState();
        expect(gameState.actionCount).toEqual(0);
        expect(gameState.playerArea).toBe(null);
        expect(gameState.enemyArea).toBe(null);
        expect(gameState.aiState).toBe(null);
    })

    it ("may have actionCount been set to other than default", function()
    {
        var gameState = new GameState(10);
        expect(gameState.actionCount).toEqual(10);
        expect(gameState.playerArea).toBe(null);
        expect(gameState.enemyArea).toBe(null);
        expect(gameState.aiState).toBe(null);
    })

    it ("may have playerArea been set to other than default", function()
    {
        var playerArea = new AreaState();
        var gameState = new GameState(10, playerArea);
        expect(gameState.actionCount).toEqual(10);
        expect(gameState.playerArea).toBe(playerArea);
        expect(gameState.enemyArea).toBe(null);
        expect(gameState.aiState).toBe(null);
    })

    it ("may have enemyArea been set to other than default", function()
    {
        var playerArea = new AreaState();
        var enemyArea = new AreaState();
        var gameState = new GameState(10, playerArea, enemyArea);
        expect(gameState.actionCount).toEqual(10);
        expect(gameState.playerArea).toBe(playerArea);
        expect(gameState.enemyArea).toBe(enemyArea);
        expect(gameState.aiState).toBe(null);
    })

    it("may have aiState been set to other than default", function()
    {
        var playerArea = new AreaState();
        var enemyArea = new AreaState();
        var aiState = {hitOrgin: new Coordinate(1,2), hitDirection: 3};
        var gameState = new GameState(10, playerArea, enemyArea, aiState);
        expect(gameState.actionCount).toEqual(10);
        expect(gameState.playerArea).toBe(playerArea);
        expect(gameState.enemyArea).toBe(enemyArea);
        expect(gameState.aiState).toBe(aiState);
    })

    it ("may be simplified", function()
    {
        var playerArea = new AreaState();
        var enemyArea = new AreaState();
        var aiState = {hitOrigin: new Coordinate(1,2), hitDirection: 3};
        var gameState = new GameState(10, playerArea, enemyArea, aiState);
        var mockPlayerArea = {};
        var mockEnemyArea = {};

        spyOn(playerArea, "simplify").and.returnValue(mockPlayerArea);
        spyOn(enemyArea, "simplify").and.returnValue(mockEnemyArea);

        var simplified = gameState.simplify();
        expect(playerArea.simplify).toHaveBeenCalled();
        expect(enemyArea.simplify).toHaveBeenCalled();
        expect(simplified.actionCount).toEqual(10);
        expect(simplified.playerArea).toBe(mockPlayerArea);
        expect(simplified.enemyArea).toBe(mockEnemyArea);
        expect(simplified.aiState.hitOrigin.x).toEqual(1);
        expect(simplified.aiState.hitOrigin.y).toEqual(2);
        expect(simplified.aiState.hitDirection).toEqual(3);
    })
})
