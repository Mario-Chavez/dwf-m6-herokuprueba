"use strict";
exports.__esModule = true;
/* desde firebase intro (back end) */
var db_1 = require("./db");
var nanoid_1 = require("nanoid");
var cors = require("cors");
/////////////
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
/* back */
app.use(express.json());
app.use(cors());
var userCollections = db_1.firestore.collection("users");
var roomCollections = db_1.firestore.collection("rooms");
//handler back
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var nombre = req.body.nombre;
    console.log(req.body);
    userCollections
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        //empty (vacio). creamos el ususario
        if (searchResponse.empty) {
            userCollections
                .add({
                email: email,
                nombre: nombre
            })
                .then(function (newUser) {
                res.json({
                    id: newUser.id,
                    "new": true
                });
            });
        }
        else {
            /* respondemos q ya existe un ususario */
            res.status(400).json({
                id: searchResponse.docs[0].id,
                message: "usuario ya existente"
            });
        }
    });
});
/* En base a su Email nos devuelve un asuario y su id si esta vacia nos dira notfound
  sino nos volvera a dar el id del ususario registrado*/
app.post("/auth", function (req, res) {
    var email = req.body.email;
    userCollections
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            res.status(404).json({
                message: "usuario no encontrado (not found)"
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
/* este edpoint nos crea una romms primero verifica si existe el user id  */
app.post("/rooms", function (req, res) {
    var userId = req.body.userId; //busca el id del usuario del body
    userCollections
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        //si existe...
        if (doc.exists) {
            /* crea en el rtdb un room */
            var roomsRef_1 = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomsRef_1
                .set({
                messages: [],
                owner: userId
            })
                .then(function () {
                /* cre el el firestore un documento con id mas sencillo y adentro guarda
                el id mas complejo del rtdb*/
                var roomLongId = roomsRef_1.key; // id largo
                var roomId = 100 + Math.floor(Math.random() * 9999);
                roomCollections
                    .doc(roomId.toString()) //agregamos un rooms con id corto
                    .set({
                    rtdbRoomId: roomLongId
                })
                    .then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "No existis (not found)"
            });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId; //se usa el query
    var roomId = req.params.roomId; //parametro que le pasasamos por postman
    userCollections
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            roomCollections
                .doc(roomId)
                .get()
                .then(function (snap) {
                var data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                Number: doc.data(),
                message: "No existe (not found)"
            });
        }
    });
});
/* aqui logre pasarle el rtdb como param en el body solo tengo que ver como hacer para poder mapearlo asi poder escribirlo en el chat
lo hice agregandole /messages asi abre un nuevo archivo con el nombre messages en rtdb y pude mapear desde la pagina de chat*/
app.post("/messages", function (req, res) {
    var rtdbRoomId = req.body.rtdbRoomId;
    console.log();
    var chatReferent = db_1.rtdb.ref("/rooms/" + rtdbRoomId + "/messages");
    chatReferent.push(req.body, function (err) {
        console.log(req.body);
        console.error("este es el error del messaes del backend", err);
        res.json("todo bien parece que anda el messages");
    });
});
//app.get("/env", (req, res) => {
//  res.json({
//    environment: process.env.NODE_ENV,
//  });
//});
//
//app.get("/db-env", (req, res) => {
//  res.json({
//    "deb-host": process.env.DB_HOST,
//  });
//});
//
//app.get("/hola", (req, res) => {
//  res.json({
//    message:
//      "hola soy el servidor probando heroku, seguire probando mas pruebas antes de comenzar a subir lo trabajos",
//  });
//});
//
app.use(express.static("dist")); //busca en dist las rutas y si no encuentra las rutas en el handler
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("Hola soy express y estoy corriendo desde = " + port);
});
