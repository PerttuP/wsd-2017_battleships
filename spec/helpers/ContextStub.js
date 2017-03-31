
function ContextStub()
{
    return {

        fillStyle: "",

        strokeStyle: "",

        linewidth: -1,

	beginPath: function(){},

	closePath: function(){},

        arc: function(centerX, centerY, radius, startAngle, endAngle, counterClockwise){},

        fill: function(){},

        fillRect: function(x, y, width, height) {},

        strokeRect: function(x, y, width, height) {}
    };

}


exports.ContextStub = ContextStub;
