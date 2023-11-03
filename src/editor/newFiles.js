import { popUp } from '../shared/popUp.js';
import { exHandleModels, obHandleModels } from '../viewer/modelHandler.js';
//const uploadPanel = document.getElementById('selectPanel2');

const filePicker = document.getElementById('filepicker');

var fileStore = [];

var data = false;
var model = false;
var model2 = false;
var tex = [];

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
        } else if (fileStore[i].name.split('.')[1] == 'jpg' && model2) {
            li.className = 'Fselected';
        }
        li.addEventListener('click', clickLi, false);
        list.appendChild(li);
    }
}

export function newFiles(V, newsitename) {
    //in the future this should let you set data dimensions if no data file detected

    //pop up, with a list of uploaded files
    var list = document.createElement('ul');
    list.addEventListener('fpchange', listChangeListener, false);
    list.className = 'fileList';
    list.id = 'fileDisplayList';
    let h1 = document.createElement('h1')
    h1.innerHTML = newsitename;
    //and two buttons: add files, confirm
    var pop = new popUp('Upload Files', [list, h1]);
    pop.createButton('Add Files', filePicker.click.bind(filePicker));
    pop.createButton('Confirm', () => {
        if (data) {
            //get file from fileStore
            V.handleFiles(fileStore.find((e) => {return e.name == data}));
        }
        if (model && model.split('.')[1] == 'obj' && model2) {
            console.log('obj loading with ', tex.length, 'textures');
            let texture = []; //fileStore.find((e) => {return e.name == tex});
            for (let i = 0; i < tex.length; i++) {
                texture.push(fileStore.find((e) => {return e.name == tex[i]}));
            }
            obHandleModels(fileStore.find((e) => {return e.name == model}), fileStore.find((e) => {return e.name == model2}), texture, V.scene);
        } else if (model) {
            exHandleModels(fileStore.find((e) => {return e.name == model}), V.scene);
        }
        pop.remove();
    
        //create storage folder
        //sendFile([], [], [], [], [], db, newsitename);

        V.leftPanel.siteheader = newsitename;
        V.dropd.value = newsitename;
        var option = document.createElement('option');
        option.text = newsitename;
        V.dropd.add(option);
        V.dropd.selectedIndex = V.dropd.length - 1;

        //V.dropd.dispatchEvent(new Event('change'));
        document.getElementById('editPos').dispatchEvent(new Event('click'));
    });
        
    filePicker.click();
}

filePicker.addEventListener('change', (e) => {
    //needs to forward glb, obj, mtl, csv, and txt to respective pickers, and jpg for textures
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
        } else if (ext == 'jpg') {
            tex.push(fname);
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