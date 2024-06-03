chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeData,
  });
});

function scrapeData() {
  const matchHeading = document.querySelector(
    ".ds-text-title-xs.ds-font-bold.ds-mb-2.ds-m-1"
  ).innerText;
  chrome.storage.local.set({ matchHeading }, () => {
    console.log("Match heading saved:", matchHeading);
  });
}
