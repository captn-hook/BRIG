import './sitelist.css';
import { navigate } from '../index/index.js';

export default function siteListElem(sites) {
    //returns a scrollable list of sites populated from 
    let list = document.createElement('div');
    list.id = 'siteList';
    list.classList.add('siteList');

    sites.forEach((site) => {
        let siteElem = document.createElement('div');
        siteElem.classList.add('siteElem');
        siteElem.classList.add('BtnSite');
        siteElem.innerHTML = site;
        siteElem.id = site;
        
        list.appendChild(siteElem);
    });

    return list;
}