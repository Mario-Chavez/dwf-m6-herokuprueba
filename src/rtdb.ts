import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "qlty8BPk9paAWSkoObwxu1U6rJ8QBndrIRCPDzej",
  databaseURL: "https://apx-dwf-m6-cebac-default-rtdb.firebaseio.com",
  authDomain: "apx-dwf-m6-cebac.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };
