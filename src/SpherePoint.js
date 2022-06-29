
import * as THREE from 'three';

export default class SpherePoint {

    constructor(rad, col = 0xff0000, x = 0, y = 0, z = 0){

    this.geometry = new THREE.SphereGeometry(rad, 8, 6, 0, Math.PI*2, 0, Math.PI);
    
    this.material = new THREE.MeshBasicMaterial();
    
    this.material.color = new THREE.Color(col);
    
    this.sphere = new THREE.Mesh(this.geometry, this.material);

    this.sphere.position.set(x, z, y);
    
    return this.sphere
    }
    }
    