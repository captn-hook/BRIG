export default class ScreenSizes {

    constructor() {

        this.div = document.getElementById('3d');
        this.spreadsheetDiv = document.getElementById('spreadsheet');

        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;

    }


    updateSizes(canvas2d, canvasleft) {

        const ctx = canvas2d.getContext('2d');

        const ctxLeft = canvasleft.getContext('2d');

        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;

        ctx.canvas.innerWidth = this.width;
        ctx.canvas.innerHeight = this.height;

        canvas2d.width = this.width;
        canvas2d.height = this.height;

        ctxLeft.canvas.innerWidth = this.spreadsheetDiv.offsetWidth;
        ctxLeft.canvas.innerHeight = this.spreadsheetDiv.offsetHeight;

        canvasleft.width = this.spreadsheetDiv.offsetWidth;
        canvasleft.height = this.spreadsheetDiv.offsetHeight;
    }

}