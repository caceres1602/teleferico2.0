// SIMTELE-WEB: proyecto académico de simulación.
// Las cuentas y registros se guardan localmente en este navegador.
// No utilizar para monitoreo ni decisiones operativas reales.

const $ = (id) => document.getElementById(id);
const STORAGE_ACCOUNT = "simtele_demo_account";
let cuentaActual = null;
let modoRegistro = false;
let mantenimientos = [];
let sensores = [];
let indiceEdicion = null;

// Acceso y gestión de cuenta (demostración local, no es autenticación segura).
function mostrarPantallaAcceso() {
  $("pantallaAcceso").classList.remove("hidden");
  $("aplicacion").classList.add("hidden");
}
function entrarAplicacion() {
  $("pantallaAcceso").classList.add("hidden");
  $("aplicacion").classList.remove("hidden");
  $("saludoUsuario").textContent = "Hola, " + cuentaActual.nombre;
}
$("mostrarRegistro").addEventListener("click", () => {
  modoRegistro = true;
  $("tituloAcceso").textContent = "Crear cuenta";
  $("botonAcceso").textContent = "Crear cuenta";
  $("mensajeAcceso").textContent = "Completa los datos para crear una cuenta de demostración.";
});
$("mostrarLogin").addEventListener("click", () => {
  modoRegistro = false;
  $("tituloAcceso").textContent = "Bienvenido";
  $("botonAcceso").textContent = "Iniciar sesión";
  $("mensajeAcceso").textContent = "";
});
$("formAcceso").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = $("nombreAcceso").value.trim();
  const clave = $("claveAcceso").value;
  if (nombre.length < 3 || clave.length < 4) {
    $("mensajeAcceso").textContent = "El usuario debe tener al menos 3 caracteres y la contraseña 4.";
    return;
  }
  const guardada = localStorage.getItem(STORAGE_ACCOUNT);
  if (modoRegistro) {
    if (guardada) {
      $("mensajeAcceso").textContent = "Ya existe una cuenta en este navegador. Inicia sesión o elimina la cuenta actual.";
      return;
    }
    cuentaActual = { nombre, clave };
    localStorage.setItem(STORAGE_ACCOUNT, JSON.stringify(cuentaActual));
    $("mensajeAcceso").textContent = "Cuenta creada. Iniciando...";
    entrarAplicacion();
  } else {
    if (!guardada) {
      $("mensajeAcceso").textContent = "No existe una cuenta. Selecciona Crear cuenta.";
      return;
    }
    const datos = JSON.parse(guardada);
    if (datos.nombre === nombre && datos.clave === clave) {
      cuentaActual = datos;
      entrarAplicacion();
    } else {
      $("mensajeAcceso").textContent = "Usuario o contraseña incorrectos.";
    }
  }
});
$("cerrarSesion").addEventListener("click", () => {
  cuentaActual = null;
  $("formAcceso").reset();
  $("mostrarLogin").click();
  mostrarPantallaAcceso();
});
$("abrirCuenta").addEventListener("click", () => {
  $("nuevoNombre").value = cuentaActual.nombre;
  $("nuevaClave").value = "";
  $("mensajeCuenta").textContent = "";
  $("modalCuenta").classList.remove("hidden");
});
$("cerrarModalCuenta").addEventListener("click", () => $("modalCuenta").classList.add("hidden"));
$("modalCuenta").addEventListener("click", (e) => {
  if (e.target === $("modalCuenta")) $("modalCuenta").classList.add("hidden");
});
$("formEditarCuenta").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = $("nuevoNombre").value.trim();
  const clave = $("nuevaClave").value;
  if (nombre.length < 3 || (clave && clave.length < 4)) {
    $("mensajeCuenta").textContent = "El usuario requiere 3 caracteres y la nueva contraseña, al menos 4.";
    return;
  }
  cuentaActual.nombre = nombre;
  if (clave) cuentaActual.clave = clave;
  localStorage.setItem(STORAGE_ACCOUNT, JSON.stringify(cuentaActual));
  $("saludoUsuario").textContent = "Hola, " + cuentaActual.nombre;
  $("mensajeCuenta").textContent = "Los datos de la cuenta fueron actualizados.";
  $("nuevaClave").value = "";
});
$("eliminarCuenta").addEventListener("click", () => {
  if (!confirm("¿Seguro que deseas eliminar la cuenta de demostración?")) return;
  localStorage.removeItem(STORAGE_ACCOUNT);
  cuentaActual = null;
  $("modalCuenta").classList.add("hidden");
  $("formAcceso").reset();
  $("mostrarLogin").click();
  mostrarPantallaAcceso();
  $("mensajeAcceso").textContent = "La cuenta local fue eliminada.";
});

// Módulo 1: distancia durante la reacción: d = (v / 3.6) * t.
$("formEmergencia").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = parseFloat($("velocidad").value);
  const t = parseFloat($("reaccion").value);
  if (!Number.isFinite(v) || !Number.isFinite(t) || v < 0 || v > 120 || t < 0 || t > 30) {
    $("resultadoEmergencia").textContent = "Error: verifica que la velocidad esté entre 0 y 120 y el tiempo entre 0 y 30.";
    return;
  }
  const distancia = (v / 3.6) * t;
  const aviso = distancia >= 30 ? "AVISO DIDÁCTICO: supera o alcanza el umbral ficticio de 30 m." : "Resultado dentro del umbral didáctico ficticio de 30 m.";
  $("resultadoEmergencia").innerHTML = `<strong>Distancia estimada: ${distancia.toFixed(2)} m.</strong><br>${aviso}<br><small>Cálculo educativo, no operativo.</small>`;
});

// Módulo 2: mantenimiento con arreglo de objetos, push, splice y tabla DOM.
function dibujarMantenimientos() {
  const cuerpo = $("tablaMantenimiento");
  cuerpo.innerHTML = "";
  if (mantenimientos.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="4" class="empty-cell">Todavía no hay registros.</td></tr>';
    return;
  }
  mantenimientos.forEach((item, indice) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${escaparHTML(item.componente)}</td><td>${item.horas}</td><td>${item.estado}</td>
      <td><button class="table-action" data-editar="${indice}">Editar</button><button class="table-action delete" data-borrar="${indice}">Eliminar</button></td>`;
    cuerpo.appendChild(fila);
  });
}
function limpiarEdicion() {
  indiceEdicion = null;
  $("formMantenimiento").reset();
  $("guardarMantenimiento").textContent = "Agregar registro";
  $("cancelarEdicion").classList.add("hidden");
}
$("formMantenimiento").addEventListener("submit", (e) => {
  e.preventDefault();
  const componente = $("componente").value.trim();
  const horas = parseFloat($("horas").value);
  const estado = $("estado").value;
  if (!componente || !Number.isFinite(horas) || horas < 0 || horas > 100000 || !estado) {
    alert("Completa los campos con datos válidos.");
    return;
  }
  const registro = { componente, horas, estado };
  if (indiceEdicion === null) mantenimientos.push(registro);
  else mantenimientos[indiceEdicion] = registro;
  limpiarEdicion();
  dibujarMantenimientos();
});
$("tablaMantenimiento").addEventListener("click", (e) => {
  const botonEditar = e.target.closest("[data-editar]");
  const botonBorrar = e.target.closest("[data-borrar]");
  if (botonEditar) {
    indiceEdicion = Number(botonEditar.dataset.editar);
    const item = mantenimientos[indiceEdicion];
    $("componente").value = item.componente;
    $("horas").value = item.horas;
    $("estado").value = item.estado;
    $("guardarMantenimiento").textContent = "Guardar cambios";
    $("cancelarEdicion").classList.remove("hidden");
    $("componente").focus();
  }
  if (botonBorrar) {
    mantenimientos.splice(Number(botonBorrar.dataset.borrar), 1);
    limpiarEdicion();
    dibujarMantenimientos();
  }
});
$("cancelarEdicion").addEventListener("click", limpiarEdicion);

// Módulo 3: cinco mediciones, for, suma, máximo y promedio.
$("formViento").addEventListener("submit", (e) => {
  e.preventDefault();
  const mediciones = [];
  for (let i = 1; i <= 5; i++) {
    const valor = parseFloat($("viento" + i).value);
    if (!Number.isFinite(valor) || valor < 0 || valor > 200) {
      $("resultadoViento").textContent = "Error: cada medición debe ser un número entre 0 y 200 km/h.";
      return;
    }
    mediciones.push(valor);
  }
  let suma = 0;
  let maximo = mediciones[0];
  mediciones.forEach((valor) => {
    suma += valor;
    if (valor > maximo) maximo = valor;
  });
  const promedio = suma / mediciones.length;
  let clasificacion = "Bajo";
  if (promedio >= 40) clasificacion = "Elevado";
  else if (promedio >= 20) clasificacion = "Moderado";
  $("resultadoViento").innerHTML = `<strong>Promedio: ${promedio.toFixed(2)} km/h</strong><br>Máximo: ${maximo.toFixed(2)} km/h<br>Clasificación descriptiva: ${clasificacion}<br><small>Mediciones simuladas: ${mediciones.join(", ")}</small>`;
});

// Módulo 4: RegExp real y validación de campos.
function dibujarSensores() {
  const cuerpo = $("tablaSensores");
  cuerpo.innerHTML = "";
  if (sensores.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="4" class="empty-cell">Todavía no hay sensores registrados.</td></tr>';
    return;
  }
  sensores.forEach((sensor, indice) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${sensor.codigo}</td><td>${escaparHTML(sensor.tipo)}</td><td>${sensor.lectura}</td><td><button class="table-action delete" data-borrar-sensor="${indice}">Eliminar</button></td>`;
    cuerpo.appendChild(fila);
  });
}
$("formSensor").addEventListener("submit", (e) => {
  e.preventDefault();
  const codigo = $("codigoSensor").value.trim().toUpperCase();
  const tipo = $("tipoSensor").value.trim();
  const lecturaTexto = $("lecturaSensor").value.trim();
  const lectura = Number(lecturaTexto);
  const formatoCodigo = /^SEN-\d{3}$/;
  if (!formatoCodigo.test(codigo)) {
    $("mensajeSensor").textContent = "Código inválido. Utiliza el formato SEN-001.";
    return;
  }
  if (!tipo) {
    $("mensajeSensor").textContent = "El tipo de sensor no puede estar vacío.";
    return;
  }
  if (lecturaTexto === "" || !Number.isFinite(lectura)) {
    $("mensajeSensor").textContent = "La lectura debe ser un valor numérico.";
    return;
  }
  if (sensores.some((sensor) => sensor.codigo === codigo)) {
    $("mensajeSensor").textContent = "Ese código ya está registrado.";
    return;
  }
  sensores.push({ codigo, tipo, lectura });
  $("mensajeSensor").textContent = "Sensor validado y registrado correctamente.";
  $("formSensor").reset();
  dibujarSensores();
});
$("tablaSensores").addEventListener("click", (e) => {
  const boton = e.target.closest("[data-borrar-sensor]");
  if (!boton) return;
  sensores.splice(Number(boton.dataset.borrarSensor), 1);
  dibujarSensores();
});

function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[caracter]);
}

// Comenzar en la pantalla de acceso.
mostrarPantallaAcceso();
