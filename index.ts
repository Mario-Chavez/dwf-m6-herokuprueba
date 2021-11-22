import * as express from "express";
const app = express();
const port = process.env.PORT || 3000;

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});

app.get("/hola", (req, res) => {
  res.json({
    message:
      "hola soy el servidor probando heroku, seguire probando mas pruebas antes de comenzar a subir lo trabajos",
  });
});

app.listen(port, () => {
  console.log("Hola soy express y estoy corriendo desde = " + port);
});
