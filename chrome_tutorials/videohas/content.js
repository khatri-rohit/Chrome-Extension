chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "getTitle") {
            const h1 = document.body.querySelector("h1");
            h1.style.color = "royalblue"

            const title = document.title;
            sendResponse({ title: title, head1: h1 });
        } else if (request.videoElement === "getVideo") {
            const video = document.body.querySelector("video");

            sendResponse({
                sender: sender,
                video: video.className,
            })
        }
    }
);