// carousel
// carousel
// carousel
document.addEventListener("DOMContentLoaded", function () {
  // Get the main image from localStorage
  const mainImage =
    localStorage.getItem("mainImage") || "../assets/images/hotel 1.jpg";

  // Use the main image plus additional images for carousel
  const images = [
    mainImage, // First image is the one from the clicked hotel card
    "../assets/images/hotel 2.jpg",
    "../assets/images/hotel 3.jpg",
    "../assets/images/hotel 4.jpg",
  ];

  // Initialize carousel with these images
  const carousel = document.querySelector(".hotel-pic");
  let slideDiv = document.querySelector(".hotel-pic .slide");
  let index = 0;

  // Set first image (main image from clicked hotel)
  slideDiv.style.backgroundImage = `url('${images[index]}')`;

  function showSlide(newIndex, direction) {
    const newSlide = document.createElement("div");
    newSlide.className = "slide";
    newSlide.style.backgroundImage = `url('${images[newIndex]}')`;

    // start offscreen
    newSlide.style.transform = `translateX(${direction * 100}%)`;
    carousel.appendChild(newSlide);

    // force browser to register the position before transition
    requestAnimationFrame(() => {
      // slide old out
      slideDiv.style.transform = `translateX(${-direction * 100}%)`;
      // slide new in
      newSlide.style.transform = "translateX(0)";
    });

    // after transition, remove old slide
    newSlide.addEventListener("transitionend", () => {
      slideDiv.remove();
      slideDiv = newSlide; // update current slide reference
    });

    index = newIndex;
    updateCounter();
  }

  // NEXT button
  document.querySelector(".symbol2").addEventListener("click", () => {
    let newIndex = (index + 1) % images.length;
    showSlide(newIndex, 1);
  });

  // PREV button
  document
    .querySelector(".symbol1 span:first-child")
    .addEventListener("click", () => {
      let newIndex = (index - 1 + images.length) % images.length;
      showSlide(newIndex, -1);
    });

  function updateCounter() {
    document.getElementById("counter").textContent = `${index + 1} / ${
      images.length
    }`;
  }

  // Update counter initially
  updateCounter();
});
// carousel
// carousel
// carousel
// carousel

// card
// card
// card
// card
function nextPage(button) {
  // get the room card of the clicked button
  const card = button.closest(".room-card");

  // extract info from this specific room
  const name = card.querySelector(".room-info > p:first-child").textContent;

  const maxGuest = card.querySelector(
    ".room-quality > span:first-child p:nth-child(2)"
  ).textContent;

  const bedConfig = card.querySelector(
    ".room-quality > span:nth-child(2) p:nth-child(2)"
  ).textContent;

  const price = card.querySelector(".room-price").textContent;
  const available = card.querySelector(".room-available").textContent;

  const amenities = card.querySelector(".amenities p:nth-child(2)").textContent;

  // store in localStorage
  localStorage.setItem("roomName", name);
  localStorage.setItem("roomGuest", maxGuest);
  localStorage.setItem("roomBed", bedConfig);
  localStorage.setItem("roomPrice", price);
  localStorage.setItem("roomAvailable", available);
  localStorage.setItem("roomAmenities", amenities);

  // go to next page
  window.location.href = "hotel-info2.html";
}

// card
// card
// card
// card

// nav arrow
// nav arrow
// nav arrow
// nav arrow
const backButton = document.querySelector(".symbol1 .fas");
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

// cards
// cards
// cards
// cards
// cards
// Get data from localStorage
const hotelName = localStorage.getItem("name");
const hotelAddress = localStorage.getItem("address");
const hotelRating = localStorage.getItem("rating");
const mainImage = localStorage.getItem("mainImage");

// Update the page with the data
if (hotelName) {
  document.querySelector(".description1 span:first-child").textContent =
    hotelName;
}

if (hotelAddress) {
  document.querySelector(".address span:first-child").textContent =
    hotelAddress;
}

if (hotelRating) {
  document.querySelector("#rating-value").textContent = hotelRating;
}
