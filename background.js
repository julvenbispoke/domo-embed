chrome.runtime.onMessage.addListener( async function (request, sender, sendResponse) {
 
  
  if("clientId" in request) {
      chrome.storage.sync.set({ clientId : request.clientId }).then(() => {
        console.log("Value is set: "+ request.clientId );
      });
     sendResponse({clientId: request.clientId})

  }

  else sendResponse({})

  
});




const AMAZON_PAGE = 'https://www.amazon.com';

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  console.log({tab})
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === AMAZON_PAGE) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'index.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});


chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));