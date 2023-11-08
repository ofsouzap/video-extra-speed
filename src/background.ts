let speed_enabled: boolean = false;

function inject_setSpeed(s: number): void {
    let eles = document.getElementsByTagName("video");

    for (let i = 0; i < eles.length; i++) {
        const ele = eles[i];
        ele.playbackRate = s;
    }

    if (eles.length > 0)
        console.log("Speed set");
    else
        console.log("No targets found for speed-up");
}

function setSpeed(tabId: number, s: number) {
    chrome.scripting
        .executeScript({
            "target": {"tabId": tabId},
            "func": inject_setSpeed,
            "args": [ s ],
        })
        .then(() => console.log("Done"))
    ;
}

function getSpeedSetting(): number {
    return speed_enabled ? 2.5 : 1;
}

async function update(tabId: number) {
    setSpeed(tabId, getSpeedSetting());

    await chrome.action.setBadgeText({
        "tabId": tabId,
        "text": speed_enabled ? "ON" : "OFF"
    });
}

async function toggle(tabId: number) {
    speed_enabled = !speed_enabled;

    await update(tabId);
}

chrome.action.onClicked.addListener(async (tab) => {
    let tabId = tab.id;
    if (tabId !== undefined)
        await toggle(tabId);
});

chrome.runtime.onInstalled.addListener(() => {
    speed_enabled = false;
});
