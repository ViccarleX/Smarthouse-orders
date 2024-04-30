document.addEventListener('DOMContentLoaded', function () {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) {
        console.error('No se encontró el elemento resultDiv en el DOM');
        return; // Detiene la ejecución si resultDiv no existe
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true; // Hace que la escucha sea continua
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    let collectingUsername = true; // Estado para determinar si estamos recolectando el nombre de usuario
    let username = ''; // Almacenar el nombre de usuario recolectado

    recognition.onresult = function (event) {
        let transcript = event.results[event.resultIndex][0].transcript.toLowerCase().trim();
        transcript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // Remueve puntuación común
        resultDiv.innerHTML = `<h3>Texto Reconocido:</h3><p>${transcript}</p>`;
        console.log('Texto reconocido:', transcript);
    
        if (collectingUsername) {
            username = transcript; // Guarda el nombre de usuario
            resultDiv.innerHTML += '<p>Por favor, di tu contraseña.</p>';
            collectingUsername = false; // Cambia el estado para capturar la contraseña
        } else {
            const password = transcript; // Captura la contraseña
            validateCredentials(username, password);
            collectingUsername = true; // Restablece para el próximo intento de login
        }
    };
    

    recognition.onerror = function (event) {
        resultDiv.innerHTML = `<p>Ocurrió un error durante el reconocimiento de voz: ${event.error}</p>`;
        console.error('Error en el reconocimiento de voz:', event.error);
    };

    recognition.onend = function() {
        console.log("Reiniciando el reconocimiento de voz...");
        recognition.start(); // Reinicia el reconocimiento automáticamente
    };

    function validateCredentials(username, password) {
        console.log(`Validando: Usuario - ${username}, Contraseña - ${password}`);
        // Aquí deberías tener una lógica para validar contra una lista segura o base de datos
        if (username === "víctor" && password === "1125" || username === "alexis" && password === "1610") {
            window.location.href = 'index.html'; // Redirigir a otra página si es correcto
            resultDiv.innerHTML = '<p>Login exitoso. Redirigiendo...</p>';
        } else {
            resultDiv.innerHTML = '<p>Credenciales incorrectas. Intenta de nuevo.</p>';
            console.log('Credenciales incorrectas. Intenta de nuevo.');
        }
    }

    // Iniciar el reconocimiento de voz automáticamente
    recognition.start();
});