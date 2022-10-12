const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

functions.https("userList", (req, res) => {
  const allUsers = [];
  return admin.auth().listUsers()
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          // For each user
          const userData = userRecord.toJSON();
          allUsers.push(userData);
        });
        res.status(200).send(JSON.stringify(allUsers));
        return functions.logger.log("Sent Users");
      })
      .catch(function(error) {
        console.log("Error listing users:", error);
        res.status(500).send(error);
        return functions.logger.log("User List Error");
      });
});