import {
    ModelHandler
} from '../ModelHandler.js';

import {
    saveFile,
    sendFile
} from '../fileHandler.js';

//dev funcs
//admin buttons are the admin ctrl button, and all the interface on the inside of that panel
export class AdminButtons {

    constructor() {
        this.d0 = document.getElementById('log');
        this.d1 = document.getElementById('selectPanel1')
        this.d2 = document.getElementById('selectPanel2')

        this.ctrlBtn = document.getElementById('ctrlBtn');

        // btn event listeners
        this.ctrlBtn.addEventListener('click', this.adminMenu);

        this.modelhandler = new ModelHandler();

        document.getElementById('editFiles').addEventListener('click', (e) => this.clicklistener());

        //need to have access to data tuple
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

        this.editPos = false;

        document.getElementById('editPos').addEventListener('click', (e) => {
            if (this.editPos) {
                this.editPos = false;
            } else {
                this.editPos = true;
            }
        })

        document.getElementById('perms').addEventListener('click', this.savePerms);

    }


    adminMenu() {
        
        const root = document.getElementById('root');
        
        if (this.ctrl.style.display == 'block') {
            this.ctrl.style.display = 'none';
            root.style.width = '100%'
        } else {
            this.ctrl.style.display = 'block';
            root.style.width = '80%';
        }
        window.dispatchEvent(new Event('resize'));
    }

    switchDisplay(state) {
        if (state == 0) {
            this.d0.style.display = 'block'
            this.d1.style.display = 'none'
            this.d2.style.display = 'none'
        } else if (state == 1) {
            this.d0.style.display = 'none'
            this.d1.style.display = 'block'
            this.d2.style.display = 'none'
        } else if (state == 2) {
            this.d0.style.display = 'none'
            this.d1.style.display = 'none'
            this.d2.style.display = 'block'
        }
    }

    //states: login 0, select panel 1, upload panel 2
    clicklistener() {
        if (this.d0.style.display == 'block') {
            this.switchDisplay(1);
        } else if (this.d1.style.display == 'block') {
            this.switchDisplay(2);
        } else {
            this.switchDisplay(0);
        }
    }

    async savePerms() {

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
}