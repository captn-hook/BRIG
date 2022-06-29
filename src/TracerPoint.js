
import * as THREE from 'three';

export default class TracerPoint {

    constructor(r = 2, w = .1, color = 'red', x = 0, y = 0, z = 0) {
        this.w = w;
        this.color = color;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = 2
    }
    
    screenPt(camera, w, h) {
        let pos = new THREE.Vector3(this.x, this.z, this.y);
    
        pos.project(camera);
    
        pos.x = (pos.x * w) + w;
        pos.y = -(pos.y * h) + h;
        pos.z = 0;
    
        return [pos.x, pos.y]
    
    }

}