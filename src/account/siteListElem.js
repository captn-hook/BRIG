import { navigate } from '../index/index.js';

export default function siteListElem(sites) {
    //returns a scrollable list of sites populated from 
    let list = document.createElement('div');
    list.id = 'siteList';
    list.classList.add('siteList');

    sites.forEach((site) => {
        console.log('SITE: ', site);
        let siteElem = document.createElement('div');
        siteElem.classList.add('siteElem');
        siteElem.innerHTML = site;
        siteElem.addEventListener('click', function () {  navigate('viewer', site); });

        list.appendChild(siteElem);
    });

    return list;
}