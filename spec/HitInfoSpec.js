var fs = require("fs");
var hitInfoModule = fs.readFileSync("./src/HitInfo.js", "utf-8");
eval(hitInfoModule);

describe("HitInfo", function()
{
    it ("by default has not been ignored and has no hits", function()
    {
        var hitInfo = new HitInfo();
        expect(hitInfo.ignored).toBe(false);
        expect(hitInfo.shipHit).toBe(false);
        expect(hitInfo.shipDestroyed).toBe(false);
    })

    it ("may have other ignored status than default at construction", function()
    {
        var hitInfo = new HitInfo(true);
        expect(hitInfo.ignored).toBe(true);
        expect(hitInfo.shipHit).toBe(false);
        expect(hitInfo.shipDestroyed).toBe(false);
    })

    it ("may have other shipHit status than default at construction", function()
    {
        var hitInfo = new HitInfo(true, true);
        expect(hitInfo.ignored).toBe(true);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(false);
    })

    it ("may have other shipDestroyed status than default at construction", function()
    {
        var hitInfo = new HitInfo(true, true, true);
        expect(hitInfo.ignored).toBe(true);
        expect(hitInfo.shipHit).toBe(true);
        expect(hitInfo.shipDestroyed).toBe(true);
    })
})
