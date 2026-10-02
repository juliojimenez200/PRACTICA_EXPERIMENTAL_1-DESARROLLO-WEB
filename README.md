# Formulario de Registro Web

Formulario de registro de usuario desarrollado con HTML5, CSS3 y JavaScript, con estilos personalizados y validaciones del lado del cliente.

## Tecnologías utilizadas
- HTML5
- CSS3 (Flexbox y Grid)
- JavaScript (manipulación del DOM, eventos y expresiones regulares)

## Funcionalidades
- Formulario con 8 campos: nombre, correo, contraseña, confirmación de contraseña, edad, teléfono, país y aceptación de términos.
- Validación en tiempo real con los eventos `input` y `blur`, y validación final con `submit`.
- Reglas de validación: campos obligatorios, formato de correo, contraseña de mínimo 8 caracteres (con mayúscula y número), coincidencia de contraseñas, rango de edad, formato de teléfono y selección obligatoria de país.
- Mensajes de error específicos por campo y mensaje de confirmación al completar el registro correctamente.
- Bloqueo del envío mientras existan datos inválidos.
- Diseño responsivo adaptado a dispositivos móviles.

### Interacciones y animaciones
- Barra de progreso que se llena según los campos válidos completados.
- Iconos en cada campo que cambian de color al enfocar o validar, con marca de verificación animada.
- Medidor de fortaleza de contraseña (débil / media / buena / fuerte).
- Botón para mostrar u ocultar la contraseña.
- Checkbox de términos personalizado con animación al marcarlo.
- Efecto "shake" en campos con error y efecto ripple en el botón de registro.
- Entrada animada de la tarjeta y los campos, y confirmación visual con ícono de check al registrarse.

## Estructura del proyecto
```
formulario-registro/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Cómo ejecutar
Abrir el archivo `index.html` en cualquier navegador web moderno. No requiere instalación de dependencias.
