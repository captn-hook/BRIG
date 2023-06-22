const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

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