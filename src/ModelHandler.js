import { data } from './Data';

export class ModelHandler {
    constructor() {
        this.globalObj;
        this.sceneMeshes = [];

        this.dataInput = document.getElementById('datapicker');

        this.modelInput = document.getElementById('modelpicker');


        //file input
        this.dataInput.addEventListener('change', (e) => {
            this.handleFiles(dataInput.files[0]);
        }, false);


        this.modelInput.addEventListener('change', (e) => {
            console.log('modelInput');
            this.handleModels(modelInput.files[0]);
        }, false);


    }
    // onLoad callback
    onLoadLoad(obj) {

        sceneMeshes = [];

        sceneMeshes.push(obj.scene.children[0]);

        obj.scene.children[0].children.forEach((e) => {
            sceneMeshes.push(e);
        })

        scene.add(obj.scene);
        globalObj = scene.children[scene.children.length - 1];
    }

    // onProgress callback
    onProgressLog(xhr) {
        console.log("LOADING: ", xhr.loaded / xhr.total * 100);
    }

    // onError callback
    onErrorLog(err) {
        console.error(err)
    }

    //data funccs

    getGLTFLoader() {
        return import('three/examples/jsm/loaders/GLTFLoader.js').then((GLTF) => {
            return new GLTF.GLTFLoader;
        });
    }

    getDRACOLoader() {
        return this.getGLTFLoader().then((GLTFLoader) => {
            return import('three/examples/jsm/loaders/DRACOLoader.js').then((DRACO) => {

                const DRACOLoader = new DRACO.DRACOLoader();

                DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

                GLTFLoader.setDRACOLoader(DRACOLoader);

                return GLTFLoader;
            });
        })
    }

    handleModels(input, userTable) {
        //remove old stuff first

        if (this.globalObj != null) {
            scene.remove(this.globalObj);
        }

        var read = new FileReader();

        read.readAsArrayBuffer(input);

        read.getDRACOLoader = this.getDRACOLoader;
        read.getGLTFLoader = this.getGLTFLoader;

        //bind this th obj
        read.onloadend = function () {

            

            this.getDRACOLoader().then((loader) => {

                loader.parse(read.result, '', this.onLoadLoad, this.onErrorLog, this.onProgressLog);

            })

        }
    }

    

    handleFiles(input) {

        //remove old stuff first
        
        var read = new FileReader();

        read.readAsBinaryString(input);

        read.onloadend = function () {

            return data(read.result)

        }
    }

    
}