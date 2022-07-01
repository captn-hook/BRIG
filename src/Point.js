import * as THREE from 'three';

class Point {

    constructor(color = 'red', pos = new THREE.Vector3(0, 0, 0)) {
        this.color = color;
        this.pos = pos;
    }

    position() {
        return this.pos;
    }

    xyz() {
        return [this.pos.x, this.pos.y, this.pos.z];
    }

}

class Point2d extends Point {

    constructor(color, pos, radius = 1, border = 1) {
        super(color, pos);
        this.color = color;
        this.pos = pos;
        this.radius = radius;
        this.border = border;

        console.log(this.pos)
    }

    screenPt(camera, w, h) {

        this.pos.project(camera);

        var x = (this.pos.x * w) + w;
        var y = -(this.pos.y * h) + h;

        return [x, y]

    }

}

class Point3d extends Point {
    constructor(color, pos, radius = 1) {
        super(color, pos);
        this.color = color;
        this.pos = pos;
        this.radius = radius;

        this.geometry = new THREE.SphereGeometry(radius)

        this.material = new THREE.MeshBasicMaterial()
        this.material.color = new THREE.Color(0xff0000)

        this.sphere = new THREE.Mesh(this.geometry, this.material)

        this.sphere.position.set(pos);
    }


}

export {
    Point2d,
    Point3d
};