

/**
  Creates new Communication object.
  @param loadCallback - This will be called on received load-message.
    Load callback must accept GameState parameter.
  @param errorCallbacl - This will be called on received error message.
    Error callback must accept string parameter that describes the error.
*/
function Communication(loadCallback, errorCallback)
{
    return {

        loadCallback: loadCallback,
        errorCallback: errorCallback,

        /**
          Sends a save message
          @param targetWindow - message receiver.
          @param gameState - Simplified GameState to be saved.
        */
        save: function(targetWindow, gameState)
        {
            var msg = {
                messageType: "SAVE",
                gameState: gameState
            };
            targetWindow.postMessage(msg, "*");
        },

        /**
          Sends a load request.
          @param targetWindow - Message receiver.
        */
        loadRequest: function(targetWindow)
        {
            var msg = {messageType: "LOAD_REQUEST"};
            targetWindow.postMessage(msg, "*");
        },


        /**
          Send setting message.
          @param targetWindow - Message receiver.
          @param width - Viewport widht
          @param height - Viewport height
        */
        setting: function(targetWindow, width, height)
        {
            var msg = {
                messageType: "SETTING",
                options: {
                    width: width,
                    height: height
                }
            };
            targetWindow.postMessage(msg, "*");
        },

        /**
          Sends score message to target window.
          @param targetWindow - message receiver.
          @param score - Final score.
        */
        score: function(targetWindow, score)
        {
            var msg = {
                messageType: "SCORE",
                score: score
            };
            targetWindow.postMessage(msg, "*");
        },

        /**
          Prodcesses messages coming from service to the game
          @param messageEvt - Incoming message event.
        */
        onMessageReceived: function(messageEvt)
        {
            if (messageEvt.data.messageType === "LOAD")
            {
                loadCallback(messageEvt.data.gameState);
            }
            else if (messageEvt.data.messageType === "ERROR")
            {
                errorCallback(messageEvt.data.info);
            }
        }
    }
}
