
export var globalObj;
export var sceneMeshes = [];

export function handleModels(input, scene) {
    //remove old stuff first

    if (globalObj != null) {
        scene.remove(globalObj);
    }

    var read = new FileReader();

    read.readAsArrayBuffer(input);


    read.onloadend = function () {


        getDRACOLoader().then((loader) => {

            loader.parse(read.result, '', onLoadWrapper(scene), onErrorLog, onProgressLog);

        })

    }
}

function onLoadWrapper(sceneR) {
    // onLoad callback
    function onLoadLoad(obj) {
        const scene = sceneR;

        sceneMeshes = [];

        sceneMeshes.push(obj.scene.children[0]);

        obj.scene.children[0].children.forEach((e) => {
            sceneMeshes.push(e);
        })

        scene.add(obj.scene);
        globalObj = scene.children[scene.children.length - 1];
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
