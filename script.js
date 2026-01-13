  /**
 * ========================================
 * "Do You Love Me?" Interactive Website
 * ========================================
 * 
 * Features:
 * - Escaping "No" button that runs away from cursor
 * - Page navigation on "Yes" click
 * - Mobile touch support
 */

// ========================================
// DOM ELEMENTS
// ========================================
const yesBtn = document.getElementById('yesBtn');
const noBtn = document. getElementById('noBtn');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');

// ========================================
// CONFIGURATION - Customize behavior here
// ========================================
const config = {
    // Minimum distance (in pixels) the No button moves each time
    minMoveDistance: 100,
    // Maximum distance (in pixels) the No button moves each time
    maxMoveDistance: 200,
    // Padding from viewport edges (in pixels)
    edgePadding:  20,
    // Button dimensions for calculation
    buttonWidth: 80,
    buttonHeight: 45
};

// ========================================
// YES BUTTON - Navigate to Page 2
// ========================================
yesBtn.addEventListener('click', function() {
    // Hide page 1
    page1.classList.remove('active');
    
    // Show page 2
    page2.classList.add('active');
    
    // Optional: Update URL without page reload (for back button support)
    // history.pushState({ page: 2 }, '', '#loved');
});

// ========================================
// NO BUTTON - Escape Behavior
// ========================================

/**
 * Moves the No button to a random position within the viewport
 * This function is called whenever the user tries to hover/touch the button
 */
function escapeButton() {
    // Add escaping class for fixed positioning
    noBtn.classList.add('escaping');
    
    // Get viewport dimensions
    const viewportWidth = window. innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate safe bounds (keep button fully visible)
    const maxX = viewportWidth - config.buttonWidth - config.edgePadding;
    const maxY = viewportHeight - config. buttonHeight - config. edgePadding;
    const minX = config.edgePadding;
    const minY = config. edgePadding;
    
    // Get current button position
    const currentRect = noBtn.getBoundingClientRect();
    const currentX = currentRect. left;
    const currentY = currentRect.top;
    
    // Generate new random position
    let newX, newY;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Keep trying until we find a position far enough from current position
    do {
        newX = Math.random() * (maxX - minX) + minX;
        newY = Math.random() * (maxY - minY) + minY;
        attempts++;
        
        // Calculate distance from current position
        const distance = Math.sqrt(
            Math.pow(newX - currentX, 2) + 
            Math.pow(newY - currentY, 2)
        );
        
        // Accept position if it's far enough or we've tried too many times
        if (distance >= config. minMoveDistance || attempts >= maxAttempts) {
            break;
        }
    } while (true);
    
    // Apply new position
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
}

/**
 * Event Listeners for No Button
 * Multiple events to catch all interaction attempts
 */

// Desktop:  Mouse hover
noBtn.addEventListener('mouseenter', function(e) {
    e.preventDefault();
    escapeButton();
});

// Desktop: Mouse getting close (mouseover on button area)
noBtn.addEventListener('mouseover', function(e) {
    e.preventDefault();
    escapeButton();
});

// Mobile: Touch start
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent click from firing
    escapeButton();
}, { passive: false });

// Mobile: Touch end (backup)
noBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
});

// Prevent any click on No button (safety measure)
noBtn.addEventListener('click', function(e) {
    e.preventDefault();
    escapeButton();
});

// ========================================
// WINDOW RESIZE HANDLER
// ========================================
/**
 * If the No button is outside viewport after resize,
 * move it back to a visible position
 */
window.addEventListener('resize', function() {
    if (noBtn.classList.contains('escaping')) {
        const rect = noBtn.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Check if button is outside viewport
        if (rect.right > viewportWidth || 
            rect.bottom > viewportHeight ||
            rect.left < 0 ||
            rect.top < 0) {
            // Move to center of screen
            noBtn.style.left = `${(viewportWidth - config. buttonWidth) / 2}px`;
            noBtn.style.top = `${(viewportHeight - config.buttonHeight) / 2 + 100}px`;
        }
    }
});

// ========================================
// KEYBOARD ACCESSIBILITY (Optional)
// ========================================
/**
 * If someone tries to tab to the No button and press Enter
 * Still escape! 
 */
noBtn.addEventListener('focus', function() {
    escapeButton();
});

noBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        escapeButton();
    }
});

// ========================================
// BACK BUTTON SUPPORT (Optional)
// ========================================
window.addEventListener('popstate', function(e) {
    // Return to page 1 if back button pressed
    page2.classList.remove('active');
    page1.classList.add('active');
    
    // Reset No button position
    noBtn.classList.remove('escaping');
    noBtn.style.left = '';
    noBtn. style.top = '';
});