import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged
} from 'firebase/auth';

//main buttons are login, logout, site selection is dropd manager
//also links to some other stuff for login mngmt
export class MainButtons {

    constructor(dropd, dataButtons, adminButtons, listUsers, userTable) {

        //listusers is a wrapped function that returns a promise
        this.listUsers = listUsers;

        this.userTable = userTable;

        this.dropd = dropd;

        this.dataButtons = dataButtons;

        this.adminButtons = adminButtons;

        this.provider = new GoogleAuthProvider();

        this.auth = getAuth();

        this.auth = getAuth();

        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                //login();
                this.signedIn(user);
            } else {
                // User is signed out
                // ...
            }
        });

        document.getElementById('login').addEventListener('click', (e) => {
            this.login();
        })

        document.getElementById('logout').addEventListener('click', (e) => {
            auth.signOut();
            window.location.reload();
        })

        document.getElementById('groups').addEventListener('click', (e) => {
            grpButtons(e, leftPanel, sizes, state)
        })

        this.ctrl = document.getElementById('ctrl');

        this.back = document.getElementById('bg')

        this.tx = document.getElementById('tx')

        this.bw = true;

        this.btns = document.getElementsByClassName('Btn');

        this.cells = document.getElementsByClassName('cell');

        this.allUsersM = [];

        document.getElementById('blackandwhite').addEventListener('click', (e) => this.bwswitch())
    }

    giveBlob(blob, storage) {
        this.adminButtons.modelhandler.handleModels(blob, this.userTable);
        this.userTable.populateTable(storage, this.allUsersM, this.dropd.value, this.bw);
    }

    async signedIn(user) {
        //change too refresh site
        //empty list 
        this.dropd.siteList([]);

        // The signed-in user info.
        const ext = user.email.split('@')

        this.allUsersM = []

        if (ext[1] == 'poppy.com') {
            //admin
            this.dataButtons.switchAdmin();

            this.listUsers().
            then((u) => {
                    u.data.users.forEach((user) => {
                        if (user.email.split('@')[1] != 'poppy.com') {
                            //not admin, create user table

                            this.allUsersM.push([user.uid, user.email]);

                        }
                    });

                })

                .catch((error) => {
                    //console.log('Error listing users:', error);
                });

            this.dropd.availableSites = [];

            this.dropd.allSites();

        } else {
            this.dropd.availableSites = [];

            userSites(db, user.uid).then((u) => {
                this.drop.siteList(u);
            })
        }

        this.adminButtons.switchDisplay(1);

        window.dispatchEvent(new Event('hashchange'));
        window.dispatchEvent(new Event('resize'));

    }

    //currently an admin button //shrug
    bwswitch() {

        bw = !bw;

        leftPanel.setbw(bw)

        userTable.bw = bw;

        if (bw) {
            scene.background = new Color(0x000000);
            back.style.background = 'rgb(27, 27, 27)';
            title.src = imageUrl1;
            tx.style.color = 'lightgray';
            textbox.style.backgroundColor = 'gray';
            textbox.style.color = 'white'
            ctrl.style.backgroundColor = 'rgb(27, 27, 27)';

            for (var i = 0; i < btns.length; i++) {
                btns[i].classList.remove('btLight');
                btns[i].classList.add('btDark');
            }

            for (var i = 0; i < cells.length; i++) {
                cells[i].classList.remove('tbLight');
                cells[i].classList.add('tbDark');
            }
        } else {
            scene.background = new Color(0xffffff);
            back.style.background = 'rgb(230, 230, 230)';
            title.src = imageUrl2;
            tx.style.color = 'black';
            textbox.style.backgroundColor = 'lightgray';
            textbox.style.color = 'black'

            ctrl.style.backgroundColor = 'rgb(230, 230, 230)';

            for (var i = 0; i < btns.length; i++) {
                btns[i].classList.remove('btDark');
                btns[i].classList.add('btLight');
            }

            for (var i = 0; i < cells.length; i++) {
                cells[i].classList.add('tbLight');
                cells[i].classList.remove('tbDark');
            }
        }
    }


    login() {

        signInWithPopup(auth, provider)
            .then((result) => {
                signedIn(result.user);

            }).catch((error) => {
                // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // The email of the user's account used.
                // const email = error.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // console.error(error, errorCode, errorMessage, email, credential);
                // ...
            });
    }

}