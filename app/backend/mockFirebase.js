var firebasemock    = require('firebase-mock');

var mockauth = new firebasemock.MockAuthentication();
var mockfirestore = new firebasemock.MockFirestore();
export var mocksdk = new firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  (path) => {
    return null;
  },
  // use null if your code does not use AUTHENTICATION
  () => {
    return mockauth;
  },
  // use null if your code does not use FIRESTORE
  () => {
    return mockfirestore;
  },
  // use null if your code does not use STORAGE
  () => {
    return null;
  },
  // use null if your code does not use MESSAGING
  () => {
    return null;
  }
);
