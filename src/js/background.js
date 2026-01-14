var planning_portals = []

/**
 * Download assets
 */
var downloadAssets = function(assets) {
  assets.forEach(function(asset) {
    var dl = {
      url: asset.href
    }
    // Use filename if specificed. If not let Chrome handle it.
    if(asset.filename) {
      dl.filename = asset.filename
    }
    chrome.downloads.download(dl)
  })
}

/**
 * Create context menu entries
 */
chrome.contextMenus.create({
  id: 'download-all-documents',
  title: 'Download All Application Documents',
  documentUrlPatterns: planning_portals
})

chrome.contextMenus.create({
  id: 'download-summary',
  title: 'Download Application Summary',
  documentUrlPatterns: planning_portals
})

/**
 * Context menu click handler
 */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if(info.menuItemId === 'download-all-documents') {
    // Send getAssets message
    chrome.tabs.sendMessage(tab.id, { message: 'getAssets' })
    // Also get summary
    chrome.tabs.sendMessage(tab.id, { message: 'getSummary' })
  }
  else if(info.menuItemId === 'download-summary') {
    // Send getSummary message
    chrome.tabs.sendMessage(tab.id, { message: 'getSummary' })
  }
})

/**
 * Message listener for download requests from content scripts
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.message === 'downloadAssets') {
    downloadAssets(request.assets)
  }
})
