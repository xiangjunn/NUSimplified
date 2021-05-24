import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
import {API_KEY, PROJECT_NAME, MESSAGING_SENDER_ID, APP_ID} from '@env'

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: PROJECT_NAME + '.firebaseapp.com',
  databaseURL: 'https://' + PROJECT_NAME +'.firebaseio.com',
  projectId: PROJECT_NAME,
  storageBucket: PROJECT_NAME + '.appspot.com',
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };