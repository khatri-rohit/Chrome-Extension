chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.todo == "ShowPageAction") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.pageAction.show(tabs[0].id);
        });
    }
});

// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.todo === "changeColor")
//             sendResponse({ farewell: "goodbye" });
//     }
// );