export class CanvasObject {
    constructor() {
    }

    rgb(value) {

        //         i    0                       1                     2                    3                    4                   5   6
        const max = 25;
        const groups = [0, 0.00016000640025601025, 0.003960158406336254, 0.01996079843193728, 0.03996159846393856, 0.1999679987199488, 1];
        const colors = ["#0000ff", "#00a0ff", "#02fbff", "#4aff01", "#fbfd00", "#ff5a00", "#ff0000"];
        const opacity = [0, .1, .2, .4, .6, .8, 1]

        for (let i = 0; i < groups.length; i++) {

            if (groups[i] * max <= value && value <= groups[i + 1] * max) {


                //console.log( this.hexToRgb(colors[i]))

                var c1 = this.hexToRgb(colors[i]);
                var c2 = this.hexToRgb(colors[i + 1]);

                var r = this.rescale(value, groups[i] * max, groups[i + 1] * max, c1.r, c2.r);
                var g = this.rescale(value, groups[i] * max, groups[i + 1] * max, c1.g, c2.g);
                var b = this.rescale(value, groups[i] * max, groups[i + 1] * max, c1.b, c2.b);

                //alpha
                var a = this.rescale(value, groups[i] * max, groups[i + 1] * max, opacity[i], opacity[i + 1]);

                //console.log(a)

                return [r, g, b, a];

            } else if (value > groups[groups.length - 1] * max) {
                var c = this.hexToRgb(colors[colors.length - 1])
                var a = 1;

                return [c.r, c.g, c.b, a];

            }
        }
    }

    midpoint(x1, y1, x2, y2) {
        return [(x1 + x2) / 2, (y1 + y2) / 2];
    }

    rescale(val, inmin, inmax, outmin, outmax) {
        return (outmin + (val - inmin) * ((outmax - outmin) / (inmax - inmin)));
    }


    rgbToHex(r, g, b) {
        return ("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)).substring(0, 7);
    }


    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}