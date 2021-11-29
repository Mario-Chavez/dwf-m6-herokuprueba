export function initTextComp() {
  class Textcomponent extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    render() {
      const variant = this.getAttribute("variant") || "body";
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");

      style.innerHTML = `
      .title{
        font-size: 40px;
        font-family: Roboto;
        text-align: center;
        margin: 5vh; 
      }
      .body{
        font-size: 18px;
        text-align: center;
        margin: 15px auto;
      }
      .subtitulo{
        font-size: 22px;
        color: #9CBBE9;
        text-align: center;
        margin: 15px auto;
      }
      `;

      div.className = variant;
      div.textContent = this.textContent;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("text-el", Textcomponent);
}
