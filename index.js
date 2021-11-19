"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
app.get("/hola", function (req, res) {
    res.json({
        message: "hola soy el servidor"
    });
});
app.listen(port, function () {
    console.log("Hola soy express y estoy corriendo desde =" + port);
});
