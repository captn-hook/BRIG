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