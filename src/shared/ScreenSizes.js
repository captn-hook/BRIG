export class ScreenSizes {

    constructor() {

        this.div = document.getElementById('3d');
        this.spreadsheetDiv = document.getElementById('spreadsheet');

        this.canvas2d = document.getElementById('2d');
        this.canvas2d.width = this.width;
        this.canvas2d.height = this.height;


        this.ctx = this.canvas2d.getContext('2d');
        this.ctx.lineJoin = 'round';
        //ctx.miterLimit = 1;

        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;

    }

    clearC2d() {
        this.ctx.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height)
    }

    updateSizes(leftPanel) {

        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;

        this.ctx.canvas.innerWidth = this.width;
        this.ctx.canvas.innerHeight = this.height;

        this.canvas2d.width = this.width;
        this.canvas2d.height = this.height;
        //console.log('leftPanel: ', leftPanel,' ctx ' , leftPanel.ctx);
        if (leftPanel) {
            leftPanel.ctx.canvas.innerWidth = this.spreadsheetDiv.offsetWidth;

            leftPanel.canvas.width = this.spreadsheetDiv.offsetWidth;

            if (leftPanel.spreadsheet) {

                leftPanel.canvas.height = this.spreadsheetDiv.offsetHeight;

                leftPanel.ctx.canvas.innerHeight = this.spreadsheetDiv.offsetHeight;

            } else {

                leftPanel.canvas.height = leftPanel.groups.length * leftPanel.cellHeight

            }

            leftPanel.cellSize(this.spreadsheetDiv.offsetHeight);

        }

    }

}