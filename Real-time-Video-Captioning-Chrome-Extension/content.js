// content.js
// Add this at the start of your content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.action === 'startTranscription') {
        startTranscription();
    } else if (request.action === 'stopTranscription') {
        stopTranscription();
    } else if (request.action === 'downloadLogs') {
        downloadDebugLogs();
    }
    // Always return true if you want to send a response asynchronously
    return true;
});

let recognition = null;
let captionContainer = null;
let debugLogs = [];
let sessionStartTime = null;

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toISOString();
}

function logDebugInfo(type, data) {
    const log = {
        timestamp: formatTime(Date.now()),
        timeOffset: sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0,
        type: type,
        data: data
    };
    debugLogs.push(log);
    console.log('Debug Log:', log);
}

function downloadDebugLogs() {
    const logContent = JSON.stringify(debugLogs, null, 2);
    const blob = new Blob([logContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    chrome.downloads.download({
        url: url,
        filename: `caption-debug-logs-${timestamp}.json`,
        saveAs: true
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startTranscription') {
        startTranscription();
    } else if (request.action === 'stopTranscription') {
        stopTranscription();
    } else if (request.action === 'downloadLogs') {
        downloadDebugLogs();
    }
});

function createCaptionContainer() {
    if (!captionContainer) {
        captionContainer = document.createElement('div');
        captionContainer.style.position = 'absolute';
        captionContainer.style.bottom = '50px';
        captionContainer.style.left = '50%';
        captionContainer.style.transform = 'translateX(-50%)';
        captionContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        captionContainer.style.color = 'white';
        captionContainer.style.padding = '10px';
        captionContainer.style.borderRadius = '5px';
        captionContainer.style.zIndex = '10000';
        document.body.appendChild(captionContainer);
        logDebugInfo('container_created', {
            styles: {
                position: captionContainer.style.position,
                bottom: captionContainer.style.bottom,
                left: captionContainer.style.left
            }
        });
    }
}

function startTranscription() {
    const video = document.querySelector('video');
    console.log("startTranscription");

    if (!video) {
        logDebugInfo('error', 'No video element found on page');
        console.error('No video element found on page');
        return;
    }

    sessionStartTime = Date.now();
    logDebugInfo('session_start', {
        videoSource: {
            duration: video.duration,
            currentTime: video.currentTime,
            paused: video.paused,
            volume: video.volume,
            muted: video.muted
        }
    });

    if (!recognition) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            logDebugInfo('recognition_start', {
                timestamp: Date.now()
            });
        };

        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            const transcript = lastResult[0].transcript;
            const confidence = lastResult[0].confidence;

            logDebugInfo('transcription', {
                transcript: transcript,
                confidence: confidence,
                isFinal: lastResult.isFinal,
                videoTime: video.currentTime
            });

            createCaptionContainer();
            captionContainer.textContent = transcript;
        };

        recognition.onerror = (event) => {
            logDebugInfo('error', {
                error: event.error,
                message: event.message
            });
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            logDebugInfo('recognition_end', {
                timestamp: Date.now()
            });
        };
    }

    // Create an AudioContext to process the video's audio
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(video);
    const streamDestination = audioContext.createMediaStreamDestination();
    source.connect(streamDestination);
    source.connect(audioContext.destination);

    logDebugInfo('audio_context_created', {
        sampleRate: audioContext.sampleRate,
        state: audioContext.state
    });

    recognition.start();
}

function stopTranscription() {
    if (recognition) {
        recognition.stop();
        recognition = null;
        logDebugInfo('transcription_stopped', {
            timestamp: Date.now()
        });
    }

    if (captionContainer) {
        captionContainer.remove();
        captionContainer = null;
        logDebugInfo('container_removed', {
            timestamp: Date.now()
        });
    }
}