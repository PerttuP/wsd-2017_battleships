var fs = require("fs");
var gameLogicModule = fs.readFileSync("./src/GameLogic.js", "utf-8");
var shipModule = fs.readFileSync("./src/Ship.js", "utf-8");
var gameSquareModule = fs.readFileSync("./src/GameSquare.js", "utf-8");
var gameAreaModule = fs.readFileSync("./src/GameArea.js", "utf-8");
var hitInfoModule = fs.readFileSync("./src/HitInfo.js", "utf-8");
var gameStateModule = fs.readFileSync("./src/GameState.js", "utf-8");
var coordinateModule = fs.readFileSync("./src/Coordinate.js", "utf-8");
var gameAIModule = fs.readFileSync("./src/GameAI.js", "utf-8");
var contextStubModule = require("./helpers/ContextStub");

eval(coordinateModule);
eval(hitInfoModule);
eval(gameStateModule);
eval(shipModule);
eval(gameSquareModule);
eval(gameAreaModule);
eval(gameAIModule);
eval(gameLogicModule);
var ContextStub = contextStubModule.ContextStub;


describe("GameLogic", function()
{
    it ("Creates both game areas when created.", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);

        expect(gameLogic.playerArea.squares.length).toEqual(10);
        expect(gameLogic.playerArea.squares[0].length).toEqual(5);
        expect(gameLogic.playerAreaCtx).toBe(playerCtx);
        expect(gameLogic.enemyArea.squares.length).toEqual(10);
        expect(gameLogic.enemyArea.squares[0].length).toEqual(5);
        expect(gameLogic.enemyAreaCtx).toBe(enemyCtx);
        expect(gameLogic.enemy).toBe(null);
        expect(gameLogic.actionCount).toEqual(0);
    })

    it ("Should place ships and create GameAI on initialization", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);

        spyOn(gameLogic.playerArea, "setShips").and.callThrough();
        spyOn(gameLogic.playerArea, "draw");
        spyOn(gameLogic.enemyArea, "setShips").and.callThrough();
        spyOn(gameLogic.enemyArea, "draw");

        gameLogic.init();

        expect(gameLogic.enemy).not.toBe(null);
        expect(gameLogic.enemy.area).toBe(gameLogic.playerArea);
        expect(gameLogic.playerArea.setShips).toHaveBeenCalled();
        expect(gameLogic.playerArea.ships.length).toEqual(3);
        expect(gameLogic.enemyArea.setShips).toHaveBeenCalled();
        expect(gameLogic.enemyArea.ships.length).toEqual(3);
        expect(gameLogic.playerArea.draw).toHaveBeenCalledWith(playerCtx);
        expect(gameLogic.enemyArea.draw).toHaveBeenCalledWith(enemyCtx);
    })

    it ("should save both player and AI area states and actionCount", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var playerAreaState = new AreaState();
        var enemyAreaState = new AreaState();
        var aiState = {hitOrgin: new Coordinate(1,2), hitDirection: 2};
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);

        spyOn(gameLogic.playerArea, "setShips").and.callThrough();
        spyOn(gameLogic.playerArea, "draw");
        spyOn(gameLogic.playerArea, "getAreaState").and.returnValue(playerAreaState);
        spyOn(gameLogic.enemyArea, "setShips").and.callThrough();
        spyOn(gameLogic.enemyArea, "draw");
        spyOn(gameLogic.enemyArea, "getAreaState").and.returnValue(enemyAreaState);

        gameLogic.init();
        spyOn(gameLogic.enemy, "getState").and.returnValue(aiState);
        gameLogic.actionCount = 3;
        var gameState = gameLogic.save();

        expect(gameLogic.playerArea.getAreaState).toHaveBeenCalled();
        expect(gameLogic.enemyArea.getAreaState).toHaveBeenCalled();
        expect(gameState.actionCount).toEqual(3);
        expect(gameState.playerArea).toBe(playerAreaState);
        expect(gameState.enemyArea).toBe(enemyAreaState);
        expect(gameState.aiState).toBe(aiState);
    })

    it ("should restore saved game state", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var playerAreaState = new AreaState();
        var enemyAreaState = new AreaState();
        var aiState = {hitOrgin: new Coordinate(1,2), hitDirection: 2};
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        var gameState = new GameState(5, playerAreaState, enemyAreaState, aiState);

        spyOn(gameLogic.playerArea, "restore");
        spyOn(gameLogic.playerArea, "draw");
        spyOn(gameLogic.enemyArea, "restore");
        spyOn(gameLogic.enemyArea, "draw");

        gameLogic.init();
        spyOn(gameLogic.enemy, "restore");
        gameLogic.load(gameState);

        expect(gameLogic.actionCount).toEqual(5);
        expect(gameLogic.playerArea.restore).toHaveBeenCalledWith(playerAreaState);
        expect(gameLogic.enemyArea.restore).toHaveBeenCalledWith(enemyAreaState);
        expect(gameLogic.playerArea.draw).toHaveBeenCalledWith(playerCtx);
        expect(gameLogic.enemyArea.draw).toHaveBeenCalledWith(enemyCtx);
        expect(gameLogic.enemy.restore).toHaveBeenCalledWith(gameLogic.playerArea, aiState);
    })

    it ("unititialized logic should restore saved game state", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var playerAreaState = new AreaState();
        var enemyAreaState = new AreaState();
        var aiState = {hitOrgin: new Coordinate(1,2), hitDirection: 2, lastHit:{loc: new Coordinate(5,4), shipHit:true}};
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        var gameState = new GameState(5, playerAreaState, enemyAreaState, aiState);

        spyOn(gameLogic.playerArea, "restore");
        spyOn(gameLogic.playerArea, "draw");
        spyOn(gameLogic.enemyArea, "restore");
        spyOn(gameLogic.enemyArea, "draw");

        gameLogic.load(gameState);

        expect(gameLogic.actionCount).toEqual(5);
        expect(gameLogic.playerArea.restore).toHaveBeenCalledWith(playerAreaState);
        expect(gameLogic.enemyArea.restore).toHaveBeenCalledWith(enemyAreaState);
        expect(gameLogic.playerArea.draw).toHaveBeenCalledWith(playerCtx);
        expect(gameLogic.enemyArea.draw).toHaveBeenCalledWith(enemyCtx);
        expect(gameLogic.enemy).not.toBe(null);
        expect(gameLogic.enemy.onGoingShip.firstHit.x).toEqual(1);
        expect(gameLogic.enemy.onGoingShip.firstHit.y).toEqual(2);
        expect(gameLogic.enemy.onGoingShip.direction).toEqual(ShipDirection.UP);
        expect(gameLogic.enemy.lastHitLoc.x).toEqual(5);
        expect(gameLogic.enemy.lastHitLoc.y).toEqual(4);
        expect(gameLogic.enemy.lastHitInfo.ignored).toBe(false)
        expect(gameLogic.enemy.lastHitInfo.shipHit).toBe(true);
        expect(gameLogic.enemy.lastHitInfo.shipDestroyed).toBe(false)
    })

    it ("should invoke AI and draw player area on AI action", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();

        spyOn(gameLogic.enemy, "action").and.returnValue(new HitInfo(false, true, false));
        spyOn(gameLogic.playerArea, "draw");
        spyOn(gameLogic.enemyArea, "draw");

        var hitInfo = gameLogic.enemyAction();

        expect(gameLogic.enemy.action.calls.count()).toEqual(1);
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
        expect(gameLogic.enemyArea.draw).not.toHaveBeenCalled();
        expect(gameLogic.playerArea.draw).toHaveBeenCalledWith(gameLogic.playerAreaCtx);
    })

    it ("should hit and draw enemy area on player action", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();

        spyOn(gameLogic.enemyArea, "hit").and.returnValue(new HitInfo(false, true, false));
        spyOn(gameLogic.enemyArea, "draw");
        spyOn(gameLogic.playerArea, "draw");

        var target = new Coordinate(1,2);
        var hitInfo = gameLogic.playerAction(target);

        expect(gameLogic.actionCount).toEqual(1);
        expect(gameLogic.enemyArea.hit).toHaveBeenCalledWith(target);
        expect(gameLogic.enemyArea.hit.calls.count()).toEqual(1);
        expect(gameLogic.enemyArea.draw).toHaveBeenCalledWith(enemyCtx);
        expect(gameLogic.playerArea.draw).not.toHaveBeenCalled();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
    })

    it ("should not increase action count or draw enemy area on ignored player action", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();

        spyOn(gameLogic.enemyArea, "hit").and.returnValue(new HitInfo(true, false, false));
        spyOn(gameLogic.enemyArea, "draw");
        spyOn(gameLogic.playerArea, "draw");

        var target = new Coordinate(1,2);
        var hitInfo = gameLogic.playerAction(target);

        expect(gameLogic.enemyArea.hit).toHaveBeenCalledWith(target);
        expect(gameLogic.enemyArea.draw).not.toHaveBeenCalled();
        expect(gameLogic.playerArea.draw).not.toHaveBeenCalled();
        expect(gameLogic.actionCount).toEqual(0);
        expect(hitInfo.ignored).toBe(true);
        expect(hitInfo.shipHit).toBe(false);
        expect(hitInfo.shipDestroyed).toBe(false);
    })

    it ("should declare game over if all player ships are destroyed", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();

        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(false);
        spyOn(gameLogic.playerArea, "allShipsDestroyed").and.returnValue(true);

        expect(gameLogic.isGameOver()).toBe(true);
        expect(gameLogic.playerArea.allShipsDestroyed).toHaveBeenCalled();
    })

    it ("should declare game over if all enemy ships are destroyed", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();

        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(true);
        spyOn(gameLogic.playerArea, "allShipsDestroyed").and.returnValue(false);

        expect(gameLogic.isGameOver()).toBe(true);
        expect(gameLogic.enemyArea.allShipsDestroyed).toHaveBeenCalled();
    })

    it ("should not declare game over if both players have ships left", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();

        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(false);
        spyOn(gameLogic.playerArea, "allShipsDestroyed").and.returnValue(false);

        expect(gameLogic.isGameOver()).toBe(false);
        expect(gameLogic.enemyArea.allShipsDestroyed).toHaveBeenCalled();
        expect(gameLogic.playerArea.allShipsDestroyed).toHaveBeenCalled();
    })

    it ("should return score 0 if game is not finished", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();
        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(false);

        expect(gameLogic.score()).toEqual(0);
    })

    it ("should return score 0 if player lost", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();
        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(false);
        spyOn(gameLogic.playerArea, "allShipsDestroyed").and.returnValue(true);

        expect(gameLogic.score()).toEqual(0);
    })

    it ("should return full score if player won with minimum number of actions", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();
        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(true);
        spyOn(gameLogic.playerArea, "allShipsDestroyed").and.returnValue(false);
        gameLogic.actionCount = 10;

        expect(gameLogic.score()).toEqual(1000);
    })

    it ("should return minimum score if player won with maximum number of actions", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();
        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(true);
        spyOn(gameLogic.playerArea, "allShipsDestroyed").and.returnValue(false);
        gameLogic.actionCount = 50;

        expect(gameLogic.score()).toEqual(100);
    })

    it ("should return medium score if player used half of maximum number of actions", function()
    {
        var playerCtx = new ContextStub();
        var enemyCtx = new ContextStub();
        var gameLogic = new GameLogic(10, 5, playerCtx, enemyCtx);
        gameLogic.init();
        spyOn(gameLogic.enemyArea, "allShipsDestroyed").and.returnValue(true);
        spyOn(gameLogic.playerArea, "allShipsDestroyed").and.returnValue(false);
        gameLogic.actionCount = 30;

        expect(gameLogic.score()).toEqual(550);
    })
})
