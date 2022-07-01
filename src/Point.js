import * as THREE from 'three';

class Point {

    constructor(color = 'red', pos = new THREE.Vector3(0, 0, 0)) {
        this.color = color;
        this.pos = pos;
    }

    position(){
        return this.pos;
    }

    xyz(){
        return [this.pos.x, this.pos.y, this.pos.z];
    }

}

export default class Point2d extends Point {

    constructor(color, pos, radius = 1, border = 1) {
        super(color, pos);
        this.radius = radius;
        this.border = border;
    }


}

class Point3d extends Point {
    constructor(color, pos, radius = 1){
        super(color, pos)


    const geometry = new THREE.SphereGeometry(radius)

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

const sphere = new THREE.Mesh(geometry,material)

}

    
}