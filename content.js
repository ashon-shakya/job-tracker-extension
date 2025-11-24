// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const data = scrapeJobData();
    sendResponse({ data: data });
  }
});

function scrapeJobData() {
  // Selectors based on current LinkedIn layout (as of late 2024/2025)
  // These look for the main job view page or the specific job modal

  // 1. Job Title
  const titleElement =
    document.querySelector(".job-details-jobs-unified-top-card__job-title") ||
    document.querySelector("h1");

  // 2. Company Name
  const companyElement =
    document.querySelector(
      ".job-details-jobs-unified-top-card__company-name"
    ) ||
    document.querySelector(
      ".job-details-jobs-unified-top-card__primary-description a"
    );

  // 3. Location Extraction
  let locationText = "N/A";

  // Select the specific container from your HTML
  const locationContainer = document.querySelector(
    ".job-details-jobs-unified-top-card__primary-description-container"
  );

  if (locationContainer) {
    // METHOD 1: The Precise Way (Best for this HTML)
    // We look for the FIRST element with the class 'tvm__text' inside the container
    const locationNode = locationContainer.querySelector(".tvm__text");

    if (locationNode) {
      locationText = locationNode.innerText.trim();
    }

    // METHOD 2: The Fallback Way (If Method 1 fails)
    // If we can't find the specific span, we grab all text and split by the dot (·)
    else {
      const fullText = locationContainer.innerText;
      // Result: "Auburn... · 1 month ago · 25 people..."
      // We split by the '·' character and take the first part
      locationText = fullText.split("·")[0].trim();
    }
  }

  // 4. Job Description (The main body text)
  const descriptionElement =
    document.querySelector("#job-details") ||
    document.querySelector(".jobs-description__content");

  return {
    title: titleElement ? titleElement.innerText.trim() : "Title not found",
    company: companyElement
      ? companyElement.innerText.trim()
      : "Company not found",
    location: locationText,
    url: window.location.href,
    description: descriptionElement
      ? descriptionElement.innerText.substring(0, 200) + "..."
      : "Description not found",
  };
}
