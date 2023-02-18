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
    WebGLRenderer
} from 'three';

export class Viewport {
    constructor(canvas3d, leftPanel) {

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

        //console.log(this.camFree, this.looking, leftPanel.spreadsheet, leftPanel.n, leftPanel.gi)

        if (this.camFree && leftPanel.spreadsheet == state[0]) {
            try {
                //fail quietly if cannot set camera
                if (leftPanel.mt == 0) {

                } else if (leftPanel.mt == 2) {
                    //if y (row) == 1, ts

                    this.cameraTargPos = new Vector3(parseFloat(ts[leftPanel.n].pos.x) + 14, parseFloat(ts[leftPanel.n].pos.z) + 30, parseFloat(ts[leftPanel.n].pos.y) + 8);
                    this.cameraTargView = new Vector3(parseFloat(ts[leftPanel.n].pos.x), parseFloat(ts[leftPanel.n].pos.z), parseFloat(ts[leftPanel.n].pos.y));

                    //throws errors if it trys to select row before/after last
                } else if (leftPanel.mt == 1) {
                    //if x (column) == 1, ms
                    //special views
                    //console.log(views[leftPanel.n + 1])
                    if (views[leftPanel.n + 1] != null && views[leftPanel.n + 1][0] != '') {
                        this.cameraTargPos = new Vector3(parseFloat(views[leftPanel.n + 1][0]), parseFloat(views[leftPanel.n + 1][1]), parseFloat(views[leftPanel.n + 1][2]));
                    } else {

                        this.cameraTargPos = new Vector3(parseFloat(ms[leftPanel.n].pos.x) + 14, parseFloat(ms[leftPanel.n].pos.z) + 30, parseFloat(ms[leftPanel.n].pos.y) + 8);

                    }
                    this.cameraTargView = new Vector3(parseFloat(ms[leftPanel.n].pos.x), parseFloat(ms[leftPanel.n].pos.z), parseFloat(ms[leftPanel.n].pos.y));

                    //insights
                    if (leftPanel.spreadsheet) {
                        textbox.value = (insights[leftPanel.n + 2] == null) ? '' : decodeURI(insights[leftPanel.n + 2]).replaceAll('~', ',');
                    } else {

                        textbox.value = (leftPanel.text == null) ? '' : decodeURI(leftPanel.text).replaceAll('~', ',');
                    }


                }
            } catch (e) {
                //console.log(e)
            }
        } else if (leftPanel.spreadsheet == state[1] && this.camFree) {

            if (leftPanel.gi) {
                var i = leftPanel.gi;
            } else {
                var i = 0;
            }
            try {
                cameraTargPos = new Vector3(leftPanel.groups[i]['pos'][0] + 5, leftPanel.groups[i]['pos'][2] + 10, leftPanel.groups[i]['pos'][1] + 3);
                cameraTargView = new Vector3(leftPanel.groups[i]['pos'][0], leftPanel.groups[i]['pos'][2], leftPanel.groups[i]['pos'][1]);
            } catch (e) {}

            //console.log(cameraTargPos, cameraTargView)

        } else if (leftPanel.spreadsheet == state[2] && this.camFree) {

            if (leftPanel.ai) {
                var i = leftPanel.ai;
            } else {
                var i = 0;
            }
            try {
                this.cameraTargPos = new Vector3(leftPanel.areas[i].avgPos()[0] + 5, leftPanel.areas[i].avgPos()[2] + 10, leftPanel.areas[i].avgPos()[1] + 3);
                this.cameraTargView = new Vector3(leftPanel.areas[i].avgPos()[0], leftPanel.areas[i].avgPos()[2], leftPanel.areas[i].avgPos()[1]);
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

        if (editPos && leftPanel.spreadsheet == state[2]) {
            workingArea.points.pop();
        }
    }

    clicked(e) {
        stoplookin();


        if (editPos) {

            var raycaster = new Raycaster();
            var mouse = {
                x: (e.clientX - leftPanel.canvas.innerWidth) / renderer.domElement.clientWidth * 2 - 1,
                y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
            };

            raycaster.setFromCamera(mouse, this.camera);

            var intersects = raycaster.intersectObjects(sceneMeshes, true);

            var doP = (leftPanel.spreadsheet == state[1]) ? true : false;

            if (intersects.length > 0) {
                if (doP) {
                    if (leftPanel.firstClickX == 1) {
                        ms[leftPanel.firstClickY - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                    } else if (leftPanel.firstClickY == 1) {
                        ts[leftPanel.firstClickX - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
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
            window.location.hash = leftPanel.siteheader + '&' + pos;
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