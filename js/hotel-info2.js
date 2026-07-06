// carousel
// carousel
// carousel
const carousel = document.querySelector(".hotel-pic");
const slideDiv = document.querySelector(".hotel-pic .slide");

const images = [
  "../assets/images/hotel 1.jpg",
  "../assets/images/hotel 4.jpg",
  "../assets/images/hotel 3.jpg",
  "../assets/images/hotel 5.jpg",
];

let index = 0;

// Set first image
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

// NEXT
document
  .querySelector(".symbol2 span:last-child")
  .addEventListener("click", () => {
    let newIndex = (index + 1) % images.length;
    showSlide(newIndex, 1); // slide from right
  });

// PREV
document
  .querySelector(".symbol2 span:first-child")
  .addEventListener("click", () => {
    let newIndex = (index - 1 + images.length) % images.length;
    showSlide(newIndex, -1); // slide from left
  });

function updateCounter() {
  document.getElementById("counter").textContent = `${index + 1} / ${
    images.length
  }`;
}
// carousel
// carousel
// carousel
// carousel

// This should be in a script tag or separate JS file
document.addEventListener("DOMContentLoaded", function () {
  // Get data from localStorage
  const roomName = localStorage.getItem("roomName");
  const roomGuest = localStorage.getItem("roomGuest");
  const roomBed = localStorage.getItem("roomBed");
  const roomPrice = localStorage.getItem("roomPrice");
  const roomAvailable = localStorage.getItem("roomAvailable");
  const roomAmenities = localStorage.getItem("roomAmenities");
 

  // Update the HTML elements
  if (roomName) document.querySelector("#room-info > p").textContent = roomName;
  if (roomGuest)
    document.querySelector(
      "#room-quality span:first-child p:nth-child(2)"
    ).textContent = roomGuest;
  if (roomPrice) document.querySelector("#room-price").textContent = roomPrice;
  if (roomAvailable)
    document.querySelector("#room-available").textContent = roomAvailable;
});

// .continue
// .continue
// .continue
// .continue
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".continue").addEventListener("click", (e) => {
    e.preventDefault();
    const roomAvailable1 = localStorage.getItem("roomAvailable");
    localStorage.setItem("roomAvailable1", roomAvailable1);

    location.href = "book.html";
  });
});
// .continue
// .continue
// .continue
// .continue

// localstorage for room name
const roomNameElement = document.getElementById("room-name");
const roomAvail = document.querySelector(".room-available");
const continueBtn = document.querySelector(".continue");

continueBtn.addEventListener("click", () => {
  const roomType = roomNameElement.textContent; // get room type
  const roomAc = roomAvail.textContent;
  localStorage.setItem("selectedRoom", roomType); // store in localStorage
  localStorage.setItem("availableRoom", roomAc);
  window.location.href = "book.html"; // navigate to second page
});
// localstorage for room name


// nav arrow
// nav arrow
// nav arrow
// nav arrow
const backButton = document.querySelector(".top .fas");
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



