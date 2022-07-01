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
            var pos1 = this.m.pos.project(camera);
            var pos2 = this.t.pos.project(camera);

            var x1 = (pos1.x * w) + w;
            var y1 = -(pos1.y * h) + h;

            var x3 = (pos2.x * w) + w;
            var y3 = -(pos2.y * h) + h;

            var x2 = (x1 + x3) / 2

            var y2 = (y1 + y3) / 2 + (this.lift * 10)

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

export { Tracer2d, Tracer3d };