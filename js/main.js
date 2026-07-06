// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

// ========== USER PROFILE UI MANAGEMENT ==========
class UserProfileManager {
    constructor() {
        this.userSession = this.getUserSession();
        this.init();
    }

    init() {
        this.updateNavigationUI();
        this.setupEventListeners();
        
        // Validate session on init
        this.validateSession();
    }

    getUserSession() {
        try {
            const session = localStorage.getItem('userSession');
            const token = localStorage.getItem('authToken');
            
            // If we have a token but no session, create basic session
            if (token && !session) {
                const basicSession = {
                    token: token,
                    user: { email: 'user@example.com' } // Placeholder
                };
                localStorage.setItem('userSession', JSON.stringify(basicSession));
                return basicSession;
            }
            
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.error('Error getting user session:', error);
            return null;
        }
    }

    validateSession() {
        // Check if session exists and token is valid
        const token = localStorage.getItem('authToken');
        const session = this.getUserSession();
        
        if (token && session) {
            // Session is valid
            this.userSession = session;
        } else {
            // Clear invalid session
            this.clearSession();
        }
        
        this.updateNavigationUI();
    }

    clearSession() {
        localStorage.removeItem('userSession');
        localStorage.removeItem('authToken');
        this.userSession = null;
    }

    isLoggedIn() {
        // Check both token and session for consistency
        const token = localStorage.getItem('authToken');
        const session = this.getUserSession();
        
        return !!(token && session && session.token);
    }

    getUserInitials() {
        if (!this.userSession || !this.userSession.user) return '';
        
        const user = this.userSession.user;
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        
        if (firstName && lastName) {
            return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        } else if (firstName) {
            return firstName.charAt(0).toUpperCase();
        } else if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        
        return 'U';
    }

    getUserFirstName() {
        if (!this.userSession || !this.userSession.user) return '';
        return this.userSession.user.first_name || this.userSession.user.email?.split('@')[0] || 'User';
    }

    updateNavigationUI() {
        const userProfile = document.querySelector('.user-profile');
        const authButtons = document.querySelector('.auth-buttons');
        const userNameElement = document.querySelector('.user-name, .profile-name');
        const userInitialsElement = document.querySelector('.user-initials, .profile-initials');
        const authLink = document.getElementById('auth-link');
        const welcomeText = document.querySelector('.welcome');
        const signinLink = document.querySelector('.signin');

        const loggedIn = this.isLoggedIn();
        console.log('🔄 Updating navigation UI, loggedIn:', loggedIn);

        if (loggedIn) {
            // User is logged in - show profile, hide login/signup buttons
            if (authButtons) {
                authButtons.style.display = 'none';
            }

            if (userProfile) {
                userProfile.style.display = 'flex';
            }

            // Update user name and initials
            const firstName = this.getUserFirstName();
            const initials = this.getUserInitials();

            if (userNameElement) {
                userNameElement.textContent = firstName;
            }

            if (userInitialsElement) {
                userInitialsElement.textContent = initials;
            }

            // Update auth link if it exists
            if (authLink) {
                authLink.textContent = firstName;
                authLink.href = 'profile.html';
            }
            
            // Update welcome text
            if (welcomeText) {
                welcomeText.textContent = 'Welcome back';
            }
            
            if (signinLink) {
                signinLink.textContent = firstName;
                signinLink.href = 'profile.html';
            }

        } else {
            // User is not logged in - show login/signup, hide profile
            if (authButtons) {
                authButtons.style.display = 'flex';
            }

            if (userProfile) {
                userProfile.style.display = 'none';
            }

            // Reset auth link
            if (authLink) {
                authLink.textContent = 'Sign in / Register';
                authLink.href = 'login.html';
            }
            
            // Reset welcome text
            if (welcomeText) {
                welcomeText.textContent = 'Welcome';
            }
            
            if (signinLink) {
                signinLink.textContent = 'Sign in / Register';
                signinLink.href = 'login.html';
            }
        }
    }

    logout() {
        console.log('🔄 Logout function called');
        
        // Clear all user data from localStorage
        this.clearSession();
        
        console.log('🗑️ LocalStorage cleared');
        
        // Clear the user session
        this.userSession = null;
        
        // Update the navigation UI immediately
        this.updateNavigationUI();
        
        // Dispatch logout event for other components
        window.dispatchEvent(new Event('userLogout'));
        
        console.log('✅ UI updated and event dispatched');
        
        // Redirect to home page
        window.location.href = 'index.html';
        console.log('🔀 Redirecting to index.html');
    }

    setupEventListeners() {
        // Listen for login/logout events
        window.addEventListener('userLogin', () => {
            console.log('🔔 User login event received');
            this.userSession = this.getUserSession();
            this.updateNavigationUI();
        });

        window.addEventListener('userLogout', () => {
            console.log('🔔 User logout event received');
            this.userSession = null;
            this.updateNavigationUI();
        });

        // User profile click to toggle menu
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Menu item clicks
        const menuItems = document.querySelectorAll('.user-menu .menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideUserMenu();
                
                // If it's the logout button, handle logout
                if (item.classList.contains('logout-button')) {
                    e.preventDefault();
                    this.logout();
                }
            });
        });

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-profile') && !e.target.closest('.user-menu')) {
                this.hideUserMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideUserMenu();
            }
        });
    }

    toggleUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.classList.toggle('active');
        }
    }

    hideUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.classList.remove('active');
        }
    }
}

// ========== API SERVICE FUNCTIONS ==========
class UserService {
    // Remove the API configuration since we're not using it yet
    static async getUserProfile() {
        // Directly return mock data without API call
        return this.getMockUserData();
    }

    // Helper method to get auth token
    static getAuthToken() {
        return localStorage.getItem('authToken') || '';
    }

    // Mock data for development
    static getMockUserData() {
        return {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            avatarUrl: null,
            isLoggedIn: false
        };
    }
}

// ========== USER AVATAR MANAGEMENT ==========
class UserAvatarManager {
    constructor() {
        this.avatarElement = document.getElementById('user-avatar');
        this.authLink = document.getElementById('auth-link');
        this.init();
    }

    init() {
        this.loadUserAvatar();
        this.setupAuthState();
    }

    loadUserAvatar() {
        // Check if user is logged in
        const userProfileManager = window.userProfileManager;
        const isLoggedIn = userProfileManager ? userProfileManager.isLoggedIn() : false;
        
        if (isLoggedIn) {
            // Show user initials
            const initials = userProfileManager.getUserInitials();
            if (this.avatarElement) {
                this.avatarElement.innerHTML = `
                    <div class="profile-avatar-mini" style="width: 32px; height: 32px; border-radius: 50%; background: #116e35; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
                        ${initials}
                    </div>
                `;
                this.avatarElement.classList.add('has-initials');
            }
        } else {
            this.showFallbackIcon();
        }
    }

    showFallbackIcon() {
        if (this.avatarElement) {
            this.avatarElement.innerHTML = `
                <svg class="usericon fallback-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM2 20a9.99 9.99 0 0 1 20 0z"/>
                </svg>
            `;
            this.avatarElement.classList.remove('has-initials');
        }
    }

    setupAuthState() {
        // Listen for auth state changes
        window.addEventListener('userLogin', () => {
            console.log('🔄 UserAvatarManager: Login event');
            this.loadUserAvatar();
        });

        window.addEventListener('userLogout', () => {
            console.log('🔄 UserAvatarManager: Logout event');
            this.showFallbackIcon();
        });
    }
}

// ========== PROPERTY SERVICE - COMBINES LANDLORD AND AGENT LISTINGS ==========
class PropertyService {
    static API_BASE_URL = 'https://rentmenaija-a4ed.onrender.com';
    
    // Fetch properties from BOTH endpoints and combine them
    static async getListings(filters = {}) {
        try {
            console.log('🔍 Fetching properties with filters:', filters);
            
            // Fetch from both endpoints in parallel
            const [landlordListings, agentListings] = await Promise.all([
                this.fetchLandlordListings(filters),
                this.fetchAgentListings(filters)
            ]);
            
            // Combine and normalize the data
            const combinedListings = this.combineListings(landlordListings, agentListings);
            
            console.log('✅ Received data:', {
                landlord: landlordListings?.length || 0,
                agent: agentListings?.length || 0,
                combined: combinedListings.length
            });
            
            return combinedListings;
        } catch (error) {
            console.error('Error fetching listings:', error);
            // Fallback to mock data if API fails
            return this.getMockListings();
        }
    }

    // Fetch landlord listings
    static async fetchLandlordListings(filters = {}) {
        try {
            const queryParams = this.buildQueryParams(filters);
            const url = `${this.API_BASE_URL}/api/listings/${queryParams}`;
            
            console.log('🏠 Fetching landlord listings from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error('❌ Landlord listings error:', response.status);
                return [];
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching landlord listings:', error);
            return [];
        }
    }

    // Fetch agent listings
    static async fetchAgentListings(filters = {}) {
        try {
            const queryParams = this.buildQueryParams(filters);
            const url = `${this.API_BASE_URL}/api/agent-listings/${queryParams}`;
            
            console.log('👔 Fetching agent listings from:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error('❌ Agent listings error:', response.status);
                return [];
            }
            
            const agentListings = await response.json();
            // Transform agent listings to match landlord listing format
            return this.transformAgentListings(agentListings);
        } catch (error) {
            console.error('Error fetching agent listings:', error);
            return [];
        }
    }

    // Transform agent listings to match landlord listing format
    static transformAgentListings(agentListings) {
        if (!agentListings || !Array.isArray(agentListings)) return [];
        
        return agentListings.map(listing => ({
            ...listing,
            // Map agent fields to lister fields for consistency
            lister_first_name: listing.agent_first_name,
            lister_last_name: listing.agent_last_name,
            lister_username: listing.agent_username,
            lister_profile_image: listing.agent_profile_image,
            lister_rating: listing.agent_rating,
            // Ensure consistent field names
            phone_number: listing.landlord_phone || '',
            landlord_email: listing.landlord_email || '',
            // If agent listing doesn't have time_since_published, calculate it
            time_since_published: listing.time_since_published || 'Recently'
        }));
    }

    // Combine and deduplicate listings
    static combineListings(landlordListings = [], agentListings = []) {
        const allListings = [...(landlordListings || []), ...(agentListings || [])];
        
        // Remove duplicates by ID
        const uniqueListings = [];
        const seenIds = new Set();
        
        allListings.forEach(listing => {
            if (listing && listing.id && !seenIds.has(listing.id)) {
                seenIds.add(listing.id);
                uniqueListings.push(listing);
            }
        });
        
        // Sort by published_at (newest first)
        return uniqueListings.sort((a, b) => {
            const dateA = new Date(a.published_at || 0);
            const dateB = new Date(b.published_at || 0);
            return dateB - dateA;
        });
    }

    // Build query parameters from filters
    static buildQueryParams(filters) {
        const params = new URLSearchParams();
        
        // Add state filter (note: API expects full state names like "Lagos State")
        if (filters.state) {
            // Check if we need to add "State" suffix
            const stateValue = filters.state.toLowerCase().includes('state') 
                ? filters.state 
                : `${filters.state} State`;
            params.set('state', stateValue);
        }
        
        // Add city filter
        if (filters.city) {
            params.set('city', filters.city);
        }
        
        // Add property type filter
        if (filters.property_type) {
            // Map frontend values to API values
            const typeMap = {
                'mini_flat': 'mini_flat',
                'apartment': 'apartment',
                'self_contain': 'self_contain',
                'duplex': 'duplex',
                'bungalow': 'bungalow',
                'studio': 'studio'
            };
            const apiPropertyType = typeMap[filters.property_type] || filters.property_type;
            params.set('property_type', apiPropertyType);
        }
        
        // Add price range filters
        if (filters.price_min) {
            params.set('price_min', filters.price_min);
        }
        
        if (filters.price_max) {
            params.set('price_max', filters.price_max);
        }
        
        // For search query, we'll filter client-side
        // No API parameter for search (q)
        
        // Add limit for performance
        params.set('limit', '50');
        
        const queryString = params.toString();
        return queryString ? `?${queryString}` : '';
    }

    // Filter listings by search term (client-side)
    static filterListingsBySearch(listings, searchTerm) {
        if (!searchTerm || !listings || !Array.isArray(listings)) return listings;
        
        const term = searchTerm.toLowerCase();
        return listings.filter(listing => {
            // Search in multiple fields
            const searchableFields = [
                listing.title,
                listing.description,
                listing.property_type,
                listing.city,
                listing.state,
                listing.address,
                // Check both lister and agent names
                listing.lister_first_name,
                listing.lister_last_name,
                listing.agent_first_name,
                listing.agent_last_name,
                listing.landlord_name
            ];
            
            return searchableFields.some(field => 
                field && field.toString().toLowerCase().includes(term)
            );
        });
    }

    // Mock data fallback
    static getMockListings() {
        console.log('⚠️ Using mock data as fallback');
        return [
            {
                id: 1,
                title: "Luxury Apartment in Victoria Island",
                description: "Beautiful 3-bedroom apartment with sea view",
                property_type: "apartment",
                monthly_rent: 5000000,
                currency: "NGN",
                city: "Lagos",
                state: "Lagos State",
                images: [],
                lister_first_name: "John",
                lister_last_name: "Doe",
                time_since_published: "2 days ago"
            },
            {
                id: 2,
                title: "Affordable Mini Flat in Ikeja",
                description: "Cozy 1-bedroom flat with modern amenities",
                property_type: "mini_flat",
                monthly_rent: 800000,
                currency: "NGN",
                city: "Lagos",
                state: "Lagos State",
                images: [],
                lister_first_name: "Jane",
                lister_last_name: "Smith",
                time_since_published: "1 day ago"
            }
        ];
    }
}

// ========== PROPERTY RENDERER ==========
class PropertyRenderer {
    constructor() {
        this.propertiesGrid = document.querySelector('.cards-grid');
        this.currentFilters = {};
        this.init();
    }

    async init() {
        await this.loadAndRenderProperties();
    }

    async loadAndRenderProperties(filters = {}) {
        try {
            console.log('🔄 Loading listings with filters:', filters);
            this.currentFilters = filters;
            const listings = await PropertyService.getListings(filters);
            
            // Apply client-side search filtering if needed
            let filteredListings = listings;
            if (filters.q) {
                filteredListings = PropertyService.filterListingsBySearch(listings, filters.q);
            }
            
            this.renderProperties(filteredListings);
        } catch (error) {
            console.error('Error loading listings:', error);
            this.showErrorState();
        }
    }

    renderProperties(listings) {
        if (!this.propertiesGrid) {
            console.error('Properties grid element not found');
            return;
        }

        if (!listings || listings.length === 0) {
            this.showNoResultsState(this.currentFilters.q || '');
            return;
        }

        console.log(`🎯 Rendering ${listings.length} listings`);

        const propertiesHTML = listings.map(listing => this.createPropertyCard(listing)).join('');
        this.propertiesGrid.innerHTML = propertiesHTML;

        // Re-initialize card click handlers and bookmark functionality
        this.initializeCardInteractions();
        
        // Set up proper image error handling after DOM is rendered
        this.setupImageErrorHandling();
        
        // Show search results count if there's a search query
        if (this.currentFilters.q) {
            this.showSearchResultsCount(listings.length, this.currentFilters.q);
        }
    }

    createPropertyCard(listing) {
        const ratingStars = this.generateRatingStars(listing.lister_rating || listing.agent_rating || 0);
        const formattedPrice = this.formatPrice(listing.monthly_rent, listing.currency);
        const firstImage = this.getValidImageUrl(listing.images);
        
        // Determine agent name (could be lister or agent)
        let agentName = '';
        if (listing.lister_first_name || listing.lister_last_name) {
            agentName = `${listing.lister_first_name || ''} ${listing.lister_last_name || ''}`.trim();
        } else if (listing.agent_first_name || listing.agent_last_name) {
            agentName = `${listing.agent_first_name || ''} ${listing.agent_last_name || ''}`.trim();
        } else if (listing.landlord_name) {
            agentName = listing.landlord_name;
        } else {
            agentName = 'Property Agent';
        }
        
        const location = listing.city || listing.state ? `${listing.city || ''} ${listing.state || ''}`.trim() : 'Location not specified';
        
        return `
            <article class="card" data-id="${listing.id}">
                <div class="card-image">
                    <img src="${firstImage}" alt="${listing.property_type || 'Property'}" data-listing-id="${listing.id}">
                    <button class="card-bookmark" aria-label="Save listing">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path d="M6 2h12v20l-6-4-6 4z"/>
                        </svg>
                    </button>
                </div>
                <div class="card-body">
                    <div class="card-type">${this.formatPropertyType(listing.property_type)}</div>
                    <h4 class="card-title">${listing.title || 'No title available'}</h4>
                    <div class="card-sub">${location}</div>
                    <div class="card-price">${formattedPrice}<span class="card-period">/month</span></div>
                    <div class="card-meta">
                        <div class="agent">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM2 20a9.99 9.99 0 0 1 20 0z"/>
                            </svg>
                            <span>${agentName}</span>
                        </div>
                        <div class="time-published" title="Published ${listing.time_since_published} ago">
                            <svg viewBox="0 0 24 24" width="14" height="14" style="fill: var(--muted);">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                            <span>${listing.time_since_published || 'Recently'}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        let starsHTML = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 17.3l6.18 3.73-1.64-7.03L21.5 9.5l-7.2-.61L12 2 9.7 8.89 2.5 9.5l4.96 4.5L5.82 21z"/></svg>';
            } else {
                starsHTML += '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 17.3l6.18 3.73-1.64-7.03L21.5 9.5l-7.2-.61L12 2 9.7 8.89 2.5 9.5l4.96 4.5L5.82 21z" fill="#ddd"/></svg>';
            }
        }
        
        return starsHTML;
    }

    formatPropertyType(propertyType) {
        const typeMap = {
            'mini_flat': 'Mini Flat',
            'apartment': 'Apartment',
            'self_contain': 'Self Contain',
            'duplex': 'Duplex',
            'bungalow': 'Bungalow',
            'studio': 'Studio',
            'self_contained': 'Self Contained'
        };
        return typeMap[propertyType] || propertyType || 'Property';
    }

    formatPrice(price, currency = 'NGN') {
        if (!price) return 'Price not specified';
        
        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) return price;
        
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(priceNum);
    }

    getValidImageUrl(images) {
        if (!images || images.length === 0) {
            return this.getDefaultPlaceholder();
        }
        
        const firstImage = images[0];
        
        // Check if it's a valid Cloudinary URL (from your API response)
        if (firstImage.includes('cloudinary.com')) {
            return firstImage;
        }
        
        // Check if it's a relative path that might not exist
        if (firstImage.startsWith('assets/') || firstImage.includes('images/')) {
            console.warn('⚠️ Using placeholder for relative image path:', firstImage);
            return this.getDefaultPlaceholder();
        }
        
        // For any other URLs, try them but have fallback
        return firstImage;
    }

    getDefaultPlaceholder() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb3BlcnR5IEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
    }

    setupImageErrorHandling() {
        if (!this.propertiesGrid) return;
        
        const images = this.propertiesGrid.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                console.log('🖼️ Image failed to load, using placeholder:', img.src);
                img.src = this.getDefaultPlaceholder();
                img.onerror = null; // Remove the event listener to prevent infinite loops
            });
        });
    }

    initializeCardInteractions() {
        this.setupCardClickHandlers();
        
        // Re-initialize bookmark functionality
        const cardBookmarkButtons = document.querySelectorAll('.card-bookmark');
        cardBookmarkButtons.forEach(button => {
            const card = button.closest('.card');
            if (card && card.dataset.id) {
                const listingId = card.dataset.id;
                const isBookmarked = window.bookmarkManager.isBookmarked(listingId);
                window.bookmarkManager.updateCardBookmarkUI(button, isBookmarked);
            }
        });
    }

    setupCardClickHandlers() {
        console.log('🔄 Setting up property card click handlers...');
        
        const propertyCards = document.querySelectorAll('.card[data-id]');
        console.log(`📦 Found ${propertyCards.length} property cards for click handling`);
        
        propertyCards.forEach((card, index) => {
            const listingId = card.getAttribute('data-id');
            console.log(`🏠 Card ${index + 1} - ID: ${listingId}`);
            
            // Add click handler
            card.addEventListener('click', function(e) {
                console.log('🎯 Property card clicked!');
                console.log('🎯 Clicked element:', e.target);
                console.log('🎯 Is bookmark?', e.target.closest('.card-bookmark'));
                
                // Don't navigate if clicking bookmark button
                if (e.target.closest('.card-bookmark')) {
                    console.log('📌 Bookmark clicked - ignoring navigation');
                    return;
                }
                
                console.log('🚀 Navigating to property details:', listingId);
                
                // Navigate to property details page with the actual listing ID
                window.location.href = `property-details.html?id=${listingId}`;
            });
            
            // Visual feedback
            card.style.cursor = 'pointer';
            card.style.transition = 'all 0.3s ease';
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--card-shadow)';
            });
        });
    }

    showNoResultsState(searchQuery) {
        if (this.propertiesGrid) {
            this.propertiesGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                    <h3 style="color: var(--muted); margin-bottom: 10px;">No Properties Found</h3>
                    <p style="color: var(--muted); margin-bottom: 20px;">${searchQuery ? `No properties match "${searchQuery}"` : 'No properties available with current filters'}</p>
                    <button onclick="window.propertyRenderer.refreshProperties()" 
                            style="padding: 10px 20px; background: var(--accent); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        View All Properties
                    </button>
                </div>
            `;
        }
    }

    showSearchResultsCount(count, query) {
        const existingCount = document.querySelector('.search-results-count');
        if (existingCount) {
            existingCount.remove();
        }

        const countElement = document.createElement('div');
        countElement.className = 'search-results-count';
        countElement.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background: #f0f9f0;
            border-radius: 8px;
            color: var(--accent-dark);
            font-weight: 500;
        `;
        countElement.innerHTML = `
            Found ${count} ${count === 1 ? 'property' : 'properties'} ${query ? `for "${query}"` : ''}
        `;

        if (this.propertiesGrid && this.propertiesGrid.parentNode) {
            this.propertiesGrid.parentNode.insertBefore(countElement, this.propertiesGrid);
        }
    }

    async applyFilters(filters = {}) {
        try {
            console.log('🔍 Applying filters:', filters);
            await this.loadAndRenderProperties(filters);
        } catch (error) {
            console.error('Error applying filters:', error);
            this.showErrorState();
        }
    }

    async refreshProperties() {
        await this.loadAndRenderProperties({});
    }

    showEmptyState() {
        if (this.propertiesGrid) {
            this.propertiesGrid.innerHTML = `
                <div class="empty-properties" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🏠</div>
                    <h3 style="color: var(--muted); margin-bottom: 10px;">No Properties Available</h3>
                    <p style="color: var(--muted);">Check back later for new property listings.</p>
                </div>
            `;
        }
    }

    showErrorState() {
        if (this.propertiesGrid) {
            this.propertiesGrid.innerHTML = `
                <div class="error-properties" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                    <h3 style="color: var(--muted); margin-bottom: 10px;">Unable to Load Properties</h3>
                    <p style="color: var(--muted);">Please check your connection and try again.</p>
                    <button onclick="window.propertyRenderer.refreshProperties()" style="margin-top: 20px; padding: 10px 20px; background: var(--accent); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
}

// ========== FILTER PANEL FUNCTIONALITY ==========
class FilterPanel {
    constructor() {
        this.filterToggle = document.getElementById('filter-toggle');
        this.filterPanel = document.getElementById('filter-panel');
        this.closeFilterPanel = document.querySelector('.close-filter-panel');
        this.applyFiltersBtn = document.getElementById('apply-filters');
        this.clearFiltersBtn = document.getElementById('clear-filters');
        this.searchInput = document.getElementById('q');
        this.searchForm = document.querySelector('.search-form');
        
        // Filter elements
        this.stateSelect = document.getElementById('state-select');
        this.citySelect = document.getElementById('city-select');
        this.propertyTypeSelect = document.getElementById('property-type-select');
        this.priceRangeSelect = document.getElementById('price-range');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFilterOptions();
    }

    async loadFilterOptions() {
        try {
            console.log('🔍 Loading filter options from API...');
            
            // Fetch from both endpoints to get all options
            const [landlordResponse, agentResponse] = await Promise.all([
                fetch('https://rentmenaija-a4ed.onrender.com/api/listings/'),
                fetch('https://rentmenaija-a4ed.onrender.com/api/agent-listings/')
            ]);
            
            let allListings = [];
            
            if (landlordResponse.ok) {
                const landlordListings = await landlordResponse.json();
                allListings = [...allListings, ...landlordListings];
            }
            
            if (agentResponse.ok) {
                const agentListings = await agentResponse.json();
                allListings = [...allListings, ...agentListings];
            }
            
            console.log('✅ Filter options loaded from both APIs:', allListings.length, 'listings');
            this.populateFilterOptions(allListings);
            
        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    }

    populateFilterOptions(listings) {
        // Extract unique states and cities
        const states = new Set();
        const cities = new Set();
        const propertyTypes = new Set();
        
        listings.forEach(listing => {
            if (listing.state && listing.state.trim()) {
                // Remove "State" suffix for display
                const displayState = listing.state.replace(/ State$/i, '');
                states.add(displayState.trim());
            }
            if (listing.city && listing.city.trim()) {
                cities.add(listing.city.trim());
            }
            if (listing.property_type && listing.property_type.trim()) {
                const formattedType = this.formatPropertyTypeDisplay(listing.property_type);
                propertyTypes.add(formattedType);
            }
        });

        // Update state select
        if (this.stateSelect) {
            // Clear existing options except the first one
            while (this.stateSelect.options.length > 1) {
                this.stateSelect.remove(1);
            }
            
            // Add states alphabetically
            Array.from(states).sort().forEach(state => {
                const option = new Option(state, state);
                this.stateSelect.add(option);
            });
            
            console.log(`📊 Loaded ${states.size} states`);
        }

        // Update city select
        if (this.citySelect) {
            // Clear existing options except the first one
            while (this.citySelect.options.length > 1) {
                this.citySelect.remove(1);
            }
            
            // Add cities alphabetically
            Array.from(cities).sort().forEach(city => {
                const option = new Option(city, city);
                this.citySelect.add(option);
            });
            
            console.log(`📊 Loaded ${cities.size} cities`);
        }

        // Update property type select if it exists
        if (this.propertyTypeSelect) {
            // Clear existing options except the first one
            while (this.propertyTypeSelect.options.length > 1) {
                this.propertyTypeSelect.remove(1);
            }
            
            // Add property types alphabetically
            Array.from(propertyTypes).sort().forEach(type => {
                const option = new Option(type, this.getPropertyTypeValue(type));
                this.propertyTypeSelect.add(option);
            });
            
            console.log(`📊 Loaded ${propertyTypes.size} property types`);
        }
    }

    getPropertyTypeValue(displayType) {
        const typeMap = {
            'Mini Flat': 'mini_flat',
            'Apartment': 'apartment',
            'Self Contain': 'self_contain',
            'Duplex': 'duplex',
            'Bungalow': 'bungalow',
            'Studio': 'studio'
        };
        return typeMap[displayType] || displayType.toLowerCase();
    }

    setupEventListeners() {
        // Toggle filter panel
        if (this.filterToggle) {
            this.filterToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFilterPanel();
            });
        }

        // Close filter panel
        if (this.closeFilterPanel) {
            this.closeFilterPanel.addEventListener('click', () => {
                this.closeFilterPanelFunc();
            });
        }

        // Apply filters
        if (this.applyFiltersBtn) {
            this.applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Clear filters
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Search form submission
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Close filter when clicking outside
        document.addEventListener('click', (e) => {
            if (this.filterPanel && !this.filterPanel.contains(e.target) && 
                this.filterToggle && !this.filterToggle.contains(e.target)) {
                this.closeFilterPanelFunc();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.filterPanel && this.filterPanel.classList.contains('active')) {
                this.closeFilterPanelFunc();
            }
        });

        // Update city options based on state selection
        if (this.stateSelect) {
            this.stateSelect.addEventListener('change', () => {
                this.updateCityOptions();
            });
        }

        // Auto-search when user types (with debounce)
        if (this.searchInput) {
            let searchTimeout;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.trim();
                    if (query.length >= 2 || query.length === 0) {
                        this.handleSearch();
                    }
                }, 500);
            });
        }
    }

    async updateCityOptions() {
        const selectedState = this.stateSelect?.value;
        if (!selectedState) return;

        try {
            console.log(`🔍 Loading cities for state: ${selectedState}`);
            
            // Add "State" suffix for API call
            const apiState = selectedState.includes('State') ? selectedState : `${selectedState} State`;
            
            // Fetch from both endpoints
            const [landlordResponse, agentResponse] = await Promise.all([
                fetch(`https://rentmenaija-a4ed.onrender.com/api/listings/?state=${encodeURIComponent(apiState)}`),
                fetch(`https://rentmenaija-a4ed.onrender.com/api/agent-listings/?state=${encodeURIComponent(apiState)}`)
            ]);
            
            const cities = new Set();
            
            // Process landlord listings
            if (landlordResponse.ok) {
                const landlordListings = await landlordResponse.json();
                landlordListings.forEach(listing => {
                    if (listing.city && listing.city.trim()) {
                        cities.add(listing.city.trim());
                    }
                });
            }
            
            // Process agent listings
            if (agentResponse.ok) {
                const agentListings = await agentResponse.json();
                agentListings.forEach(listing => {
                    if (listing.city && listing.city.trim()) {
                        cities.add(listing.city.trim());
                    }
                });
            }

            // Update city select
            if (this.citySelect) {
                // Clear existing options except the first one
                this.citySelect.innerHTML = '<option value="">Select City</option>';
                
                // Add cities alphabetically
                Array.from(cities).sort().forEach(city => {
                    const option = new Option(city, city);
                    this.citySelect.add(option);
                });
                
                console.log(`📊 Loaded ${cities.size} cities for ${selectedState}`);
            }
        } catch (error) {
            console.error('Error updating city options:', error);
        }
    }

    toggleFilterPanel() {
        if (this.filterToggle && this.filterPanel) {
            const isExpanded = this.filterToggle.classList.toggle('active');
            this.filterPanel.classList.toggle('active');
            this.filterToggle.setAttribute('aria-expanded', isExpanded.toString());
        }
    }

    closeFilterPanelFunc() {
        if (this.filterPanel && this.filterToggle) {
            this.filterPanel.classList.remove('active');
            this.filterToggle.classList.remove('active');
            this.filterToggle.setAttribute('aria-expanded', 'false');
        }
    }

    applyFilters() {
        const filters = this.getCurrentFilters();
        console.log('🔍 Applying filters:', filters);
        
        // Apply filters to property renderer
        if (window.propertyRenderer) {
            window.propertyRenderer.applyFilters(filters);
        }
        
        // Close the filter panel
        this.closeFilterPanelFunc();
        
        // Show feedback to user
        this.showFilterFeedback(filters);
    }

    handleSearch() {
        const searchQuery = this.searchInput ? this.searchInput.value.trim() : '';
        console.log('🔍 Search query:', searchQuery);
        
        // Build filters with search query
        const filters = this.getCurrentFilters();
        
        // Only add search query if it exists
        if (searchQuery) {
            filters.q = searchQuery;
        } else {
            // Remove search filter if empty
            delete filters.q;
        }
        
        console.log('🔍 Applying search filters:', filters);
        
        // Apply search filters to property renderer
        if (window.propertyRenderer) {
            window.propertyRenderer.applyFilters(filters);
        }
        
        // Show feedback
        if (searchQuery) {
            this.showNotification(`Searching for: ${searchQuery}`);
        } else {
            this.showNotification('Showing all properties');
        }
    }

    getCurrentFilters() {
        const filters = {};
        
        // Get search query
        if (this.searchInput && this.searchInput.value.trim()) {
            filters.q = this.searchInput.value.trim();
        }
        
        // Get state filter (add "State" suffix for API)
        if (this.stateSelect && this.stateSelect.value) {
            const selectedState = this.stateSelect.value;
            // Add "State" suffix if not already present
            filters.state = selectedState.includes('State') ? selectedState : `${selectedState} State`;
        }
        
        // Get city filter
        if (this.citySelect && this.citySelect.value) {
            filters.city = this.citySelect.value;
        }
        
        // Get property type filter
        if (this.propertyTypeSelect && this.propertyTypeSelect.value) {
            filters.property_type = this.propertyTypeSelect.value;
        }
        
        // Get price range filter
        if (this.priceRangeSelect && this.priceRangeSelect.value) {
            const [priceMin, priceMax] = this.priceRangeSelect.value.split('-');
            if (priceMin && priceMin !== '') filters.price_min = priceMin.replace(/[^0-9]/g, '');
            if (priceMax && priceMax !== '') filters.price_max = priceMax.replace(/[^0-9]/g, '');
        }
        
        console.log('🔍 Current filters:', filters);
        return filters;
    }

    clearFilters() {
        // Reset all filter inputs
        if (this.stateSelect) this.stateSelect.value = '';
        if (this.citySelect) this.citySelect.value = '';
        if (this.priceRangeSelect) this.priceRangeSelect.value = '';
        if (this.propertyTypeSelect) this.propertyTypeSelect.value = '';
        if (this.searchInput) this.searchInput.value = '';
        
        console.log('🧹 Filters cleared');
        
        // Refresh properties without filters
        if (window.propertyRenderer) {
            window.propertyRenderer.refreshProperties();
        }
        
        // Show feedback
        this.showNotification('All filters cleared');
    }

    showFilterFeedback(filters) {
        let message = 'Filters applied: ';
        const activeFilters = [];
        
        if (filters.state) {
            const displayState = filters.state.replace(/ State$/i, '');
            activeFilters.push(`State: ${displayState}`);
        }
        if (filters.city) activeFilters.push(`City: ${filters.city}`);
        if (filters.property_type) activeFilters.push(`Type: ${this.formatPropertyTypeDisplay(filters.property_type)}`);
        if (filters.price_min || filters.price_max) {
            const priceText = filters.price_min && filters.price_max 
                ? `₦${parseInt(filters.price_min).toLocaleString()} - ₦${parseInt(filters.price_max).toLocaleString()}`
                : filters.price_min 
                    ? `From ₦${parseInt(filters.price_min).toLocaleString()}`
                    : `Up to ₦${parseInt(filters.price_max).toLocaleString()}`;
            activeFilters.push(`Price: ${priceText}`);
        }
        if (filters.q) activeFilters.push(`Search: "${filters.q}"`);
        
        if (activeFilters.length > 0) {
            message += activeFilters.join(', ');
        } else {
            message = 'Showing all properties';
        }
        
        this.showNotification(message);
    }

    formatPropertyTypeDisplay(propertyType) {
        const typeMap = {
            'mini_flat': 'Mini Flat',
            'apartment': 'Apartment',
            'self_contain': 'Self Contain',
            'duplex': 'Duplex',
            'bungalow': 'Bungalow',
            'studio': 'Studio'
        };
        return typeMap[propertyType] || propertyType;
    }

    showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.filter-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'filter-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.innerHTML = `
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// ========== BOOKMARK MANAGEMENT SYSTEM ==========
class BookmarkManager {
    constructor() {
        // Singleton pattern to prevent multiple instances
        if (window.bookmarkManager) {
            return window.bookmarkManager;
        }
        
        this.storageKey = 'rentme_bookmarks';
        this.bookmarks = this.loadBookmarks();
        this.init();
        window.bookmarkManager = this;
    }

    init() {
        this.updateHeaderBookmarkCount();
        this.setupBookmarkListeners();
    }

    loadBookmarks() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return [];
            
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            return [];
        }
    }

    saveBookmarks() {
        try {
            const data = JSON.stringify(this.bookmarks);
            
            // Check storage quota (approx 5MB)
            if (data.length > 5000000) {
                this.bookmarks = this.bookmarks.slice(0, 50);
                this.showNotification('Bookmarks cleared due to storage limits');
            }
            
            localStorage.setItem(this.storageKey, data);
            this.updateHeaderBookmarkCount();
            this.dispatchBookmarkUpdate();
        } catch (error) {
            console.error('Error saving bookmarks:', error);
            if (error.name === 'QuotaExceededError') {
                this.showNotification('Storage full - some bookmarks were cleared');
                this.bookmarks = this.bookmarks.slice(0, 25);
                setTimeout(() => this.saveBookmarks(), 100);
            }
        }
    }

    getAllBookmarks() {
        return [...this.bookmarks]; // Return copy to prevent mutation
    }

    addBookmark(propertyData) {
        // Validate input data
        if (!propertyData || !propertyData.id) {
            console.error('Invalid property data: missing id');
            return false;
        }

        // Check if already bookmarked
        const existingIndex = this.bookmarks.findIndex(b => b.id === propertyData.id);
        
        if (existingIndex === -1) {
            this.bookmarks.unshift({
                ...this.validatePropertyData(propertyData),
                dateAdded: new Date().toISOString()
            });
            this.saveBookmarks();
            this.showNotification('Property added to bookmarks');
            return true;
        }
        return false;
    }

    removeBookmark(propertyId) {
        if (!propertyId) {
            console.warn('removeBookmark called without propertyId');
            return false;
        }

        const initialLength = this.bookmarks.length;
        this.bookmarks = this.bookmarks.filter(b => b.id !== propertyId);
        
        if (this.bookmarks.length !== initialLength) {
            this.saveBookmarks();
            this.showNotification('Property removed from bookmarks');
            this.updateCardBookmarkState(propertyId, false);
            return true;
        }
        return false;
    }

    isBookmarked(propertyId) {
        return this.bookmarks.some(b => b.id === propertyId);
    }

    updateHeaderBookmarkCount() {
        const bookmarkCountElements = document.querySelectorAll('.bookmark-count');
        const headerBookmark = document.querySelector('.header-bookmark');
        const count = this.bookmarks.length;

        bookmarkCountElements.forEach(element => {
            if (!element) return;
            
            element.textContent = count;
            if (count > 0) {
                element.style.display = 'flex';
                if (headerBookmark) {
                    headerBookmark.classList.add('has-bookmarks');
                }
            } else {
                element.style.display = 'none';
                if (headerBookmark) {
                    headerBookmark.classList.remove('has-bookmarks');
                }
            }
        });
    }

    setupBookmarkListeners() {
        // Use event delegation for better performance
        document.addEventListener('click', (e) => {
            // Card bookmark buttons
            const bookmarkBtn = e.target.closest('.card-bookmark');
            if (bookmarkBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = bookmarkBtn.closest('.card');
                if (card) {
                    this.toggleCardBookmark(card, bookmarkBtn);
                }
                return;
            }

            // Remove buttons in dropdown
            const removeBtn = e.target.closest('.remove-bookmark');
            if (removeBtn) {
                e.stopPropagation();
                const propertyId = removeBtn.dataset.id;
                if (propertyId) {
                    this.removeBookmark(propertyId);
                    this.renderBookmarkDropdown();
                }
                return;
            }

            // Bookmark item clicks
            const bookmarkItem = e.target.closest('.bookmark-item');
            if (bookmarkItem) {
                const propertyId = bookmarkItem.dataset.id;
                if (propertyId) {
                    this.navigateToProperty(propertyId);
                }
                return;
            }

            // Close dropdown when clicking outside
            if (this.isBookmarkDropdownOpen()) {
                const dropdown = document.querySelector('.bookmark-dropdown');
                const overlay = document.querySelector('.bookmark-dropdown-overlay');
                
                if (e.target.closest('.close-dropdown') || 
                    e.target === overlay || 
                    (!e.target.closest('.bookmark-dropdown') && !e.target.closest('.header-bookmark'))) {
                    this.closeBookmarkDropdown();
                }
            }
        });

        // Header bookmark click - open dropdown
        const headerBookmark = document.querySelector('.header-bookmark');
        if (headerBookmark) {
            headerBookmark.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleBookmarkDropdown();
            });
        }

        // View all bookmarks button
        const viewAllBtn = document.querySelector('.view-all-bookmarks');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'bookmarks.html';
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isBookmarkDropdownOpen()) {
                this.closeBookmarkDropdown();
            }
        });
    }

    toggleCardBookmark(card, bookmarkBtn) {
        const propertyId = card.dataset.id;
        
        if (!propertyId) {
            console.warn('Card missing data-id attribute');
            return;
        }

        if (this.isBookmarked(propertyId)) {
            // Remove bookmark
            this.removeBookmark(propertyId);
        } else {
            // Add bookmark
            const propertyData = this.extractPropertyData(card, propertyId);
            this.addBookmark(propertyData);
        }
        
        // Update UI immediately
        this.updateCardBookmarkUI(bookmarkBtn, this.isBookmarked(propertyId));
    }

    extractPropertyData(card, propertyId) {
        // More robust data extraction with better fallbacks
        const title = card.querySelector('.card-title')?.textContent?.trim() || 'Unknown Property';
        const location = card.querySelector('.card-sub')?.textContent?.trim() || 'Location not specified';
        const price = card.querySelector('.card-price')?.textContent?.trim() || 'Price not specified';
        const type = card.querySelector('.card-type')?.textContent?.trim() || 'Property';
        const agent = card.querySelector('.agent span')?.textContent?.trim() || 'Unknown Agent';
        const image = card.querySelector('.card-image img')?.src || '/assets/images/placeholder.jpg';
        
        // Better rating calculation - count only filled stars
        const ratingContainer = card.querySelector('.rating');
        let rating = 0;
        if (ratingContainer) {
            rating = ratingContainer.querySelectorAll('svg.filled, svg[fill*="#"]').length;
        }
        
        return {
            id: propertyId,
            title,
            location,
            price,
            type,
            agent,
            image,
            rating,
            dateAdded: new Date().toISOString()
        };
    }

    validatePropertyData(propertyData) {
        // Ensure all required fields have proper values
        return {
            id: propertyData.id || String(Date.now()),
            title: propertyData.title?.trim() || 'Unknown Property',
            location: propertyData.location?.trim() || 'Location not specified',
            price: propertyData.price?.trim() || 'Price not specified',
            type: propertyData.type?.trim() || 'Property',
            agent: propertyData.agent?.trim() || 'Unknown Agent',
            image: propertyData.image || '/assets/images/placeholder.jpg',
            rating: Math.max(0, Math.min(5, parseInt(propertyData.rating) || 0)),
            dateAdded: propertyData.dateAdded || new Date().toISOString()
        };
    }

    updateCardBookmarkUI(bookmarkBtn, isBookmarked) {
        if (!bookmarkBtn) return;
        
        if (isBookmarked) {
            bookmarkBtn.classList.add('saved');
            bookmarkBtn.style.background = '#116e35';
            const icon = bookmarkBtn.querySelector('svg');
            if (icon) {
                icon.style.fill = 'white';
            }
        } else {
            bookmarkBtn.classList.remove('saved');
            bookmarkBtn.style.background = 'rgba(255, 255, 255, 0.95)';
            const icon = bookmarkBtn.querySelector('svg');
            if (icon) {
                icon.style.fill = '';
            }
        }
    }

    updateCardBookmarkState(propertyId, isBookmarked) {
        const card = document.querySelector(`.card[data-id="${propertyId}"]`);
        if (card) {
            const cardBookmarkBtn = card.querySelector('.card-bookmark');
            if (cardBookmarkBtn) {
                this.updateCardBookmarkUI(cardBookmarkBtn, isBookmarked);
            }
        }
    }

    isBookmarkDropdownOpen() {
        const dropdown = document.querySelector('.bookmark-dropdown');
        return dropdown && dropdown.classList.contains('active');
    }

    toggleBookmarkDropdown() {
        if (this.isBookmarkDropdownOpen()) {
            this.closeBookmarkDropdown();
        } else {
            this.openBookmarkDropdown();
        }
    }

    openBookmarkDropdown() {
        const dropdown = document.querySelector('.bookmark-dropdown');
        const overlay = document.querySelector('.bookmark-dropdown-overlay');
        
        if (dropdown && overlay) {
            dropdown.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderBookmarkDropdown();
        } else {
            // Fallback: redirect to bookmarks page
            window.location.href = 'bookmarks.html';
        }
    }

    closeBookmarkDropdown() {
        const dropdown = document.querySelector('.bookmark-dropdown');
        const overlay = document.querySelector('.bookmark-dropdown-overlay');
        
        if (dropdown && overlay) {
            dropdown.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    renderBookmarkDropdown() {
        const dropdownContent = document.querySelector('.bookmark-dropdown-content');
        const emptyState = document.querySelector('.empty-bookmarks');
        const bookmarkList = document.querySelector('.bookmark-list');
        
        if (!dropdownContent) return;

        const bookmarks = this.getAllBookmarks();

        if (bookmarks.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            if (bookmarkList) bookmarkList.innerHTML = '';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        
        if (bookmarkList) {
            const limitedBookmarks = bookmarks.slice(0, 5); // Show max 5 items
            bookmarkList.innerHTML = limitedBookmarks.map(bookmark => `
                <div class="bookmark-item" data-id="${bookmark.id}">
                    <div class="bookmark-item-image">
                        <img src="${bookmark.image}" alt="${this.escapeHtml(bookmark.title)}" onerror="this.src='/assets/images/placeholder.jpg'">
                        <button class="remove-bookmark" aria-label="Remove from bookmarks" data-id="${bookmark.id}">
                            <svg viewBox="0 0 24 24" width="12" height="12">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="bookmark-item-info">
                        <h4>${this.escapeHtml(bookmark.type)}</h4>
                        <div class="bookmark-item-title">${this.escapeHtml(bookmark.title)}</div>
                        <div class="bookmark-item-price">${this.escapeHtml(bookmark.price)}</div>
                    </div>
                </div>
            `).join('');

            // Show "view all" message if there are more bookmarks
            if (bookmarks.length > 5) {
                const viewAllMessage = document.createElement('div');
                viewAllMessage.className = 'bookmark-view-all-message';
                viewAllMessage.textContent = `And ${bookmarks.length - 5} more bookmarks...`;
                bookmarkList.appendChild(viewAllMessage);
            }
        }
    }

    navigateToProperty(propertyId) {
        console.log('Navigate to property:', propertyId);
        // Navigate to property details page
        window.location.href = `property-details.html?id=${propertyId}`;
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.bookmark-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'bookmark-notification';
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <i>✓</i>
            <span>${this.escapeHtml(message)}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    dispatchBookmarkUpdate() {
        window.dispatchEvent(new CustomEvent('bookmarksUpdated', {
            detail: { bookmarks: this.bookmarks }
        }));
    }

    // Cleanup method for when the manager is no longer needed
    destroy() {
        // Remove event listeners if needed
        const headerBookmark = document.querySelector('.header-bookmark');
        if (headerBookmark) {
            headerBookmark.replaceWith(headerBookmark.cloneNode(true));
        }
    }
}

// ========== MOCK DATA FOR DEVELOPMENT ==========
// Remove this section when actual API is ready
// Simulate API response for development
window.mockUserAPI = {
    login: function(userData) {
        localStorage.setItem('mockUser', JSON.stringify(userData));
        window.dispatchEvent(new Event('userLogin'));
    },
    
    logout: function() {
        localStorage.removeItem('mockUser');
        window.dispatchEvent(new Event('userLogout'));
    },
    
    getCurrentUser: function() {
        const user = localStorage.getItem('mockUser');
        return user ? JSON.parse(user) : null;
    }
};

// ========== MAIN INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize user profile manager FIRST (so it updates UI immediately)
    window.userProfileManager = new UserProfileManager();
    
    // Initialize hamburger menu
    hamburger && hamburger.addEventListener('click', () => {
        const expanded = hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', expanded);
        if (mainNav) mainNav.classList.toggle('open');
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.closest('.site-header')) {
            if (mainNav && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Initialize filter panel only if it exists
    const filterPanelExists = document.getElementById('filter-toggle') || document.getElementById('filter-panel');
    if (filterPanelExists) {
        window.filterPanel = new FilterPanel();
    }
    
    // Initialize bookmark manager
    window.bookmarkManager = new BookmarkManager();
    
    // Initialize user avatar manager (after user profile manager)
    window.userAvatarManager = new UserAvatarManager();
    
    // Initialize property renderer ONLY if properties grid exists
    const propertiesGrid = document.querySelector('.cards-grid');
    if (propertiesGrid) {
        window.propertyRenderer = new PropertyRenderer();
        
        // Initialize card bookmarks state after properties are loaded
        setTimeout(() => {
            const cardBookmarkButtons = document.querySelectorAll('.card-bookmark');
            cardBookmarkButtons.forEach(button => {
                const card = button.closest('.card');
                if (card && card.dataset.id) {
                    const isBookmarked = window.bookmarkManager.isBookmarked(card.dataset.id);
                    window.bookmarkManager.updateCardBookmarkUI(button, isBookmarked);
                }
            });
        }, 1000);
    }
    
    // Add this: Check session on every page load
    console.log('🔍 Checking user session on page load...');
    window.userProfileManager.validateSession();
});

// ========== PROPERTY CARD CLICK HANDLING ==========
function initializePropertyCards() {
    console.log('🔄 Initializing property card clicks...');
    
    const propertyCards = document.querySelectorAll('.card[data-id]');
    console.log(`📦 Found ${propertyCards.length} property cards`);
    
    propertyCards.forEach((card, index) => {
        console.log(`🏠 Card ${index + 1}:`, card.getAttribute('data-id'));
        
        // Add click handler
        card.addEventListener('click', function(e) {
            console.log('🎯 Card clicked!');
            console.log('🎯 Clicked element:', e.target);
            console.log('🎯 Is bookmark?', e.target.closest('.card-bookmark'));
            
            // Don't navigate if clicking bookmark button
            if (e.target.closest('.card-bookmark')) {
                console.log('📌 Bookmark clicked - ignoring navigation');
                return;
            }
            
            const listingId = this.getAttribute('data-id');
            console.log('🚀 Navigating to property:', listingId);
            
            // Navigate to property details page with the actual listing ID
            window.location.href = `property-details.html?id=${listingId}`;
        });
        
        // Visual feedback
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--card-shadow)';
        });
    });
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BookmarkManager, UserProfileManager, FilterPanel };
}