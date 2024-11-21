const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

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
    // Set the canvas' size to match the video
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
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

getVideo();
video.addEventListener('canplay', paintToCanvas);
