
document.getElementById('login').addEventListener('click', (e) => {
    sizes.updateSizes(leftPanel);
    login();
})

document.getElementById('logout').addEventListener('click', (e) => {
    siteList([]);
    availableSites = [];
    accessibleSites = [];
    switchDisplay(0);
    auth.signOut();
})


document.getElementById('groups').addEventListener('click', (e) => {
    grpButtons(e, leftPanel, sizes, state)
})

const ctrlBtn = document.getElementById('ctrlBtn');

const root = document.getElementById('root');

const ctrl = document.getElementById('ctrl');

var back = document.getElementById('bg')

var tx = document.getElementById('tx')

var bw = true;

var btns = document.getElementsByClassName('Btn');

var cells = document.getElementsByClassName('cell');

document.getElementById('blackandwhite').addEventListener('click', (e) => {

    bw = !bw;

    leftPanel.setbw(bw)

    userTable.bw = bw;

    if (bw) {
        scene.background = new Color(0x000000);
        back.style.background = 'rgb(27, 27, 27)';
        title.src = imageUrl1;
        tx.style.color = 'lightgray';
        textbox.style.backgroundColor = 'gray';
        textbox.style.color = 'white'
        ctrl.style.backgroundColor = 'rgb(27, 27, 27)';

        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('btLight');
            btns[i].classList.add('btDark');
        }

        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.remove('tbLight');
            cells[i].classList.add('tbDark');
        }
    } else {
        scene.background = new Color(0xffffff);
        back.style.background = 'rgb(230, 230, 230)';
        title.src = imageUrl2;
        tx.style.color = 'black';
        textbox.style.backgroundColor = 'lightgray';
        textbox.style.color = 'black'

        ctrl.style.backgroundColor = 'rgb(230, 230, 230)';

        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('btDark');
            btns[i].classList.add('btLight');
        }

        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.add('tbLight');
            cells[i].classList.remove('tbDark');
        }
    }
})

var btn6 = {
    adminMenu: function () {
        if (ctrl.style.display == 'block') {
            ctrl.style.display = 'none';
            root.style.width = '100%'
        } else {
            ctrl.style.display = 'block';
            root.style.width = '80%';
        }
        window.dispatchEvent(new Event('resize'));
    }
};

// btn event listeners

ctrlBtn.addEventListener('click', btn6.adminMenu);
