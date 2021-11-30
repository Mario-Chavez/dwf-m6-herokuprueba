"use strict";
exports.__esModule = true;
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
//import * as serviceAccount from "./key.json";
var serviceKey = require("./serviceKey.json");
/* inicicalizamos colocando nuestra key  */
admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
    databaseURL: "https://apx-dwf-m6-cebac-default-rtdb.firebaseio.com"
});
/* cargamos el firestore y rtdb en una constante para manipularlo */
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
