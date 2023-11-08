const speedSettings: number[] = [
    1,
    1.75,
    2,
    2.5,
    3,
    5
];
const DEFAULT_SPEED_INDEX: number = 0;

let tabSpeedIndexes: Record<number, number> = { };

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

function nextSpeed(tabId: number) {
    if (!tabSpeedIndexes[tabId]) {
        tabSpeedIndexes[tabId] = DEFAULT_SPEED_INDEX;
    }

    tabSpeedIndexes[tabId] += 1;
    tabSpeedIndexes[tabId] %= speedSettings.length;
}

function getTabSpeedIndex(tabId: number): number {
    if (tabSpeedIndexes[tabId]) {
        return tabSpeedIndexes[tabId];
    } else {
        return DEFAULT_SPEED_INDEX;
    }
}

function getTabSpeed(tabId: number): number {
    return speedSettings[getTabSpeedIndex(tabId)];
}

function getTabIconLabel(tabId: number): string {
    let speedIndex: number = getTabSpeedIndex(tabId);
    return speedIndex == DEFAULT_SPEED_INDEX ? "" : speedSettings[speedIndex].toString();
}

function setSpeed(tabId: number, speed: number) {
    chrome.scripting
        .executeScript({
            "target": {"tabId": tabId},
            "func": inject_setSpeed,
            "args": [ speed ],
        })
        .then(() => {
            console.log("Injected script on tab " + tabId);
        })
    ;
}

async function nextSpeedAndUpdate(tabId: number) {
    nextSpeed(tabId);

    setSpeed(tabId, getTabSpeed(tabId));

    await chrome.action.setBadgeText({
        "tabId": tabId,
        "text": getTabIconLabel(tabId)
    });
}

chrome.action.onClicked.addListener(async (tab) => {
    let tabId = tab.id;
    if (tabId !== undefined)
        await nextSpeedAndUpdate(tabId);
});

chrome.runtime.onInstalled.addListener(() => { }); // Nothing for now, might be helpful to keep here for another time
