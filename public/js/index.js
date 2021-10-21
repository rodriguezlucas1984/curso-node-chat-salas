//Referencias HTML
const form = document.querySelector("#form");
const lblNombre = document.querySelector("#lblNombre");
const lblSala = document.querySelector("#lblSala");

form.addEventListener("submit", (ev) => {
  if (lblNombre.value.trim() === "" || lblSala.value.trim() === "") {
    ev.preventDefault();
    throw new Error("La sala y el nombre son requeridos");
  }
});
