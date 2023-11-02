import { popUp } from '../shared/popUp.js';
//const uploadPanel = document.getElementById('selectPanel2');

const filePicker = document.getElementById('filepicker');

const glbInput = document.getElementById('modelpicker');
const objInput = document.getElementById('objpicker');
const mtlInput = document.getElementById('mtlpicker');

var objmtl = [null, null];

objInput.addEventListener('change', (e) => {
    //objs need mtl to wait for a mtl file
    console.log('objInput', objInput.files);
    objmtl[0] = objInput.files[0];
    if (objmtl[1] != null) {
        import('../viewer/modelHandler.js').then((module) => {
            module.obHandleModels(objmtl[0], objmtl[1]);
            objmtl = [null, null];
        })
    }
}, false);

mtlInput.addEventListener('change', (e) => {
    //mtl needs obj to wait for a obj file
    console.log('mtlInput', mtlInput.files);
    objmtl[1] = mtlInput.files[0];
    if (objmtl[0] != null) {
        import('../viewer/modelHandler.js').then((module) => {
            module.obHandleModels(objmtl[0], objmtl[1]);
            objmtl = [null, null];
        })
    }
}, false);

glbInput.addEventListener('change', (e) => {
    //glbs are self contained so just process
    //console.log('glbInput');
    import('../viewer/modelHandler.js').then((module) => {
        module.exHandleModels(glbInput.files[0]);
    })
}, false);

filePicker.addEventListener('change', (e) => {
    //needs to forward glb, obj, mtl, csv, and txt to respective pickers
    //should be able to handle one model (glb OR obj/mtl) and one data file (csv OR txt)
    console.log('filePicker', filePicker.files);

    var data = false;
    var model = false;
    var model2 = false;

    for (let i = 0; i < filePicker.files.length; i++) {
        var ext = filePicker.files[i].name.split('.')[1];
        console.log(ext);
        if (!data && (ext == 'csv' || ext == 'txt')) {
            data = true;
            dataInput.files[0] = filePicker.files[i];
        } else if (!model && ext == 'glb') {
            model = true;
            glbInput.files[0] = filePicker.files[i];
        } else if (!model && ext == 'obj') {
            model = true;
            objInput.files[0] = filePicker.files[i];
        } else if (!model2 && ext == 'mtl') {
            model2 = true;
            mtlInput.files[0] = filePicker.files[i];
        }
    }
    console.log(data, model, model2);

}, false);

export function newFiles() {
    //pop up, with a list of uploaded files
    var list = document.createElement('ul');
    //and two buttons: add files, confirm
    var pop = new popUp('Upload Files');
    console.log(pop);
    pop.createButton('Add Files', () => {
        filePicker.click();
    });
    pop.createButton('Confirm', () => {
        //file picker should be checking for correct file types
        console.log('confirm');
    });
}