//a pop up class that can be filled with html elements, and floats on top of the page with a cancel button
//structure:
//    <div class="popUp">
//        <h1>Pop Up Title</h1>
//        <button class="popUpCancel">X</button>
//        <div class="popUpContent">
//            elements differ
//        </div>
//        <div class="popUpButtons">
//            various functions can go here, grid layout
//        </div>
//    </div>

import './popUp.css'; 

class popUpButton {
    constructor(name, func, cls = 'popUpButton') {
        this.name = name;

        this.elem = document.createElement('button');
        this.elem.className = cls;
        this.elem.innerHTML = name;

        this.elem.addEventListener('click', func, false);

        return this.elem;
    }
}

export class popUp {
    constructor(title, contentlist = [], buttonlist = [], cls = 'bgDark popUp') {
        //lists should be arrays of html elements

        this.elem = document.createElement('div');
        this.elem.className = cls;

        this.titleElem = document.createElement('h1');
        this.titleElem.innerHTML = title;
        this.titleElem.className = 'fgDark';
        this.elem.appendChild(this.titleElem);
        
        this.cancelButton = new popUpButton('X', this.remove.bind(this), 'popUpCancel');
        this.elem.appendChild(this.cancelButton);

        this.contentElem = document.createElement('div');
        this.contentElem.className = 'popUpContent';
        this.elem.appendChild(this.contentElem);

        this.buttonElem = document.createElement('div');
        this.buttonElem.className = 'btn-group popUpButtons';
        this.elem.appendChild(this.buttonElem);

        for (let i = 0; i < contentlist.length; i++) {
            this.contentElem.appendChild(contentlist[i]);
        }

        for (let i = 0; i < buttonlist.length; i++) {
            this.buttonElem.appendChild(buttonlist[i]);
        }

        document.body.appendChild(this.elem);

        return this;
    }

    createButton(name, func, cls = 'btDark popUpButton') {
        var button = new popUpButton(name, func, cls);
        this.buttonElem.appendChild(button);
        return button;
    }
    
    addContent(elem) {
        this.contentElem.appendChild(elem);
    }

    addButton(elem) {
        this.buttonElem.appendChild(elem);
    }

    removeContent(elem) {
        this.contentElem.removeChild(elem);
    }

    removeButton(elem) {
        this.buttonElem.removeChild(elem);
    }

    remove() {
        this.elem.remove();
    }
}     