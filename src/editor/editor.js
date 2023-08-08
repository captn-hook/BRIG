import { cont } from '../viewer/viewer.js';

import { default as html } from "./editor.html";

export function open(state, firebaseEnv) {
    document.body.innerHTML = html; 
    cont(state, firebaseEnv);
    //add editor elements

    const sGroup = document.getElementById('saveGroup');
    const aGroup = document.getElementById('addGroup');
    const dGroup = document.getElementById('deleteGroup');

    const sArea = document.getElementById('saveArea');
    const aArea = document.getElementById('addArea');
    const dArea = document.getElementById('deleteArea');


    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}
