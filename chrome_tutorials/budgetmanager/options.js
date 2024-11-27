document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("limit", (budget) => {
        document.getElementById("limit").value = parseInt(budget.limit);
    });

    const reset = document.getElementById("resetTotal");
    reset.addEventListener("click", () => {
        chrome.storage.sync.set({ "total": 0 });
        let notifications = {
            type: "basic",
            iconUrl: "icon-48.png",
            title: "Total Reset",
            message: "Total has been reset to 0"
        }
        chrome.notifications.create('resetTotal', notifications);
    });

    const saveLimit = document.getElementById("saveLimit");
    saveLimit.addEventListener("click", () => {
        let limit = document.getElementById("limit").value;
        chrome.storage.sync.set({ "limit": parseInt(limit) });
        close();
    });

});