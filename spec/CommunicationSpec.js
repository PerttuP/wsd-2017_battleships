
var fs = require("fs");
var communicationModule = fs.readFileSync("./src/Communication.js", "utf-8");
var gameStateModule = fs.readFileSync("./src/GameState.js", "utf-8");
eval (communicationModule);
eval(gameStateModule);

function WindowStub()
{
    return {
        postMessage : function(message, targetOrigin, transfer){}
    }
}

function CallBacks()
{
    return {
        errorCb: function(msg){},
        loadCb: function(gameState){}
    }
}

describe("Communication", function()
{
    var callbacks = null;
    var window = null;
    var comm = null;

    beforeEach(function()
    {
        callbacks = new CallBacks();
        window = new WindowStub();
        spyOn(callbacks, "errorCb");
        spyOn(callbacks, "loadCb");
        spyOn(window, "postMessage");

        comm = new Communication(callbacks.loadCb, callbacks.errorCb);
    });

    it ("Saves callbacks for later use", function()
    {
        expect(callbacks.errorCb).not.toHaveBeenCalled();
        expect(callbacks.loadCb).not.toHaveBeenCalled();
        expect(comm.errorCallback).toBe(callbacks.errorCb);
        expect(comm.loadCallback).toBe(callbacks.loadCb);
    })

    it ("Sends score messages", function()
    {
        comm.score(window, 500);

        expect(window.postMessage.calls.count()).toEqual(1);
        var saveArgs = window.postMessage.calls.argsFor(0);
        expect(saveArgs.length).toEqual(2);
        expect(saveArgs[0].messageType).toEqual("SCORE");
        expect(saveArgs[0].score).toEqual(500);
        expect(saveArgs[1]).toEqual("*");

        expect(callbacks.errorCb).not.toHaveBeenCalled();
        expect(callbacks.loadCb).not.toHaveBeenCalled();
    })

    it ("sends loadResponse messages", function()
    {
        comm.loadRequest(window);

        expect(window.postMessage.calls.count()).toEqual(1);
        var args = window.postMessage.calls.argsFor(0);
        expect(args.length).toEqual(2);
        expect(args[0].messageType).toEqual("LOAD_REQUEST");
        expect(args[1]).toEqual("*");

        expect(callbacks.errorCb).not.toHaveBeenCalled();
        expect(callbacks.loadCb).not.toHaveBeenCalled();
    })

    it ("sends save messages", function()
    {
        var playerArea = new AreaState();
        var enemyArea = new AreaState();
        var gameState = new GameState(10, playerArea, enemyArea);
        comm.save(window, gameState);

        expect(window.postMessage.calls.count()).toEqual(1);
        var args = window.postMessage.calls.argsFor(0);
        expect(args.length).toEqual(2);
        expect(args[0].messageType).toEqual("SAVE");
        expect(args[0].gameState).toBe(gameState);
        expect(args[1]).toEqual("*");

        expect(callbacks.errorCb).not.toHaveBeenCalled();
        expect(callbacks.loadCb).not.toHaveBeenCalled();
    })

    it ("sends setting messages", function()
    {
        comm.setting(window, 400, 200);

        expect(window.postMessage.calls.count()).toEqual(1);
        var args = window.postMessage.calls.argsFor(0);
        expect(args.length).toEqual(2);
        expect(args[0].messageType).toEqual("SETTING");
        expect(args[0].options.width).toEqual(400);
        expect(args[0].options.height).toEqual(200);
        expect(args[1]).toEqual("*");

        expect(callbacks.errorCb).not.toHaveBeenCalled();
        expect(callbacks.loadCb).not.toHaveBeenCalled();
    })

    it ("processes load messages", function()
    {
        var gameState = {
            actionCount: 10,
            playerArea: { x: 0, y: 0, areaWidth: 0, areaHeight: 0, squareWidth: 0, ships: [  ], hits: [  ], showShips: false },
            enemyArea: { x: 0, y: 0, areaWidth: 0, areaHeight: 0, squareWidth: 0, ships: [  ], hits: [  ], showShips: false }
        };

        var msg = {
            messageType: "LOAD",
            gameState: gameState
        }

        var evt = {
            data: msg
        }

        comm.onMessageReceived(evt);

        expect(callbacks.errorCb).not.toHaveBeenCalled();
        expect(callbacks.loadCb.calls.count()).toEqual(1);
        var loadArgs = callbacks.loadCb.calls.argsFor(0);
        expect(loadArgs.length).toEqual(1);
        expect(loadArgs[0]).toBe(gameState);
        expect(loadArgs[0].actionCount).toEqual(10);
    })

    it ("processes error messages", function()
    {

        var msg = {
            messageType: "ERROR",
            info: "Error message"
        }
        var evt = {
            data: msg
        }
        comm.onMessageReceived(evt);

        expect(callbacks.loadCb).not.toHaveBeenCalled();
        expect(callbacks.errorCb.calls.count()).toEqual(1);
        var args = callbacks.errorCb.calls.argsFor(0);
        expect(args.length).toEqual(1);
        expect(args[0]).toEqual(msg.info);
    })

    it ("should ignore unknown messages", function()
    {
        var msg = {
            messageType: "UNKNOWN",
        }
        var evt = {
            data: msg
        }
        comm.onMessageReceived(evt);

        expect(callbacks.loadCb).not.toHaveBeenCalled();
        expect(callbacks.errorCb).not.toHaveBeenCalled();
    })
})
