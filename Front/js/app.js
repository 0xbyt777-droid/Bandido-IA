// 1. CONFIGURACIÓN
// Nota: Asegúrate de que estas llaves sean las correctas de tu panel de Supabase
// Asegúrate de que los nombres sean EXACTOS a los de Vercel
const SUPABASE_URL = "https://gkpuchloqugpncomgxhi.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_XwPMObqLa81rMC6kLXwabQ_KT7oGOwZ"; 

// Inicializamos el cliente usando esos mismos nombres
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let selectedTone = "Bandido"; 

// 2. FUNCIÓN PARA SELECCIONAR EL TONO
window.selectTone = function(tono) {
    selectedTone = tono;
    console.log("Tono seleccionado:", selectedTone);
    
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.classList.remove('active');
        // Esto busca el texto en el botón para marcarlo como activo
        if(btn.innerText.toLowerCase().includes(tono.toLowerCase())) btn.classList.add('active');
    });
}

// 3. FUNCIÓN PARA PREVISUALIZAR E INICIAR ANÁLISIS
window.previewImage = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('image-preview');
        preview.src = reader.result;
        document.getElementById('image-preview-container').classList.remove('hidden');
        
        // Enviar a la IA (quitamos el encabezado data:image/...)
        analyzeImage(reader.result.split(',')[1]);
    }
    reader.readAsDataURL(file);
}

// 4. EL CEREBRO: LLAMADA A LA EDGE FUNCTION
async function analyzeImage(base64Data) {
    const responseText = document.getElementById('response-text');
    const responseSection = document.getElementById('response-section');
    
    // Feedback visual
    responseText.innerText = "Johnny Bravo está analizando tu facha en tono " + selectedTone + "...";
    responseSection.classList.remove('hidden');

    try {
        // Invocamos la función 'bandido-analyzer'
        const { data, error } = await supabaseClient.functions.invoke('bandido-analyzer', {
            body: { 
                image: base64Data, 
                tono: selectedTone 
            }
        });

        if (error) throw error;

        // --- EXPLICACIÓN DEL CAMBIO ---
        // Usamos 'data.analysis' porque así lo definimos en el index.ts de la Edge Function
        if (data && data.analysis) {
            responseText.innerText = data.analysis;
        } else {
            responseText.innerText = "Mano, la IA respondió pero no soltó el floro. Intenta otra vez.";
        }

    } catch (err) {
        console.error("Error detallado:", err);
        responseText.innerText = "¡Error fatal! Asegúrate de que GEMINI_API_KEY esté en los Secrets de Supabase.";
    }
}

// 5. FUNCIÓN PARA COPIAR
window.copyResponse = function() {
    const text = document.getElementById('response-text').innerText;
    navigator.clipboard.writeText(text);
    alert("¡Floro copiado!");
}