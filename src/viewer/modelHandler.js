import { AmbientLight } from 'three';

export var globalObj;
export var sceneMeshes = [];

function newLight(scene) {
    //look for a light
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].type == "AmbientLight") {
            return;
        }
    }
    const light = new AmbientLight(0x404040); // soft white light
    light.intensity = 10;
    scene.add(light);
}

function emptyS(scene) {
    while(scene.children.length > 0){ 
        //if not a light
        if (scene.children[0].type != "AmbientLight") {
            scene.remove(scene.children[0]); 
        } else if (scene.children.length > 1) {
            scene.remove(scene.children[1]); 
        } else {
            break;
        }
    }
}

export function handleModels(input, scene) {
    //remove old stuff first
    emptyS(scene);
    // if (globalObj != null) {
    //     scene.remove(globalObj);
    // }

    //re add the light
    newLight(scene);

    var read = new FileReader();

    read.readAsArrayBuffer(input);

    read.onloadend = function () {

        getDRACOLoader().then((loader) => {

            loader.parse(read.result, '', onLoadWrapper(scene), onErrorLog, onProgressLog);

        })

    }
}

export function exHandleModels(input, scene) {
    //remove old stuff first
    emptyS(scene);

    var read = new FileReader();

    read.readAsArrayBuffer(input);

    read.onloadend = function () {

        getDRACOLoader().then((loader) => {
            loader.parse(read.result, '', onLoadWrapper(scene), onErrorLog, onProgressLog);

        })

    }
}

export function obHandleModels(input, inmat, scene) {
    emptyS(scene);

    var read = new FileReader();
    //input is a file
    read.readAsDataURL(input);

    read.onloadend = function () {
        var obj = read.result;

        read.readAsText(inmat);

        read.onloadend = function () {
            var mat = read.result;

            getOBJLoaders().then((loaders) => {
                const mtlLoader = new loaders[0]();
                const objLoader = new loaders[1]();
                mtlLoader.load(mat, (mtl) => {
                    mtl.preload();
                    objLoader.setMaterials(mtl);
                    objLoader.load(obj, onLoadWrapper(scene, true), onProgressLog, onErrorLog);
                });
            });
        }
    }
}

function onLoadWrapper(scene, isObj = false) {

    // onLoad callback
    function onLoadLoad(obj) {

        sceneMeshes = [];

        sceneMeshes.push(obj.scene.children[0]);

        obj.scene.children[0].children.forEach((e) => {
            sceneMeshes.push(e);
        })

        scene.add(obj.scene);
        //globalObj = scene.children[scene.children.length - 1];
    }

    function onLoadOBJ(obj) {
        //obj loads as a group, so we need to add each child to the scene
        obj.children.forEach((e) => {
            scene.add(e);
        })
        //globalObj = scene.children[scene.children.length - 1];
    }

    if (isObj) {
        return onLoadOBJ;
    } else {
        return onLoadLoad;
    }
}

// onProgress callback
function onProgressLog(xhr) {
    //console.log("LOADING: ", xhr.loaded / xhr.total * 100);
}

// onError callback
function onErrorLog(err) {
    console.error(err)
}

function getGLTFLoader() {
    return import('three/examples/jsm/loaders/GLTFLoader.js').then((GLTF) => {
        return new GLTF.GLTFLoader;
    });
}

function getDRACOLoader() {
    return getGLTFLoader().then((GLTFLoader) => {
        return import('three/examples/jsm/loaders/DRACOLoader.js').then((DRACO) => {

            const DRACOLoader = new DRACO.DRACOLoader();

            DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

            GLTFLoader.setDRACOLoader(DRACOLoader);

            return GLTFLoader;
        });
    })
}

 function getOBJLoaders() {
//     import { MTLLoader } from '../js/examples/jsm/loaders/MTLLoader.js';
//     import { OBJLoader } from '../js/examples/jsm/loaders/OBJLoader.js';
    return import('three/examples/jsm/loaders/MTLLoader.js').then((MTLLoader) => {
        return import('three/examples/jsm/loaders/OBJLoader.js').then((OBJLoader) => {
            return [MTLLoader.MTLLoader, OBJLoader.OBJLoader];
        });
    })
}