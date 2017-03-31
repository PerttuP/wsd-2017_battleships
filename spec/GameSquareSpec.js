var context = require('./helpers/ContextStub');
var fs = require("fs");
var coordinateModule = fs.readFileSync("./src/Coordinate.js", "utf-8");
var sqrModule = fs.readFileSync("./src/GameSquare.js", "utf-8");
var shipModule = fs.readFileSync("./src/Ship.js", "utf-8");

eval(coordinateModule);
eval(shipModule);
eval(sqrModule);


describe("GameSquare", function(){

    it("has given x, y and width", function()
    {
        sqr = new GameSquare(80, 120, 40);
        expect(sqr.width).toEqual(40);
        expect(sqr.x).toEqual(80);
        expect(sqr.y).toEqual(120);
    })

    it ("is initially not hit", function()
    {
        sqr = new GameSquare(80,120,40);
        expect(sqr.isHit).toBe(false);
    })

    it ("initially has no ship", function()
    {
        sqr = new GameSquare(80,120, 40);
        expect(sqr.ship).toBe(null);
    })

    it ("initially shows ships", function()
    {
        sqr = new GameSquare(80, 120, 40);
        expect(sqr.showShips).toBe(true);
    })

    it ("has blue background", function()
    {
        sqr = new GameSquare(80,120, 40);
        expect(sqr.bgColor).toEqual("#0000FF");
    })

    it ("has blue hit indicator, if not hit and has no ship", function()
    {
        sqr = new GameSquare(80,120, 40);
        expect(sqr.hitIndicatorColor()).toEqual("#0000FF");
    })

    it ("has blue hit indicator if not hit and has ship", function()
    {
        sqr = new GameSquare(80,120, 40);
        sqr.ship = {};
        expect(sqr.hitIndicatorColor()).toEqual("#0000FF");
    })

    it ("has white hit indicator if is hit and has no ship", function()
    {
        sqr = new GameSquare(80,120, 40);
        sqr.isHit = true;
        expect(sqr.hitIndicatorColor()).toEqual("#FFFFFF");
    })

    it ("has red hit indicator if is hit and has ship", function()
    {
        sqr = new GameSquare(80,120, 40);
        sqr.isHit = true;
        sqr.ship = {};
        expect(sqr.hitIndicatorColor()).toEqual("#FF0000");
    })

    it ("draws background as  blue rectangle with black borders", function()
    {
        ctx = new context.ContextStub();
        spyOn(ctx, "fillRect");
        spyOn(ctx, "strokeRect");
        spyOn(ctx, "beginPath");
        spyOn(ctx, "closePath");

        sqr = new GameSquare(80,120, 40);
        sqr.drawBackground(ctx);

        expect(ctx.beginPath.calls.count()).toEqual(1);
        expect(ctx.fillStyle).toEqual("#0000FF");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.lineWidth).toEqual(1);
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 120, 40, 40);
        expect(ctx.strokeRect).toHaveBeenCalledWith(80, 120, 40, 40);
        expect(ctx.closePath.calls.count()).toEqual(1);
    })

    it ("allways draws the background", function()
    {
        ctx = new context.ContextStub();
        sqr1 = new GameSquare(80,120,40);
        spyOn(sqr1, "drawBackground");
        sqr1.draw(ctx);
        expect(sqr1.drawBackground).toHaveBeenCalledWith(ctx);

        sqr2 = new GameSquare(80,120,40);
        sqr2.ship = new Ship(2);
        spyOn(sqr2, "drawBackground");
        sqr2.draw(ctx);
        expect(sqr2.drawBackground).toHaveBeenCalledWith(ctx);

        sqr3 = new GameSquare(80,120,40);
        sqr3.ship = new Ship(2);
        spyOn(sqr3, "drawBackground");
        sqr3.draw(ctx);
        expect(sqr3.drawBackground).toHaveBeenCalledWith(ctx);

        sqr4 = new GameSquare(80,120,40);
        sqr4.isHit = true;
        spyOn(sqr4, "drawBackground");
        sqr4.draw(ctx);
        expect(sqr4.drawBackground).toHaveBeenCalledWith(ctx);

        sqr5 = new GameSquare(80,120,40);
        sqr5.ship = new Ship(2);
        sqr5.isHit = true;
        spyOn(sqr5, "drawBackground");
        sqr5.draw(ctx);
        expect(sqr5.drawBackground).toHaveBeenCalledWith(ctx);
    })

    it ("draws white hit indicator if is hit but does not have ship", function()
    {
        ctx = new context.ContextStub();
        spyOn(ctx, "arc");
        spyOn(ctx, "fill");
        spyOn(ctx, "beginPath");
        spyOn(ctx, "closePath");

        sqr = new GameSquare(80,120,40);
        sqr.isHit = true;
        sqr.drawHitIndicator(ctx);
        expect(ctx.beginPath.calls.count()).toEqual(1);
        expect(ctx.fillStyle).toEqual("#FFFFFF");
        expect(ctx.arc).toHaveBeenCalledWith(100, 140, 15, 0, 2*Math.PI, false);
        expect(ctx.fill).toHaveBeenCalled();
        expect(ctx.closePath.calls.count()).toEqual(1);
    })


    it ("draws red hit indicator if is hit and has ship", function()
    {
        ctx = new context.ContextStub();
        spyOn(ctx, "arc");
        spyOn(ctx, "fill");
        spyOn(ctx, "beginPath");
        spyOn(ctx, "closePath");

        sqr = new GameSquare(80,120,40);
        sqr.isHit = true;
        sqr.ship = {};
        sqr.drawHitIndicator(ctx);
        expect(ctx.beginPath.calls.count()).toEqual(1);
        expect(ctx.fillStyle).toEqual("#FF0000");
        expect(ctx.arc).toHaveBeenCalledWith(100, 140, 15, 0, 2*Math.PI, false);
        expect(ctx.fill).toHaveBeenCalled();
        expect(ctx.closePath.calls.count()).toEqual(1);
    })

    it ("draws downwards ship gray if not destroyed and black if is", function()
    {
        var ctx = new context.ContextStub();
        spyOn(ctx, "fillRect");
        spyOn(ctx, "strokeRect");
        spyOn(ctx, "beginPath");
        spyOn(ctx, "closePath");

        var sqr = new GameSquare(80,120,40);
        sqr.isHit = true;
        sqr.ship = new  Ship(2);
        sqr.ship.direction = ShipDirection.DOWN;
        sqr.drawShip(ctx);

        expect(ctx.beginPath.calls.count()).toEqual(1);
        expect(ctx.fillStyle).toEqual("#888888");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);
        expect(ctx.closePath.calls.count()).toEqual(1);

        sqr.ship.damage = 2;
        sqr.drawShip(ctx);

        expect(ctx.beginPath.calls.count()).toEqual(2);
        expect(ctx.fillStyle).toEqual("#000000");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);
        expect(ctx.closePath.calls.count()).toEqual(2);
    })

    it ("draws upwards ship gray if not destroyed and black if is", function()
    {
        var ctx = new context.ContextStub();
        spyOn(ctx, "fillRect");
        spyOn(ctx, "strokeRect");

        var sqr = new GameSquare(80,120,40);
        sqr.isHit = true;
        sqr.ship = new  Ship(2);
        sqr.ship.direction = ShipDirection.UP;
        sqr.drawShip(ctx);

        expect(ctx.fillStyle).toEqual("#888888");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);

        sqr.ship.damage = 2;
        sqr.drawShip(ctx);

        expect(ctx.fillStyle).toEqual("#000000");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);
        expect(ctx.fillRect).toHaveBeenCalledWith(85, 120, 30, 40);
    })

    it ("draws rightward ship gray if not destroyed and black if is", function()
    {
        var ctx = new context.ContextStub();
        spyOn(ctx, "fillRect");
        spyOn(ctx, "strokeRect");

        var sqr = new GameSquare(80,120,40);
        sqr.isHit = true;
        sqr.ship = new  Ship(2);
        sqr.ship.direction = ShipDirection.RIGHT;
        sqr.drawShip(ctx);

        expect(ctx.fillStyle).toEqual("#888888");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);

        sqr.ship.damage = 2;
        sqr.drawShip(ctx);

        expect(ctx.fillStyle).toEqual("#000000");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);

    })

    it ("draws leftward ship gray if not destroyed and black if is", function()
    {
        var ctx = new context.ContextStub();
        spyOn(ctx, "fillRect");
        spyOn(ctx, "strokeRect");

        var sqr = new GameSquare(80,120,40);
        sqr.isHit = true;
        sqr.ship = new  Ship(2);
        sqr.ship.direction = ShipDirection.LEFT;
        sqr.drawShip(ctx);

        expect(ctx.fillStyle).toEqual("#888888");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);

        sqr.ship.damage = 2;
        sqr.drawShip(ctx);

        expect(ctx.fillStyle).toEqual("#000000");
        expect(ctx.strokeStyle).toEqual("#000000");
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);
        expect(ctx.fillRect).toHaveBeenCalledWith(80, 125, 40, 30);
    })

    it ("draws ship if has ship", function()
    {
        ctx = new context.ContextStub();
        sqr = new GameSquare(80,120,40);
        spyOn(sqr, "drawShip")
        sqr.ship = {};

        sqr.draw(ctx);
        expect(sqr.drawShip).toHaveBeenCalledWith(ctx);
    })

    it ("does not draw ship if has no ship", function()
    {
        ctx = new context.ContextStub();
        sqr = new GameSquare(80,120,40);
        spyOn(sqr, "drawShip")
        sqr.ship = null;

        sqr.draw(ctx);
        expect(sqr.drawShip).not.toHaveBeenCalled();
    })

    it ("does not draw ship if ships are hidden", function()
    {
        ctx = new context.ContextStub();
        sqr = new GameSquare(80,120,40);
        sqr.showShips = false;
        spyOn(sqr, "drawShip")
        sqr.ship = new Ship(3);

        sqr.draw(ctx);
        expect(sqr.drawShip).not.toHaveBeenCalled();
    })

    it("draws hit indicator if is hit", function()
    {
        ctx = new context.ContextStub();
        sqr = new GameSquare(80,120,40);
        spyOn(sqr, "drawHitIndicator")
        sqr.isHit = true;

        sqr.draw(ctx);
        expect(sqr.drawHitIndicator).toHaveBeenCalledWith(ctx);
    })

    it("does not draw hit indicator if not hit", function()
    {
        ctx = new context.ContextStub();
        sqr = new GameSquare(80,120,40);
        spyOn(sqr, "drawHitIndicator")
        sqr.isHit = false;

        sqr.draw(ctx);
        expect(sqr.drawHitIndicator).not.toHaveBeenCalled();
    })

    it ("draws destroyed ships even if hidden", function()
    {
        var sqr = new GameSquare(80,120,40);
        sqr.isHit = true;
        sqr.showShips = false;
        sqr.ship = new Ship(3);
        spyOn(sqr.ship, "isDestroyed").and.returnValue(true);
        spyOn(sqr, "drawBackground");
        spyOn(sqr, "drawHitIndicator");
        spyOn(sqr, "drawShip");

        var ctx = new context.ContextStub();
        sqr.draw(ctx);
        expect(sqr.ship.isDestroyed).toHaveBeenCalledWith();
        expect(sqr.drawBackground).toHaveBeenCalledWith(ctx);
        expect(sqr.drawHitIndicator).toHaveBeenCalledWith(ctx);
    })


})

