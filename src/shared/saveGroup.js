import { doc, setDoc } from "firebase/firestore";

export default async function saveGroup(db, name, i, tracers, text) {

    if (i) {

        var group = {};

        if (text == '') {
            group['name'] = 'group' + i
        } else {
            //evertything up to the first newline
            group['name'] = decodeURI(text).replaceAll(',', '~').split(/\r?\n/)[0];
        }


        group['text'] = decodeURI(text).replaceAll(',', '~');

        var posAvg = [];

        tracers.forEach((t) => {
            var label = String(t.m.i) + "/" + String(t.t.i);


            if (t.visible && posAvg.find(e => e == t.m.pos) == null) {
                posAvg.push(t.m.pos);
            }

            group[label] = t.visible;
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
        //average of all elements in posAvg
        try {
            await setDoc(doc(db, name, 'group' + i), group);
            console.log("Document written");
            return group
        } catch (e) {
            console.error("Error adding document", e);
        }
    } else {
        console.error("Error adding document"); 
    }
}