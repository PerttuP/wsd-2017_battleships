
/**
  Create new GameSquare
  GameSquare represents one location on GameArea.
  @param {number} x - pixel x-coordinate of top left corner.
  @param {number} y - pixel y-coordinate of top left corner.
  @param {number} width - Square visual width in pixels.
  @return {GameSquare} New square with given x, y and with.
  Square initially is not hit and has no ship, and will show later assigned ships.
*/
function GameSquare(x, y, width)
{
    return {
        width: width,
        x: x,
        y: y,
        ship: null,
        isHit: false,
        bgColor: "#0000FF",
        showShips: true,

        /**
          Get hit indicator color.
          @return {string} White, if there is no ship in location and red if there is.
        */
        hitIndicatorColor: function()
        {
            var color = this.bgColor;
            if (this.isHit && this.ship !== null)
            {
                color = "#FF0000";
            }
            else if (this.isHit)
            {
                color = "#FFFFFF";
            }
            return color;
        },

        /**
          Get ship color
          @return {string} Gray if ship is not destroyed. Else black.
        */
        shipColor: function()
        {
            var color = "#888888";
            if (this.ship.isDestroyed())
            {
                color = "#000000";
            }
            return color;
        },

        /**
          Get pixel coordinates for square center point.
          @return {Coordinate} Center coordinates.
        */
        center: function() {
            return {
                x: this.x + this.width/2,
                y: this.y + this.width/2
            };
        },

        /**
          Draw square background (blue square).
          @param ctx - Canvas 2D context.
        */
        drawBackground: function(ctx)
        {
            ctx.beginPath();
            ctx.fillStyle = this.bgColor;
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.fillRect(this.x, this.y, this.width, this.width);
            ctx.strokeRect(this.x, this.y, this.width, this.width);
            ctx.closePath();
        },

        /**
          Draw ship.
          @param ctx - Canvas 2D context.
        */
        drawShip: function(ctx)
        {
            ctx.beginPath();
            ctx.fillStyle = this.shipColor();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;

            var top, left, width, height;
            if (this.ship.direction === ShipDirection.UP || this.ship.direction === ShipDirection.DOWN)
            {
                top = this.y;
                left = this.x + 5;
                width = this.width - 10;
                height = this.width;
            }
            else {
                top = this.y + 5;
                left = this.x;
                width = this.width;
                height = this.width - 10;
            }

            ctx.fillRect(left, top, width, height);
            ctx.strokeRect(left, top, width, height);
            ctx.closePath();
        },

        /**
          Draw hit indicator.
          @param ctx - Canvas 2D context.
        */
        drawHitIndicator: function(ctx)
        {
            ctx.beginPath();
            ctx.fillStyle = this.hitIndicatorColor();
            var center = this.center();
            ctx.arc(center.x, center.y, this.width/2 - 5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        },

        /**
          Draw the whole square.
          @param ctx - Canvas 2D context.
        */
        draw: function(ctx)
        {
            this.drawBackground(ctx);

            if (this.ship !== null && (this.showShips || this.ship.isDestroyed()))
            {
                this.drawShip(ctx);
            }

            if (this.isHit)
            {
                this.drawHitIndicator(ctx);
            }
        }
    }
}
