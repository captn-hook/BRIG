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

    const dataArray = parse(data)

    //strip special info from data arrays
    var insights = [];
    var views = [];

    if (dataArray[dataArray.length - 1][0] == 'VIEWS') {
        views = dataArray.pop()
    }

    if (dataArray[dataArray.length - 1][0] == 'INSIGHTS') {
        insights = dataArray.pop()
    }


    views.forEach((e, i) => {
        var xyz = e.split('/');
        views[i] = xyz;
    })

    const ms = [];
    const ts = [];
    const tracers = [];

    if (dataArray[1][1] == 'XYZ') {

        //data func if xyz
        for (var m = 0; m < dataArray[0].length; m++) {
            for (var t = 0; t < dataArray.length; t++) {

                //DATA INTERP TREE
                //basic idea, cycle thru 2d array
                //ROW and COLUMN 0 label
                //ROW and COLUMN 1 XYZ

                //Labels
                if (m == 0 || t == 0) {
                    //console.log('Label: ' + dataArray[t][m]);

                    //CLM 1
                } else if (m == 1 && t > 1) {

                    var xyz = dataArray[t][m].split('/');
                    var pos = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);

                    ts.push(new Point2d("D", t - 1, 'blue', pos, 5));

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
                    //console.error('Error: ' + dataArray[t][m]);
                }
            }
        }
    } else {
        //placeholder locations

        dataArray[0].forEach((e, i) => {
            if (e != '' && e != null) {
                var pos = new THREE.Vector3(0, (i) * 3, 0);
                ms.push(new Point2d('M', i, 'red', pos, 10));
            }
        })


        dataArray.forEach((e, i) => {
            if (i > 0 && e != '' && e != null) {
                var pos = new THREE.Vector3((i) * 3, 0, 0);
                ts.push(new Point2d('D', i, 'blue', pos, 5));
            }
        })

        for (var m = 0; m < dataArray[0].length; m++) {
            for (var t = 0; t < dataArray.length; t++) {

                //Labels
                if (m == 0 || t == 0) {
                   
                    //CLM 1
                } else if (m > 0 && t > 0) {

                    // if (dataArray[t][m] > 1) {
                    tracers.push(new Tracer2d(ms[m - 1], ts[t - 1], dataArray[t][m]));
                    //}

                } else {
                    console.error('Error: ' + dataArray[t][m]);
                }
            }
        }

    }

    //const sheet = new Spreadsheet(ms.length, ts.length, sizes.width / 4, sizes.height);

    /*
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
    */

    return [ms, ts, tracers, insights, views]

}

export function saveFile(ms, ts, tracers, insights, views) {

    let viewlist = [];

    let csvContent = "data:text/csv;charset=utf-8,"

    let dataArray = [
        ["Labels", "M0"],
        ["T0", "XYZ"]
    ];

    ms.forEach(e => {
        dataArray[0].push(e.name);
        dataArray[1].push(String(e.pos.x) + "/" + String(e.pos.y) + "/" + String(e.pos.z));
    })

    ts.forEach((e, i) => {
        dataArray.push([e.name]);
        dataArray[i + 2].push(String(e.pos.x) + "/" + String(e.pos.y) + "/" + String(e.pos.z));
    })

    tracers.forEach((e, i) => {
        dataArray[(i % ts.length) + 2].push(String(e.value))
    })
    insights[0] = 'INSIGHTS'
    
    for (var i = 0; i < ms.length + 1; i++){
        if (i == 0) {
            viewlist[i] = 'VIEWS';
        } else if (views[i] != null) {
            viewlist[i] = views[i].join("/")
        }
    }
    
    dataArray.push(insights);
    dataArray.push(viewlist);

    dataArray.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);

}