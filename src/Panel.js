
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

        this.canvas.oncontextmenu = () => false;

        this.canvas.addEventListener('mousedown', this.clicks);

        this.canvas.addEventListener('click', this.place);

        this.canvas.addEventListener('mousemove', this.move);

        this.bw = false;

        this.camFree = true;
    }

    setbw(bw) {
        this.bw = bw;
    }

    setcam(camFree) {
        this.camFree = camFree;
    }

    cellSize(ts, ms) {

        this.cellWidth = (this.canvas.width / (ts + 1));
        this.cellHeight = (this.canvas.height / (ms + 1));

    }

    clicks(e) {
        if (this.firstClick) {
            this.firstClick = false;

            this.secondClickX = null;
            this.secondClickY = null;

            //grabs position of mouse, upaated by mousemove event
            this.firstClickX = this.cellX;
            this.firstClickY = this.cellY;

            //this is for linking to a specific location
            //window.location.hash = ('X=' + cellX + '&Y=' + cellY);
        }
    }

    place(e) {
        if (this.camFree) {
            looking = true;
        }
        //single click, place markers 1 and 2
        if (e.detail == 1) {
            if (this.firstClick) {

                //update camera on mouse click
                updateCam(this.cellX, this.cellY)

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
                updateCam(this.cellX, this.cellY)

                window.location.hash = ('X=' + this.cellX + '&Y=' + this.cellY)

            }
            //double click, clear markers
        } else if (e.detail == 2) {

            blankClicks();

            updateCam(this.cellX, this.cellY);

            //get m/t/tracer by cellX and cellY
            if (this.cellX <= 1 && this.cellY <= 1) {
                //do nothing
            } else if (this.cellY == 1) {

                var state = !ts[this.cellX - 2].visible

                ts[cellX - 2].visible = state;

                tracers.forEach((t) => {
                    if (t.t.i == cellX - 1) {
                        t.visible = state;
                    }
                })

            } else if (this.cellX == 1) {

                var state = !ms[this.cellY - 2].visible

                ms[this.cellY - 2].visible = state;

                if (state == true) {
                    ts.forEach(t => {
                        t.visible = true
                    })
                }

                tracers.forEach((t) => {
                    if (t.m.i == this.cellY - 1) {
                        t.visible = state;
                    }
                })

            } else {

                tracers.forEach((t) => {
                    if (t.m.i == this.cellY - 1 && t.t.i == this.cellX - 1) {
                        t.visible = !t.visible;
                    }
                })

            }

        }

    }

    //spreadsheet mouse move, tracks mouse position to cellX and cellY
    move(e) { 
        var rect = this.getBoundingClientRect();
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
    
    frame() {

        //click 1
        if (this.firstClick != null) {


            //click 2
            if (this.secondClickX == null && this.secondClickY == null) {

                //spreadsheet highlight mousemove
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'yellow'
                this.ctx.lineWidth = 2;

                var [x, y, w, h] = this.bounds(this.firstClickX, this.firstClickY, this.cellX, this. cellY);

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

                var [x, y, w, h] = bounds(this.secondClickX, this.secondClickY, this.firstClickX, this.firstClickY);
                this.ctx.rect(x, y, w, h);
                this.ctx.stroke()

            }
        }
    }
}

export {
    Panel
}