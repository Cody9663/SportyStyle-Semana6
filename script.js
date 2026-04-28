let auth0Client = null;

const auth0Config = {
  domain: "dev-kjda6xyai8kdh0oa.uk.auth0.com",
  clientId: "Tw2d9krYDBCY5sCW4KKteXx0uebvKtvM",
  authorizationParams: {
    redirect_uri: window.location.origin
  }
};

async function iniciarAuth0() {
  auth0Client = await auth0.createAuth0Client(auth0Config);

  if (location.search.includes("code=") && location.search.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  actualizarEstadoUsuario();
}

async function login() {
  await auth0Client.loginWithRedirect();
}

async function logout() {
  sessionStorage.clear();

  await auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}

async function actualizarEstadoUsuario() {
  const autenticado = await auth0Client.isAuthenticated();

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const bienvenida = document.getElementById("bienvenida");

  if (autenticado) {
    const usuario = await auth0Client.getUser();

    loginBtn.classList.add("oculto");
    logoutBtn.classList.remove("oculto");
    bienvenida.textContent = `Bienvenido/a, ${usuario.name}`;
  } else {
    loginBtn.classList.remove("oculto");
    logoutBtn.classList.add("oculto");
    bienvenida.textContent = "Debes iniciar sesión para una experiencia segura.";
  }

  mostrarCarrito();
}

function obtenerCarrito() {
  const carritoGuardado = sessionStorage.getItem("carrito");
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
  const carrito = obtenerCarrito();

  const productoExistente = carrito.find(producto => producto.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

function mostrarCarrito() {
  const carrito = obtenerCarrito();
  const listaCarrito = document.getElementById("listaCarrito");
  const totalCompra = document.getElementById("totalCompra");

  listaCarrito.innerHTML = "";

  let total = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
    totalCompra.textContent = "Total: $0";
    return;
  }

  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    listaCarrito.innerHTML += `
      <div class="item-carrito">
        <strong>${producto.nombre}</strong><br>
        Precio: $${producto.precio.toLocaleString("es-CL")}<br>
        Cantidad: ${producto.cantidad}<br>
        Subtotal: $${subtotal.toLocaleString("es-CL")}
      </div>
    `;
  });

  totalCompra.textContent = `Total: $${total.toLocaleString("es-CL")}`;
}

function validarFormulario(nombre, direccion, correo, telefono) {
  const correoValido = correo.includes("@") && correo.includes(".");
  const telefonoValido = /^[0-9]{8,12}$/.test(telefono);

  if (nombre.trim() === "" || direccion.trim() === "") {
    return "Debe completar nombre y dirección.";
  }

  if (!correoValido) {
    return "Debe ingresar un correo electrónico válido.";
  }

  if (!telefonoValido) {
    return "El teléfono debe contener solo números y tener entre 8 y 12 dígitos.";
  }

  return null;
}

document.getElementById("formCompra").addEventListener("submit", function(evento) {
  evento.preventDefault();

  const carrito = obtenerCarrito();
  const confirmacion = document.getElementById("confirmacion");

  if (carrito.length === 0) {
    confirmacion.className = "error";
    confirmacion.innerHTML = "Debe agregar productos al carrito antes de finalizar la compra.";
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;

  const error = validarFormulario(nombre, direccion, correo, telefono);

  if (error) {
    confirmacion.className = "error";
    confirmacion.innerHTML = error;
    return;
  }

  let total = 0;
  let detalle = "";

  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    detalle += `
      <li>${producto.nombre} - Cantidad: ${producto.cantidad} - Subtotal: $${subtotal.toLocaleString("es-CL")}</li>
    `;
  });

  confirmacion.className = "exito";
  confirmacion.innerHTML = `
    <h3>Gracias por tu compra, ${nombre}</h3>
    <p>El pedido será enviado a: ${direccion}</p>
    <p>Correo de contacto: ${correo}</p>
    <p>Teléfono: ${telefono}</p>
    <h4>Detalle del pedido:</h4>
    <ul>${detalle}</ul>
    <strong>Total pagado: $${total.toLocaleString("es-CL")}</strong>
  `;

  sessionStorage.removeItem("carrito");
  mostrarCarrito();
});

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("logoutBtn").addEventListener("click", logout);

window.onload = iniciarAuth0;