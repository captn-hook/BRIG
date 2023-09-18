import { AmbientLight } from 'three';

export var globalObj;
export var sceneMeshes = [];

export function handleModels(input, scene) {
    //remove old stuff first

    // if (globalObj != null) {
    //     scene.remove(globalObj);
    // }
    console.log("reloading 3d scene...");
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    //re add the light
    const light = new AmbientLight(0x404040); // soft white light
    light.intensity = 10;
    scene.add(light);

    var read = new FileReader();

    read.readAsArrayBuffer(input);


    read.onloadend = function () {


        getDRACOLoader().then((loader) => {

            loader.parse(read.result, '', onLoadWrapper(scene), onErrorLog, onProgressLog);

        })

    }
}

var GsceneR = null;

export function exHandleModels(input) {
    if (GsceneR == null) {
        return;
    }
    //remove old stuff first
    while(scene.children.length > 0){ 
        GsceneR.remove(GsceneR.children[0]); 
    }

    var read = new FileReader();

    read.readAsArrayBuffer(input);


    read.onloadend = function () {


        getDRACOLoader().then((loader) => {

            loader.parse(read.result, '', onLoadWrapper(GsceneR), onErrorLog, onProgressLog);

        })

    }
}


export function setGsceneR(sceneR) {
    GsceneR = sceneR;
}

function onLoadWrapper(sceneR) {
    if (sceneR == null) {
        sceneR = GsceneR;
    } else {
        GsceneR = sceneR;
    }
    // onLoad callback
    function onLoadLoad(obj) {
        const scene = sceneR;

        sceneMeshes = [];

        sceneMeshes.push(obj.scene.children[0]);

        obj.scene.children[0].children.forEach((e) => {
            sceneMeshes.push(e);
        })

        scene.add(obj.scene);
        //console.log("LOADED: ", obj);
        //console.log("SCENE: ", scene);
        //globalObj = scene.children[scene.children.length - 1];
    }
    return onLoadLoad;
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
