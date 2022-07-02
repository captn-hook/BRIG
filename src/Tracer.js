import * as THREE from 'three';
import Point2d from './Point';

class Tracer {

    constructor(m = 0, t = 0, value = 0, width = 1, headroom = 1, lift = 1) {
        this.m = m;
        this.t = t;
        this.value = value;
        this.width = width;
        this.headroom = headroom;
        this.lift = lift;

        this.color = this.rgb(value);
    }

    rgb(value) {

        const max = 25;
        //         i    0                       1                     2                    3                    4                   5   6
        const groups = [0, 0.00016000640025601025, 0.003960158406336254, 0.01996079843193728, 0.03996159846393856, 0.1999679987199488, 1];
        const colors = ["#0000ff", "#00a0ff", "#02fbff", "#4aff01", "#fbfd00", "#ff5a00", "#ff0000"];

        for (let i = 0; i < groups.length; i++) {

            if (groups[i] * 25 <= value <= groups[i + 1] * 25) {

                console.log( this.hexToRgb(colors[i]))

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

class Tracer2d extends Tracer {

    constructor(m, t, value, width, headroom, lift, outline = 1) {

        super(m, t, value, width, headroom, lift);

        this.outline = outline;


    }


    screenPts(camera, w, h) {

        var frustum = new THREE.Frustum();

        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));


        if (frustum.containsPoint(this.m.pos)) {

            let proj1 = new THREE.Vector3(this.m.pos.x, this.m.pos.z, this.m.pos.y);

            proj1.project(camera);

            let proj2 = new THREE.Vector3(this.t.pos.x, this.t.pos.z, this.t.pos.y);

            proj2.project(camera);

            var x1 = (proj1.x * w) + w;
            var y1 = -(proj1.y * h) + h;

            var x3 = (proj2.x * w) + w;
            var y3 = -(proj2.y * h) + h;

            var x2 = (x1 + x3) / 2

            var y2 = (y1 + y3) / 2 - (this.lift * 30)

            return [x1, y1, x2, y2, x3, y3]



        } else {
            return [-20, -20, -20, -20, -20, -20]
        }
    }

    monitor() {
        return this.m;
    }

    tracer() {
        return this.t;
    }

}

class Tracer3d extends Tracer {

    //ahh

}

export {
    Tracer2d,
    Tracer3d
};