
import { Vector3, SphereGeometry, MeshBasicMaterial, Color, Mesh } from 'three';

class Point {

    constructor(type, i, color = 'red', pos) {
        this.name = type + String(i);
        this.type = type;
        this.i = i;
        this.color = color;
        this.pos = pos;

        this.visible = true;
    }

    position() {
        return [this.x, this.y, this.z];
    }

}

class Point2d extends Point {

    constructor(type, i, color, pos, radius = 5, border = 2) {

        super(type, i, color, pos);

        this.radius = radius;
        this.border = border;

    }

    screenPt(camera, w, h) {

        let proj = new Vector3(this.pos.x, this.pos.z, this.pos.y);

        proj.project(camera);

        var x = (proj.x * w) + w;
        var y = -(proj.y * h) + h;


        return [x, y, proj.z]
    }

    drawPt(leftPanel, camera, sizes, bw) {

        var ctxLeft = leftPanel.ctx;
        var cellHeight = leftPanel.cellHeight;
        var cellWidth = leftPanel.cellWidth;

        //main canvas
        var [x, y, z] = this.screenPt(camera, sizes.width / 2, sizes.height / 2);

        if (Math.abs(z) < 1 && x != null && this.visible) {


            sizes.ctx.beginPath();
            sizes.ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
            sizes.ctx.fillStyle = this.color;
            sizes.ctx.fill();
            sizes.ctx.lineWidth = this.border;
            sizes.ctx.strokeStyle = this.color;
            sizes.ctx.stroke();

            sizes.ctx.font = String(leftPanel.fontsize) + "px Arial";
            sizes.ctx.textAlign = "center";
            sizes.ctx.strokeStyle = 'black';
            sizes.ctx.lineWidth = 4;
            sizes.ctx.lineJoin = "round";
            sizes.ctx.strokeText(this.name, x, y + 4);
            sizes.ctx.fillStyle = "white";
            sizes.ctx.fillText(this.name, x, y + 4);

        }

        //left canvas
        if (leftPanel.spreadsheet) {

            ctxLeft.font = String(leftPanel.fontsize) + "px Arial";

            if (this.visible) {
                ctxLeft.globalAlpha = 1.0;
                if (bw) {
                    ctxLeft.fillStyle = "black";
                } else {
                    ctxLeft.fillStyle = "white";
                }
            } else {
                ctxLeft.globalAlpha = 0.2;
                ctxLeft.fillStyle = "grey";
            }
            ctxLeft.globalAlpha = 1.0;

            ctxLeft.textAlign = "center";
            if (this.type == 'M') {
                ctxLeft.fillRect(0, this.i * cellHeight, cellWidth, cellHeight);
                if (!bw) {
                    ctxLeft.fillStyle = "black";
                } else {
                    ctxLeft.fillStyle = "white";
                }
                ctxLeft.fillText(this.name, cellWidth / 2, this.i * cellHeight + cellHeight / 2 + leftPanel.fontsize / 3);
            } else if (this.type == 'D') {
                ctxLeft.fillRect(this.i * cellWidth, 0, cellWidth, cellHeight);
                if (!bw) {
                    ctxLeft.fillStyle = "black";
                } else {
                    ctxLeft.fillStyle = "white";
                }
                ctxLeft.fillText(this.name, this.i * cellWidth + cellWidth / 2, cellHeight / 2 + leftPanel.fontsize / 3);
            } else {
                console.error('Type Error: Left Canvas')
            }
        }
    }







}

class Point3d extends Point {
    constructor(type, i, color, pos, radius = 1) {

        super(type, i, color, pos);

        this.radius = radius;

        this.geometry = new SphereGeometry(radius);

        this.material = new MeshBasicMaterial();
        this.material.color = new Color(this.color);
        this.sphere = new Mesh(this.geometry, this.material);

        this.sphere.position.set(this.pos.x, this.pos.z, this.pos.y);
    }


}

export {
    Point2d,
    Point3d
};