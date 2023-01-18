import {
    Vector3,
} from 'three';
//import Point2d from './Point';

class Area {

    constructor(p = [], value = 0, opacity = .5, thickness = 1) {
        this.points = p;
        this.value = parseFloat(value);
        this.opacity = opacity;
        this.visible = true;
        this.outline = false;
        this.thickness = thickness;

        //console.log(this.rgb(this.value));  
        [this.r, this.g, this.b, this.a] = this.rgb(this.value);

        this.color = this.rgbToHex(this.r, this.g, this.b);
        //console.log(this.color);


        this.visible = true;
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

    screenPts(camera, w, h, x, y, z) {

        let proj = new Vector3(x, z, y);

        proj.project(camera);

        //end       tx                  
        var x = ((proj.x * w) + w);
        //headroom    ty                 
        var y = (-(proj.y * h) + h);

        return [x, y]

    }

    drawArea(ctx, camera, sizes, alpha = true) {


        //start,     ctrl1,  ctrl2,    end   arw 1   arw 2
        var screenpts = [];

        for (var p in this.points) {

            var x = this.points[p].x;
            var y = this.points[p].y;
            var z = this.points[p].z;

            screenpts.push(this.screenPts(camera, sizes.width / 2, sizes.height / 2, x, y, z));

        }
        //if z1 and z2 magnitude is less than 1, then draw the tracer

        if (this.visible) {


            ctx.lineWidth = this.outline;

            if (alpha) {
                var opac = this.a;
            } else {
                var opac = 1;
            }

            opac = this.opacity
            //or this.opacity

            ctx.strokeStyle = "rgba(" + String(this.r) + ", " + String(this.g) + ", " + String(this.b) + ", " + String(opac) + ")";
            ctx.fillStyle = "rgba(" + String(this.r) + ", " + String(this.g) + ", " + String(this.b) + ", " + String(opac) + ")";

            //area
            ctx.beginPath();
            ctx.moveTo(screenpts[0][0], screenpts[0][1]);
            console.log(screenpts[0][0], screenpts[0][1])

            for (var i = 1; i < screenpts.length; i++) {
                ctx.lineTo(screenpts[i][0], screenpts[i][1]);
                console.log(screenpts[i][0], screenpts[i][1])
            }

            ctx.fill();

            console.log(ctx.fillStyle)

        }

    }

}

export {
    Area
};