// popup.js
function sendMessageToTab(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            console.log(tabs[0]);
            console.log(tabs[0].id, message);
            chrome.tabs.sendMessage(tabs[0].id, message).catch((err) => {
                console.log('Error sending message:', err);
                // Optionally show an error message to the user
                alert('Please refresh the page and try again.');
            });
        }
    });
}

document.getElementById('startTranscription').addEventListener('click', () => {
    sendMessageToTab({ action: 'startTranscription' });
});

document.getElementById('stopTranscription').addEventListener('click', () => {
    sendMessageToTab({ action: 'stopTranscription' });
    console.log("stopTranscription");
});

document.getElementById('downloadLogs').addEventListener('click', () => {
    sendMessageToTab({ action: 'downloadLogs' });
});
