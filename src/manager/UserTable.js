import {
    ref,
    getMetadata 
} from 'firebase/storage';

export class UserTable {
    constructor(t, d) {
        this.table = t;

        this.defaultDropd = d;
        this.inUsers = [];
        this.allUsers = [];


        this.aU = [];
        this.iU = [];

        this.bw = true;

    }
    //set group to selected
    emptyTable() {
        this.allUsers = [];
        this.inUsers = [];
        this.aU = [];
        this.iU = [];

        this.table.innerHTML = '';
    }


    populateTable(storage, u, dropdValue) {
        if (dropdValue != this.defaultDropd && dropdValue != 'Empty' && dropdValue != 'Select a site' && dropdValue != '') {

            this.allUsers = u;
            this.inUsers = [];


            var itemRef = ref(storage, '/Sites/' + dropdValue + '/' + dropdValue + '.glb')

            getMetadata(itemRef).then((metadata) => {

                    if (metadata.customMetadata != null) {

                        var names = Object.keys(metadata.customMetadata);
                        var data = Object.values(metadata.customMetadata);

                        names.forEach((user) => {

                            if (data[names.indexOf(user)] != 'false') {

                                this.inUsers.push([data[names.indexOf(user)], user]);

                                for (var i = 0; i < this.allUsers.length; i++) {
                                    if (this.allUsers[i][1] == user) {
                                        this.allUsers.splice(i, 1);
                                    }
                                }
                            }

                        });

                        this.pTable2(this.allUsers, this.inUsers);

                    }
                })
                .catch((error) => {
                    console.error(error);
                })

            this.pTable2(this.allUsers, this.inUsers);
        }
    }

    pTable2(aU0, iU0) {

        var nerHTML = '<tr>\n<th class="cell">No Access</th><th class="cell">Access</th>\n</tr>\n';

        var big = iU0.length > aU0.length ? iU0.length : aU0.length;

        var style = this.bw ? 'tbDark' : 'tbLight';

        var tbIn = 'tbIn';

        for (var i = 0; i < big; i++) {

            nerHTML += '<tr>\n';

            if (i < aU0.length) {

                if (aU0[i].length > 2) {
                    tbIn = 'tbOut';
                }

                nerHTML += '<td class="' + style + ' ' + tbIn + ' cell">' + aU0[i][1] + '</td>';

                tbIn = 'tbIn';
            } else {
                nerHTML += '<td class="' + style + ' ' + tbIn + ' cell"></td>';
            }

            if (i < iU0.length) {

                if (iU0[i].length > 2) {
                    tbIn = 'tbOut';
                }

                nerHTML += '<td class="' + style + ' ' + tbIn + ' cell">' + iU0[i][1] + '</td>';

                tbIn = 'tbIn';
            } else {
                nerHTML += '<td class="' + style + ' ' + tbIn + ' cell"></td>';
            }

            nerHTML += '\n</tr>\n';

        }

        this.allUsers = aU0;
        this.inUsers = iU0;

        this.aU = []
        this.iU = []

        this.table.innerHTML = nerHTML;

        document.querySelectorAll('#table td')
            .forEach(e => e.addEventListener("click", this.cellListener.bind(this, e)));
    }

    cellListener(e) {

        for (var i = 0; i < this.allUsers.length; i++) {

            if (this.allUsers[i][1] == e.innerHTML) { 

                this.iU.push([this.allUsers[i][0], this.allUsers[i][1], 'flag']);

            } else {

                this.aU.push(this.allUsers[i]);

            }

        }

        for (var i = 0; i < this.inUsers.length; i++) {


            if (this.inUsers[i][1] == e.innerHTML) {

                this.aU.push([this.inUsers[i][0], this.inUsers[i][1], 'flag']);

            } else {

                this.iU.push(this.inUsers[i]);

            }

        }

        this.pTable2(this.aU, this.iU);       
    }
}