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
    terminos
];


const patterns = {

    nombre:
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{3,50}$/,

    correo:
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    password:
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,

    telefono:
        /^0\d{9}$/
};


const codigosPaises = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS
BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN
CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE
EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF
GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM
HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM
JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC
LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK
ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA
NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG
PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS
ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO
TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI
VN VU WF WS YE YT ZA ZM ZW
`;


function normalizarPais(valor) {

    return valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}


const nombresPais = new Set();

const nombresPaisEspanol =
    new Intl.DisplayNames(["es"], {
        type: "region"
    });

const nombresPaisIngles =
    new Intl.DisplayNames(["en"], {
        type: "region"
    });


codigosPaises
    .trim()
    .split(/\s+/)
    .forEach((codigo) => {

        const nombreES =
            nombresPaisEspanol.of(codigo);

        const nombreEN =
            nombresPaisIngles.of(codigo);

        if (nombreES && nombreES !== codigo) {

            nombresPais.add(
                normalizarPais(nombreES)
            );
        }

        if (nombreEN && nombreEN !== codigo) {

            nombresPais.add(
                normalizarPais(nombreEN)
            );
        }
    });


function toISO(fecha) {

    const mes =
        String(fecha.getMonth() + 1)
            .padStart(2, "0");

    const dia =
        String(fecha.getDate())
            .padStart(2, "0");

    return `${fecha.getFullYear()}-${mes}-${dia}`;
}


function obtenerHoy() {
    return new Date();
}


function calcularEdad(valor) {

    const [anio, mes, dia] =
        valor.split("-").map(Number);

    const hoy =
        obtenerHoy();

    let edad =
        hoy.getFullYear() - anio;

    const antesDeCumpleanos =
        hoy.getMonth() + 1 < mes ||
        (
            hoy.getMonth() + 1 === mes &&
            hoy.getDate() < dia
        );

    if (antesDeCumpleanos) {
        edad--;
    }

    return edad;
}


function configurarFechaNacimiento() {

    const hoy =
        obtenerHoy();


    const maxFecha =
        new Date(
            hoy.getFullYear() - 18,
            hoy.getMonth(),
            hoy.getDate()
        );


    const minFecha =
        new Date(
            hoy.getFullYear() - 99,
            hoy.getMonth(),
            hoy.getDate()
        );


    fechaNacimiento.max =
        toISO(maxFecha);

    fechaNacimiento.min =
        toISO(minFecha);
}


configurarFechaNacimiento();


function vibrar(
    elemento,
    patron = [60, 40, 60]
) {

    elemento.classList.remove("shake");

    void elemento.offsetWidth;

    elemento.classList.add("shake");


    elemento.addEventListener(
        "animationend",
        () => {
            elemento.classList.remove("shake");
        },
        {
            once: true
        }
    );


    if (navigator.vibrate) {
        navigator.vibrate(patron);
    }
}


function showError(
    input,
    mensaje,
    shake = true
) {

    const span =
        document.getElementById(
            `error-${input.id}`
        );


    if (span) {
        span.textContent =
            mensaje;
    }


    input.classList.add("invalid");

    input.classList.remove("valid");


    input.setAttribute(
        "aria-invalid",
        "true"
    );


    if (shake) {
        vibrar(input);
    }
}


function clearError(input) {

    const span =
        document.getElementById(
            `error-${input.id}`
        );


    if (span) {
        span.textContent = "";
    }


    input.classList.remove("invalid");

    input.classList.add("valid");


    input.setAttribute(
        "aria-invalid",
        "false"
    );
}


function updateProgress() {

    const completados =
        camposRequeridos.filter(
            (campo) => {

                if (
                    campo.type ===
                    "checkbox"
                ) {
                    return campo.checked;
                }

                return campo.classList.contains(
                    "valid"
                );
            }
        ).length;


    const porcentaje =
        Math.round(
            (
                completados /
                camposRequeridos.length
            ) * 100
        );


    progressFill.style.width =
        `${porcentaje}%`;


    const progressBar =
        document.querySelector(
            ".progress-track"
        );


    if (progressBar) {

        progressBar.setAttribute(
            "aria-valuenow",
            porcentaje
        );
    }
}


function validateNombre(
    shake = false
) {

    const valor =
        nombre.value.trim();


    if (
        !patterns.nombre.test(valor)
    ) {

        showError(
            nombre,
            "Ingresa un nombre válido (mínimo 3 letras).",
            shake
        );

        updateProgress();

        return false;
    }


    clearError(nombre);

    updateProgress();

    return true;
}


function validateCorreo(
    shake = false
) {

    const valor =
        correo.value.trim();


    if (
        !patterns.correo.test(valor)
    ) {

        showError(
            correo,
            "Ingresa un correo electrónico válido.",
            shake
        );

        updateProgress();

        return false;
    }


    clearError(correo);

    updateProgress();

    return true;
}


function updatePasswordStrength() {

    const valor =
        password.value;

    let puntaje = 0;


    if (valor.length >= 8) {
        puntaje++;
    }


    if (/[A-Z]/.test(valor)) {
        puntaje++;
    }


    if (/\d/.test(valor)) {
        puntaje++;
    }


    if (
        /[^A-Za-z0-9]/.test(valor)
    ) {
        puntaje++;
    }


    const niveles = [

        {
            ancho: "0%",
            color: "transparent",
            texto: ""
        },

        {
            ancho: "25%",
            color: "#dc2626",
            texto: "Débil"
        },

        {
            ancho: "50%",
            color: "#f59e0b",
            texto: "Media"
        },

        {
            ancho: "75%",
            color: "#3b82f6",
            texto: "Buena"
        },

        {
            ancho: "100%",
            color: "#16a34a",
            texto: "Fuerte"
        }
    ];


    const nivel =
        valor === ""
            ? niveles[0]
            : niveles[puntaje];


    strengthFill.style.width =
        nivel.ancho;


    strengthFill.style.backgroundColor =
        nivel.color;


    strengthText.textContent =
        nivel.texto;


    strengthText.style.color =
        nivel.color === "transparent"
            ? "var(--color-text-light)"
            : nivel.color;
}


function validatePassword(
    shake = false
) {

    updatePasswordStrength();


    if (
        !patterns.password.test(
            password.value
        )
    ) {

        showError(
            password,
            "Mínimo 8 caracteres: una mayúscula, un número y un carácter especial.",
            shake
        );

        updateProgress();

        return false;
    }


    clearError(password);


    if (confirmPassword.value) {

        validateConfirmPassword(false);
    }


    updateProgress();

    return true;
}


function validateConfirmPassword(
    shake = false
) {

    if (
        confirmPassword.value === "" ||
        confirmPassword.value !==
        password.value
    ) {

        showError(
            confirmPassword,
            "Las contraseñas no coinciden.",
            shake
        );

        updateProgress();

        return false;
    }


    clearError(confirmPassword);

    updateProgress();

    return true;
}


function validateFechaNacimiento(
    shake = false
) {

    const valor =
        fechaNacimiento.value;


    if (!valor) {

        showError(
            fechaNacimiento,
            "Ingresa tu fecha de nacimiento.",
            shake
        );

        updateProgress();

        return false;
    }


    const fecha =
        new Date(
            `${valor}T00:00:00`
        );


    if (
        isNaN(fecha.getTime())
    ) {

        showError(
            fechaNacimiento,
            "La fecha no es válida.",
            shake
        );

        updateProgress();

        return false;
    }


    const hoy =
        obtenerHoy();


    if (fecha > hoy) {

        showError(
            fechaNacimiento,
            "La fecha no puede ser futura.",
            shake
        );

        updateProgress();

        return false;
    }


    const edad =
        calcularEdad(valor);


    if (edad < 18) {

        showError(
            fechaNacimiento,
            "Debes ser mayor de 18 años.",
            shake
        );

        updateProgress();

        return false;
    }


    if (edad > 99) {

        showError(
            fechaNacimiento,
            "Ingresa una fecha de nacimiento válida.",
            shake
        );

        updateProgress();

        return false;
    }


    clearError(fechaNacimiento);

    updateProgress();

    return true;
}


function validateTelefono(
    shake = false
) {

    const valor =
        telefono.value.trim();


    if (
        !patterns.telefono.test(valor)
    ) {

        showError(
            telefono,
            "Ingresa 10 dígitos y comienza con 0.",
            shake
        );

        updateProgress();

        return false;
    }


    clearError(telefono);

    updateProgress();

    return true;
}


function validatePais(
    shake = false
) {

    if (!pais.value) {

        showError(
            pais,
            "Selecciona un país.",
            shake
        );

        updateProgress();

        return false;
    }


    if (pais.value === "Otro") {

        const nombreEscrito =
            normalizarPais(
                otroPais.value
            );


        if (
            !nombreEscrito ||
            !nombresPais.has(
                nombreEscrito
            )
        ) {

            showError(
                otroPais,
                "Escribe un país válido.",
                shake
            );

            pais.classList.remove(
                "valid"
            );

            updateProgress();

            return false;
        }


        clearError(otroPais);

    } else {

        otroPais.classList.remove(
            "valid",
            "invalid"
        );


        const errorOtroPais =
            document.getElementById(
                "error-otroPais"
            );


        if (errorOtroPais) {
            errorOtroPais.textContent = "";
        }
    }


    clearError(pais);

    updateProgress();

    return true;
}


function actualizarCampoOtroPais() {

    const mostrar =
        pais.value === "Otro";


    otroPaisGroup.hidden =
        !mostrar;


    if (!mostrar) {

        otroPais.value = "";

        otroPais.classList.remove(
            "valid",
            "invalid"
        );


        const error =
            document.getElementById(
                "error-otroPais"
            );


        if (error) {
            error.textContent = "";
        }
    }


    validatePais(false);
}


pais.addEventListener(
    "change",
    actualizarCampoOtroPais
);


otroPais.addEventListener(
    "input",
    () => {

        if (
            pais.value === "Otro"
        ) {

            validatePais(false);
        }
    }
);


otroPais.addEventListener(
    "blur",
    () => {

        if (
            pais.value === "Otro" &&
            otroPais.value
        ) {

            validatePais(true);
        }
    }
);


function validateTerminos(
    shake = false
) {

    const span =
        document.getElementById(
            "error-terminos"
        );


    const box =
        terminos.parentElement.querySelector(
            ".checkbox-box"
        );


    if (!terminos.checked) {

        span.textContent =
            "Debes aceptar los términos para continuar.";


        terminos.setAttribute(
            "aria-invalid",
            "true"
        );


        if (shake) {
            vibrar(box);
        }


        updateProgress();

        return false;
    }


    span.textContent = "";


    terminos.setAttribute(
        "aria-invalid",
        "false"
    );


    updateProgress();

    return true;
}


terminos.addEventListener(
    "change",
    () => validateTerminos(false)
);


const reglas = [

    [nombre, validateNombre],

    [correo, validateCorreo],

    [password, validatePassword],

    [
        confirmPassword,
        validateConfirmPassword
    ],

    [
        fechaNacimiento,
        validateFechaNacimiento
    ],

    [telefono, validateTelefono]
];


reglas.forEach(
    ([elemento, funcion]) => {

        elemento.addEventListener(
            "input",
            () => {

                if (
                    elemento.classList.contains(
                        "invalid"
                    ) ||
                    elemento.value
                ) {

                    funcion(false);
                }
            }
        );


        elemento.addEventListener(
            "blur",
            () => {

                if (
                    elemento.value
                ) {

                    funcion(true);
                }
            }
        );
    }
);


fechaNacimiento.addEventListener(
    "change",
    () =>
        validateFechaNacimiento(true)
);


document
    .querySelectorAll(
        ".toggle-password"
    )
    .forEach((boton) => {

        boton.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        boton.dataset.target
                    );


                const visible =
                    input.type === "text";


                input.type =
                    visible
                        ? "password"
                        : "text";


                boton.setAttribute(
                    "aria-label",
                    visible
                        ? "Mostrar contraseña"
                        : "Ocultar contraseña"
                );


                boton.setAttribute(
                    "aria-pressed",
                    String(!visible)
                );


                boton.classList.toggle(
                    "active",
                    !visible
                );
            }
        );
    });


submitBtn.addEventListener(
    "click",
    (evento) => {

        if (submitBtn.disabled) {
            return;
        }


        const rect =
            submitBtn.getBoundingClientRect();


        const size =
            Math.max(
                rect.width,
                rect.height
            );


        const ripple =
            document.createElement(
                "span"
            );


        ripple.className =
            "ripple";


        ripple.style.width =
            `${size}px`;


        ripple.style.height =
            `${size}px`;


        ripple.style.left =
            `${evento.clientX -
                rect.left -
                size / 2}px`;


        ripple.style.top =
            `${evento.clientY -
                rect.top -
                size / 2}px`;


        submitBtn.appendChild(
            ripple
        );


        ripple.addEventListener(
            "animationend",
            () => ripple.remove(),
            {
                once: true
            }
        );
    }
);


form.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const resultados = [

            validateNombre(true),

            validateCorreo(true),

            validatePassword(true),

            validateConfirmPassword(true),

            validateFechaNacimiento(true),

            validateTelefono(true),

            validatePais(true),

            validateTerminos(true)
        ];


        if (
            resultados.every(Boolean)
        ) {

            submitBtn.disabled =
                true;


            formMessage.textContent =
                "Procesando registro...";


            formMessage.className =
                "form-message";


            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        500
                    )
            );


            formMessage.textContent =
                "✔ Registro exitoso. ¡Bienvenido/a!";


            formMessage.className =
                "form-message success";


            submitBtn.disabled =
                false;


            
            setTimeout(
                () => {

                    form.reset();


                    otroPaisGroup.hidden =
                        true;


                    otroPais.value =
                        "";


                    document
                        .querySelectorAll(
                            "input, select"
                        )
                        .forEach(
                            (elemento) => {

                                elemento.classList.remove(
                                    "valid",
                                    "invalid"
                                );


                                elemento.removeAttribute(
                                    "aria-invalid"
                                );
                            }
                        );


                    strengthFill.style.width =
                        "0%";


                    strengthFill.style.backgroundColor =
                        "transparent";


                    strengthText.textContent =
                        "";


                    progressFill.style.width =
                        "0%";


                    const progressBar =
                        document.querySelector(
                            ".progress-track"
                        );


                    if (progressBar) {

                        progressBar.setAttribute(
                            "aria-valuenow",
                            "0"
                        );
                    }


                    formMessage.className =
                        "form-message";


                    formMessage.textContent =
                        "";

                },
                2500
            );


        } else {

            
            formMessage.textContent =
                "Revisa los campos marcados en rojo antes de continuar.";


            formMessage.className =
                "form-message error";


            vibrar(
                card,
                [100, 50, 100, 50, 100]
            );


            vibrar(
                submitBtn,
                [100, 50, 100]
            );
        }
    }
);



document
    .querySelectorAll(
        "input, select"
    )
    .forEach((elemento) => {

        elemento.setAttribute(
            "aria-invalid",
            "false"
        );
    });


updateProgress();

updatePasswordStrength();