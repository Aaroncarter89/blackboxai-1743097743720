// Payment page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment method selection
    initPaymentMethods();
    
    // Initialize card validation
    initCardValidation();
    
    // Load booking summary
    loadBookingSummary();
    
    // Initialize payment button
    initPaymentButton();
});

// Payment method selection
function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            
            // Show/hide payment forms based on selection
            const methodType = method.textContent.trim().toLowerCase();
            showPaymentForm(methodType);
        });
    });
}

// Show appropriate payment form
function showPaymentForm(methodType) {
    // Hide all payment forms first
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    // Show selected form
    const formId = methodType.replace('/', '-').toLowerCase() + '-form';
    const form = document.getElementById(formId);
    if (form) {
        form.classList.remove('hidden');
    } else {
        // Default to card form if specific form not found
        document.getElementById('card-form').classList.remove('hidden');
    }
}

// Card validation
function initCardValidation() {
    const cardNumberInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
    const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
    const cvvInput = document.querySelector('input[placeholder="123"]');
    
    // Format card number
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
            
            // Detect card type
            detectCardType(value.replace(/\s/g, ''));
        });
    }
    
    // Format expiry date
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Limit CVV length
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

// Detect card type based on number
function detectCardType(cardNumber) {
    const cardIcon = document.getElementById('card-type-icon');
    if (!cardIcon) return;
    
    // Reset
    cardIcon.className = 'far fa-credit-card';
    
    // Visa
    if (/^4/.test(cardNumber)) {
        cardIcon.className = 'fab fa-cc-visa';
    }
    // Mastercard
    else if (/^5[1-5]/.test(cardNumber)) {
        cardIcon.className = 'fab fa-cc-mastercard';
    }
    // Amex
    else if (/^3[47]/.test(cardNumber)) {
        cardIcon.className = 'fab fa-cc-amex';
    }
    // Discover
    else if (/^6(?:011|5)/.test(cardNumber)) {
        cardIcon.className = 'fab fa-cc-discover';
    }
}

// Load booking summary from localStorage
function loadBookingSummary() {
    const bookingData = getFromLocalStorage('currentBooking');
    if (bookingData) {
        // Update booking summary
        document.getElementById('selectedSeats').textContent = bookingData.selectedSeats.join(', ');
        
        const seatPrice = 25.00;
        const baseFare = (bookingData.selectedSeats.length * seatPrice).toFixed(2);
        const taxes = (bookingData.selectedSeats.length * 2.50).toFixed(2);
        const total = (parseFloat(baseFare) + parseFloat(taxes)).toFixed(2);
        
        document.getElementById('baseFare').textContent = `$${baseFare}`;
        document.getElementById('taxes').textContent = `$${taxes}`;
        document.getElementById('totalAmount').textContent = `$${total}`;
        
        // Update payment button
        const payButton = document.getElementById('payButton');
        if (payButton) {
            payButton.innerHTML = `<span>Pay $${total}</span> <i class="fas fa-lock ml-2"></i>`;
        }
    }
}

// Initialize payment button
function initPaymentButton() {
    const payButton = document.getElementById('payButton');
    if (!payButton) return;
    
    payButton.addEventListener('click', function() {
        // Validate form
        const termsChecked = document.getElementById('terms').checked;
        if (!termsChecked) {
            showNotification('Please agree to the Terms & Conditions', 'error');
            return;
        }
        
        // Validate card details if card payment
        if (document.querySelector('.payment-method.active').textContent.includes('Card')) {
            if (!validateCardDetails()) {
                return;
            }
        }
        
        // Show loading
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        payButton.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            // On success
            processPaymentSuccess();
        }, 2000);
    });
}

// Validate card details
function validateCardDetails() {
    const cardNumber = document.querySelector('input[placeholder="1234 5678 9012 3456"]').value.replace(/\s/g, '');
    const expiry = document.querySelector('input[placeholder="MM/YY"]').value;
    const cvv = document.querySelector('input[placeholder="123"]').value;
    const cardName = document.querySelector('input[placeholder="Name on card"]').value;
    
    let isValid = true;
    
    // Validate card number (simple Luhn check)
    if (!cardNumber || !luhnCheck(cardNumber) || cardNumber.length < 13) {
        showValidationError(document.querySelector('input[placeholder="1234 5678 9012 3456"]'), 'Invalid card number');
        isValid = false;
    }
    
    // Validate expiry date
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        showValidationError(document.querySelector('input[placeholder="MM/YY"]'), 'Invalid expiry date');
        isValid = false;
    } else {
        const [month, year] = expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (parseInt(year) < currentYear || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showValidationError(document.querySelector('input[placeholder="MM/YY"]'), 'Card expired');
            isValid = false;
        }
    }
    
    // Validate CVV
    if (!cvv || cvv.length < 3) {
        showValidationError(document.querySelector('input[placeholder="123"]'), 'Invalid CVV');
        isValid = false;
    }
    
    // Validate card name
    if (!cardName.trim()) {
        showValidationError(document.querySelector('input[placeholder="Name on card"]'), 'Please enter cardholder name');
        isValid = false;
    }
    
    return isValid;
}

// Luhn algorithm for card validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (alternate) {
            digit *= 2;
            if (digit > 9) {
                digit = (digit % 10) + 1;
            }
        }
        
        sum += digit;
        alternate = !alternate;
    }
    
    return sum % 10 === 0;
}

// Process successful payment
function processPaymentSuccess() {
    const payButton = document.getElementById('payButton');
    const bookingData = getFromLocalStorage('currentBooking');
    
    if (bookingData) {
        // Create booking confirmation
        const bookingId = `BUS-${Date.now().toString().slice(-6)}`;
        const bookingDate = new Date().toLocaleDateString();
        
        const confirmedBooking = {
            ...bookingData,
            bookingId,
            bookingDate,
            status: 'confirmed',
            paymentAmount: document.getElementById('totalAmount').textContent
        };
        
        // Save to booking history
        let bookingHistory = getFromLocalStorage('bookingHistory') || [];
        bookingHistory.unshift(confirmedBooking);
        saveToLocalStorage('bookingHistory', bookingHistory);
        
        // Clear current booking
        localStorage.removeItem('currentBooking');
        
        // Update UI
        payButton.innerHTML = '<span>Payment Successful</span> <i class="fas fa-check ml-2"></i>';
        
        // Show confirmation and redirect
        setTimeout(() => {
            showNotification('Payment successful! Your booking is confirmed.', 'success');
            setTimeout(() => {
                window.location.href = 'history.html';
            }, 2000);
        }, 500);
    }
}