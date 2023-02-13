export class Hash {
    constructor(dropd) {
        this.hash = window.location.hash.substring(1)

        this.dropd = dropd

        window.addEventListener('hashchange', this.getHash.bind(this))
    }

    getHash() {
        this.hash = window.location.hash.substring(1)

        if (hash[0] != '&') {
            var params = hash.split('&');

            //hash has site name
            if (params[0] != this.dropd.value && params[0][0] != 'X' && params[0][0] != 'P' && params[0][0] != 'G') {
                leftPanel.siteheader = params[0];
                this.dropd.value = params[0];
                this.dropd.dispatchEvent(new Event('change'));
            }

            //hash has group
            if (params[1] && params[1][0] == 'G') {
                leftPanel.spreadsheet = state[1]
                if (params[0] != this.dropd.value) {
                    stupid = params[1].substring(2);
                } else {
                    leftPanel.gi = params[1].substring(2);
                    sizes.updateSizes(leftPanel);
                }

                //hash has spreadsheet
            } else if (params[1] && params[1][0] == 'X') {
                leftPanel.spreadsheet = state[0]
                if (params[1].substring(2) != leftPanel.cellX || params[2].substring(2) != leftPanel.cellY) {
                    leftPanel.firstClickX = params[0].substring(2);
                    leftPanel.firstClickY = params[1].substring(2);
                    updateCam();
                }

                //hash has camera position
            } else if (params[1] && params[1][0] == 'P') {

                var coords = params[1].substring(2).split('/')
                var pos = new Vector3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]))

                if (camera.position.distanceTo(pos) > .03) {

                    cameraTargPos = pos
                    camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

                    controls.update();
                    updateCam();
                }
            }
        }
    }
}