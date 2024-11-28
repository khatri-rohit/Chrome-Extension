let contextMenuItem = {
    "id": "spendMoney",
    "title": "SpendMoney",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

function isInt(value) {
    return isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

chrome.contextMenus.onClicked.addListener(function (data) {
    if (data.menuItemId == "spendMoney" && data.selectionText) {
        if (isInt(data.selectionText)) {
            chrome.storage.sync.get(["total", "limit"], (budget) => {
                let newTotal = 0;
                if (budget.total) {
                    newTotal += parseInt(budget.total);
                }
                newTotal += parseInt(data.selectionText);
                console.log(newTotal);
                chrome.storage.sync.set({ "total": newTotal }, () => {
                    if (newTotal >= budget.limit) {
                        let notifications = {
                            type: "basic",
                            iconUrl: "icon-48.png",
                            title: "Limit reached!",
                            message: "Uh oh! Looks like you've reached limit"
                        }
                        chrome.notifications.create('limitReached', notifications);

                    }
                })
            })
        }
    }
})