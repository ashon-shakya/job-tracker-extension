document.getElementById("scrapeBtn").addEventListener("click", async () => {
  // Get the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject the content script programmatically (ensures it runs even if extension was reloaded)
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content.js"],
    },
    () => {
      // Once injected, send the message
      chrome.tabs.sendMessage(tab.id, { action: "scrape" }, (response) => {
        if (response && response.data) {
          displayData(response.data);
        } else {
          document.getElementById("jobTitle").innerText =
            "Error: Refresh the LinkedIn page and try again.";
          document.getElementById("result").style.display = "block";
        }
      });
    }
  );
});

function displayData(data) {
  document.getElementById("jobTitle").innerText = data.title;
  document.getElementById("company").innerText = data.company;
  document.getElementById("location").innerText = data.location;
  document.getElementById("result").style.display = "block";

  // Optional: Copy JSON to clipboard immediately
  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
}
