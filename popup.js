document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('summarizeBtn').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        let tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            // Get selected text from the page
            function getSelectedText() {
              return window.getSelection().toString();
            }
            return getSelectedText();  // Return selected text to the popup
          }
        }).then((injectionResults) => {
          if (injectionResults && injectionResults[0] && injectionResults[0].result) {
            const selectedText = injectionResults[0].result;
            console.log("Selected text:", selectedText);

            if (selectedText) {
              summarizeText(selectedText);
            } else {
              alert("Please select some text to summarize.");
            }
          }
        }).catch((err) => {
          console.error("Script injection error:", err);
        });
      }
    });
  });
});
// Function to send the text to the server for summarization
function summarizeText(text) {
  const data = {
    prompt: `Summarize this: ${text}`,
    max_tokens: 50,
    temperature: 0.7,
  };
  console.log("Data sent to server:", data);

  axios.post('http://localhost:3000/proxy-gemini', data)  // Update endpoint here
    .then(response => {
      const summary = response.data.summary;
      console.log("Summary:", summary);
      alert(`Summary:\n\n${summary}`);
    })
    .catch(error => {
      console.error("Error summarizing text:", error);
      alert("There was an error summarizing the text. Please try again.");
    });
}
