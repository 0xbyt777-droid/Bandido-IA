// 1. CONFIGURACIÓN (Cambiamos el nombre para evitar el error de "already declared")
const SUPABASE_URL = "https://jccugrulawykqaoajbew.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_pbrqRfTKgssYDhX16EKxpA_XQ1Vc61X"; 

// Usamos supabaseClient en lugar de solo supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let selectedTone = "Bandido"; 

// 2. FUNCIÓN PARA SELECCIONAR EL TONO
window.selectTone = function(tono) {
    selectedTone = tono;
    console.log("Tono seleccionado:", selectedTone);
    
    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(tono)) btn.classList.add('active');
    });
}

// 3. FUNCIÓN PARA PREVISUALIZAR E INICIAR ANÁLISIS
window.previewImage = function(event) {
    console.log("Subida detectada...");
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        // Mostrar la imagen en el HTML
        const preview = document.getElementById('image-preview');
        preview.src = reader.result;
        document.getElementById('image-preview-container').classList.remove('hidden');
        
        // Enviar a la IA
        analyzeImage(reader.result.split(',')[1]);
    }
    reader.readAsDataURL(file);
}

// 4. EL CEREBRO: LLAMADA A LA EDGE FUNCTION
async function analyzeImage(base64Data) {
    const responseText = document.getElementById('response-text');
    const responseSection = document.getElementById('response-section');
    
    responseText.innerText = "Johnny Bravo está pensando en tono " + selectedTone + "...";
    responseSection.classList.remove('hidden');

    try {
        // IMPORTANTE: Aquí también usamos supabaseClient
        const { data, error } = await supabaseClient.functions.invoke('bandido-analyzer', {
            body: { 
                image: base64Data, 
                tono: selectedTone 
            }
        });

        if (error) throw error;
        responseText.innerText = data.floro;

    } catch (err) {
        console.error("Error detallado:", err);
        responseText.innerText = "Mano, algo falló. Revisa que la función esté activa en Supabase.";
    }
}

// 5. FUNCIÓN PARA COPIAR
window.copyResponse = function() {
    const text = document.getElementById('response-text').innerText;
    navigator.clipboard.writeText(text);
    alert("¡Floro copiado al portapapeles!");
}