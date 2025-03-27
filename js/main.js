// Common functionality for all pages

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // Initialize any common components
    initCommonComponents();
});

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.querySelector('.md\\:hidden + .hidden.md\\:flex');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Initialize common components
function initCommonComponents() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e) {
    const tooltip = e.target;
    const tooltipText = tooltip.getAttribute('title');
    
    // Create tooltip element
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'absolute z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded';
    tooltipElement.textContent = tooltipText;
    
    // Position tooltip
    const rect = tooltip.getBoundingClientRect();
    tooltipElement.style.top = `${rect.top - 30}px`;
    tooltipElement.style.left = `${rect.left + rect.width / 2}px`;
    tooltipElement.style.transform = 'translateX(-50%)';
    
    // Add to DOM
    tooltipElement.id = 'current-tooltip';
    document.body.appendChild(tooltipElement);
    
    // Remove title to prevent default behavior
    tooltip.removeAttribute('title');
}

// Hide tooltip
function hideTooltip(e) {
    const tooltip = document.getElementById('current-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
    // Restore title attribute
    e.target.setAttribute('title', tooltip.textContent);
}

// Local storage helper functions
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    const types = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg ${types[type] || types.info} animate-fade-in`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add animation classes to stylesheet
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fade-out {
            animation: fadeOut 0.3s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addAnimationStyles();