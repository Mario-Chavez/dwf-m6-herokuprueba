"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static("dist")); //busca en dist las rutas y si no encuentra las rutas en el handler
/* seguir mañana minuto 28 */
//handler
app.get("/env", function (req, res) {
    res.json({
        environment: process.env.NODE_ENV
    });
});
app.get("/db-env", function (req, res) {
    res.json({
        "deb-host": process.env.DB_HOST
    });
});
app.get("/hola", function (req, res) {
    res.json({
        message: "hola soy el servidor probando heroku, seguire probando mas pruebas antes de comenzar a subir lo trabajos"
    });
});
app.listen(port, function () {
    console.log("Hola soy express y estoy corriendo desde = " + port);
});
