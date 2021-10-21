const socket = io();

const params = new URLSearchParams(window.location.search);

if (!params.has("nombre")) {
  window.location = "index.html";
  throw new Error("El nombre es necesario");
}
if (!params.has("sala")) {
  window.location = "index.html";
  throw new Error("La sala es necesario");
}
if (params.get("nombre").length === 0) {
  window.location = "index.html";
  throw new Error("Valor invalido para el nombre");
}
if (params.get("sala").length === 0) {
  window.location = "index.html";
  throw new Error("Valor invalido para la sala");
}

const usuario = {
  nombre: params.get("nombre"),
  sala: params.get("sala"),
};

socket.on("connect", function () {
  console.log("Conectado al servidor");

  socket.emit("entrarChat", usuario, (resp) =>
    console.log("Usuarios conectados", resp)
  );
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

// Enviar información
// socket.emit(
//   "Mensaje",
//   {
//     usuario: "Fernando",
//     mensaje: "Hola Mundo",
//   },
//   function (resp) {
//     console.log("respuesta server: ", resp);
//   }
// );

// Escuchar información
socket.on("crearMensaje", (mensaje) => {
  console.log("Servidor:", mensaje);
});

//Escuchar cambios de ususarios
//cuando un usuario entra o sale del chat
socket.on("listaPersonas", (personas) => {
  console.log("lista de  personas", personas);
});

//Mensajes privados
socket.on("mensajePrivado", (mensaje) => {
  console.log("Mensaje privado: ", mensaje);
});
