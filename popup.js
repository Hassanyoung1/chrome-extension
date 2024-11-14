document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('summarizeBtn').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        let tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            function getSelectedText() {
              return window.getSelection().toString();
            }
            return getSelectedText();
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

async function summarizeText(text) {
  try {
    console.log("I'm here");
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents": [
          {
            "parts": [
              {
                "text": text
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;
    console.log("Summary:", summary);
    alert(`Summary:\n\n${summary}`);
  } catch (error) {
    console.error("Error summarizing text:", error);
    alert("There was an error summarizing the text. Please try again. Error: " + error.message);
  }
}