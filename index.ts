/* desde firebase intro (back end) */
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as cors from "cors";
/////////////
import * as express from "express";
const app = express();
const port = process.env.PORT || 3000;

/* back */
app.use(express.json());
app.use(cors());

const userCollections = firestore.collection("users");
const roomCollections = firestore.collection("rooms");

//handler back

app.post("/signup", (req, res) => {
  const { email } = req.body;
  const { nombre } = req.body;
  console.log(req.body);

  userCollections
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      //empty (vacio). creamos el ususario
      if (searchResponse.empty) {
        userCollections
          .add({
            email,
            nombre,
          })
          .then((newUser) => {
            res.json({
              id: newUser.id,
              new: true,
            });
          });
      } else {
        /* respondemos q ya existe un ususario */
        res.status(400).json({
          id: searchResponse.docs[0].id,
          message: "usuario ya existente",
        });
      }
    });
});
/* En base a su Email nos devuelve un asuario y su id si esta vacia nos dira notfound
  sino nos volvera a dar el id del ususario registrado*/
app.post("/auth", (req, res) => {
  const { email } = req.body;

  userCollections
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "usuario no encontrado (not found)",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

/* este edpoint nos crea una romms primero verifica si existe el user id  */
app.post("/rooms", (req, res) => {
  const { userId } = req.body; //busca el id del usuario del body
  userCollections
    .doc(userId.toString())
    .get()
    .then((doc) => {
      //si existe...
      if (doc.exists) {
        /* crea en el rtdb un room */
        const roomsRef = rtdb.ref("rooms/" + nanoid());
        roomsRef
          .set({
            messages: [],
            owner: userId,
          })
          .then(() => {
            /* cre el el firestore un documento con id mas sencillo y adentro guarda 
            el id mas complejo del rtdb*/
            const roomLongId = roomsRef.key; // id largo
            const roomId = 100 + Math.floor(Math.random() * 9999);
            roomCollections
              .doc(roomId.toString()) //agregamos un rooms con id corto
              .set({
                rtdbRoomId: roomLongId, //guardamos (set) el id complejo que hicimos en el rdtb
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "No existis (not found)",
        });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query; //se usa el query
  const { roomId } = req.params; //parametro que le pasasamos por postman

  userCollections
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomCollections
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          Number: doc.data(),
          message: "No existe (not found)",
        });
      }
    });
});

/* aqui logre pasarle el rtdb como param en el body solo tengo que ver como hacer para poder mapearlo asi poder escribirlo en el chat
lo hice agregandole /messages asi abre un nuevo archivo con el nombre messages en rtdb y pude mapear desde la pagina de chat*/

app.post("/messages", (req, res) => {
  const rtdbRoomId = req.body.rtdbRoomId;
  console.log();

  const chatReferent = rtdb.ref("/rooms/" + rtdbRoomId + "/messages");
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

app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log("Hola soy express y estoy corriendo desde = " + port);
});
