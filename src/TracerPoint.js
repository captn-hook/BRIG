
export default class TracerPoint {

    constructor(label = 'Unlabeled', color = 'red', x = 0, y = 0) {
        this.label = label;
        this.color = color;
        this.x = x;
        this.y = y;
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.r = 20
    }

    animate(x, y) {
        this.x = x;
        this.y = y;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.lineWidth = 5;
        this.context.strokeStyle = '#003300';
        this.context.stroke();
    }

    getName() {
        return label;
    }

    setName(name) {
        this.label = name;
    }

}