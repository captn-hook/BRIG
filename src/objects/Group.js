class GroupManager {
    constructor() {}
}

class Group {
    constructor() {}

    clicks(e) {
        if (this.spreadsheet == this.state[1]) {
            if (this.gi != this.cellY - 1) {
                this.gi = this.cellY - 1

                if (this.groups[this.gi] != undefined) {
                    this.text = this.groups[this.gi]['text']
                } else {
                    this.text = ''
                }

                window.location.hash = (this.siteheader + '&G=' + this.gi);
            } else {
                this.gi = -1;
            }
        }
    }
}