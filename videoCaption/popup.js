console.log("Extension Loaded");
document.getElementById('start').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'getVideoElement' }, function (response) {
        if (response && response.success) {
            console.log('Video element found');
        } else {
            console.log('Video element not found');
        }
    });
});
