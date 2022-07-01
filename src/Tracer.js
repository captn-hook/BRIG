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

export { Tracer2d, Tracer3d };