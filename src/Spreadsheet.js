export default class Spreadsheet {
    constructor( ms, ts, w, h) {
        this.x = ms - 1;
        this.y = ts - 1;

        //cell size
        this.w = w / this.x;
        this.h = h / this.y;

    }


    rgb(value) {

        const max = 25;
        //         i    0                       1                     2                    3                    4                   5   6
        const groups = [0, 0.00016000640025601025, 0.003960158406336254, 0.01996079843193728, 0.03996159846393856, 0.1999679987199488, 1];
        const colors = ["#0000ff", "#00a0ff", "#02fbff", "#4aff01", "#fbfd00", "#ff5a00", "#ff0000"];

        for (let i = 0; i < groups.length; i++) {

            if (groups[i] * 25 <= value <= groups[i + 1] * 25) {

                //console.log( this.hexToRgb(colors[i]))

                var c1 = this.hexToRgb(colors[i]);
                var c2 = this.hexToRgb(colors[i + 1]);

                var r = this.rescale(value, groups[i] * 25, groups[i + 1] * 25, c1.r, c2.r);
                var g = this.rescale(value, groups[i] * 25, groups[i + 1] * 25, c1.g, c2.g);
                var b = this.rescale(value, groups[i] * 25, groups[i + 1] * 25, c1.b, c2.b);

    
                return this.rgbToHex(r, g, b);
            } 
        }
    }

    rescale(val, inmin, inmax, outmin, outmax) {
        return (outmin + (val - inmin) * ((outmax - outmin) / (inmax - inmin)));
    }


    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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