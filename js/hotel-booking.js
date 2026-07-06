// Hotel Booking Page Specific Functionality

class HotelBookingManager {
  constructor() {
    this.init();
  }

  init() {
    this.initializeHotelCards();
    this.initializeHotelBookmarks();
    this.setupHotelBookmarkButtons();
  }

  // Initialize hotel card interactions
  initializeHotelCards() {
    console.log("🏨 Initializing hotel card clicks...");

    const hotelCards = document.querySelectorAll(".hotel-card[data-id]");
    console.log(`🏨 Found ${hotelCards.length} hotel cards`);

    hotelCards.forEach((card, index) => {
      console.log(`🏨 Hotel Card ${index + 1}:`, card.getAttribute("data-id"));

      // Add click handler for card (excluding bookmark buttons)
      card.addEventListener("click", function (e) {
        console.log("🎯 Hotel card clicked!");
        console.log("🎯 Clicked element:", e.target);
        console.log("🎯 Is bookmark?", e.target.closest(".card-bookmark"));

        // Don't navigate if clicking bookmark button
        if (e.target.closest(".card-bookmark")) {
          console.log("📌 Bookmark clicked - ignoring navigation");
          return;
        }

        const hotelId = this.getAttribute("data-id");
        console.log("🚀 Navigating to hotel details:", hotelId);

        // Navigate to hotel details page
        window.location.href = `hotel-details.html?id=${hotelId}`;
      });

      // Visual feedback
      card.style.cursor = "pointer";
      card.style.transition = "all 0.3s ease";

      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px)";
        this.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "var(--card-shadow)";
      });
    });
  }

  // Setup hotel bookmark buttons
  setupHotelBookmarkButtons() {
    document.addEventListener("click", (e) => {
      const bookmarkBtn = e.target.closest(".hotel-card .card-bookmark");
      if (bookmarkBtn) {
        e.preventDefault();
        e.stopPropagation();

        const card = bookmarkBtn.closest(".hotel-card");
        if (card) {
          this.toggleHotelBookmark(card, bookmarkBtn);
        }
      }
    });
  }

  toggleHotelBookmark(card, bookmarkBtn) {
    const hotelId = card.dataset.id;

    if (!hotelId) {
      console.warn("Hotel card missing data-id attribute");
      return;
    }

    // Get hotel data from card
    const hotelData = this.extractHotelData(card, hotelId);

    if (window.bookmarkManager.isBookmarked(hotelId)) {
      // Remove bookmark
      window.bookmarkManager.removeBookmark(hotelId);
      this.updateHotelBookmarkUI(bookmarkBtn, false);
    } else {
      // Add bookmark
      window.bookmarkManager.addBookmark(hotelData);
      this.updateHotelBookmarkUI(bookmarkBtn, true);
    }
  }

  extractHotelData(card, hotelId) {
    const title =
      card.querySelector(".hotel-name")?.textContent || "Grand Plaza Hotel";
    const location =
      card.querySelector(".hotel-address")?.textContent ||
      "19, Victor Kokomo st. Victoria Island";
    const price =
      card.querySelector(".hotel-price")?.textContent || "N12,000 / Night";
    const description =
      card.querySelector(".hotel-description")?.textContent ||
      "Secure guesthouse with generator & free breakfast";
    const owner =
      card.querySelector(".owner-name")?.textContent || "Richard Ayodele";
    const rating = card.querySelector(".rating span")?.textContent || "4.7";
    const image =
      card.querySelector(".hotel-image img")?.src || "assets/images/hotel1.jpg";
    const ownerImage =
      card.querySelector(".owner-avatar img")?.src ||
      "assets/images/owner1.jpg";

    return {
      id: hotelId,
      title,
      location,
      price,
      type: "Hotel",
      agent: owner,
      image,
      rating,
      description,
      ownerImage,
      dateAdded: new Date().toISOString(),
      isHotel: true,
    };
  }

  updateHotelBookmarkUI(bookmarkBtn, isBookmarked) {
    if (isBookmarked) {
      bookmarkBtn.classList.add("saved");
    } else {
      bookmarkBtn.classList.remove("saved");
    }
  }

  // Initialize hotel bookmarks state
  initializeHotelBookmarks() {
    // Wait for main bookmark manager to initialize
    setTimeout(() => {
      const hotelBookmarkButtons = document.querySelectorAll(
        ".hotel-card .card-bookmark"
      );
      hotelBookmarkButtons.forEach((button) => {
        const hotelCard = button.closest(".hotel-card");
        if (hotelCard && hotelCard.dataset.id) {
          const isBookmarked = window.bookmarkManager?.isBookmarked(
            hotelCard.dataset.id
          );
          if (isBookmarked) {
            this.updateHotelBookmarkUI(button, true);
          }
        }
      });
    }, 100);
  }
}

// Initialize hotel booking functionality when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.hotelBookingManager = new HotelBookingManager();
});

// Extend bookmark manager for hotels
if (typeof BookmarkManager !== "undefined") {
  // Override extractPropertyData to handle hotel cards
  const originalExtractPropertyData =
    BookmarkManager.prototype.extractPropertyData;

  BookmarkManager.prototype.extractPropertyData = function (card, propertyId) {
    // Check if it's a hotel card
    if (card.classList.contains("hotel-card")) {
      return window.hotelBookingManager.extractHotelData(card, propertyId);
    }

    // Otherwise use original method for property cards
    return originalExtractPropertyData.call(this, card, propertyId);
  };
}

// cards
// cards
// cards
// cards
// cards
// Make sure you're selecting ALL hotel cards
const hotelCards = document.querySelectorAll('.hotel-card');

// Add click event to EACH card
hotelCards.forEach(card => {
  card.addEventListener('click', function(e) {
    // Prevent if clicking bookmark
    if (e.target.closest('.card-bookmark')) {
      return;
    }
    
    // Get data from THIS specific card
    const hotelName = this.querySelector('.hotel-name').textContent;
    const hotelAddress = this.querySelector('.hotel-address').textContent;
    const hotelPrice = this.querySelector('.hotel-price').textContent;
    const hotelRating = this.querySelector('.rating span').textContent;
    const hotelImg = this.querySelector('.hotel-image img').src;
    const ownerName = this.querySelector('.owner-name').textContent;
    const ownerImg = this.querySelector('.owner-avatar img').src;
    
    console.log('Clicked hotel:', hotelName); // Debug log
    
    // Store in localStorage
    localStorage.setItem('name', hotelName);
    localStorage.setItem('address', hotelAddress);
    localStorage.setItem('price', hotelPrice);
    localStorage.setItem('rating', hotelRating);
    localStorage.setItem('img', hotelImg);
    localStorage.setItem('ownerName', ownerName);
    localStorage.setItem('ownerImg', ownerImg);
    localStorage.setItem('mainImage', hotelImg); // For carousel
    
    // Navigate to details page
    window.location.href = 'hotel-details.html';
  });
});