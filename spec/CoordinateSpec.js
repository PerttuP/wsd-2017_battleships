var fs = require("fs");
var coordinateModule = fs.readFileSync("./src/Coordinate.js", "utf-8");
eval(coordinateModule);

describe("Coordinate", function(){

    it("has x and y property", function(){
        coord = new Coordinate(1,2);
        expect(coord.x).toBeDefined();
        expect(coord.y).toBeDefined();
        expect(coord.x).toEqual(1);
        expect(coord.y).toEqual(2);
        coord.x = 3;
        coord.y = 5
        expect(coord.x).toEqual(3);
        expect(coord.y).toEqual(5);
    })

    it ("Can be searched from array", function()
    {
        var array = [new Coordinate(1,1), new Coordinate(2,2), new Coordinate(3,3)];

        expect(indexOfCoordinate(array, new Coordinate(1,1))).toEqual(0);
        expect(indexOfCoordinate(array, new Coordinate(2,2))).toEqual(1);
        expect(indexOfCoordinate(array, new Coordinate(3,3))).toEqual(2);
        expect(indexOfCoordinate(array, new Coordinate(1,2))).toEqual(-1);
    })
})
