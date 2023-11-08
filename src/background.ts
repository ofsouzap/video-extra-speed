let state: boolean = false;
let tabId: number | undefined = undefined;

function f_setSpeedFast(s: number): void {
    document.getElementsByTagName("video")[0].playbackRate = s;
    console.log("Speed set");
}

function setSpeed(s: number) {
    if (tabId !== undefined) {
        chrome.scripting
            .executeScript({
                "target": {"tabId": tabId},
                "func": f_setSpeedFast,
                "args": [ s ],
            })
            .then(() => console.log("Done"))
        ;
    }
}

async function update() {
    setSpeed(state ? 2.5 : 1);

    if (tabId !== undefined) {
       await chrome.action.setBadgeText({
            "tabId": tabId,
            "text": state ? "ON" : "OFF"
        });
    }
}

async function toggle() {
    state = !state;

    await update();
}

chrome.action.onClicked.addListener(async (tab) => {
    tabId = tab.id;
    await toggle();
});

chrome.runtime.onInstalled.addListener(() => {
    state = false;
    update();
});
