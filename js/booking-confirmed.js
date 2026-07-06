const backButton = document.querySelector(".top .fas");
backButton.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // If no history (opened in new tab), go to homepage or referrer
    window.location.href = document.referrer || "/";
  }
});

