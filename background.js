chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
      fetch('http://localhost:3000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: request.text })
      })
      .then(response => response.json())
      .then(data => {
        chrome.runtime.sendMessage({ action: 'showSummary', summary: data.summary });
      })
      .catch(error => {
        console.error('Error:', error);
        chrome.runtime.sendMessage({ action: 'showError', error: 'Failed to summarize text' });
      });
    }
  });