chrome.contextMenus.create({
    id: "print-selected-text",
    title: "Print selected text",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.onClicked.addListener(function(info) {
    if (info.menuItemId == "print-selected-text") {
        console.log(info.selectionText);
    }
  });
  
  // In the background script
function sendDataToContentScript(data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "data", data: data}, function(response) {
        console.log(response);
      });
    });
  }
  
  