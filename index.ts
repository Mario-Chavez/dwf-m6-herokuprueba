import * as express from "express";
const app = express();
const port = process.env.PORT || 3000;

app.get("/hola", (req, res) => {
  res.json({
    message: "hola soy el servidor probando heroku",
  });
});

app.listen(port, () => {
  console.log("Hola soy express y estoy corriendo desde = " + port);
});
