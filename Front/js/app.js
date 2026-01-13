/**
 * BANDIDO IA - CONFIGURACIÓN DIRECTA
 */

// 1. CONFIGURACIÓN
const SUPABASE_URL = "https://jccugrulawykqaoajbew.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_pbrqRfTKgssYDhX16EKxpA_XQ1Vc61X"; 

// 2. INICIALIZACIÓN
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// El resto de tu lógica (selectTone, previewImage, analyzeImage) se queda igual...

let selectedTone = "Bandido"; // Tono por defecto

// 2. FUNCIÓN PARA SELECCIONAR EL TONO (La llama tu HTML)
window.selectTone = function(tono) {
    selectedTone = tono;
    
    // Opcional: Feedback visual para saber cuál botón está marcado
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(tono)) btn.classList.add('active');
    });
    
    console.log("Tono seleccionado:", selectedTone);
}

// 3. FUNCIÓN PARA PREVISUALIZAR Y ANALIZAR (La llama tu input file)
window.previewImage = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Mostrar vista previa en el HTML
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('image-preview');
        preview.src = reader.result;
        document.getElementById('image-preview-container').classList.remove('hidden');
        
        // LANZAR EL ANÁLISIS AUTOMÁTICAMENTE O PUEDES CREAR UN BOTÓN APARTE
        analyzeImage(reader.result.split(',')[1]);
    }
    reader.readAsDataURL(file);
}

// 4. EL CEREBRO: LLAMADA A SUPABASE
async function analyzeImage(base64Data) {
    const responseText = document.getElementById('response-text');
    const responseSection = document.getElementById('response-section');
    
    responseText.innerText = "Analizando con estilo " + selectedTone + "...";
    responseSection.classList.remove('hidden');

    try {
        const { data, error } = await supabase.functions.invoke('bandido-analyzer', {
            body: { 
                image: base64Data, 
                tono: selectedTone // <--- AQUÍ LE PASAMOS EL TONO ELEGIDO
            }
        });

        if (error) throw error;

        // Mostrar la respuesta de Gemini
        responseText.innerText = data.floro;

    } catch (err) {
        console.error(err);
        responseText.innerText = "Error al obtener el floro. Revisa la consola.";
    }
}

// 5. FUNCIÓN PARA COPIAR
window.copyResponse = function() {
    const text = document.getElementById('response-text').innerText;
    navigator.clipboard.writeText(text);
    alert("¡Floro copiado!");
}