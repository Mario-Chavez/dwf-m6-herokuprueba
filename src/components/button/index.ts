export function initButtonComp() {
  class BotonEl extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const contenido = this.textContent;

      const style = document.createElement("style");
      style.innerHTML = `
      .root{
        max-width: 312px;
        height: 55px;
        margin:10px auto ;
      } 
      .button{
        width: 100%;                
        padding:15px 13px;
        margin-top:3px;
        border: solid 2px black;
        border-radius: 5px;
        background-color: #9CBBE9;
      }
      
      
      `;

      const div = document.createElement("div");
      div.classList.add("root");

      div.innerHTML = `
      <button class="button">${contenido}</button>  
      `;
      shadow.appendChild(style);
      shadow.appendChild(div);
    }
  }
  customElements.define("boton-el", BotonEl);
}
