import * as THREE from 'three';

class Tracer {

    constructor(value, width = 1, headroom = 1, lift = 1) {
        this.value = value;
        this.width = width;
        this.headroom = headroom;
        this.lift = lift;
    }

}

export default class Tracer2d extends Tracer {
    constructor(value, pos1, pos2, width = 1, headroom = 1, lift = 1) {
        super(value, width, headroom, lift);

        this.pos1 = pos1;
        this.pos2 = pos2;

        this.mid = this.midpoint(pos1, pos2);

    }

    screenPts(camera, w, h) {

        var frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));


        if (frustum.containsPoint(this.pos1)) {
            this.pos1.project(camera);
            this.pos2.project(camera);
            this.mid.project(camera);




            var x1 = (this.pos1.x * w) + w;
            var y1 = -(this.pos1.y * h) + h;

            var x2 = (this.mid.x * w) + w;
            var y2 = -(this.mid.y * h) + h;

            var x3 = (this.pos2.x * w) + w;
            var y3 = -(this.pos2.y * h) + h;

            return [x1, y1, x2, y2, x3, y3]

        } else {

            return [-20, -20, -20, -20, -20, -20]
        }

    }

    m() {
        return this.pos1
    }

    t() {
        return this.pos2
    }

    midpoint(pos1, pos2) {
        console.log('mid')
        return new THREE.Vector3((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2, (pos1.z + pos2.z) / 2);
    }
}