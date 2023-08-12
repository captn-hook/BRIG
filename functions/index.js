const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const bukitid = 'brig-b2ca3.appspot.com'
const serviceAccount = require('./key.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: bukitid
});

const bucket = getStorage().bucket();

const auth = admin.auth();

exports.listUsers = functions.https.onCall((data, context) => {

  if (!context.auth) return {
    status: 'error',
    code: 401,
    message: 'Not signed in'
  }

  if (context.auth.token.email.split('@')[1] == 'poppy.com' || context.auth.token.email.split('@')[0] == 'tristanskyhook') {
    return new Promise((resolve, reject) => {
      // find a user by data.uid and return the result
      resolve(auth.listUsers());
      reject({
        status: 'error',
        code: 500,
        message: 'Promise rejected'
      });
    })
  } else {
    return {
      status: 'error',
      code: 401,
      message: 'Not authorized'
    }
  }

});

exports.allSites = functions.https.onCall((data, context) => {

  if (!context.auth) return {
    status: 'error',
    code: 401,
    message: 'Not signed in'
  }
  if (context.auth.token.email.split('@')[1] == 'poppy.com' || context.auth.token.email.split('@')[0] == 'tristanskyhook') {
    
    return new Promise((resolve, reject) => {
      resolve(bucket.getFiles().then(files => {
        //resole files into a list of names in /Sites/
        let sites = [];
        for (let i = 0; i < files[0].length; i++) {
          console.log('name: ' + files[0][i].name);
          n = files[0][i].name;
          //append every siteName encapsulated by Sites/{siteName}/... to sites
          if (n.split('/')[0] == 'Sites' && !sites.includes(n.split('/')[1])) {
            sites.push(n.split('/')[1]);
          }
        }
        return sites;
      }));
      reject({
        status: 'error',
        code: 500,
        message: 'Promise rejected'
      });
    })      
  } else {
    return {
      status: 'error',
      code: 401,
      message: 'Not authorized'
    }
  }
});