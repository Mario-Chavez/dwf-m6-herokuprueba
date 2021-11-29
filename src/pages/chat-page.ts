import { state } from "../state";

type Message = {
  from: string;
  message: string;
};

class Chat extends HTMLElement {
  connectedCallback() {
    state.subscribe(() => {
      const cs = state.getState();
      this.messages = cs.messages;
      this.render();
    });
    this.render();
    this.addListeners();
  }
  messages: Message[] = [];
  addListeners() {
    const form = document.querySelector(".submit-message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      console.log(target["new-message"].value);

      state.pushMessages(target["new-message"].value);
    });
  }

  render() {
    const style = document.createElement("style");

    //aqui va el style
    style.innerHTML = `
    * {
        box-sizing: border-box;
      }
    body {
        margin: 0;
      }
    .roomId{
        text-align: center;
      }
    .container-messages {
        max-width: 312px;
        height: auto;
        margin: 10px auto;
      }

    .container-messages__messages{
      display:grid;
      grid-template-columns: auto;
      grid-template-rows: auto;
      }

    .messages{
      display: inline;
      margin-bottom: 10px;
      background-color: #9cbbe9;
      justify-self: end

    }
    .messages-otro{
      justify-self: flex-start;
      background-color:#ed8080;
      margin-bottom: 10px
    }
   
    .input__messages{
      width: 100%;
      max-width: 312px;
      height: 6vh;
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

    this.innerHTML = `
      <header-el></header-el>
      <text-el variant="title">
      Sala de Chats
      </text-el>
      <h3 class="roomId">Room Id : ${state.data.roomId} </h3>
      <div class="container-messages"> 
       <div class="container-messages__messages"> 
       ${this.messages
         .map((m) => {
           if (m.from == state.data.fullName) {
             return `<div class="messages">${m.from}:${m.message}</div>`;
           } else {
             return `<div class="messages-otro">${m.from}:${m.message}</div>`;
           }
         })
         .join("")}
       </div>
       <form class="submit-message">
       <input type="text" class="input__messages" placeholder="Escribe tu Mensaje" name="new-message">
       <button class="button">Comenzar</button>
       </form>
       </div>
      `;

    this.appendChild(style);
    this.addListeners();
  }
}
customElements.define("chat-page", Chat);
