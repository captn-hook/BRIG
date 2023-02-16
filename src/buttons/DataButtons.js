//this is a bug, a small insect like a beetle
//ignore that im insane
//data buttons are the cluster of 6 or less buttons above the spreadsheet/areas/groups

export class DataButtons {

    constructor(leftPanel, sizes, state) {

        this.sGroup = document.getElementById('saveGroup');
        this.aGroup = document.getElementById('addGroup');
        this.dGroup = document.getElementById('deleteGroup');

        this.sArea = document.getElementById('saveArea');
        this.aArea = document.getElementById('addArea');
        this.dArea = document.getElementById('deleteArea');

        //bug is short for this button pannel is bugging me
        this.bug1 = document.getElementById('bug1');
        this.bug2 = document.getElementById('bug2');
        this.bug3 = document.getElementById('bug3');

        this.camFree

        this.alpha

        this.adminTG = false;

        this.sGroup.addEventListener('click', this.plant1);

        this.aGroup.addEventListener('click', this.plant2)

        this.doVals = false;

        document.getElementById('groups').addEventListener('click', (e) => {
            this.rpButtons(e, leftPanel, sizes, state)
        })


        document.getElementById('valueBtn').addEventListener('click', (e) => this.valueBtn(e));

        document.getElementById('opacityBtn').addEventListener('click', (e) => this.opacityBtn(e));

        document.getElementById('flipBtn').addEventListener('click', (e) => this.flipBtn(e));

        document.getElementById('camBtn').addEventListener('click', (e) => this.camBtn(e));

        document.getElementById('resetBtn').addEventListener('click', (e) => this.resetBtn(e));

        document.getElementById('toggleBtn').addEventListener('click', (e) => this.toggleBtn(e));

        this.dGroup.addEventListener('click', (e) => this.deleteGroup(e));

        this.sArea.addEventListener('click', this.tnalp3);

        this.aArea.addEventListener('click', this.tnalp4)

        this.dArea.addEventListener('click', (e) => this.deleteArea(e));

    }

    switchAdmin() {
        if (!this.adminTG) {
            ctrlBtn.style.display = 'block';
            this.sGroup.style.display = 'inline-block';
            this.aGroup.style.display = 'inline-block';
            this.dGroup.style.display = 'inline-block';

            this.sArea.style.display = 'inline-block';
            this.aArea.style.display = 'inline-block';
            this.dArea.style.display = 'inline-block';
            this.adminTG = false;
        } else {
            ctrlBtn.style.display = 'none';
            this.sGroup.style.display = 'none';
            this.aGroup.style.display = 'none';
            this.dGroup.style.display = 'none';
        }
    }


    grpButtons(e, leftPanel, sizes, state) {

        leftPanel.next();

        if (leftPanel.spreadsheet == state[0]) {
            e.target.innerHTML = 'Groups';
            bug1.style.display = 'block'
            bug2.style.display = 'none'
            bug3.style.display = 'none'
            sizes.spreadsheetDiv.style.overflow = 'hidden';
        } else if (leftPanel.spreadsheet == state[1]) {
            e.target.innerHTML = 'Areas';
            bug1.style.display = 'none'
            bug2.style.display = 'block'
            bug3.style.display = 'none'
            sizes.spreadsheetDiv.style.overflow = 'auto';
        } else if (leftPanel.spreadsheet == state[2]) {
            e.target.innerHTML = 'Tracers';
            bug1.style.display = 'none'
            bug2.style.display = 'none'
            bug3.style.display = 'block'
            sizes.spreadsheetDiv.style.overflow = 'auto';
        }
        sizes.updateSizes(leftPanel);
    }


    async plant1(leftPanel, dropd, tracers) {
        if (leftPanel.gi != 0 && leftPanel.gi != -1) {
            leftPanel.groups[leftPanel.gi] = await saveGroup(db, dropd.value, leftPanel.gi, tracers, leftPanel.text)
        }
    }


    async plant2() {
        var i = 0;
        leftPanel.groups.forEach((e) => {
            if (e != undefined) {
                i++;
            }
        })
        leftPanel.groups[i] = await saveGroup(db, dropd.value, i, tracers, leftPanel.text)

    }



    valueBtn(e) {
        if (e.target.innerHTML == 'Show values') {
            e.target.innerHTML = 'Hide values';
            //show values
            doVals = true;
        } else {
            e.target.innerHTML = 'Show values';
            //hide values
            doVals = false;
        }
    }

    opacityBtn(e) {
        if (!alpha) {
            e.target.innerHTML = 'Transparent';
            alpha = true;
            //show values
        } else {
            e.target.innerHTML = 'Opaque';
            alpha = false;
            //hide values
        }
    }

    flipBtn(e) {
        if (e.target.innerHTML == 'Flip Selection ◐') {
            e.target.innerHTML = 'Flip Selection ◑';
            //show values
        } else {
            e.target.innerHTML = 'Flip Selection ◐';
            //hide values
        }
        //find the difference between click 1 and click 2
        var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
        var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
        var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
        var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

        tracers.forEach((t) => {
            if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
                t.visible = !t.visible;
            }
        })

        if (minx == 0) {
            ms.forEach((m) => {
                if (m.i >= miny && m.i <= y) {
                    m.visible = !m.visible;
                }
            })
        }

        if (miny == 0) {
            ts.forEach((d) => {
                if (d.i >= minx && d.i <= x) {
                    d.visible = !d.visible;
                }
            })
        }
    }

    camBtn(e) {
        if (e.target.innerHTML == 'Multi 🎥') {
            e.target.innerHTML = 'Locked 📷';
            controls.enabled = false;
            camFree = true;
            leftPanel.setcam(camFree)
        } else if (e.target.innerHTML == 'Locked 📷') {
            e.target.innerHTML = 'Free 📹';
            controls.enabled = true;
            camFree = false;
            leftPanel.setcam(camFree)
        } else {
            e.target.innerHTML = 'Multi 🎥';
            controls.enabled = true;
            camFree = true;
            leftPanel.setcam(camFree)
        }
    }

    resetBtn(e) {
        if (e.target.innerHTML == 'Toggle all ❎') {
            e.target.innerHTML = 'Toggle all ✅';

            //set every m, t, and tracer to visible
            ms.forEach((m) => {
                m.visible = true;
            })
            ts.forEach((t) => {
                t.visible = true;
            })
            tracers.forEach((t) => {
                t.visible = true;
            })

        } else {
            e.target.innerHTML = 'Toggle all ❎';

            //set every m, t, and tracer to hidden
            ms.forEach((m) => {
                m.visible = false;
            })
            ts.forEach((t) => {
                t.visible = false;
            })
            tracers.forEach((t) => {
                t.visible = false;
            })

        }
    }

    toggleBtn(e) {
        var mode = null;

        if (e.target.innerHTML == 'Toggle selection ◧') {
            e.target.innerHTML = 'Toggle selection ◨';
            mode = true;
        } else {
            e.target.innerHTML = 'Toggle selection ◧';
            mode = false;
        }

        //find the difference between click 1 and click 2
        var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
        var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
        var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
        var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

        tracers.forEach((t) => {
            if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
                t.visible = mode;
            }
        })

        if (minx == 0) {
            ms.forEach((m) => {
                if (m.i >= miny && m.i <= y) {
                    m.visible = mode;
                }
            })
        }

        if (miny == 0) {
            ts.forEach((d) => {
                if (d.i >= minx && d.i <= x) {
                    d.visible = mode;
                }
            })
        }
    }


    //groups btns
    deleteGroup(e) {
        deleteDoc(doc(db, dropd.value, 'group' + leftPanel.gi));
        leftPanel.groups[leftPanel.gi] = undefined;
    }

    //areabtns
    async tnalp3() {
        if (leftPanel.ai != 0 && leftPanel.ai != -1) {
            leftPanel.areas[leftPanel.ai].text = leftPanel.text;
            console.log(leftPanel.areas[leftPanel.ai])
            saveArea(db, dropd.value, leftPanel.ai, leftPanel.areas[leftPanel.ai])
        }
    }

    async tnalp4() {
        if (workingArea.points.length > 2) {
            var i = 0;
            workingArea.text = leftPanel.text;
            leftPanel.areas.forEach((e) => {
                if (e != undefined) {
                    i++;
                }
            })

            var n = prompt("Enter Area Name");
            workingArea.name = String(n);

            var x = prompt("Enter Area Value");
            workingArea.setValue(parseFloat(x));

            var a = new Area(workingArea.points, workingArea.value, workingArea.name, workingArea.text)

            leftPanel.areas.push(a);
            saveArea(db, dropd.value, i, a)
            workingArea = new Area([]);
        }
    }

    deleteArea(e) {
        deleteDoc(doc(db, dropd.value, 'area' + leftPanel.ai));
        leftPanel.areas[leftPanel.ai] = undefined;
    }

}