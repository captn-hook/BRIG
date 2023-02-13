class Panel {
    constructor(c) {
        this.firstClick = false;

        this.secondClickX = null;
        this.secondClickY = null;

        this.firstClickX = null;
        this.firstClickY = null;

        this.cellX = null;
        this.cellY = null;

        this.cellWidth = null;
        this.cellHeight = null;

        this.canvas = c;

        this.ctx = c.getContext('2d');

        this.ctx.lineJoin = 'round';

        this.canvas.oncontextmenu = () => false;

        this.fontsize = 12;
    }


    setFontsize(l) {
        if (l == undefined) {
            if (this.tracers != undefined) {
                l = this.tracers.length;
            } else {
                l = 12;
            }
        }

        var m = Math.floor(Math.min(this.canvas.parentElement.clientWidth, this.canvas.parentElement.clientHeight));
        var x = Math.ceil(m / 1.7 / (l / 4)) + 5;
        if (x > 20) {
            x = 20;
        }
        this.fontsize = x
    }


    blankClicks() {
        this.firstClick = true;
        this.firstClickX = null;
        this.firstClickY = null;
        this.secondClickX = null;
        this.secondClickY = null;
    }


}

class SpreadsheetPanel extends Panel {
    constructor(c) {
        super(c);

        this.mt = 0;

        this.n = 0;

        this.tracers;

        this.ms;

        this.ts;

        this.text = ''

        this.lastgi = -1;
        this.lastai = -1;

        this.canvas.addEventListener('mousedown', this.clicks.bind(this));

        this.canvas.addEventListener('click', this.place.bind(this));

        this.canvas.addEventListener('mousemove', this.move.bind(this));

    }

    setTracers(ms, ts, tracers) {
        this.tracers = tracers;
        this.ms = ms;
        this.ts = ts;
        this.setFontsize(tracers.length);
    }

    cellSize(h) {
        if (this.ms != undefined && this.ts != undefined) {
            this.cellWidth = (this.canvas.width / (this.ts.length + 1));

            if (this.spreadsheet == this.state[0]) {
                this.cellHeight = (this.canvas.height / (this.ms.length + 1));
            } else {
                this.cellHeight = (h / (this.ms.length + 1));
            }

        }
    }

    clicks(e) {
        //only if spred
        if (this.spreadsheet == this.state[0]) {
            if (this.firstClick) {
                this.firstClick = false;

                this.secondClickX = null;
                this.secondClickY = null;

                //grabs position of mouse, upaated by mousemove event
                this.firstClickX = this.cellX;
                this.firstClickY = this.cellY;

                //this is for linking to a specific location
                window.location.hash = (this.siteheader + '&X=' + this.cellX + '&Y=' + this.cellY);
            }
        }
    }

    place(e) {

        if (this.spreadsheet == this.state[0]) {
            viewport.stoplookin();
            //single click, place markers 1 and 2
            if (e.detail == 1) {
                if (this.firstClick) {

                    //update camera on mouse click
                    this.camPos(this.cellX, this.cellY)

                    //grabs position of mouse, upaated by mousemove event
                    this.firstClickX = this.cellX;
                    this.firstClickY = this.cellY;

                    //window.location.hash = ('X=' + cellX + '&Y=' + cellY)

                } else {
                    this.firstClick = true;

                    //grabs position of mouse, upated by mousemove event
                    this.secondClickX = this.cellX;
                    this.secondClickY = this.cellY;

                    //update camera on mouse click
                    this.camPos(this.cellX, this.cellY)

                    //window.location.hash = ('X=' + this.cellX + '&Y=' + this.cellY)

                }
                //double click, clear markers
            } else if (e.detail == 2) {

                this.blankClicks();

                this.camPos(this.cellX, this.cellY);

                //get m/t/tracer by cellX and cellY
                if (this.cellX <= 1 && this.cellY <= 1) {
                    //do nothing
                } else if (this.cellY == 1) {

                    var state = !this.ts[this.cellX - 2].visible

                    this.ts[this.cellX - 2].visible = state;

                    this.tracers.forEach((t) => {
                        if (t.t.i == this.cellX - 1) {
                            t.visible = state;
                        }
                    })

                } else if (this.cellX == 1) {

                    var state = !this.ms[this.cellY - 2].visible

                    this.ms[this.cellY - 2].visible = state;

                    if (state == true) {
                        this.ts.forEach(t => {
                            t.visible = true
                        })
                    }

                    this.tracers.forEach((t) => {
                        if (t.m.i == this.cellY - 1) {
                            t.visible = state;
                        }
                    })

                } else {
                    this.tracers.forEach((t) => {
                        if (t.m.i == this.cellY - 1 && t.t.i == this.cellX - 1) {
                            t.visible = !t.visible;
                        }
                    })

                }

            }
        } else {

        }
    }

    //spreadsheet mouse move, tracks mouse position to cellX and cellY
    move(e) {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.pageX - rect.left;
        var y = e.pageY - rect.top;

        this.cellX = Math.ceil(x / this.cellWidth);

        this.cellY = Math.ceil(y / this.cellHeight);

    }

    bounds(x1, y1, x2, y2) {
        //returns the bounds of the current selection
        var x = (((x1 < x2) ? x1 : x2) - 1) * this.cellWidth
        var y = (((y1 < y2) ? y1 : y2) - 1) * this.cellHeight

        var w = (Math.abs(x1 - x2) + 1) * this.cellWidth
        var h = (Math.abs(y1 - y2) + 1) * this.cellHeight
        0
        return [x, y, w, h]
    }

    frame(textbox) {

        const state = {
            0: 'spreadsheet',
            1: 'groups',
            2: 'areas'
        }

        //console.log(this.spreadsheet == this.state[2])
        if (this.spreadsheet == state[0]) {
            this.spreadsheetFrame();
        } else if (this.spreadsheet == state[1]) {
            this.groupFrame(textbox);
        } else if (this.spreadsheet == state[2]) {
            this.areaFrame();
        }
    }

    groupFrame(textbox) {
        //console.log('this.groups', this.groups)

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (var i in this.groups) { //plus scroll?
            if (this.groups[i] && i != 0) { //safety check, omit first group

                var h = Math.ceil(this.cellHeight)

                i = parseInt(i)

                if (i < this.cellY && this.cellY <= (i + 1)) {
                    this.ctx.fillStyle = 'yellow'
                } else if (i == this.gi) {
                    this.ctx.fillStyle = 'lightgrey'
                } else {
                    this.ctx.fillStyle = 'grey'
                }

                this.ctx.fillRect(0, i * h, this.canvas.width, h);

                this.ctx.lineJoin = "round";
                this.ctx.font = String(this.fontsize) + "px Arial";
                this.ctx.textAlign = "center";
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.fillStyle = 'white';

                var text = this.groups[i]['name'];


                this.ctx.strokeText(text, this.canvas.width / 2, i * h + h / 1.3);
                this.ctx.fillStyle = this.color;
                this.ctx.fillText(text, this.canvas.width / 2, i * h + h / 1.3);

                textbox.value = (this.text == null) ? '' : decodeURI(this.text).replaceAll('~', ',');
            }
        }
    }

    spreadsheetFrame(bw = false) {
        //click 1

        //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.firstClick != null) {

            //click 2
            if (this.secondClickX == null && this.secondClickY == null) {

                //spreadsheet highlight mousemove
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'yellow'
                this.ctx.lineWidth = 2;

                var [x, y, w, h] = this.bounds(this.firstClickX, this.firstClickY, this.cellX, this.cellY);

                this.ctx.rect(x, 0, w, this.cellHeight * (((this.firstClickY < this.cellY) ? this.cellY : this.firstClickY)));
                this.ctx.stroke()

                this.ctx.rect(0, y, this.cellWidth * (((this.firstClickX < this.cellX) ? this.cellX : this.firstClickX)), h);
                this.ctx.stroke()

                this.ctx.beginPath();

                this.ctx.strokeStyle = 'grey'
                this.ctx.lineWidth = 4;

                this.ctx.rect((this.firstClickX - 1) * this.cellWidth, (this.firstClickY - 1) * this.cellHeight, this.cellWidth, this.cellHeight);
                this.ctx.stroke()


            } else {

                this.ctx.beginPath();

                if (this.bw) {
                    this.ctx.strokeStyle = 'white'
                } else {
                    this.ctx.strokeStyle = 'black'
                }
                this.ctx.lineWidth = 4;

                var [x, y, w, h] = this.bounds(this.secondClickX, this.secondClickY, this.firstClickX, this.firstClickY);
                this.ctx.rect(x, y, w, h);
                this.ctx.stroke()

            }
        }
    }

    areaFrame() {
        //console.log('this.areas', this.areas)

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (var i in this.areas) { //plus scroll?
            if (this.areas[i]) { //safety check, omit first group

                var h = Math.ceil(this.cellHeight)

                i = parseInt(i)

                if (i < this.cellY && this.cellY <= (i + 1)) {
                    this.ctx.fillStyle = 'yellow'
                } else if (i == this.ai) {
                    this.ctx.fillStyle = 'lightgrey'
                } else {
                    this.ctx.fillStyle = 'grey'
                }

                this.ctx.fillRect(0, i * h, this.canvas.width, h);

                this.ctx.lineJoin = "round";
                this.ctx.font = String(this.fontsize) + "px Arial";
                this.ctx.textAlign = "center";
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.fillStyle = 'white';

                var text = this.areas[i].name;

                this.ctx.strokeText(text, this.canvas.width / 2, i * h + h / 1.3);
                this.ctx.fillStyle = this.color;
                this.ctx.fillText(text, this.canvas.width / 2, i * h + h / 1.3);

                textbox.value = (this.text == null) ? '' : decodeURI(this.text).replaceAll('~', ',');
            }
        }
    }

}

export {
    SpreadsheetPanel,
    Panel
};