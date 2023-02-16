export class DropDManager {

    constructor() {
        this.dropd = document.getElementById('dropdown');

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
        var folderRef = ref(storage, '/Sites')

        listAll(folderRef).then((e) => {

            for (var i = 0; i < e.prefixes.length; i++) {
                this.availableSites.push(e.prefixes[i].name)
            }

            var promises = [];

            for (var i = 0; i < this.availableSites.length; i++) {

                var fileRef = ref(storage, '/Sites/' + this.availableSites[i] + '/' + this.availableSites[i] + '.glb');

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
                siteList(this.accessibleSites);
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

            [ms, ts, tracers, insights, views] = data;

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

    //load files from google storage by dropdown name
    loadFromName(event) {

        [ms, ts, tracers, insights, views] = [
            [],
            [],
            [],
            [],
            []
        ];

        //console.log(event.target.value);

        if (event.target.value == null || event.target.value == undefined || event.target.value == '') {
            var targ = leftPanel.siteheader;
        } else {
            var targ = event.target.value;
        }

        if (targ != defaultDropd) {

            var modelRef = ref(storage, '/Sites/' + targ + '/' + targ + '.glb');


            // .glb, load model

            //var dataRef = ref(storage, '/Sites/' + event.target.value + '/data.csv');

            //loadRefs(modelRef, dataRef)
            leftPanel.groups = GetGroups(db, targ);
            leftPanel.areas = GetAreas(db, targ);
            loadRefAndDoc(modelRef, targ);

            leftPanel.siteheader = targ;

        } else {
            //load default

            /*
            load example
            */
            var modelRef = ref(storage, '/Example/example.glb');

            var dataRef = ref(storage, '/Example/data.csv');

            // .glb, load model

            loadRefs(modelRef, dataRef)

            leftPanel.groups = GetGroups(db, targ);
            leftPanel.areas = GetAreas(db, targ);

            /*
            Animate
            */
            leftPanel.siteheader = 'Example';
        }

        //window.location.hash = leftPanel.siteheader + '&';

    }
}