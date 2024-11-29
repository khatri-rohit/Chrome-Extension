chrome.runtime.sendMessage({ todo: "ShowPageAction" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.todo == "changeColor") {
        let addColor = "#" + request.clickedColor
        console.log(addColor);
    }
})
