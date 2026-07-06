document.addEventListener("DOMContentLoaded", () => {
  /* ================= GLOBAL STATE ================= */
  const pages = [
    document.getElementById("hhh1"), // Step 1
    document.getElementById("number2"), // Step 2
    document.getElementById("number3"), // Step 3
    document.getElementById("number4"), // Step 4
    document.getElementById("number4_3"), // Step 4.3
    document.getElementById("number5"), // Step 5
    document.getElementById("number6"), // Step 6
  ];

  const bravoPages = document.querySelectorAll(".bravo");
  const bravoPage = bravoPages[0]; // Step 4.2
  const bravo4Page = bravoPages[1]; // Step 4.4

  const dots = document.querySelectorAll(".progress span:nth-child(odd)");
  const lines = document.querySelectorAll(".progress span:nth-child(even)");

  let currentStep = Number(localStorage.getItem("currentStep")) || 1;
  let currentSubStep = localStorage.getItem("currentSubStep") || "4_1";

  /* ================= CORE FUNCTIONS ================= */
  function showWithAnimation(el, display = "grid") {
    if (!el) return;
    el.style.display = display;
    el.offsetHeight; // Force reflow to trigger animation
    el.classList.add("active");
  }

  function hideAll() {
    pages.forEach((el) => {
      if (el) {
        el.style.display = "none";
        el.classList.remove("active");
      }
    });
    document.querySelectorAll(".bravo").forEach((el) => {
      el.style.display = "none";
      el.classList.remove("active");
    });
  }

  function updateProgress(step) {
    const dots = document.querySelectorAll(".progress .dot");
    const lines = document.querySelectorAll(".progress .line");

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i < step);
    });
    lines.forEach((line, i) => {
      line.style.backgroundColor = i < step - 1 ? "#046753" : "#d9d9d9";
    });
  }

  function showMainStep(step) {
    hideAll();
    const page = pages[step - 1];
    if (page) showWithAnimation(page, "grid");
    currentStep = step;
    localStorage.setItem("currentStep", step);

    // Reset sub-step when leaving step 4
    if (step !== 4) {
      currentSubStep = "4_1";
      localStorage.removeItem("currentSubStep");
    }

    updateProgress(step);
    updateMobileProgress();
  }

  /* ================= MOBILE-PROGRESS COUNTER ================= */
  function updateMobileProgress() {
    const progressSpans = document.querySelectorAll(".progress span");

    if (window.innerWidth >= 1024) {
      // LARGE SCREENS → restore default CSS
      progressSpans.forEach((span) => (span.style.display = ""));
      return;
    }

    // MOBILE ONLY → show current step progress
    progressSpans.forEach((span, i) => {
      span.style.display = i === (currentStep - 1) * 2 ? "grid" : "none";
      span.style.placeItems = "center";
    });
  }

  /* ================= STEP 1 IMAGE UPLOAD ================= */
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("previewImages");
  const uploadText = document.getElementById("uploadText");

  window.selectImages = () => imageInput.click();

  if (imageInput) {
    imageInput.addEventListener("change", () => {
      if (!preview) return;
      preview.innerHTML = "";
      if (uploadText)
        uploadText.classList.toggle("hidden", imageInput.files.length > 0);

      [...imageInput.files].forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
      });
    });
  }

  /* ================= ROOM IMAGE UPLOAD ================= */
  function setupRoomImageUpload() {
    document.querySelectorAll(".roomImageInput").forEach((input) => {
      input.addEventListener("change", () => {
        const previewId = input.dataset.preview;
        const preview = document.getElementById(previewId);
        const text = input
          .closest(".room-upload")
          ?.querySelector(".room-upload-text");

        if (preview) preview.innerHTML = "";
        if (text) text.classList.add("hidden");

        [...input.files].forEach((file) => {
          if (!file.type.startsWith("image/")) return;
          const img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          img.style.width = "100%";
          img.style.height = "100vh";
          img.style.objectFit = "cover";
          if (preview) preview.appendChild(img);
        });
      });
    });
  }

  window.selectRoomImages = (btn) => {
    const input = btn.closest(".room-upload")?.querySelector(".roomImageInput");
    if (input) input.click();
  };

  /* ================= DROPDOWN ================= */
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const header = dropdown.querySelector(".dropdown-header");
    const selected = dropdown.querySelector(".selected-room");

    if (header && selected) {
      header.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("active");
      });

      dropdown.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
          selected.textContent = li.textContent;
          dropdown.classList.remove("active");
        });
      });
    }
  });

  document.addEventListener("click", () => {
    document
      .querySelectorAll(".dropdown.active")
      .forEach((d) => d.classList.remove("active"));
  });

  /* ================= VALIDATION ================= */
  function validate(container) {
    if (!container) return false;
    let valid = true;

    container
      .querySelectorAll("input[type='text'], input[type='number']")
      .forEach((input) => {
        if (!input.value.trim()) {
          input.style.border = "2px solid red";
          valid = false;
        } else {
          input.style.border = "2px solid green";
        }
      });

    return valid;
  }

  /* ================= STEP FLOW ================= */
  // STEP 1 → 2
  const nextButton = document.querySelector("#hhh1 .next");
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!validate(pages[0]) || !imageInput.files.length) {
        alert("Complete all fields and upload at least one image");
        return;
      }
      showMainStep(2);
    });
  }

  // STEP 2 → 3
  const button2 = document.querySelector("#number2 .button");
  if (button2) {
    button2.addEventListener("click", () => {
      const address = document.querySelector("#number2 .fill input");
      if (!address || !address.value.trim()) {
        alert("Enter full address");
        return;
      }
      showMainStep(3);
    });
  }

  // STEP 3 → 4
  const button3 = document.querySelector("#number3 .button1");
  if (button3) {
    button3.addEventListener("click", () => {
      const checked = document.querySelectorAll("#number3 input:checked");
      if (!checked.length) {
        alert("Select at least one amenity");
        return;
      }
      showMainStep(4);
    });
  }

  /* ================= STEP 4 SUB-STEPS ================= */
  const step4Button = document.querySelector("#number4 .alpha16"); // 4 → 4.2
  const bravo3Button = document.querySelector(".bravo3"); // 4.2 → 4.3
  const step4_3Button = document.querySelector("#number4_3 .alpha16"); // 4.3 → 4.4
  const confirmButton = document.getElementById("bbravo3"); // 4.4 → 5

  if (step4Button) {
    step4Button.addEventListener("click", () => {
      hideAll();
      if (bravoPage) showWithAnimation(bravoPage, "block");
      currentSubStep = "4_2";
      currentStep = 4;
      localStorage.setItem("currentSubStep", currentSubStep);
      updateProgress(4);
      updateMobileProgress();
    });
  }

  if (bravo3Button) {
    bravo3Button.addEventListener("click", () => {
      hideAll();
      if (pages[4]) showWithAnimation(pages[4], "grid");
      currentSubStep = "4_3";
      currentStep = 4;
      localStorage.setItem("currentSubStep", currentSubStep);
      updateProgress(4);
      updateMobileProgress();
    });
  }

  if (step4_3Button) {
    step4_3Button.addEventListener("click", () => {
      hideAll();
      if (bravo4Page) showWithAnimation(bravo4Page, "block");
      currentSubStep = "4_4";
      currentStep = 4;
      localStorage.setItem("currentSubStep", currentSubStep);
      updateProgress(4);
      updateMobileProgress();
    });
  }

  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      hideAll();
      const page5 = pages[5]; // Step 5
      if (page5) {
        showWithAnimation(page5, "grid");
        currentStep = 5;
        currentSubStep = "5";
        localStorage.setItem("currentStep", 5);
        localStorage.setItem("currentSubStep", "5");
        updateProgress(5);
        updateMobileProgress();
      }
    });
  }

  /* ================= STEP 5 → STEP 6 ================= */
  const step5Button = document.querySelector("#number5 .charlie16");
  if (step5Button) {
    step5Button.addEventListener("click", () => {
      hideAll();
      const page6 = pages[6]; // Step 6
      if (page6) {
        showWithAnimation(page6, "grid");
        currentStep = 6;
        currentSubStep = "6";
        localStorage.setItem("currentStep", 6);
        localStorage.setItem("currentSubStep", "6");
        updateProgress(6);
        updateMobileProgress();
      }
    });
  }

  /* ================= PAGE 6 → PAGE 7 ================= */
  const publishBtn = document.querySelector(".delta6");
  const page6 = document.getElementById("number6");
  const page7 = document.getElementById("number7");
  const progressBar = document.querySelector(".progress");
  const topIcon = document.querySelector(".top i");

  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      page6.style.display = "none";
      showWithAnimation(page7, "flex");

      if (progressBar) progressBar.style.display = "none";

      if (topIcon) {
        topIcon.classList.remove("fa-arrow-left");
        topIcon.classList.add("fa-xmark");
        topIcon.style.cursor = "pointer";
      }
    });
  }

  /* ================= BACK BUTTON ================= */
  const backButton = document.querySelector(".top i");
  if (backButton) {
    backButton.addEventListener("click", () => {
      if (backButton.classList.contains("fa-xmark")) {
        // FULL RESET
        hideAll();
        if (page7) {
          page7.style.display = "none";
          page7.classList.remove("active");
        }

        currentStep = 1;
        currentSubStep = "4_1";
        localStorage.clear();

        // Reset progress UI
        document.querySelectorAll(".progress .dot").forEach((dot, i) => {
          dot.classList.toggle("active", i === 0);
        });
        document.querySelectorAll(".progress .line").forEach((line) => {
          line.style.backgroundColor = "#d9d9d9";
        });

        if (progressBar) progressBar.style.display = "flex";

        backButton.classList.remove("fa-xmark");
        backButton.classList.add("fa-arrow-left");

        showWithAnimation(pages[0], "grid");
        updateMobileProgress();
        return;
      }

      // Back navigation logic
      if (currentStep === 5) {
        hideAll();
        if (bravo4Page) bravo4Page.style.display = "block";
        currentStep = 4;
        currentSubStep = "4_4";
        localStorage.setItem("currentStep", 4);
        localStorage.setItem("currentSubStep", "4_4");
        updateProgress(4);
        updateMobileProgress();
        return;
      }

      if (currentSubStep === "4_4") {
        hideAll();
        if (pages[4]) pages[4].style.display = "grid";
        currentSubStep = "4_3";
        localStorage.setItem("currentSubStep", currentSubStep);
        updateMobileProgress();
        return;
      }

      if (currentSubStep === "4_3") {
        hideAll();
        if (bravoPage) bravoPage.style.display = "block";
        currentSubStep = "4_2";
        localStorage.setItem("currentSubStep", currentSubStep);
        updateMobileProgress();
        return;
      }

      if (currentSubStep === "4_2") {
        showMainStep(4);
        currentSubStep = "4_1";
        localStorage.setItem("currentSubStep", currentSubStep);
        updateMobileProgress();
        return;
      }

      if (currentStep > 1) {
        showMainStep(currentStep - 1);
        if (currentStep - 1 !== 4) {
          currentSubStep = "4_1";
          localStorage.removeItem("currentSubStep");
        }
        updateMobileProgress();
      }
    });
  }

  /* ================= INITIALIZATION ================= */
  setupRoomImageUpload();
  hideAll();

  // Restore state on page load
  if (currentStep === 6 && pages[6]) pages[6].style.display = "grid";
  else if (currentStep === 5 && pages[5]) showWithAnimation(pages[5], "grid");
  else if (currentStep === 4) {
    if (currentSubStep === "4_2" && bravoPage)
      bravoPage.style.display = "block";
    else if (currentSubStep === "4_3" && pages[4])
      pages[4].style.display = "grid";
    else if (currentSubStep === "4_4" && bravo4Page)
      bravo4Page.style.display = "block";
    else showMainStep(4);
  } else {
    if (currentStep === 4 && currentSubStep !== "4_1") {
      hideAll();
      updateProgress(4);
      updateMobileProgress();
    } else {
      showMainStep(currentStep);
    }
  }

  updateProgress(currentStep);
  updateMobileProgress();

  // Update mobile progress dynamically on resize
  window.addEventListener("resize", updateMobileProgress);
});
