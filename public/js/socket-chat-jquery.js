const parametros = new URLSearchParams(window.location.search);

const nombre = parametros.get("nombre");
const sala = parametros.get("sala");

//Modo privado
let modoPrivado = { activado: false, destino: "", usuario: null };

//Referencias de jQuery
const divUsuarios = $("#divUsuarios");
const formEnviar = $("#formEnviar");
const txtMensaje = $("#txtMensaje");
const divChatbox = $("#divChatbox");
const inputBuscar = $("#inputBuscar");
const txtSala = $("#txtSala");

//Titulo sala
txtSala.text(sala);

function renderizarUsuarios(personas) {
  let html = "";

  html += "<li>";
  html += `<a href="javascript:void(0)" class="active">Chat de <span>${params.get(
    "sala"
  )}</span></a>`;
  html += "</li>";

  html += personas.map((persona) => {
    return `<li>
              <a  data-id=${persona.id} data-nombre=${persona.nombre}  href="javascript:void(0)">
                <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> 
                  <span>${persona.nombre}
                    <small class="text-success">online</small>
                  </span>
                </a>
            </li>`;
  });

  divUsuarios.html(html);
}

function renderizarMensaje(mensaje, yo, privado) {
  let html;
  if (yo) {
    html = `<li class="reverse ${
      modoPrivado.activado === true ? "bg-info" : ""
    }">
    <div class="chat-content">
        <h5>${mensaje.nombre}</h5>
        <div class="box bg-light-inverse">${mensaje.mensaje}  ${
      modoPrivado.activado === true
        ? `(Mensaje privado enviado a ${modoPrivado.usuario.data("nombre")})`
        : ""
    }
        </div>
    </div>
    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />
    </div>
    <div class="chat-time">${new Date(mensaje.fecha)
      .toTimeString()
      .substr(0, 5)}</div>
    </li> `;
  } else {
    html = `<li class="animated fadeIn ${privado ? "bg-info" : ""}">  
  ${
    mensaje.nombre !== "Administrador"
      ? `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />
  </div>`
      : ""
  }
  <div class="chat-content">
      <h5>${mensaje.nombre}</h5>
      <div class="box bg-light-${
        mensaje.nombre === "Administrador" ? "danger" : "info"
      }">${mensaje.mensaje}</div>
  </div>
  <div class="chat-time">${new Date(mensaje.fecha)
    .toTimeString()
    .substr(0, 5)}</div>
</li>`;
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

//Listeners
divUsuarios.on("click", "a", function () {
  const id = $(this).data("id");
  if (id && id !== socket.id) {
    console.log(id);
    if (id !== modoPrivado.destino) {
      modoPrivado.activado = true;
      modoPrivado.destino = id;
      if (modoPrivado.usuario !== null) {
        modoPrivado.usuario.css("background-color", "white");
      }
      modoPrivado.usuario = $(this);
      $(this).css("background-color", "#17a2b8");
    } else {
      modoPrivado.activado = false;
      modoPrivado.destino = "";
      modoPrivado.usuario = null;
      $(this).css("background-color", "white");
    }
  }
});

formEnviar.on("submit", function (e) {
  e.preventDefault();
  if (txtMensaje.val().trim().length === 0) {
    return;
  }

  if (modoPrivado.activado === false) {
    socket.emit(
      "crearMensaje",
      {
        nombre: nombre,
        mensaje: txtMensaje.val(),
      },
      (mensaje) => {
        txtMensaje.val("").focus();
        renderizarMensaje(mensaje, true);
        scrollBottom();
      }
    );
  } else {
    socket.emit(
      "mensajePrivado",
      {
        nombre: nombre,
        mensaje: txtMensaje.val(),
        para: modoPrivado.destino,
      },
      (mensaje) => {
        txtMensaje.val("").focus();
        renderizarMensaje(mensaje, true);
        scrollBottom();
      }
    );
  }
});

inputBuscar.on("input", function () {
  let html = "";
  divUsuarios.children().each(function (index, usuario) {
    if (!usuario.children[0].getAttribute("data-nombre")) {
      return;
    }

    if (
      usuario.children[0]
        .getAttribute("data-nombre")
        .includes(inputBuscar.val())
    ) {
      usuario.classList.remove("d-none");
    } else {
      usuario.classList.add("d-none");
    }
  });
});
