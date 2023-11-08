let tabSpeedsEnabled: Record<number, boolean> = { };

function inject_setSpeed(s: number): void {
    let eles = document.getElementsByTagName("video");

    for (let i = 0; i < eles.length; i++) {
        const ele = eles[i];
        ele.playbackRate = s;
    }

    if (eles.length > 0)
        console.log("Playback speed set to " + s);
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
        .then(() => {
            console.log("Injected script on tab " + tabId);
        })
    ;
}

function getSpeedSetting(tabId: number): number {
    if (!tabSpeedsEnabled[tabId]) {
        tabSpeedsEnabled[tabId] = false;
    }

    return tabSpeedsEnabled[tabId] ? 2.5 : 1;
}

async function update(tabId: number) {
    setSpeed(tabId, getSpeedSetting(tabId));

    await chrome.action.setBadgeText({
        "tabId": tabId,
        "text": getSpeedSetting(tabId).toString()
    });
}

async function toggle(tabId: number) {
    if (!tabSpeedsEnabled[tabId]) {
        tabSpeedsEnabled[tabId] = false;
    }

    tabSpeedsEnabled[tabId] = !tabSpeedsEnabled[tabId];

    await update(tabId);
}

chrome.action.onClicked.addListener(async (tab) => {
    let tabId = tab.id;
    if (tabId !== undefined)
        await toggle(tabId);
});

chrome.runtime.onInstalled.addListener(() => { }); // Nothing for now, might be helpful to keep here for another time
