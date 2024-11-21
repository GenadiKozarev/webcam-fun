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
        console.error('Video access required for this feature to work', err);
    }
};

getVideo();
