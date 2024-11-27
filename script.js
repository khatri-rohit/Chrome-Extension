document.addEventListener('DOMContentLoaded', function () {
    const videoElements = document.querySelectorAll("video");
    if (videoElements.length > 0) {
        const video = videoElements[0]; // Ensure video is scoped correctly
        console.log("Video found:", video);

        // Check if the browser supports AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            console.error("AudioContext is not supported in this browser.");
            return;
        }

        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(video);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // Check if the browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;

        recognition.onresult = function (event) {
            const transcript = event.results[event.resultIndex][0].transcript;
            const p = document.createElement('p');
            p.textContent = transcript;
            document.body.appendChild(p);
            console.log("Transcribe");
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'network') {
                console.error('Network error. Retrying in 5 seconds...');
                setTimeout(() => {
                    recognition.start(); // Retry starting the speech recognition
                }, 5000);
            }
        };


        // Handle permissions and start recognition when the video plays
        video.onplay = function () {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(function (stream) {
                    console.log("Microphone access granted");
                    recognition.start();
                })
                .catch(function (err) {
                    console.error("Microphone access denied:", err);
                });
        };

        video.onpause = function () {
            recognition.stop();
        };

    } else {
        console.log("No video elements found on this page.");
    }
});
