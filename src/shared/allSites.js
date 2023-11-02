import {
    //getStorage,
    ref,
    listAll,
    //getBlob,
    //updateMetadata,
    getMetadata,
} from 'firebase/storage';

export default async function allSites(storage)  {
    if (!storage) return [];

    const folderRef = ref(storage, '/Sites');
    var availableSites = [];
    var accessibleSites = [];

    return listAll(folderRef).then((e) => {

        for (var i = 0; i < e.prefixes.length; i++) {
            availableSites.push(e.prefixes[i].name)
        }

        var promises = [];

        for (var i = 0; i < availableSites.length; i++) {

            var fileRef = ref(storage, '/Sites/' + availableSites[i] + '/' + availableSites[i] + '.glb');

            promises.push(getMetadata(fileRef)
                .then((data) => {
                    availableSites.sort();
                    accessibleSites.sort();
                    accessibleSites.push(data.name.split('.')[0])

                })
                .catch((error) => {
                    console.error(error);
                } ) 
            ) 
        }
    
        return Promise.all(promises).then(() => {
            return accessibleSites;
        }
        )
    })
}
        