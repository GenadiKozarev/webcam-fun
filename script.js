const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rgbControls = document.querySelector('.rgb-controls');
const effects = document.querySelectorAll('.effects input[name="effect"]');
let selectedEffect = null;

const getVideo = async () => {
    try {
        // Request video access (no audio)
        const localMediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        // Check if srcObject is the primary method
        if ('srcObject' in video) {
            video.srcObject = localMediaStream;
        } else {
            // Fallback for older browsers
            video.src = URL.createObjectURL(localMediaStream);
            // Clean up the object URL when video is loaded to prevent memory leaks
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
            };
        }
        video.play();
    } catch (err) {
        alert('Camera access is required for this feature to work.');
        console.error('Video access required for this feature to work', err);
    }
};

const paintToCanvas = () => {
    const { videoWidth, videoHeight } = video;
    // Set the canvas dimensions to match the video source
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    // Continuously process video frames with pixel manipulation effect
    return setInterval(() => {
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        // Extract pixel data from canvas
        let pixels = ctx.getImageData(0, 0, videoWidth, videoHeight);
        // Apply the selected color manipulation effect
        if (selectedEffect === 'sunnyEffect') {
            ctx.globalAlpha = 1;
            rgbControls.style.display = 'none';
            pixels = sunnyEffect(pixels);
            console.log(ctx.globalAlpha);
        }
        if (selectedEffect === 'psychedelicEffect') {
            ctx.globalAlpha = 1;
            rgbControls.style.display = 'none';
            pixels = psychedelicEffect(pixels);
        }
        if (selectedEffect === 'rgbEffect') {
            ctx.globalAlpha = 1;
            rgbControls.style.display = 'flex';
            pixels = rgbEffect(pixels);
        }
        if (selectedEffect === 'ghostEffect') {
            rgbControls.style.display = 'none';
            ctx.globalAlpha = 0.1;
        }
        // Render modified pixels back to canvas
        ctx.putImageData(pixels, 0, 0);
    }, 20);
};

const takePhoto = () => {
    // Reset audio playback to start
    snap.currentTime = 0;
    // Play camera snap sound effect
    snap.play();
    // Capture current canvas content as a data URL in JPEG format
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    // Set download attribute to specify filename when user saves the image
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Person" />`;
    // Insert the new link/image at the beginning of the 'strip' element
    strip.insertBefore(link, strip.firstChild);
};

const sunnyEffect = pixels => {
    // Iterate through pixel data, modifying color channels
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // Red
        pixels.data[i + 1] = pixels.data[i + 1] - 10; // Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
};

const psychedelicEffect = pixels => {
    // Iterate through pixel data, creating a color channel offset effect.
    // Shift channels to a different index.
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 108] = pixels.data[i + 0]; // Red
        pixels.data[i + 86] = pixels.data[i + 1]; // Green
        pixels.data[i - 20] = pixels.data[i + 2]; // Blue
    }
    return pixels;
};

const rgbEffect = pixels => {
    const levels = {};
    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value;
    });
    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
        if (
            red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax
        ) {
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
};

getVideo();
video.addEventListener('canplay', paintToCanvas);
effects.forEach(effect => {
    effect.addEventListener('change', e => {
        selectedEffect = e.target.value;
    });
});
