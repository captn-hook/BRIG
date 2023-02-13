
//dev funcs

var d0 = document.getElementById('log');
var d1 = document.getElementById('selectPanel1')
var d2 = document.getElementById('selectPanel2')

function switchDisplay(state) {
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

//file input
dataInput.addEventListener('change', (e) => {
    handleFiles(dataInput.files[0]);
}, false);

modelInput.addEventListener('change', (e) => {
    console.log('modelInput');
    handleModels(modelInput.files[0]);
}, false);

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

document.getElementById('sendFiles').addEventListener('click', (e) => {
    if (dropd.value != defaultDropd)
        sendFile(ms, ts, tracers, insights, views, db, dropd.value);
})

document.getElementById('saveCam').addEventListener('click', (e) => {
    console.log('saveCam')
    views[leftPanel.firstClickY - 1] = [String(camera.position.x), String(camera.position.y), String(camera.position.z)];
    console.log(views)
})

var editPos = false;

document.getElementById('editPos').addEventListener('click', (e) => {
    if (editPos) {
        editPos = false;
    } else {
        editPos = true;
    }
})

document.getElementById('perms').addEventListener('click', savePerms);

async function savePerms() {

    var itemRef = ref(storage, '/Sites/' + dropd.value + '/' + dropd.value + '.glb')

    //var dataRef = ref(storage, '/Sites/' + dropd.value + '/data.csv')

    var inner = '';

    let d = {}



    userTable.inUsers.forEach((user) => {
        inner += '"' + user[1] + '":"' + user[0] + '",';

        d[user[1]] = user[0];

        setDoc(doc(db, user[0], dropd.value), {
            'access': true,
        })
    })

    userTable.allUsers.forEach((user) => {
        inner += '"' + user[1] + '":"false",';

        d[user[1]] = 'false';

        setDoc(doc(db, user[0], dropd.value), {
            'access': false,
        })
    })

    inner = inner.slice(0, -1);

    inner = '{"customMetadata":{' + inner + '}}';

    const newMetadata = JSON.parse(inner);

    updateMetadata(itemRef, newMetadata).then((metadata) => {

        /* updates csvs
        updateMetadata(dataRef, newMetadata).then((metadata) => {
*/


        userTable.populateTable(storage, allUsersM, dropd.value, bw);
        /*s

                }).catch((error) => {

                    console.log(error)

                });
        */
    }).catch((error) => {

        console.log(error)

    });
    /*
        try {
            const docRef = await setDoc(doc(db, dropd.value, 'access'), d);
            console.log("Document written");
        } catch (e) {
            console.error("Error adding document");
        }
    */
};