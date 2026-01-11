/**
 * BANDIDO IA - CLIENTE FRONT-END
 * Este archivo maneja la interfaz y la comunicación con Supabase.
 * Las llaves se dejan vacías para seguridad en GitHub.
 */

// 1. CONFIGURACIÓN (Se llenan en el panel de Vercel/Supabase)
const SUPABASE_URL = ""; 
const SUPABASE_KEY = ""; 

// 2. INICIALIZACIÓN
// Validamos que existan las llaves antes de iniciar
let supabase;
if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.warn("⚠️ Configuración de Supabase ausente. Verifica tus variables de entorno.");
}

// 3. SELECCIÓN DE ELEMENTOS
const imageInput = document.getElementById('imageInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultDiv = document.getElementById('result');

// 4. LÓGICA DE ANÁLISIS
async function analyzeImage() {
    // Verificamos si supabase está listo
    if (!supabase) {
        resultDiv.innerHTML = "<p style='color:orange;'>⚠️ Error: No se han configurado las llaves de conexión.</p>";
        return;
    }

    const file = imageInput.files[0];
    if (!file) {
        alert("Por favor, selecciona una imagen primero.");
        return;
    }

    // Feedback visual
    resultDiv.innerHTML = `
        <div class="loading">
            <p>🔍 Bandido IA analizando objeto...</p>
            <small>Esto puede tardar unos segundos.</small>
        </div>
    `;
    analyzeBtn.disabled = true;

    try {
        // Convertir imagen a Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = async () => {
            const base64Image = reader.result.split(',')[1];

            // LLAMADA A LA IA (Edge Function)
            // 'bandido-analyzer' es el nombre que le daremos a tu función en Supabase
            const { data, error } = await supabase.functions.invoke('bandido-analyzer', {
                body: { image: base64Image }
            });

            if (error) throw error;

            // MOSTRAR RESULTADO
            resultDiv.innerHTML = `
                <div class="response-card">
                    <h3>✅ Resultado:</h3>
                    <p>${data.analysis}</p>
                </div>
            `;
        };

    } catch (err) {
        console.error("Error:", err);
        resultDiv.innerHTML = "<p style='color:red;'>❌ Error crítico al conectar con la IA.</p>";
    } finally {
        analyzeBtn.disabled = false;
    }
}

// 5. EVENTOS
if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzeImage);
}