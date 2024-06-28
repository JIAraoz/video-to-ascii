
const upload = document.getElementById('upload');
const video = document.getElementById('video');
const asciiVideo = document.getElementById('ascii-video');

// Mapa de caracteres ASCII según la luminosidad (invertido)
const asciiChars = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        video.src = url;
        video.style.display = 'block';
        video.play();
    }
});

video.addEventListener('play', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const drawFrame = () => {
        if (video.paused || video.ended) {
            return;
        }

        // Configurar el tamaño del canvas según el tamaño del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dibujar el fotograma actual del video en el canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Obtener los datos de los píxeles del fotograma
        try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            let asciiFrame = '';

            // Convertir cada píxel a un carácter ASCII
            for (let y = 0; y < canvas.height; y += 8) {
                for (let x = 0; x < canvas.width; x += 4) {
                    const index = (y * canvas.width + x) * 4;
                    const r = pixels[index];
                    const g = pixels[index + 1];
                    const b = pixels[index + 2];

                    // Convertir a escala de grises
                    const gray = (r + g + b) / 3;

                    // Mapear el valor de gris a un carácter ASCII
                    const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
                    const char = asciiChars[charIndex];

                    // Crear un span para cada carácter ASCII con el color correspondiente
                    asciiFrame += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
                }
                asciiFrame += '<br>';
            }

            asciiVideo.innerHTML = asciiFrame;
        } catch (e) {
            console.error('Error al obtener los datos de la imagen:', e);
        }
        // Solicitar el siguiente fotograma
        requestAnimationFrame(drawFrame);
    };

    drawFrame();
});