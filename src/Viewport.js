import {
    PerspectiveCamera,
    Scene,
    Vector3,
    Color
} from 'three';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
    ScreenSizes
} from './ScreenSizes.js';

import {
    AmbientLight,
    WebGLRenderer,
    Raycaster,
} from 'three';

export class Viewport {
    constructor(canvas3d, leftpanel) {
        
        this.leftpanel = leftpanel;

        this.sizes = new ScreenSizes();

        this.camera = new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 1, 500);

        this.cameraTargPos = new Vector3(5, 5, 5);
        this.cameraTargView = new Vector3(0, 0, 0);

        // Controls
        this.controls = new OrbitControls(this.camera, this.sizes.canvas2d);


        this.looking = true;
        this.camFree = false;

        this.controls.enableDamping = true;
        this.controls.target.set(0, 0, 0);

        // Scene
        this.scene = new Scene();

        this.scene.background = new Color(0x000000);
        this.scene.add(this.camera);

        // Lights
        var light = new AmbientLight(0x404040); // soft white light
        light.intensity = 3;

        this.scene.add(light);


        //Renderer
        this.renderer = new WebGLRenderer({
            canvas: canvas3d
        });

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


        this.sizes.canvas2d.addEventListener('click', (e) => this.clicked(e), false);

        this.sizes.canvas2d.addEventListener('contextmenu', (e) => this.rightclk(e));


        this.sizes.canvas2d.addEventListener('wheel', this.stoplookin(), {
            passive: true
        });

        //canvas
        this.sizes.canvas2d.addEventListener('mousedown', this.stoplookin())


        //resize
        window.addEventListener('resize', () => this.resize())
    }

    resize() {

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }



    update() {

        this.camera.position.set(this.cameraTargPos.x, this.cameraTargPos.y, this.cameraTargPos.z);
        this.camera.lookAt(this.cameraTargView);
    }

    camPos(x, y) {

        if (this.camFree) {

            if (x <= 1 && y <= 1) {

                this.mt = 0;
                this.n = 0;

            } else if (y == 1) {
                //if y (row) == 1, ts
                this.mt = 2;
                this.n = x - 2;
                //throws errors if it trys to select row before/after last

            } else if (1 < y && y < this.ms.length + 2) {
                //if x (column) == 1, ms
                this.mt = 1;
                this.n = y - 2;
            }
        }
    }


    updateCam() {

        //console.log(this.camFree, this.looking, this.leftpanel.spreadsheet, this.leftpanel.n, this.leftpanel.gi)

        if (this.camFree && this.leftpanel.spreadsheet == state[0]) {
            try {
                //fail quietly if cannot set camera
                if (this.leftpanel.mt == 0) {

                } else if (this.leftpanel.mt == 2) {
                    //if y (row) == 1, ts

                    this.cameraTargPos = new Vector3(parseFloat(ts[this.leftpanel.n].pos.x) + 14, parseFloat(ts[this.leftpanel.n].pos.z) + 30, parseFloat(ts[this.leftpanel.n].pos.y) + 8);
                    this.cameraTargView = new Vector3(parseFloat(ts[this.leftpanel.n].pos.x), parseFloat(ts[this.leftpanel.n].pos.z), parseFloat(ts[this.leftpanel.n].pos.y));

                    //throws errors if it trys to select row before/after last
                } else if (this.leftpanel.mt == 1) {
                    //if x (column) == 1, ms
                    //special views
                    //console.log(views[this.leftpanel.n + 1])
                    if (views[this.leftpanel.n + 1] != null && views[this.leftpanel.n + 1][0] != '') {
                        this.cameraTargPos = new Vector3(parseFloat(views[this.leftpanel.n + 1][0]), parseFloat(views[this.leftpanel.n + 1][1]), parseFloat(views[this.leftpanel.n + 1][2]));
                    } else {

                        this.cameraTargPos = new Vector3(parseFloat(ms[this.leftpanel.n].pos.x) + 14, parseFloat(ms[this.leftpanel.n].pos.z) + 30, parseFloat(ms[this.leftpanel.n].pos.y) + 8);

                    }
                    this.cameraTargView = new Vector3(parseFloat(ms[this.leftpanel.n].pos.x), parseFloat(ms[this.leftpanel.n].pos.z), parseFloat(ms[this.leftpanel.n].pos.y));

                    //insights
                    if (this.leftpanel.spreadsheet) {
                        textbox.value = (insights[this.leftpanel.n + 2] == null) ? '' : decodeURI(insights[this.leftpanel.n + 2]).replaceAll('~', ',');
                    } else {

                        textbox.value = (this.leftpanel.text == null) ? '' : decodeURI(this.leftpanel.text).replaceAll('~', ',');
                    }


                }
            } catch (e) {
                //console.log(e)
            }
        } else if (this.leftpanel.spreadsheet == state[1] && this.camFree) {

            if (this.leftpanel.gi) {
                var i = this.leftpanel.gi;
            } else {
                var i = 0;
            }
            try {
                cameraTargPos = new Vector3(this.leftpanel.groups[i]['pos'][0] + 5, this.leftpanel.groups[i]['pos'][2] + 10, this.leftpanel.groups[i]['pos'][1] + 3);
                cameraTargView = new Vector3(this.leftpanel.groups[i]['pos'][0], this.leftpanel.groups[i]['pos'][2], this.leftpanel.groups[i]['pos'][1]);
            } catch (e) {}

            //console.log(cameraTargPos, cameraTargView)

        } else if (this.leftpanel.spreadsheet == state[2] && this.camFree) {

            if (this.leftpanel.ai) {
                var i = this.leftpanel.ai;
            } else {
                var i = 0;
            }
            try {
                this.cameraTargPos = new Vector3(this.leftpanel.areas[i].avgPos()[0] + 5, this.leftpanel.areas[i].avgPos()[2] + 10, this.leftpanel.areas[i].avgPos()[1] + 3);
                this.cameraTargView = new Vector3(this.leftpanel.areas[i].avgPos()[0], this.leftpanel.areas[i].avgPos()[2], this.leftpanel.areas[i].avgPos()[1]);
            } catch (e) {}
        }

    }

    stoplookin() {
        if (this.camFree) {
            this.looking = false;
        }
    }

    rightclk(e) {
        stoplookin();

        e.preventDefault();

        if (editPos && this.leftpanel.spreadsheet == this.state[2]) {
            workingArea.points.pop();
        }
    }

    clicked(e) {
        this.stoplookin();


        if (editPos) {

            var raycaster = new Raycaster();
            var mouse = {
                x: (e.clientX - this.leftpanel.canvas.innerWidth) / this.renderer.domElement.clientWidth * 2 - 1,
                y: -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
            };

            raycaster.setFromCamera(mouse, this.camera);

            var intersects = raycaster.intersectObjects(this.sceneMeshes, true);

            var doP = (this.leftpanel.spreadsheet == this.state[1]) ? true : false;

            if (intersects.length > 0) {
                if (doP) {
                    if (this.leftpanel.firstClickX == 1) {
                        ms[this.leftpanel.firstClickY - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                    } else if (this.leftpanel.firstClickY == 1) {
                        ts[this.leftpanel.firstClickX - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                    }
                } else {
                    console.log(workingArea.points);
                    workingArea.points.push(new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y));
                }
            }
        }

        //store pos in link
        var pos = String('P=' + Math.round(this.camera.position.x * 100) / 100) + '/' + String(Math.round(camera.position.y * 100) / 100) + '/' + String(Math.round(camera.position.z * 100) / 100) + '/' + String(Math.round(camera.rotation.x * 100) / 100) + '/' + String(Math.round(camera.rotation.y * 100) / 100) + '/' + String(Math.round(camera.rotation.z * 100) / 100)

        if (pos[0] != null) {
            window.location.hash = this.leftpanel.siteheader + '&' + pos;
        }
    }

    frame() {
        // Update Orbital Controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);

        //New Frame
        this.sizes.clearC2d();
    }
}