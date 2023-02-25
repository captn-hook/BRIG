import { Vector3, Vector2 } from 'three';
//import Point2d from './Point';
import { CanvasObject } from './CanvasObject';

class Tracer extends CanvasObject {

    constructor(m = 0, t = 0, value = 0, headroom = 40, lift = 20) {
        super();
        this.m = m;
        this.t = t;
        this.value = parseFloat(value);
        this.headroom = headroom;
        this.lift = lift;

        //console.log(this.rgb(this.value));  
        [this.r, this.g, this.b, this.a] = this.rgb(this.value);

        this.color = this.rgbToHex(this.r, this.g, this.b);
        //console.log(this.color);


        this.visible = true;
    }

    screenPts(camera, w, h) {


        let proj1 = new Vector3(this.m.pos.x, this.m.pos.z, this.m.pos.y);

        proj1.project(camera);

        let proj2 = new Vector3(this.t.pos.x, this.t.pos.z, this.t.pos.y);

        proj2.project(camera);

        //end       tx                  
        var x4 = ((proj2.x * w) + w);
        //headroom    ty                 
        var y4 = (-(proj2.y * h) + h);

        /*
        MOVE M POINT ALONG LINE TO T POMT BY HEADROOM
        */

        //m
        var x1 = ((proj1.x * w) + w);
        var y1 = (-(proj1.y * h) + h);

        //m > T
        //get unit vector of ((x4 - x1), (y4 - y1))
        var u = new Vector2(x4 - x1, y4 - y1).normalize();

        //mx + (tx - mx) /  scalar(headroom)
        x1 += u.x * this.headroom;
        //my + (ty - my) / scalar(headroom)
        y1 += u.y * this.headroom;

        //mid + lift
        var [mx, my] = this.midpoint(x1, y1, x4, y4);
        my -= this.lift;

        //ctrl1  mid(start, mid)
        var [x2, y2] = this.midpoint(x1, y1, mx, my);

        //ctrl2  mid(end, mid)
        var [x3, y3] = this.midpoint(x4, y4, mx, my);

        var headwidth = Math.max(this.outline * 2, 2); // length of head in 

        var dx = x4 - x1;
        var dy = y4 - y1;

        var angle = Math.atan2(dy, dx);

        var arrowconst = 3;

        var x5 = x1 + headwidth * Math.cos(angle - Math.PI / arrowconst);
        var y5 = y1 + headwidth * Math.sin(angle - Math.PI / arrowconst);

        var x6 = x1 + headwidth * Math.cos(angle + Math.PI / arrowconst);
        var y6 = y1 + headwidth * Math.sin(angle + Math.PI / arrowconst);

        return [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, proj1.z, proj2.z]

    }

}

class Tracer2d extends Tracer {

    constructor(m, t, value, headroom, lift) {

        super(m, t, value, headroom, lift);

        const maxwidth = 50;

        const minwidth = 1;

        this.rgbval = this.hexToRgb(this.color);

        this.outline = this.rescale(Math.min(value, 10), 0, 25, minwidth, maxwidth);

        //console.log(this.value, this.a)
    }


    drawTracer(leftPanel, camera, sizes, alpha, doVals) {

        var ctxLeft = leftPanel.ctx;
        var cellHeight = leftPanel.cellHeight;
        var cellWidth = leftPanel.cellWidth;

        //start,     ctrl1,  ctrl2,    end   arw 1   arw 2
        var [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, z1, z2] = this.screenPts(camera, sizes.width / 2, sizes.height / 2)

        //if z1 and z2 magnitude is less than 1, then draw the tracer
        if (this.visible && Math.abs(z1) < 1 && Math.abs(z2) < 1) {


            sizes.ctx.lineWidth = this.outline;

            if (alpha) {
                var opac = this.a;
            } else {
                var opac = 1;
            }

            sizes.ctx.strokeStyle = "rgba(" + String(this.r) + ", " + String(this.g) + ", " + String(this.b) + ", " + String(opac) + ")";
            sizes.ctx.fillStyle = "rgba(" + String(this.r) + ", " + String(this.g) + ", " + String(this.b) + ", " + String(opac) + ")";



            //arrowhead
            sizes.ctx.beginPath();
            sizes.ctx.moveTo(x1, y1);
            sizes.ctx.lineTo(x5, y5);
            sizes.ctx.lineTo(x6, y6);
            sizes.ctx.lineTo(x1, y1);
            sizes.ctx.fill();

            // Cubic Bézier curve
            sizes.ctx.beginPath();
            //start line at arrow tip edge
            var [strtx, strty] = this.midpoint(x5, y5, x6, y6);
            sizes.ctx.moveTo(strtx, strty);
            //                ctrl1    ctrl2   end
            sizes.ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
            sizes.ctx.stroke();

            if (doVals) {

                sizes.ctx.font = "12px Arial";
                sizes.ctx.textAlign = "center";
                sizes.ctx.strokeStyle = 'black';
                sizes.ctx.lineWidth = 2;

                sizes.ctx.strokeText(Math.round(this.value * 100) / 100, x2, y2);
                sizes.ctx.fillStyle = this.color;
                sizes.ctx.fillText(Math.round(this.value * 100) / 100, x2, y2);
            }

        }

        //spreadsheet
        if (leftPanel.spreadsheet) {
            if (this.visible) {
                ctxLeft.globalAlpha = 1.0;
            } else {
                ctxLeft.globalAlpha = .2;
            }
            ctxLeft.fillStyle = this.color;
            ctxLeft.fillRect(this.t.i * cellWidth, this.m.i * cellHeight, cellWidth, cellHeight);
            ctxLeft.globalAlpha = 1.0;
        }
    };

    drawValues(ctxLeft, cellWidth, cellHeight) {

        if (this.visible) {

            var size = parseInt(cellWidth / 2.3);

            ctxLeft.font = size.toString() + "px Arial";
            ctxLeft.textAlign = "center";
            ctxLeft.strokeStyle = 'black';
            ctxLeft.lineWidth = 2;
            ctxLeft.strokeText(Math.round(this.value * 100) / 100, this.t.i * cellWidth + cellWidth / 2, this.m.i * cellHeight + cellHeight / 1.5);
            ctxLeft.fillStyle = "white";
            ctxLeft.fillText(Math.round(this.value * 100) / 100, this.t.i * cellWidth + cellWidth / 2, this.m.i * cellHeight + cellHeight / 1.5);

            /*
            ctxLeft.font = "12px Arial";
            ctxLeft.fillStyle = "black";
            ctxLeft.textAlign = "center";
            ctxLeft.fillText(this.value, cellWidth * cellWidth, cellHeight * cellHeight - 30);
            */
        }
    };



    monitor() {
        return this.m;
    }

    tracer() {
        return this.t;
    }

}

export {
    Tracer2d
};