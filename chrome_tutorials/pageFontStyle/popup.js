document.addEventListener("DOMContentLoaded", () => {
    
    const btn = document.querySelector("button");
    btn.addEventListener("click", () => {
        const color = document.querySelector("#fontColor");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                todo: "changeColor",
                clickedColor: color.value
            });
        });
    });
});