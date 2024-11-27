chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'getVideoElement') {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            // Video element found, do something with it
            console.log(videoElement);
            // You can send a response back to the popup script if needed
            sendResponse({ success: true });
        } else {
            // Video element not found
            sendResponse({ success: false });
        }
    }
});
