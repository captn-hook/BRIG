import * as THREE from 'three';
import { Vector3 } from 'three';

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

            let proj = new THREE.Vector3(this.pos.x, this.pos.z, this.pos.y);

            proj.project(camera);

            var x = (proj.x * w) + w;
            var y = -(proj.y * h) + h;

         
            return [x, y]
    }

    drawPt(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight) {
        //main canvas
        var [x, y] = this.screenPt(camera, sizes.width / 2, sizes.height / 2);
    
        if (x != null && this.visible) {
    
    
            ctx.beginPath();
            ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.lineWidth = this.border;
            ctx.strokeStyle = this.color;
            ctx.stroke();
    
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.strokeText(this.name, x, y + 4);
            ctx.fillStyle = "white";
            ctx.fillText(this.name, x, y + 4);
    
        }
    
        //left canvas
    
        ctxLeft.font = "10px Arial";
    
        if (this.visible) {
            ctxLeft.globalAlpha = 1.0;
            ctxLeft.fillStyle = "white";
        } else {
            ctxLeft.globalAlpha = 0.2;
            ctxLeft.fillStyle = "grey";
        }
        ctxLeft.globalAlpha = 1.0;
    
        ctxLeft.textAlign = "center";
    
        if (this.type == 'M') {
            ctxLeft.fillRect(0, this.i * cellHeight, cellWidth, cellHeight);
            ctxLeft.fillStyle = "black";
            ctxLeft.fillText(this.name, 10, this.i * cellHeight + 10);
        } else if (this.type == 'T') {
            ctxLeft.fillRect(this.i * cellWidth, 0, cellWidth, cellHeight);
            ctxLeft.fillStyle = "black";
            ctxLeft.fillText(this.name, this.i * cellWidth + 10, 10);
        } else {
            console.error('Type Error: Left Canvas')
        }
    }
    






}

class Point3d extends Point {
    constructor(type, i, color, pos, radius = 1) {

        super(type, i, color, pos);
        
        this.radius = radius;

        this.geometry = new THREE.SphereGeometry(radius);

        this.material = new THREE.MeshBasicMaterial();
        this.material.color = new THREE.Color(this.color);
        this.sphere = new THREE.Mesh(this.geometry, this.material);

        this.sphere.position.set(this.pos.x, this.pos.z, this.pos.y);
    }


}

export {
    Point2d,
    Point3d
};