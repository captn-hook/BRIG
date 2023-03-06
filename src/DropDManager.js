
import {
    ref,
    getMetadata,
    listAll
} from 'firebase/storage';

export class DropDManager {

    constructor(storage, obj) {
        this.dropd = document.getElementById('dropdown');

        this.storage = storage;

        this.ms = obj[0];

        this.ts = obj[1];

        this.tracers = obj[2];

        this.insights = obj[3];

        this.views = obj[4];

        this.groups = obj[5];

        this.areas = obj[6];

        this.siteheader = 'Example';

        //dev funcs

        this.d0 = document.getElementById('log');
        this.d1 = document.getElementById('selectPanel1')
        this.d2 = document.getElementById('selectPanel2')

        this.defaultDropd = 'Select a site';

        this.availableSites = [];

        this.accessibleSites = [];

        this.dropd.addEventListener('change', (e) => this.loadFromName(e));

    }

    allSites() {
        var folderRef = ref(this.storage, '/Sites')

        listAll(folderRef).then((e) => {

            for (var i = 0; i < e.prefixes.length; i++) {
                this.availableSites.push(e.prefixes[i].name)
            }

            var promises = [];

            for (var i = 0; i < this.availableSites.length; i++) {

                var fileRef = ref(this.storage, '/Sites/' + this.availableSites[i] + '/' + this.availableSites[i] + '.glb');

                promises.push(getMetadata(fileRef)
                    .then((data) => {
                        this.availableSites.sort();
                        this.accessibleSites.sort();
                        this.accessibleSites.push(data.name.split('.')[0])

                    })
                    .catch((err) => {

                        //console.error(err);

                    }));
            }

            Promise.all(promises).then(() => {
                this.siteList(this.accessibleSites);
            });

        })
    }

    siteList(s) {
        //empty dropdown
        while (this.dropd.firstChild) {
            this.dropd.removeChild(this.dropd.firstChild);
        }

        //add default option
        var def = document.createElement('option');
        def.text = this.defaultDropd;
        this.dropd.add(def);

        s.forEach((site) => {
            var option = document.createElement('option');
            option.text = site;
            this.dropd.add(option);

            if (window.location.hash != '' && window.location.hash[1] != '&') {
                if (window.location.hash.split('&')[0].substring(1) == this.dropd.options[this.dropd.length - 1].text) {
                    this.dropd.selectedIndex = this.dropd.length - 1;
                }
            }
        })

    }

    loadRefAndDoc(ref, doc) {

        getBlob(ref)
            .then((blob) => {
                handleModels(blob);
            })
            .catch((err) => {
                //console.error(err);
            })

        RemoteData(db, doc).then((data) => {

            [this.ms, this.ts, this.tracers, this.insights, this.views] = data;

            leftPanel.setTracers(ms, ts, tracers)

            if (stupid != null) {
                leftPanel.gi = stupid;
                stupid = null;
            }

            sizes.updateSizes(leftPanel);

        }).catch((err) => {
            //console.error(err);
        })


    }

    //load files from google this.storage by dropdown name
    loadFromName(event) {

        [this.ms, this.ts, this.tracers, this.insights, this.views] = [
            [],
            [],
            [],
            [],
            []
        ];

        //console.log(event.target.value);

        if (event.target.value == null || event.target.value == undefined || event.target.value == '') {
            var targ = this.siteheader;
        } else {
            var targ = event.target.value;
        }

        if (targ != this.defaultDropd) {

            var modelRef = ref(this.storage, '/Sites/' + targ + '/' + targ + '.glb');


            // .glb, load model

            //var dataRef = ref(this.storage, '/Sites/' + event.target.value + '/data.csv');

            //loadRefs(modelRef, dataRef)
            this.groups = GetGroups(db, targ);
            this.areas = GetAreas(db, targ);
            loadRefAndDoc(modelRef, targ);

            this.siteheader = targ;

        } else {
            //load default

            /*
            load example
            */
            var modelRef = ref(this.storage, '/Example/example.glb');

            var dataRef = ref(this.storage, '/Example/data.csv');

            // .glb, load model

            loadRefs(modelRef, dataRef)

            this.groups = GetGroups(db, targ);
            this.areas = GetAreas(db, targ);

            /*
            Animate
            */
            this.siteheader = 'Example';
        }

        //window.location.hash = this.siteheader + '&';

    }
}