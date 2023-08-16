import {
    parse
} from '@vanillaes/csv'

import {
    Point2d
} from './Point';

import {
    Tracer2d
} from './Tracer';

import {
    Area
} from './Area';

import {
    setDoc,
    getDoc,
    getDocs,
    collection,
    doc
} from "firebase/firestore";

import {
    Vector3
} from 'three';

const MAX_GROUPS = 40;

const MAX_AREAS = 40;
export function GetAreas(db, name) {
    var areas = []
    if (name != '') {


        for (let i = 0; i < MAX_AREAS; i++) {

            const area = doc(db, name, 'area' + (i + 1));

            getDoc(area).then((a) => {
                a = a.data();

                if (a != undefined) {

                    var points = [];

                    var npoints = 0;

                    for (var v in a) {
                        if (v.startsWith('point')) {
                            npoints++;
                        }
                    }

                    for (let j = 0; j < npoints; j++) {
                        var point = a['point' + j];
                        points.push(new Vector3(point[0], point[1], point[2]));
                    }

                    var value = a['value'];
                    var name = a['name'];
                    var text = a['text'];

                    if (text == undefined) {
                        text = '';
                    }

                    if (value == undefined) {
                        value = 0;
                    }

                    if (name == undefined) {
                        name = 'area' + (i + 1);
                    }

                    var area = new Area(points, value, name, text);

                    areas.push(area);
                }
            })
        }
    }

    return areas;
}

export async function saveArea(db, name, i, area) {

    var text = area.text;

    if (i) {
        var areaDoc = {};

        if (area.name != undefined && area.name != '') {
            areaDoc['name'] = area.name
        } else if (text == '') {
            areaDoc['name'] = 'area' + i
        } else {
            //evertything up to the first newline
            areaDoc['name'] = decodeURI(text).replaceAll(',', '~').split(/\r?\n/)[0];
        }

        areaDoc['text'] = decodeURI(text).replaceAll(',', '~');

        for (let j = 0; j < area.points.length; j++) {
            areaDoc['point' + j] = [area.points[j].x, area.points[j].y, area.points[j].z];
        }

        var avg = area.posAvg();
        areaDoc['pos'] = [avg.x, avg.y, avg.z];

        areaDoc['value'] = area.value;
        try {
            await setDoc(doc(db, name, 'area' + i), areaDoc);
            console.log("Document written");
            return areaDoc;
        } catch (e) {
            console.error("Error adding document", e);
        }
    }
}

//need save group and get groups functions
export function GetGroups(db, name) {

    var groups = []
    if (name != '') {  

        for (let i = 0; i < MAX_GROUPS; i++) {

            const group = doc(db, name, 'group' + i);

            getDoc(group).then((g) => {
                groups.push(g.data())
            })
        }
    }

    return groups
}

export async function RemoteData(db, name) {

    var ms = []
    var ts = []
    var tracers = []
    var insights = []
    var views = []


    const docRef = doc(db, name, 'data');

    const group0 = doc(db, name, 'group0');

    await getDoc(group0).then((g) =>
        getDoc(docRef).then((doc) => {

            let gru = g.data();

            let d = doc.data();

            var leng = Object.keys(d).length;

            var IV = 0;

            if (d[leng - 2][0] == 'INSIGHTS') {

                insights = d[leng - 2]

                IV += 1;

            }

            if (d[leng - 1][0] == 'VIEWS') {

                views = d[leng - 1]

                for (i in d[leng - 1]) {
                    if (d[leng - 1][i].includes("/") != -1) {
                        views[i] = d[leng - 1][i].split("/")
                    }
                }

                IV += 1;

            }

            for (var i = 2; i < d[0].length; i++) {

                var xyz = d[1][i].split('/');
                var pos = new Vector3(xyz[0], xyz[1], xyz[2]);

                ms.push(new Point2d("M", i - 1, 'red', pos, 7));

            }

            for (var i = 2; i < leng - IV; i++) {

                var xyz = d[i][1].split('/');
                var pos = new Vector3(xyz[0], xyz[1], xyz[2]);

                ts.push(new Point2d("D", i - 1, 'blue', pos, 3.5));

            }

            for (var m = 2; m < d[0].length; m++) {
                for (var t = 2; t < leng - IV; t++) {

                    tracers.push(new Tracer2d(ms[m - 2], ts[t - 2], d[t][m]));

                    if (gru != undefined && (String(m - 1) + "/" + String(t - 1)) in gru) {

                        tracers[tracers.length - 1].visible = gru[String(m - 1) + "/" + String(t - 1)];
                    }

                }
            }
        }))

    return [ms, ts, tracers, insights, views]
}

export function Data(data) {

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
                    var pos = new Vector3(xyz[0], xyz[1], xyz[2]);

                    ts.push(new Point2d("D", t - 1, 'blue', pos, 5));

                    //ROW 1
                } else if (t == 1 && m > 1) {

                    var xyz = dataArray[t][m].split('/');
                    var pos = new Vector3(xyz[0], xyz[1], xyz[2]);

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
                var pos = new Vector3(0, (i) * 3, 0);
                ms.push(new Point2d('M', i, 'red', pos, 10));
            }
        })


        dataArray.forEach((e, i) => {
            if (i > 0 && e != '' && e != null) {
                var pos = new Vector3((i) * 3, 0, 0);
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

function assemble(ms, ts, tracers, insights, views) {

    let viewlist = [];

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

    for (var i = 0; i < ms.length + 1; i++) {
        if (i == 0) {
            viewlist[i] = 'VIEWS';
        } else if (views[i] != null) {
            viewlist[i] = views[i].join("/")
        }
    }

    dataArray.push(insights);
    dataArray.push(viewlist);

    return dataArray

}

export async function sendFile(ms, ts, tracers, insights, views, db, name) {
    console.log('sending file', name);

    let dataArray = assemble(ms, ts, tracers, insights, views);

    let document = {};

    for (let i = 0; i < dataArray.length; i++) {

        //for every element in da[i] arr if it is undefined set it to ''
        for (let j = 0; j < dataArray[i].length; j++) {
            if (dataArray[i][j] == undefined) {
                dataArray[i][j] = '';
            }
            document[i] = dataArray[i];

        }
        
    }

    try {
        console.log('sending file', document);
        await setDoc(doc(db, name, 'data'), document);
        console.log("Document 1 written");
    } catch (e) {
        console.error("Error adding document", e);
    }

    //create distance table

    let group0 = {}

    let distance = {};

    tracers.forEach((t) => {


        var d = t.m.pos.distanceTo(t.t.pos);
        var label = String(t.m.i) + "/" + String(t.t.i);

        distance[label] = d;

        if (d < 1) {
            group0[label] = false;
        } else {
            group0[label] = true;
        }

    })

    group0['pos'] = [10, 10, 10];

    try {
        await setDoc(doc(db, name, 'dist'), distance);
        console.log("Document 2 written");
    } catch (e) {
        console.error("Error adding document");
    }

    try {
        await setDoc(doc(db, name, 'group0'), group0);
        console.log("Document 3 written");
    } catch (e) {
        console.error("Error adding document");
    }


    ms.forEach((m, i) => {

        var group = {};
        var posAvg = [];

        tracers.forEach((t) => {

            var label = String(t.m.i) + "/" + String(t.t.i);

            if (t.m.i == i + 1) {
                group[label] = true;
            } else {
                group[label] = false;
            }

            if (t.visible && posAvg.find(e => e == t.m.pos) == null) {
                posAvg.push(t.m.pos);
            }

        })

        let n = 0;
        let x = 0;
        let y = 0;
        let z = 0;

        posAvg.forEach((p) => {
            x += parseFloat(p.x);
            y += parseFloat(p.y);
            z += parseFloat(p.z);
            n++;
        })

        let pos = [x / n, y / n, z / n];

        group['pos'] = pos;
        group['name'] = m.name;
        group['text'] = m.name;

        try {
            setDoc(doc(db, name, 'group' + String(i + 1)), group);
        } catch (e) {

        }
    })

}

export function saveFile(ms, ts, tracers, insights, views) {

    
    for (var i = 0; i < ms.length + 1; i++) {
        if (i == 0) {
            views[i] = 'VIEWS';
        } else if (views[i] == null) {
            views[i] = [parseFloat(ms[i - 1].pos.x) + 14, parseFloat(ms[i - 1].pos.z) + 30, parseFloat(ms[i - 1].pos.y) + 8];
        }
    }

    let dataArray = assemble(ms, ts, tracers, insights, views);


    let csvContent = "data:text/csv;charset=utf-8,"


    dataArray.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);

}