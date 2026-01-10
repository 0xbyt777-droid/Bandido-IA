// Variables globales para rastrear el estado
let imageLoaded = false;
let toneSelected = ""; // Guardamos el nombre del tono seleccionado

/**
 * Procesa la imagen subida y muestra la vista previa
 */
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('image-preview');
        output.src = reader.result;
        
        // Mostrar el contenedor de la imagen
        document.getElementById('image-preview-container').classList.remove('hidden');
        
        imageLoaded = true;
        checkConditions();
    }
    reader.readAsDataURL(file);
}

/**
 * Maneja la selección de tonos y el estilo visual de los botones
 */
function selectTone(tone) {
    console.log("Tono seleccionado:", tone);
    toneSelected = tone;

    // 1. Quitar la clase 'active' de todos los botones de tono
    const buttons = document.querySelectorAll('.tone-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 2. Agregar la clase 'active' solo al botón clickeado
    // Buscamos el botón que contiene el texto del tono
    buttons.forEach(btn => {
        if (btn.innerText.includes(tone)) {
            btn.classList.add('active');
        }
    });

    checkConditions();
}

/**
 * Verifica si ya podemos mostrar la respuesta o llamar a la IA
 */
function checkConditions() {
    if (imageLoaded && toneSelected !== "") {
        const responseSection = document.getElementById('response-section');
        
        // Mostramos la sección de respuesta
        responseSection.classList.remove('hidden');
        
        // Efecto visual: Scroll suave hacia la respuesta
        responseSection.scrollIntoView({ behavior: 'smooth' });

        // Nota: Aquí es donde más adelante llamaremos a llamarAGemini()
        console.log("Listo para procesar con Gemini en tono:", toneSelected);
    }
}

/**
 * Copia el resultado al portapapeles
 */
function copyResponse() {
    const text = document.getElementById('response-text').innerText;
    
    if (!text || text.includes("Aquí aparecerá")) {
        alert("¡Primero genera un floro, bandido!");
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        // Feedback visual al copiar
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerText;
        
        copyBtn.innerText = "¡Copiado! 🔥";
        copyBtn.style.background = "#4CAF50"; // Cambia a verde temporalmente
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.background = ""; // Vuelve al color original del CSS
        }, 2000);
    });
}