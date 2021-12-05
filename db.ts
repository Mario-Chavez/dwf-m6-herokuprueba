import * as admin from "firebase-admin";
//import * as serviceAccount from "./key.json";
const serviceKey = require("./key.json");

/* inicicalizamos colocando nuestra key  */
admin.initializeApp({
  credential: admin.credential.cert(serviceKey as any),
  databaseURL: "https://apx-dwf-m6-cebac-default-rtdb.firebaseio.com",
});

/* cargamos el firestore y rtdb en una constante para manipularlo */
const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
