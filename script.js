// Referencias a los elementos del formulario
const form = document.getElementById('registroForm');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const edad = document.getElementById('edad');
const telefono = document.getElementById('telefono');
const pais = document.getElementById('pais');
const terminos = document.getElementById('terminos');
const formMessage = document.getElementById('formMessage');
const progressFill = document.getElementById('progressFill');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

const camposRequeridos = [nombre, correo, password, confirmPassword, edad, telefono, pais, terminos];

// Expresiones regulares utilizadas en las validaciones
const patterns = {
  nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/,
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
  telefono: /^0\d{9}$/
};

// Dispara una pequeña animación de "shake" sobre un elemento
function triggerShake(el) {
  el.classList.remove('shake');
  // Forzar reflow para poder reiniciar la animación
  void el.offsetWidth;
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

// Marca un campo como inválido y muestra su mensaje de error
function showError(input, message) {
  const errorSpan = document.getElementById(`error-${input.id}`);
  if (errorSpan) errorSpan.textContent = message;
  input.classList.add('invalid');
  input.classList.remove('valid');
  triggerShake(input);
}

// Marca un campo como válido y limpia el mensaje de error
function clearError(input) {
  const errorSpan = document.getElementById(`error-${input.id}`);
  if (errorSpan) errorSpan.textContent = '';
  input.classList.remove('invalid');
  input.classList.add('valid');
}

// Calcula cuántos campos requeridos están completos y válidos para animar la barra de progreso
function updateProgress() {
  const completados = camposRequeridos.filter(campo => {
    if (campo.type === 'checkbox') return campo.checked;
    return campo.classList.contains('valid');
  }).length;

  const porcentaje = Math.round((completados / camposRequeridos.length) * 100);
  progressFill.style.width = `${porcentaje}%`;
}

function validateNombre() {
  if (!patterns.nombre.test(nombre.value.trim())) {
    showError(nombre, 'Ingresa un nombre válido (mínimo 3 letras)');
    updateProgress();
    return false;
  }
  clearError(nombre);
  updateProgress();
  return true;
}

function validateCorreo() {
  if (!patterns.correo.test(correo.value.trim())) {
    showError(correo, 'Ingresa un correo electrónico válido');
    updateProgress();
    return false;
  }
  clearError(correo);
  updateProgress();
  return true;
}

// Evalúa qué tan fuerte es la contraseña y anima la barra correspondiente
function updatePasswordStrength() {
  const valor = password.value;
  let puntaje = 0;

  if (valor.length >= 8) puntaje++;
  if (/[A-Z]/.test(valor)) puntaje++;
  if (/\d/.test(valor)) puntaje++;
  if (/[^A-Za-z0-9]/.test(valor)) puntaje++;

  const niveles = [
    { ancho: '0%', color: 'transparent', texto: '' },
    { ancho: '25%', color: '#dc2626', texto: 'Débil' },
    { ancho: '50%', color: '#f59e0b', texto: 'Media' },
    { ancho: '75%', color: '#3b82f6', texto: 'Buena' },
    { ancho: '100%', color: '#16a34a', texto: 'Fuerte' }
  ];

  const nivel = valor === '' ? niveles[0] : niveles[puntaje];
  strengthFill.style.width = nivel.ancho;
  strengthFill.style.backgroundColor = nivel.color;
  strengthText.textContent = nivel.texto;
  strengthText.style.color = nivel.color === 'transparent' ? 'var(--color-text-light)' : nivel.color;
}

function validatePassword() {
  updatePasswordStrength();

  if (!patterns.password.test(password.value)) {
    showError(password, 'Mínimo 8 caracteres: mayúscula, número y carácter especial (ej: !@#$)');
    updateProgress();
    return false;
  }
  clearError(password);
  // Si ya se había escrito la confirmación, se vuelve a verificar
  if (confirmPassword.value) validateConfirmPassword();
  updateProgress();
  return true;
}

function validateConfirmPassword() {
  if (confirmPassword.value === '' || confirmPassword.value !== password.value) {
    showError(confirmPassword, 'Las contraseñas no coinciden');
    updateProgress();
    return false;
  }
  clearError(confirmPassword);
  updateProgress();
  return true;
}

function validateEdad() {
  const valor = Number(edad.value);
  if (!edad.value || valor < 18 || valor > 99) {
    showError(edad, 'Ingresa una edad entre 18 y 99 años');
    updateProgress();
    return false;
  }
  clearError(edad);
  updateProgress();
  return true;
}

function validateTelefono() {
  if (!patterns.telefono.test(telefono.value.trim())) {
    showError(telefono, 'Formato inválido: 10 dígitos, inicia con 0');
    updateProgress();
    return false;
  }
  clearError(telefono);
  updateProgress();
  return true;
}

function validatePais() {
  if (!pais.value) {
    showError(pais, 'Selecciona un país');
    updateProgress();
    return false;
  }
  clearError(pais);
  updateProgress();
  return true;
}

function validateTerminos() {
  const errorSpan = document.getElementById('error-terminos');
  if (!terminos.checked) {
    errorSpan.textContent = 'Debes aceptar los términos para continuar';
    updateProgress();
    return false;
  }
  errorSpan.textContent = '';
  updateProgress();
  return true;
}

// Validación en tiempo real mientras el usuario escribe
nombre.addEventListener('input', validateNombre);
edad.addEventListener('input', validateEdad);
password.addEventListener('input', validatePassword);
confirmPassword.addEventListener('input', validateConfirmPassword);

// Validación al perder el foco (blur), y corrección en vivo si ya había error
correo.addEventListener('blur', validateCorreo);
correo.addEventListener('input', () => {
  if (correo.classList.contains('invalid')) validateCorreo();
});

telefono.addEventListener('blur', validateTelefono);
telefono.addEventListener('input', () => {
  if (telefono.classList.contains('invalid')) validateTelefono();
});

pais.addEventListener('change', validatePais);
terminos.addEventListener('change', validateTerminos);

// Botones para mostrar/ocultar contraseña
document.querySelectorAll('.toggle-password').forEach(boton => {
  boton.addEventListener('click', () => {
    const targetInput = document.getElementById(boton.dataset.target);
    const esVisible = targetInput.type === 'text';
    targetInput.type = esVisible ? 'password' : 'text';
    boton.setAttribute('aria-label', esVisible ? 'Mostrar contraseña' : 'Ocultar contraseña');
    boton.classList.toggle('active', !esVisible);
  });
});

// Efecto ripple al hacer clic en el botón de envío
const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', function (e) {
  const rect = submitBtn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);

  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

  submitBtn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// Validación final al enviar el formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const resultados = [
    validateNombre(),
    validateCorreo(),
    validatePassword(),
    validateConfirmPassword(),
    validateEdad(),
    validateTelefono(),
    validatePais(),
    validateTerminos()
  ];

  const formularioValido = resultados.every(Boolean);

  if (formularioValido) {
    formMessage.innerHTML = `
      <svg class="check-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Registro exitoso. ¡Bienvenido/a!`;
    formMessage.className = 'form-message success';

    setTimeout(() => {
      form.reset();
      document.querySelectorAll('input, select').forEach(el => el.classList.remove('valid', 'invalid'));
      strengthFill.style.width = '0%';
      strengthText.textContent = '';
      progressFill.style.width = '0%';
    }, 1800);
  } else {
    formMessage.textContent = 'Revisa los campos marcados en rojo antes de continuar.';
    formMessage.className = 'form-message error';
  }
});