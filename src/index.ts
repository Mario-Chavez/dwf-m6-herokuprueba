/*
import { json } from "stream/consumers";

fetch("/env")
  .then((res) => res.json())
  .then(
    (data) =>
      (document.querySelector(".root").textContent = JSON.stringify(data))
  );
 seguir mañana instale la dependencias pero no puedo instala el fire-admin no se porq ver quizas el package del backend */
////////////////////////////////////////////////////////////////////////

//pages
import "./pages/home-page";
import "./pages/chat-page";
//router
import "./router";
//state
import { state } from "./state";
//components
import { initHeaderComp } from "./components/header";
import { initTextComp } from "./components/text";
import { initButtonComp } from "./components/button";

(function () {
  initButtonComp();
  initHeaderComp();
  initTextComp();
})();
