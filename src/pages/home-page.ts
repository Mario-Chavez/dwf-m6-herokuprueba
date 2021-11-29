import { Router } from "@vaadin/router";
import { state } from "../state";

class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    state.init();
    const cs = state.getState();
    const form = this.shadow.querySelector(".form");
    const inputRoom = this.shadow.querySelector(".input-roomId");
    const selector: any = this.shadow.querySelector(".input-select-room");

    selector.addEventListener("change", () => {
      const selectValue = selector.options[selector.selectedIndex].value;

      if (selectValue == "room__exist") {
        inputRoom.setAttribute("style", "display:inherit");
      } else {
        inputRoom.setAttribute("style", "display:none");
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectValue = selector.options[selector.selectedIndex].value;

      const target = e.target as any;
      const fullname = target.nombre.value;
      const email = target.email.value;

      state.setEmailAndFullName(email, fullname);
      state.signIn((err) => {
        if (selectValue == "room__exist") {
          console.log("entraste al room __exist");

          state.accessToRoom((inputRoom as HTMLInputElement).value.toString());
          state.setState(cs);
        } else {
          console.log("entraste al else del signIn haciendo un nuevo room");
          state.askNewRoom(() => {
            state.setState(cs);
            state.accessToRoom(state.data.roomId);
          });
        }
        if (err) console.error("hubo un error en el signin");
      });
      Router.go("/chat");
    });
  }

  render() {
    const divEl = document.createElement("div");
    const style = document.createElement("style");

    style.innerHTML = `
    * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
    .form {
      max-width: 312px;
      height: auto;
      margin: 10px auto;
    }
    .input {
      width: 100%;
      max-width: 312px;
      height: 4vh;
      margin-top: 3px;
      margin-bottom: 3px;
    }
    .input-select-room{
      width: 100%;
      max-width: 312px;
      height: 4vh;
      margin-top: 3px;
      margin-bottom: 3px;
    }
    .input-roomId{
      width: 100%;
      max-width: 312px;
      height: 4vh;
      margin-top: 3px;
      margin-bottom: 3px;

    }
    .form-room{
      width: 100%;
      height: 4vh;
      margin-top: 3px;
      margin-bottom: 3px;

    }
    
    .button {
      width: 100%;
      padding: 15px 13px;
      margin-top: 3px;
      border: solid 2px black;
      border-radius: 5px;
      background-color: #9cbbe9;
      max-width: 312px;
      height: 55px;
      margin: 10px auto;
    }
    
    `;

    divEl.innerHTML = `
      <header-el></header-el>
      <text-el variant="title">Bienvenido</text-el>
      <form class="form"> 
          <div>
            <label>Email</label>
          </div>
            <input class="input" type="text" name="email">
          <div>
            <label>Nombre</label>
          </div>
            <input class="input" type="text" name="nombre">
          <div>
             <label>Room</label>
          </div>
          
            <select class="input-select-room" name="input-select-room">
              <option value="room__new" name="new">Nuevo Room</option>
              <option value="room__exist" name="exist">Room Existente</option>
            </select>

            <input type="text" class="input-roomId" placeholder="Escribe tu RoomId" name="roomId">
            
            <button class="button">Comenzar</button>
          </form>

      `;
    this.shadow.appendChild(style);
    this.shadow.appendChild(divEl);
  }
}
customElements.define("home-page", Home);
