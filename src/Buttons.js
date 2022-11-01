import {
    saveFile
} from './Data';

const d0 = document.getElementById('log');
const d1 = document.getElementById('selectPanel1')
const d2 = document.getElementById('selectPanel2')

export function switchDisplay(state) {
    if (state == 0) {
        d0.style.display = 'block'
        d1.style.display = 'none'
        d2.style.display = 'none'
    } else if (state == 1) {
        d0.style.display = 'none'
        d1.style.display = 'block'
        d2.style.display = 'none'
    } else if (state == 2) {
        d0.style.display = 'none'
        d1.style.display = 'none'
        d2.style.display = 'block'
    }
}

export function addButtonListeners() {

    //states: login 0, select panel 1, upload panel 2
    document.getElementById('editFiles').addEventListener('click', (e) => {
        if (d0.style.display == 'block') {
            switchDisplay(1);
        } else if (d1.style.display == 'block') {
            switchDisplay(2);
        } else {
            switchDisplay(0);
        }
    })

    document.getElementById('saveFiles').addEventListener('click', (e) => {
        saveFile(ms, ts, tracers, insights, views);
    })

    1




}