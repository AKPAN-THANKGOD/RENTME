const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const selectedRangeText = document.getElementById("selected-range");
const bookingDateText = document.querySelector(".book2001");

let date = new Date();
let startDate = null;
let endDate = null;
let selecting = null; // null, "start", or "end"

// Switch selection mode
startBtn.addEventListener("click", () => {
  selecting = "start";
  startBtn.style.background = "#4caf50";
  endBtn.style.background = "gray";
});

endBtn.addEventListener("click", () => {
  selecting = "end";
  endBtn.style.background = "#f44336";
  startBtn.style.background = "gray";
});

// Helper: format full date
function formatFullDate(day, monthIndex, year) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[monthIndex]} ${day}, ${year}`;
}

// Render calendar
function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  monthYear.textContent = `${months[month]} ${year}`;

  daysContainer.innerHTML = "";

  // Empty spaces before first day
  for (let i = 0; i < firstDay; i++) {
    daysContainer.appendChild(document.createElement("div"));
  }

  // Create days
  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.textContent = i;
    day.classList.add("day");
    day.dataset.date = i;
    day.dataset.month = month;
    day.dataset.year = year;

    // Highlight previously selected dates
    if (startDate && i === startDate) day.classList.add("start-date");
    if (endDate && i === endDate) day.classList.add("end-date");
    if (startDate && endDate && i > startDate && i < endDate)
      day.classList.add("in-range");

    // Click to select
    day.addEventListener("click", () => {
      if (!selecting) {
        alert("Please click 'Select Start Date' or 'Select End Date' first!");
        return;
      }

      if (selecting === "start") {
        startDate = i;
        // If start is after end, reset end
        if (endDate && endDate < startDate) endDate = null;
      } else if (selecting === "end") {
        if (!startDate) {
          alert("Please select start date first!");
          return;
        }
        if (i < startDate) {
          alert("End date cannot be before start date!");
          return;
        }
        endDate = i;
      }

      renderCalendar(); // immediately update highlight
      updateSelectedRange(); // show full dates
      updateBookingDate(); // 👈 updates <p class="book2001">
      selecting = null; // reset mode
    });

    daysContainer.appendChild(day);
  }
}

// Update the selected-range span with full dates
function updateSelectedRange() {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (startDate && endDate) {
    const startFull = formatFullDate(startDate, month, year);
    const endFull = formatFullDate(endDate, month, year);
    selectedRangeText.textContent = `Date: ${startFull} - ${endFull}`;
  } else if (startDate) {
    const startFull = formatFullDate(startDate, month, year);
    selectedRangeText.textContent = `Selected Start: ${startFull}`;
  } else {
    selectedRangeText.textContent = "";
  }
}

function updateBookingDate() {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (startDate && endDate) {
    const startFull = formatFullDate(startDate, month, year);
    const endFull = formatFullDate(endDate, month, year);

    bookingDateText.textContent = `Date: ${startFull} - ${endFull}`;
  }
}

// Month navigation
prevBtn.onclick = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};
nextBtn.onclick = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

// Initial render
renderCalendar();

// drop down for number of rooms
// drop down for number of rooms
// drop down for number of rooms
// drop down for number of rooms
// drop down for number of rooms
const book = document.querySelector(".book213");
const dropdown = document.querySelector(".dropdown");
const dropdownContent = dropdown.querySelector(".dropdown-content");
const roomsLeft = document.querySelector(".book214");

// Function to extract room count safely
function getAvailableRooms() {
  try {
    // Safer extraction with null checks
    const match = roomsLeft.textContent.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  } catch (error) {
    console.error("Error parsing room count:", error);
    return 0;
  }
}

// Function to generate dropdown options based on rooms left
function generateOptions() {
  const available = getAvailableRooms();

  // Clear previous options but preserve structure
  dropdownContent.innerHTML = "";

  // If no rooms available
  if (available <= 0) {
    const option = document.createElement("div");
    option.classList.add("option", "disabled");
    option.textContent = "Sold out";
    dropdownContent.appendChild(option);
    book.textContent = "Sold out";
    book.classList.add("disabled");
    return;
  }

  // Reset book button state
  book.textContent = "Select rooms";
  book.classList.remove("disabled");

  // Generate options for available rooms
  for (let i = 1; i <= available; i++) {
    const option = document.createElement("div");
    option.classList.add("option");
    option.textContent = i + (i === 1 ? " room" : " rooms");
    option.dataset.value = i; // Store numeric value

    dropdownContent.appendChild(option);

    // Click event to update book213
    option.addEventListener("click", () => {
      book.textContent = option.textContent;
      book.dataset.selected = i; // Store selected value
      dropdownContent.style.display = "none";

      // You can use the selected value elsewhere
      console.log(`Selected ${i} room(s)`);
    });
  }
}

// Monitor for changes in room count
function observeRoomCountChanges() {
  // Method 1: MutationObserver (best for dynamic updates)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData" || mutation.type === "childList") {
        console.log("Room count updated, regenerating options...");
        generateOptions();
      }
    });
  });

  // Start observing the room count element
  observer.observe(roomsLeft, {
    characterData: true,
    childList: true,
    subtree: true,
  });

  return observer;
}

// Initialize everything
function initRoomBooking() {
  // Generate initial options
  generateOptions();

  // Start observing for changes
  const observer = observeRoomCountChanges();

  // Toggle dropdown on book213 click
  book.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent immediate closing

    // Don't open if sold out
    if (book.classList.contains("disabled")) return;

    const isVisible = dropdownContent.style.display === "block";
    dropdownContent.style.display = isVisible ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== book) {
      dropdownContent.style.display = "none";
    }
  });

  // Close dropdown on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownContent.style.display = "none";
    }
  });
}

// Start the initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRoomBooking);
} else {
  initRoomBooking();
}
// drop down for number of rooms
// drop down for number of rooms
// drop down for number of rooms
// drop down for number of rooms
// drop down for number of rooms

// drop down for duration
// drop down for duration
// drop down for duration
// drop down for duration
// --- First dropdown (number) ---
const book217 = document.querySelector(".book217");
const dropdown1 = document.querySelector(".dropdown1-menu");
const options = dropdown1.querySelectorAll(".link");

// --- Second dropdown (word like "Night") ---
const book218 = document.querySelector(".book218");
const book218Text = book218.querySelector("p"); // 👈 the <p> that shows "Night"
const dropdown2 = document.querySelector(".dropdown2-menu");
const options1 = dropdown2.querySelectorAll(".link1");

// Store current base word (e.g., "Night")
let currentBaseWord = book218Text.textContent.trim();

// Pluralization helper
function pluralize(count, singular, plural = singular + "s") {
  return count === 1 ? singular : plural;
}

// Update the displayed phrase (number + pluralized word)
function updatePhrase() {
  const num = parseInt(book217.textContent.trim(), 10);
  if (!isNaN(num)) {
    book218Text.textContent = pluralize(num, currentBaseWord);
  }
}

// Initialize
updatePhrase();

// --- Number dropdown logic ---
book217.addEventListener("click", function (e) {
  e.stopPropagation();
  dropdown1.classList.toggle("show");
});

options.forEach((option) => {
  option.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    book217.textContent = this.textContent.trim();
    dropdown1.classList.remove("show");
    updatePhrase();
    updateTotalPrice();
    updateTotalNights();
  });
});

// --- Word dropdown logic ---
book218.addEventListener("click", function (e) {
  e.stopPropagation();
  dropdown2.classList.toggle("show");
});

options1.forEach((option) => {
  option.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    currentBaseWord = this.textContent.trim(); // 👈 store base word
    dropdown2.classList.remove("show");
    updatePhrase(); // 👈 recompute: e.g., "3 Nights"
    updateTotalPrice();
    updateTotalNights();
  });
});

// --- Close dropdowns on outside click ---
window.addEventListener("click", function () {
  dropdown1.classList.remove("show");
  dropdown2.classList.remove("show");
});

// calculations for no of rooms
// calculations for no of rooms
// calculations for no of rooms
// calculations for no of rooms
const priceTag = document.querySelector(".price-tag");
const totalPrice = document.querySelector(".total");
const totalPrice2 = document.querySelector(".book2214");
const totalNightsText = document.querySelector(".book2000");

// Function to extract number from currency
function extractNumber(text) {
  return parseInt(text.replace(/[^0-9]/g, ""));
}

function updateTotalNights() {
  const nights = parseInt(book217.textContent.trim(), 10);
  totalNightsText.textContent = `Total Nights: ${nights}`;
}

// Update total when duration changes
function updateTotalPrice() {
  const price = extractNumber(priceTag.textContent);
  const nights = parseInt(book217.textContent.trim(), 10);
  const total = price * nights;

  totalPrice.textContent = `Total Price: N${total.toLocaleString()}`;
  totalPrice2.textContent = `Total Price: N${total.toLocaleString()}`;
}

// calculations for no of rooms
// calculations for no of rooms
// calculations for no of rooms
// calculations for no of rooms

// local storage for room name
// local storage for room name
// local storage for room name
// local storage for room name
const roomDisplay = document.getElementById("room-display");
const roomA = document.querySelector(".book214");
const selectedRoom = localStorage.getItem("selectedRoom"); // retrieve stored value
const availableRoom = localStorage.getItem("availableRoom");
if (selectedRoom) {
  roomDisplay.textContent = selectedRoom; // display it
} else {
  roomDisplay.textContent = "Not selected"; // fallback text
}

if (availableRoom) {
  roomA.textContent = availableRoom; // display it
} else {
  roomA.textContent = "Not selected"; // fallback text
}
// local storage for room name
// local storage for room name
// local storage for room name
// local storage for room name

// nav arrow
// nav arrow
// nav arrow
// nav arrow
const backButton = document.querySelector(".fas");
backButton.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // If no history (opened in new tab), go to homepage or referrer
    window.location.href = document.referrer || "/";
  }
});

// nav arrow
// nav arrow
// nav arrow
// nav arrow
