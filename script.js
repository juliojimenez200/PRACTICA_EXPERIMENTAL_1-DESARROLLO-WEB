const card = document.getElementById("card");
const form = document.getElementById("registroForm");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const telefono = document.getElementById("telefono");
const pais = document.getElementById("pais");
const otroPais = document.getElementById("otroPais");
const otroPaisGroup = document.getElementById("otroPaisGroup");
const terminos = document.getElementById("terminos");
const formMessage = document.getElementById("formMessage");
const progressFill = document.getElementById("progressFill");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const submitBtn = document.getElementById("submitBtn");

const camposRequeridos = [
  nombre,
  correo,
  password,
  confirmPassword,
  fechaNacimiento,
  telefono,
  pais,
  terminos,
];

const patterns = {
  nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/,
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
  telefono: /^0\d{9}$/,
};
const codigosPaises = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW`;
const normalizarPais = (valor) =>
  valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase();
const nombresPais = new Set();
const nombresPaisEspanol = new Intl.DisplayNames(["es"], { type: "region" });
const nombresPaisIngles = new Intl.DisplayNames(["en"], { type: "region" });
codigosPaises.split(" ").forEach((codigo) => {
  const nombre = nombresPaisEspanol.of(codigo);
  const nombreIngles = nombresPaisIngles.of(codigo);
  if (nombre && nombre !== codigo) {
    nombresPais.add(normalizarPais(nombre));
  }
  if (nombreIngles && nombreIngles !== codigo) {
    nombresPais.add(normalizarPais(nombreIngles));
  }
});

function toISO(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
const hoy = new Date();
const maxFecha = new Date(
  hoy.getFullYear() - 18,
  hoy.getMonth(),
  hoy.getDate(),
);
fechaNacimiento.max = toISO(maxFecha);
fechaNacimiento.min = "1900-01-01";

function calcularEdad(valor) {
  const [y, m, d] = valor.split("-").map(Number);
  let edad = hoy.getFullYear() - y;
  const antesDeCumple =
    hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d);
  if (antesDeCumple) edad--;
  return edad;
}

function vibrar(el, patron = [60, 40, 60]) {
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
  el.addEventListener("animationend", () => el.classList.remove("shake"), {
    once: true,
  });
  if (navigator.vibrate) navigator.vibrate(patron);
}

function showError(input, message, shake = true) {
  const span = document.getElementById(`error-${input.id}`);
  if (span) span.textContent = message;
  input.classList.add("invalid");
  input.classList.remove("valid");
  if (shake) vibrar(input);
}

function clearError(input) {
  const span = document.getElementById(`error-${input.id}`);
  if (span) span.textContent = "";
  input.classList.remove("invalid");
  input.classList.add("valid");
}

function updateProgress() {
  const completados = camposRequeridos.filter((c) =>
    c.type === "checkbox" ? c.checked : c.classList.contains("valid"),
  ).length;
  progressFill.style.width = `${Math.round((completados / camposRequeridos.length) * 100)}%`;
}

function validateNombre(shake = false) {
  if (!patterns.nombre.test(nombre.value.trim())) {
    showError(nombre, "Ingresa un nombre válido (mínimo 3 letras)", shake);
    updateProgress();
    return false;
  }
  clearError(nombre);
  updateProgress();
  return true;
}

function validateCorreo(shake = false) {
  if (!patterns.correo.test(correo.value.trim())) {
    showError(correo, "Ingresa un correo electrónico válido", shake);
    updateProgress();
    return false;
  }
  clearError(correo);
  updateProgress();
  return true;
}

function updatePasswordStrength() {
  const v = password.value;
  let puntaje = 0;
  if (v.length >= 8) puntaje++;
  if (/[A-Z]/.test(v)) puntaje++;
  if (/\d/.test(v)) puntaje++;
  if (/[^A-Za-z0-9]/.test(v)) puntaje++;
  const niveles = [
    { ancho: "0%", color: "transparent", texto: "" },
    { ancho: "25%", color: "#dc2626", texto: "Débil" },
    { ancho: "50%", color: "#f59e0b", texto: "Media" },
    { ancho: "75%", color: "#3b82f6", texto: "Buena" },
    { ancho: "100%", color: "#16a34a", texto: "Fuerte" },
  ];
  const n = v === "" ? niveles[0] : niveles[puntaje];
  strengthFill.style.width = n.ancho;
  strengthFill.style.backgroundColor = n.color;
  strengthText.textContent = n.texto;
  strengthText.style.color =
    n.color === "transparent" ? "var(--color-text-light)" : n.color;
}

function validatePassword(shake = false) {
  updatePasswordStrength();
  if (!patterns.password.test(password.value)) {
    showError(
      password,
      "Mínimo 8 caracteres: mayúscula, número y carácter especial (ej: !@#$)",
      shake,
    );
    updateProgress();
    return false;
  }
  clearError(password);
  if (confirmPassword.value) validateConfirmPassword();
  updateProgress();
  return true;
}

function validateConfirmPassword(shake = false) {
  if (
    confirmPassword.value === "" ||
    confirmPassword.value !== password.value
  ) {
    showError(confirmPassword, "Las contraseñas no coinciden", shake);
    updateProgress();
    return false;
  }
  clearError(confirmPassword);
  updateProgress();
  return true;
}

function validateFechaNacimiento(shake = false) {
  const valor = fechaNacimiento.value;
  if (!valor) {
    showError(fechaNacimiento, "Ingresa tu fecha de nacimiento", shake);
    updateProgress();
    return false;
  }
  const fecha = new Date(valor + "T00:00:00");
  if (isNaN(fecha) || fecha > hoy) {
    showError(fechaNacimiento, "La fecha no es válida", shake);
    updateProgress();
    return false;
  }
  const edad = calcularEdad(valor);
  if (edad < 18) {
    showError(fechaNacimiento, "Debes ser mayor de 18 años", shake);
    updateProgress();
    return false;
  }
  if (edad > 99) {
    showError(fechaNacimiento, "Ingresa una fecha de nacimiento válida", shake);
    updateProgress();
    return false;
  }
  clearError(fechaNacimiento);
  updateProgress();
  return true;
}

function validateTelefono(shake = false) {
  if (!patterns.telefono.test(telefono.value.trim())) {
    showError(telefono, "Formato inválido: 10 dígitos, inicia con 0", shake);
    updateProgress();
    return false;
  }
  clearError(telefono);
  updateProgress();
  return true;
}

function validatePais(shake = false) {
  if (!pais.value) {
    clearError(otroPais);
    showError(pais, "Selecciona un país", shake);
    updateProgress();
    return false;
  }
  if (pais.value === "Otro") {
    const nombreEscrito = normalizarPais(otroPais.value);
    if (!nombreEscrito || !nombresPais.has(nombreEscrito)) {
      showError(otroPais, "Escribe un país válido", shake);
      pais.classList.remove("valid");
      updateProgress();
      return false;
    }
    clearError(otroPais);
  } else {
    clearError(otroPais);
  }
  clearError(pais);
  updateProgress();
  return true;
}

function validateTerminos(shake = false) {
  const span = document.getElementById("error-terminos");
  const box = terminos.parentElement.querySelector(".checkbox-box");
  if (!terminos.checked) {
    span.textContent = "Debes aceptar los términos para continuar";
    if (shake) vibrar(box);
    updateProgress();
    return false;
  }
  span.textContent = "";
  updateProgress();
  return true;
}

const reglas = [
  [nombre, validateNombre],
  [correo, validateCorreo],
  [password, validatePassword],
  [confirmPassword, validateConfirmPassword],
  [fechaNacimiento, validateFechaNacimiento],
  [telefono, validateTelefono],
];
reglas.forEach(([el, fn]) => {
  el.addEventListener("input", () => {
    if (el.classList.contains("invalid") || el.value) fn(false);
  });
  el.addEventListener("blur", () => {
    if (el.value) fn(true);
  });
});
fechaNacimiento.addEventListener("change", () => validateFechaNacimiento(true));
function actualizarCampoOtroPais() {
  const mostrar = pais.value === "Otro";
  otroPaisGroup.hidden = !mostrar;
  if (!mostrar) otroPais.value = "";
  validatePais(false);
}
pais.addEventListener("change", actualizarCampoOtroPais);
otroPais.addEventListener("input", () => {
  if (pais.value === "Otro") validatePais(false);
});
otroPais.addEventListener("blur", () => {
  if (pais.value === "Otro" && otroPais.value) validatePais(true);
});
terminos.addEventListener("change", () => validateTerminos(false));

document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    btn.setAttribute(
      "aria-label",
      visible ? "Mostrar contraseña" : "Ocultar contraseña",
    );
    btn.classList.toggle("active", !visible);
  });
});

submitBtn.addEventListener("click", (e) => {
  const rect = submitBtn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  submitBtn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const resultados = [
    validateNombre(true),
    validateCorreo(true),
    validatePassword(true),
    validateConfirmPassword(true),
    validateFechaNacimiento(true),
    validateTelefono(true),
    validatePais(true),
    validateTerminos(true),
  ];
  if (resultados.every(Boolean)) {
    formMessage.textContent = "✔ Registro exitoso. ¡Bienvenido/a!";
    formMessage.className = "form-message success";
    setTimeout(() => {
      form.reset();
      otroPaisGroup.hidden = true;
      otroPais.value = "";
      document
        .querySelectorAll("input, select")
        .forEach((el) => el.classList.remove("valid", "invalid"));
      strengthFill.style.width = "0%";
      strengthText.textContent = "";
      progressFill.style.width = "0%";
      formMessage.className = "form-message";
      formMessage.textContent = "";
    }, 2500);
  } else {
    formMessage.textContent =
      "Revisa los campos marcados en rojo antes de continuar.";
    formMessage.className = "form-message error";
    vibrar(card, [100, 50, 100, 50, 100]);
    vibrar(submitBtn, [100, 50, 100]);
  }
});
