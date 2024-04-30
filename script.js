document.addEventListener('DOMContentLoaded', function () {
    const resultDiv = document.getElementById('result');
    const textElement = document.getElementById('text');
  
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true; // Hace que la escucha sea continua
        recognition.interimResults = false;
        recognition.lang = 'es-ES';
  
        recognition.onresult = function (event) {
            const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
            resultDiv.innerHTML = `
                <h3>Texto Reconocido:</h3>
                <p>${transcript}</p>
            `;
  
            console.log('Texto reconocido:', transcript);
            processTranscript(transcript);
        };
  
        recognition.onerror = function (event) {
            resultDiv.innerHTML = '<p>Ocurrió un error durante el reconocimiento de voz.</p>';
            console.error('Error en el reconocimiento de voz:', event.error);
        };
  
        recognition.onend = function() {
            console.log("Reiniciando el reconocimiento de voz...");
            recognition.start(); // Reiniciar el reconocimiento automáticamente
        };
  
        // Iniciar el reconocimiento de voz automáticamente
        recognition.start();
    } else {
        resultDiv.innerHTML = '<p>El reconocimiento de voz no es compatible con este navegador.</p>';
        console.error('Reconocimiento de voz no compatible');
    }
  
    function processTranscript(transcript) {
        if (transcript.includes('jimena')) {
            const command = extractCommand(transcript);
            if (command) {
                saveCommandToDatabase(command);
            } else {
                console.log('No se encontró una orden válida en la transcripción:', transcript);
            }
        }
    }

    function extractCommand(transcript) {
        const commands = [
            'enciende la luz del cuarto',
            'apaga la luz del cuarto',
            'enciende la luz de la sala',
            'apaga la luz de la sala',
            'enciende las luces del jardín',
            'apaga las luces del jardín',
            'enciende el ventilador',
            'apaga el ventilador',
            'abre las cortinas',
            'cierra las cortinas',
            'enciende la alarma de la casa',
            'apaga la alarma de la casa',
            'enciende las cámaras de seguridad',
            'apaga las cámaras de seguridad'
        ];
        return commands.find(cmd => transcript.includes(cmd));
    }

    function saveCommandToDatabase(command) {
        const url = 'https://631f96f822cefb1edc4eda3a.mockapi.io/Smarthouse';
        const data = {
            orden: command,
            usuario: 'víctor', // Deberás modificar esto según tu lógica de usuarios
            fecha: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString()
        };
  
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar la orden en la BD');
            }
            console.log('Orden guardada correctamente en la BD');
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    }
});
