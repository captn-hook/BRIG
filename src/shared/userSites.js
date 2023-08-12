``
export default async function userSites(db, name) {

    let sitelist = [];

    return new Promise(function (resolve, reject) {
        getDocs(collection(db, name)).then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.data().access == true) {

                    sitelist.push(doc.id)

                }
                console.log(doc.id, " => ", doc.data());

                resolve(sitelist);

            });

        }).catch((error) => {
            reject(error);
        });
    });
}
