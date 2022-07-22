import {
    parse
} from '@vanillaes/csv'

import {
    Point2d
} from './Point';

import {
    Tracer2d
} from './Tracer';

import * as THREE from 'three';

export default function Data(data) {

/*
Data
*/

const dataArray = parse(data);

console.log(dataArray)



const ms = [];
const ts = [];
const tracers = [];

for (var m = 0; m < dataArray[0].length; m++) {
    for (var t = 0; t < dataArray.length; t++) {

        //DATA INTERP TREE
        //basic idea, cycle thru 2d array
        //ROW and COLUMN 0 label
        //ROW and COLUMN 1 XYZ

        //Labels
        if (m == 0 || t == 0) {
            console.log('Label: ' + dataArray[t][m]);

            //CLM 1
        } else if (m == 1 && t > 1) {

            var xyz = dataArray[t][m].split('/');
            var pos = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);

            ts.push(new Point2d("T", t - 1, 'blue', pos, 5));

            //ROW 1
        } else if (t == 1 && m > 1) {

            var xyz = dataArray[t][m].split('/');
            var pos = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);

            ms.push(new Point2d("M", m - 1, 'red', pos, 10));

            //Main Transmission
        } else if (m > 1 && t > 1) {

            // if (dataArray[t][m] > 1) {
            tracers.push(new Tracer2d(ms[m - 2], ts[t - 2], dataArray[t][m]));
            //}

        } else {
            console.log('Error: ' + dataArray[t][m]);
        }
    }
}

//const sheet = new Spreadsheet(ms.length, ts.length, sizes.width / 4, sizes.height);

function compare(a, b) {
    if (a.last_nom < b.last_nom) {
        return -1;
    }
    if (a.last_nom > b.last_nom) {
        return 1;
    }
    return 0;
}

tracers.sort((a, b) => {
    return a.value - b.value;
});

return [ms, ts, tracers]

}