class Panel {
    constructor(c) {

        this.spreadsheet = true;

        this.groups = [];

        this.firstClick = false;

        this.secondClickX = null;
        this.secondClickY = null;

        this.firstClickX = null;
        this.firstClickY = null;

        this.cellX = null;
        this.cellY = null;

        this.cellWidth = null;
        this.cellHeight = null;

        this.looking = true;

        this.canvas = c;

        this.ctx = c.getContext('2d');

        this.canvas.oncontextmenu = () => false;

        this.canvas.addEventListener('mousedown', this.clicks.bind(this));

        this.canvas.addEventListener('click', this.place.bind(this));

        this.canvas.addEventListener('mousemove', this.move.bind(this));

        this.bw = true;

        this.camFree = true;

        this.mt = 0;

        this.n = 0;

        this.mlen = 0;

        this.tracers;

        this.ms;

        this.ts;

        this.text = ''

        this.gi;

        this.sh = this.canvas.height;

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

            } else if (1 < y && y < this.mlen + 2) {
                //if x (column) == 1, ms
                this.mt = 1;
                this.n = y - 2;
            }
        }
    }

    setTracers(ms, ts, tracers) {
        this.tracers = tracers;
        this.ms = ms;
        this.ts = ts;
    }

    setbw(bw) {
        this.bw = bw;
    }

    setcam(camFree) {
        this.camFree = camFree;
    }

    blankClicks() {
        this.firstClick = true;
        this.firstClickX = null;
        this.firstClickY = null;
        this.secondClickX = null;
        this.secondClickY = null;
    }

    cellSize(ts, ms) {

        this.mlen = ms;

        this.cellWidth = (this.canvas.width / (ts + 1));

        if (this.spreadsheet) {
        this.cellHeight = (this.canvas.height / (ms + 1));
        }
  

    }

    clicks(e) {
        if (this.spreadsheet) {
            if (this.firstClick) {
                this.firstClick = false;

                this.secondClickX = null;
                this.secondClickY = null;

                //grabs position of mouse, upaated by mousemove event
                this.firstClickX = this.cellX;
                this.firstClickY = this.cellY;

                //this is for linking to a specific location
                window.location.hash = ('X=' + this.cellX + '&Y=' + this.cellY);
            }
        } else {
            if (this.gi != this.cellY - 1) {
                this.gi = this.cellY - 1
                this.text = this.groups[this.gi]['text']
            } else {
                this.gi = -1;
            }
        }
    }

    place(e) {

        if (this.spreadsheet) {
            if (this.camFree) {
                this.looking = true;
            }
            //single click, place markers 1 and 2
            if (e.detail == 1) {
                if (this.firstClick) {

                    //update camera on mouse click
                    this.camPos(this.cellX, this.cellY)

                    //grabs position of mouse, upaated by mousemove event
                    this.firstClickX = this.cellX;
                    this.firstClickY = this.cellY;

                    window.location.hash = ('X=' + cellX + '&Y=' + cellY)

                } else {
                    this.firstClick = true;

                    //grabs position of mouse, upated by mousemove event
                    this.secondClickX = this.cellX;
                    this.secondClickY = this.cellY;

                    //update camera on mouse click
                    this.camPos(this.cellX, this.cellY)

                    window.location.hash = ('X=' + this.cellX + '&Y=' + this.cellY)

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

        return [x, y, w, h]
    }

    frame(textbox) {
        if (this.spreadsheet) {
            this.spreadsheetFrame();
        } else {
            this.groupFrame(textbox);
        }
    }

    groupFrame(textbox) {
        for (var i in this.groups) { //plus scroll?
            if (this.groups[i]) {

                var x = parseInt(i)

                if (x < this.cellY && this.cellY <= (x + 1)) {
                    this.ctx.fillStyle = 'yellow'
                } else if (i == this.gi) {
                    this.ctx.fillStyle = 'lightgrey'
                } else {
                    this.ctx.fillStyle = 'grey'
                }

                this.ctx.fillRect(0, i * this.cellHeight, this.canvas.width, this.cellHeight);

                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.fillStyle = 'white';

                if (i == 0) {
                    var text = 'Group ' + i;
                } else {
                    var text = this.groups[i]['name'];
                }

                this.ctx.strokeText(text, this.canvas.width / 2, i * this.cellHeight + this.cellHeight/2);
                this.ctx.fillStyle = this.color;
                this.ctx.fillText(text, this.canvas.width / 2, i * this.cellHeight + this.cellHeight/2);

                textbox.value = (this.text == null) ? '' : decodeURI(this.text).replaceAll('~', ',');
            }
        }
    }

    spreadsheetFrame() {
        //click 1
        this.ctx.fillRect(0, 0, this.cellWidth, this.cellHeight);

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
}

export {
    Panel
}