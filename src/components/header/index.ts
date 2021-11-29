export function initHeaderComp() {
  class Header extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    render() {
      this.innerText = "Header";
      this.style.height = "30px";
      this.style.backgroundColor = "#FF8282";
      this.style.font = "22px";
      this.style.display = "flex";
      this.style.justifyContent = "center";
      this.style.alignItems = "center";
    }
  }
  customElements.define("header-el", Header);
}
