
export default function loginStyle() {
	//remove restricted classes for logged in users
    console.log("loginStyle");
	var elements = document.querySelectorAll('[class*="restricted"]')
    //console.log(elements);
	for (var i = 0; i < elements.length; i++) {
		elements[i].className = elements[i].className.replace('restricted', '');
    }

    var elements2 = document.querySelectorAll('[class*="restricted2"]');
    for (var i = 0; i < elements2.length; i++) {
        elements2[i].className = elements2[i].className.replace('restricted2', '');
    }
	//eventually discriminate between editor and viewer
}