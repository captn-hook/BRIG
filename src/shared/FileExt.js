
export default function FileExt(path) {

	var filetype = path.split('.').pop();

	console.log(filetype);

	if (filetype == 'gltf' || filetype == 'glb') {

		return true;

	} else if (filetype == 'obj') {

		return false;

	} else {
		console.log('Please upload a .glb, .gltf, or .obj');
	}
}