

var globalObj;
var sceneMeshes = [];

// onLoad callback
function onLoadLoad(obj) {

    sceneMeshes = [];

    sceneMeshes.push(obj.scene.children[0]);

    obj.scene.children[0].children.forEach((e) => {
        sceneMeshes.push(e);
    })

    scene.add(obj.scene);
    globalObj = scene.children[scene.children.length - 1];
}

// onProgress callback
function onProgressLog(xhr) {
    console.log("LOADING: ", xhr.loaded / xhr.total * 100);
}

// onError callback
function onErrorLog(err) {
    console.error(err)
}

/*
Misc
*/
const dataInput = document.getElementById('datapicker');

const modelInput = document.getElementById('modelpicker');


//data funccs

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

function handleModels(input) {
    //remove old stuff first

    if (globalObj != null) {
        scene.remove(globalObj);
    }

    var read = new FileReader();

    read.readAsArrayBuffer(input);

    read.onloadend = function () {

        getDRACOLoader().then((loader) => {

            loader.parse(read.result, '', onLoadLoad, onErrorLog, onProgressLog);

        })

        userTable.populateTable(storage, allUsersM, dropd.value, bw);

    }
}

function handleFiles(input) {

    //remove old stuff first
    leftPanel.blankClicks();

    var read = new FileReader();

    read.readAsBinaryString(input);

    read.onloadend = function () {

        [ms, ts, tracers, insights, views] = Data(read.result)

        leftPanel.setTracers(ms, ts, tracers)
        //resize sheet
        sizes.updateSizes(leftPanel);
    }
}