document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(["total", "limit"], (budget) => {
        let total = parseInt(budget.total);
        let limit = parseInt(budget.limit);

        document.getElementById("total").textContent = total;
        document.getElementById("limit").textContent = limit;
    });

    const spendAmount = document.getElementById("spendAmount");
    spendAmount.addEventListener("click", () => {
        console.log("Helloe");
        chrome.storage.sync.get(["total", "limit"], (budget) => {
            let newTotal = 0;
            if (budget.total) {
                newTotal += parseInt(budget.total)
            }
            console.log(budget);

            const amount = document.getElementById("amount")
            let amt = parseInt(amount.value);
            if (amount.value) {
                newTotal += amt
            }

            chrome.storage.sync.set({ "total": newTotal }, () => {
                if ((amt && newTotal) >= budget.limit) {
                    let notifications = {
                        type: "basic",
                        iconUrl: "icon-48.png",
                        title: "Limit reached!",
                        message: "Uh oh! Looks like you've reached limit"
                    }
                    chrome.notifications.create('limitReached', notifications);
                }
            });

            document.getElementById("total").textContent = newTotal;
            document.getElementById("amount").value = ""

        });
    });
});