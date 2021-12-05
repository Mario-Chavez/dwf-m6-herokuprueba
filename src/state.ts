const API_BASE_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import map from "lodash/map";

const state = {
  data: {
    email: "",
    userId: "",
    fullName: "",
    roomId: "",
    rtdbRoomId: "",
    messages: [],
  },
  listeners: [],
  init() {
    const lastStorage = localStorage.getItem("state");
  },

  listenRoom() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const cs = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);
      cs.messages = messagesList;
      this.setState(cs);
    });
  },

  getState() {
    return this.data;
  },

  pushMessages(message: string) {
    const nombreDelState = this.data.fullName;
    const rtdbRoomId = this.data.rtdbRoomId;
    fetch(API_BASE_URL + "/messages/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: nombreDelState,
        message: message,
        rtdbRoomId: rtdbRoomId, // aqui pase el id al back porque no podia encontrar la forma de buscarlo en el back
      }),
    });
  },
  setEmailAndFullName(email: string, fullName: string) {
    const cs = this.getState();
    cs.fullName = fullName;
    cs.email = email;
  },

  /* el setstate es el estado que vamos a colocar nuevo */
  setState(newState) {
    this.data = newState;

    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState)); //guarda en localStorage el estado
    console.log("soy el state eh cambiado", this.data);
  },

  newUser(callback) {
    const cs = this.getState();
    if (cs.email && cs.fullName) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          nombre: cs.fullName,
          email: cs.email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const cs = this.getState();
          cs.fullName = data.nombre;
          cs.email = data.email;
          this.setState(cs);
          callback();
          console.log("este es el nuevo ususario del front al back", cs);
        });
    } else {
      callback(true);
      console.error("usuario aya existe");
    }
  },

  signIn(callback) {
    const cs = this.getState();
    if (cs.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: cs.email }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
      console.log("este es el console despues del callback del signIn");
    } else {
      console.error("No hay un mail en el state");
      callback(true);
    }
  },

  askNewRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
            console.log("este es el console despues del callback del askRoom");
          }
        });
    } else {
      console.error(" no exisite el ususario con ese id");
    }
  },

  accessToRoom(roomIdDelInput, callback?) {
    const cs = this.getState();
    const roomId = roomIdDelInput.toString();
    const userId = cs.userId;
    cs.roomId = roomId;
    cs.userId = userId;
    this.setState(cs);

    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
        if (callback) {
          callback();
        }
        console.log(
          "este es el console despues del callback del accesToRoom",
          cs
        );
      });
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
