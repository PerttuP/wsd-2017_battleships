
var gameLogic = null;
var playersTurn = false;
var communication = null;

var AREA_LOGICAL_WIDTH = 10;
var AREA_LOGICAL_HEIGHT = 5;
var AREA_VISUAL_WIDTH = 400;
var AREA_VISUAL_HEIGHT = 200;
var TOTAL_HEIGHT = 650;
var TOTAL_WIDTH = 450;


var messages = {
    PLAYER_WON: "VICTORY!",
    ENEMY_WON: "GAME OVER",
    ENEMY_SHIP_HIT: "Direct Hit!",
    ENEMY_SHIP_DESTROYED: "One Gone!",
    PLAYER_SHIP_HIT: "They Hit Us!",
    PLAYER_SHIP_DESTROYED: "We Lost One!",
    PLAYER_MISSED: "Miss!",
    ENEMY_MISSED: "They Missed!",
    CHOOSE_NEW_TARGET: "Hit New Target",
    CLICK_TO_FIRE: "Click to Fire!"
};

var messageClasses = {
    POSITIVE: "positiveMsg",
    NEGATIVE: "negativeMsg",
    NEUTRAL: "neutralMsg"
};

$(document).ready(function()
{
    communication = new Communication(onLoad, onError);
    window.addEventListener("message", communication.onMessageReceived);
    document.getElementById("newGameBtn").addEventListener("click", newGame);

    communication.setting(window.parent, TOTAL_WIDTH, TOTAL_HEIGHT);
    communication.loadRequest(window.parent);

    document.getElementById("enemyCanvas").addEventListener('click', playerClicked, false);

    // Start new game. If there will be a load message, new game gets overwritten.
    newGame();

})


// Callback for load messages from service.
function onLoad(gameState)
{
    // Empty gameState represents ended game.
    if (gameState.actionCount !== undefined)
    {
        var playerCanvas = document.getElementById("playerCanvas");
        var playerCtx = playerCanvas.getContext("2d");
        var enemyCanvas = document.getElementById("enemyCanvas");
        var enemyCtx = enemyCanvas.getContext("2d");

        gameLogic = new GameLogic(AREA_LOGICAL_WIDTH, AREA_LOGICAL_HEIGHT, playerCtx, enemyCtx);
        gameLogic.load(gameState);
        playersTurn = true;
    }
    else {
        newGame();
    }
}


// Callback for error messages from service.
function onError(msg)
{
    // Just start a new game
    newGame();
    communication.save(window.parent, gameLogic.save().simplify() );
}


function newGame()
{
    var playerCanvas = document.getElementById("playerCanvas");
    var playerCtx = playerCanvas.getContext("2d");
    var enemyCanvas = document.getElementById("enemyCanvas");
    var enemyCtx = enemyCanvas.getContext("2d");

    gameLogic = new GameLogic(AREA_LOGICAL_WIDTH, AREA_LOGICAL_HEIGHT, playerCtx, enemyCtx);
    gameLogic.init();
    playersTurn = true;
    displayMessage(messages.CLICK_TO_FIRE);
}


// Callback for player clicking on enemy canvas.
function playerClicked(event)
{
    if (playersTurn)
    {
        var x = event.pageX - $('#enemyCanvas').offset().left;
        var y = event.pageY - $('#enemyCanvas').offset().top;

        var clickedCoordinate = gameLogic.enemyArea.getClickedSquare(x, y);
        var hitInfo = gameLogic.playerAction(clickedCoordinate);

        if (hitInfo.ignored)
        {
            displayMessage(messages.CHOOSE_NEW_TARGET);
            return;
        }
        else if (gameLogic.isGameOver())
        {
            displayMessage(messages.PLAYER_WON, messageClasses.POSITIVE);
            onGameOver(true);
            return;
        }
        else if (hitInfo.shipDestroyed)
        {
            displayMessage(messages.ENEMY_SHIP_DESTROYED, messageClasses.POSITIVE);
        }
        else if (hitInfo.shipHit)
        {
            displayMessage(messages.ENEMY_SHIP_HIT, messageClasses.POSITIVE);
        }
        else {
            displayMessage(messages.PLAYER_MISSED, messageClasses.NEGATIVE);
        }

        // Delay turn switch for player would have time to see message.
        playersTurn = false;
        setTimeout(function()
        {
            enemysTurn();
        }, 1000);

    }
}


function enemysTurn()
{
    var hitInfo = gameLogic.enemyAction();

    if (gameLogic.isGameOver())
    {
        displayMessage(messages.ENEMY_WON, messageClasses.NEGATIVE);
        onGameOver(false);
        return;
    }
    else if (hitInfo.shipDestroyed)
    {
        displayMessage(messages.PLAYER_SHIP_DESTROYED, messageClasses.NEGATIVE);
    }
    else if (hitInfo.shipHit)
    {
        displayMessage(messages.PLAYER_SHIP_HIT, messageClasses.NEGATIVE);
    }
    else
    {
        displayMessage(messages.ENEMY_MISSED, messageClasses.POSITIVE);
    }

    //Automatically save after each round.
    communication.save(window.parent, gameLogic.save().simplify());

    // Delay turn switch for player would have time to see message.
    setTimeout(function()
    {
        displayMessage(messages.CLICK_TO_FIRE);
        playersTurn = true;
    }, 1000);
}


/**
  Displays message on Message area.
  @param msg - Message to be shown.
*/
function displayMessage(msg, messageClass)
{
    var msgClass = messageClass === undefined ? messageClasses.NEUTRAL : messageClass;
    var msgArea = $("#messageArea");
    msgArea.empty();
    msgArea.append("<div class=\"" + msgClass + "\">" + msg + "</div>")
}


function onGameOver(playerWon)
{
    playersTurn = false;
    var score = gameLogic.score();
    communication.score(window.parent, score);

    // Reset saved game.
    communication.save(window.parent, {});

    // Display score
    console.log("Foo")
    if (playerWon)
    {
        var msg = "Score: " + score;
        setTimeout(function()
        {
            displayMessage(msg, messageClasses.POSITIVE);
        }, 2000);
    }
}
