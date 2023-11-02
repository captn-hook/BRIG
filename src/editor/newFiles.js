import { popUp } from '../shared/popUp.js';
import { exHandleModels, obHandleModels } from '../viewer/modelHandler.js';
//const uploadPanel = document.getElementById('selectPanel2');

const filePicker = document.getElementById('filepicker');

var fileStore = [];

var data = false;
var model = false;
var model2 = false;

function clickLi(e) {
    //set its var to false
    if (data == e.target.innerHTML) {
        data = false;
    } else if (model == e.target.innerHTML) {
        model = false;
    } else if (model2 == e.target.innerHTML) {
        model2 = false;
    }
    //remove it from filestore
    for (let i = 0; i < fileStore.length; i++) {
        if (fileStore[i].name == e.target.innerHTML) {
            fileStore.splice(i, 1);
        }
    }
    //and reset filePicker
    filePicker.value = '';
    filePicker.dispatchEvent(new CustomEvent('change'));
}

function listChangeListener(e) {
    //shows all the files in filePicker and highlights the ones that are selected
    //those being data, model, and model2 if they arent false
    //first empty the list
    var list = e.target;
    
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    //then add all the files
    for (let i = 0; i < fileStore.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = fileStore[i].name;
        if (fileStore[i].name == data || fileStore[i].name == model || fileStore[i].name == model2) {
            li.className = 'Fselected';
        }
        li.addEventListener('click', clickLi, false);
        list.appendChild(li);
    }
}

export function newFiles(dfunc, scene) {
    //in the future this should let you set data dimensions if no data file detected

    //pop up, with a list of uploaded files
    var list = document.createElement('ul');
    list.addEventListener('fpchange', listChangeListener, false);
    list.className = 'fileList';
    list.id = 'fileDisplayList';
    //and two buttons: add files, confirm
    var pop = new popUp('Upload Files', [list]);
    pop.createButton('Add Files', filePicker.click.bind(filePicker));
    pop.createButton('Confirm', () => {
        if (data) {
            //get file from fileStore
            dfunc(fileStore.find((e) => {return e.name == data}));
        }
        if (model.split('.')[1] == 'obj' && model2) {
            obHandleModels(fileStore.find((e) => {return e.name == model}), fileStore.find((e) => {return e.name == model2}), scene);
        } else if (model) {
            console.log('glb: ', model);
            console.log(fileStore.find((e) => {return e.name == model}));
            exHandleModels(fileStore.find((e) => {return e.name == model}), scene);
        }
        pop.remove();
    });
        
    filePicker.click();
}

filePicker.addEventListener('change', (e) => {
    //needs to forward glb, obj, mtl, csv, and txt to respective pickers
    //should be able to handle one model (glb OR obj/mtl) and one data file (csv OR txt)
    function proc(fname) {
        var ext = fname.split('.')[1];
        if (!data && (ext == 'csv' || ext == 'txt')) {
            data = fname;
        } else if (!model && ext == 'glb') {
            model = fname;
        } else if (!model && ext == 'obj') {
            model = fname;
        } else if (!model2 && ext == 'mtl') {
            model2 = fname;
        }
    }
    for (let i = 0; i < fileStore.length; i++) {
        proc(fileStore[i].name);
    }

    for (let i = 0; i < filePicker.files.length; i++) {
        proc(filePicker.files[i].name);
        //if file already exists, replace it
        for (let j = 0; j < fileStore.length; j++) {
            if (fileStore[j].name == filePicker.files[i].name) {
                fileStore.splice(j, 1);
            }
        }
        fileStore.push(filePicker.files[i]);
    }
    //propogate change to list
    document.getElementById('fileDisplayList').dispatchEvent(new CustomEvent('fpchange'));
}, false);