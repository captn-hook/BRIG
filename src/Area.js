import {
    Vector3,
} from 'three';
import {
    CanvasObject
} from './CanvasObject';
//import Point2d from './Point';

class Area extends CanvasObject {

    constructor(p = [], value = undefined, name = '', text = '', opacity = .5, thickness = 2) {
        super();
        this.name = name;
        this.text = text;
        this.points = p;
        this.value = parseFloat(value);
        this.opacity = opacity;
        this.visible = true;
        this.outline = false;
        this.thickness = thickness;

        //console.log(this.rgb(this.value));

        if (this.value) {
            [this.r, this.g, this.b, this.a] = this.rgb(this.value);
        } else {
            this.r = 255;
            this.g = 255;
            this.b = 255;
            this.a = 100;
        }
        this.color = this.rgbToHex(this.r, this.g, this.b);
        //console.log(this.color);


        this.visible = true;
    }

    setValue(value) {
        this.value = parseFloat(value);
        [this.r, this.g, this.b, this.a] = this.rgb(this.value);
        this.color = this.rgbToHex(this.r, this.g, this.b);
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

    drawCircle(ctx, x, y, r) {
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawArea(camera, sizes, doVals, alpha = true, displayp = 'none') {

        if (this.visible) {
            //start,     ctrl1,  ctrl2,    end   arw 1   arw 2
            var screenpts = [];

            for (var p in this.points) {

                var x = this.points[p].x;
                var y = this.points[p].y;
                var z = this.points[p].z / 100;

                screenpts.push(this.screenPts(camera, sizes.width / 2, sizes.height / 2, x, y, z));

            }

            //display points
            if (displayp == 'last' && screenpts.length > 0) {
                this.drawCircle(sizes.ctx, screenpts[screenpts.length - 1][0], screenpts[screenpts.length - 1][1], 4);
            } else if (displayp == 'all') {
                for (var p in screenpts) {
                    this.drawCircle(sizes.ctx, screenpts[p][0], screenpts[p][1], 2);
                }
            }

            //if z1 and z2 magnitude is less than 1, then draw the tracer
            sizes.ctx.lineWidth = this.outline;

            if (alpha) {
                var opac = this.opacity
            } else {
                var opac = 1;
            }

            
            //or this.opacity

            sizes.ctx.strokeStyle = "rgba(" + String(this.r / 5) + ", " + String(this.g / 5) + ", " + String(this.b / 5) + ", " + String(1) + ")";
            sizes.ctx.fillStyle = "rgba(" + String(this.r) + ", " + String(this.g) + ", " + String(this.b) + ", " + String(opac) + ")";
            sizes.ctx.lineWidth = this.thickness;
            //area
            if (screenpts.length > 0) {
                sizes.ctx.beginPath();
                sizes.ctx.moveTo(screenpts[0][0], screenpts[0][1]);

                for (var i = 1; i < screenpts.length; i++) {
                    sizes.ctx.lineTo(screenpts[i][0], screenpts[i][1]);
                }

                sizes.ctx.closePath();

                sizes.ctx.fill();
                sizes.ctx.stroke();


                //label

                var avg = this.posAvg();

                var [x, y] = this.screenPts(camera, sizes.width / 2, sizes.height / 2, avg.x, avg.y, avg.z / 100);

                sizes.ctx.font = "12px Arial";
                sizes.ctx.textAlign = "center";
                sizes.ctx.strokeStyle = 'black';
                sizes.ctx.lineWidth = 4;
                sizes.ctx.lineJoin = "round";
                sizes.ctx.strokeText(this.name, x, y + 4);
                sizes.ctx.fillStyle = "white";
                sizes.ctx.fillText(this.name, x, y + 4);

                if (doVals) {

                    sizes.ctx.strokeText((Math.round(this.value * 10) / 10) + ' eACH', x, y - 10);
                    sizes.ctx.fillStyle = this.color;
                    sizes.ctx.fillText(Math.round(this.value * 10) / 10 + ' eACH', x, y - 10);

                }
            }

        }

    }

    posAvg() {
        var avg = new Vector3(0, 0, 0);

        this.points.forEach(p => {
            avg.add(p);
        });

        return avg.divideScalar(this.points.length);
    }
}

export {
    Area
};