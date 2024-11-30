document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("btn");
    btn.addEventListener("click", async function () {
        const [tab] = await chrome.tabs.query(
            { active: true, currentWindow: true }
        );
        const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
        // do something with response here, not outside the function
        console.log(response);
    });
});