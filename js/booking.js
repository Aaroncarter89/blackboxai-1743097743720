// Booking page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize seat map
    initSeatMap();
    
    // Initialize passenger form validation
    initPassengerForm();
    
    // Load any existing booking data
    loadBookingData();
});

// Seat map functionality
function initSeatMap() {
    const seatMap = document.getElementById('seatMap');
    const selectedSeatsDisplay = document.getElementById('selectedSeats');
    const totalFareDisplay = document.getElementById('totalFare');
    
    let selectedSeats = [];
    const seatPrice = 25.00;
    const maxSeats = 5; // Maximum seats per booking

    // Sample seat data - in a real app this would come from an API
    const seatData = [
        { id: 'A1', status: 'available', type: 'standard' },
        { id: 'A2', status: 'available', type: 'standard' },
        { id: 'A3', status: 'booked', type: 'standard' },
        { id: 'A4', status: 'available', type: 'standard' },
        { id: 'B1', status: 'available', type: 'standard' },
        { id: 'B2', status: 'available', type: 'standard' },
        { id: 'B3', status: 'available', type: 'standard' },
        { id: 'B4', status: 'booked', type: 'standard' },
        { id: 'C1', status: 'available', type: 'standard' },
        { id: 'C2', status: 'available', type: 'standard' },
        { id: 'C3', status: 'available', type: 'standard' },
        { id: 'C4', status: 'available', type: 'standard' },
        { id: 'D1', status: 'available', type: 'standard' },
        { id: 'D2', status: 'booked', type: 'standard' },
        { id: 'D3', status: 'available', type: 'standard' },
        { id: 'D4', status: 'available', type: 'standard' }
    ];

    // Generate seats
    seatData.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.className = `seat ${seat.status}`;
        seatElement.textContent = seat.id;
        seatElement.dataset.id = seat.id;
        seatElement.dataset.status = seat.status;
        
        if (seat.status !== 'booked') {
            seatElement.addEventListener('click', () => toggleSeatSelection(seatElement));
        }
        
        seatMap.appendChild(seatElement);
    });

    // Toggle seat selection
    function toggleSeatSelection(seatElement) {
        const seatId = seatElement.dataset.id;
        const currentStatus = seatElement.dataset.status;
        
        if (currentStatus === 'selected') {
            // Deselect seat
            seatElement.className = 'seat available';
            seatElement.dataset.status = 'available';
            selectedSeats = selectedSeats.filter(id => id !== seatId);
        } else {
            // Check if maximum seats reached
            if (selectedSeats.length >= maxSeats) {
                showNotification(`Maximum ${maxSeats} seats per booking`, 'warning');
                return;
            }
            
            // Select seat
            seatElement.className = 'seat selected';
            seatElement.dataset.status = 'selected';
            selectedSeats.push(seatId);
        }
        
        updateBookingSummary();
        saveBookingData();
    }

    // Update booking summary
    function updateBookingSummary() {
        if (selectedSeats.length === 0) {
            selectedSeatsDisplay.textContent = 'None';
            totalFareDisplay.textContent = '$0.00';
        } else {
            selectedSeatsDisplay.textContent = selectedSeats.join(', ');
            const total = (selectedSeats.length * seatPrice).toFixed(2);
            totalFareDisplay.textContent = `$${total}`;
        }
    }
}

// Passenger form validation
function initPassengerForm() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        
        let isValid = true;
        
        // Validate name
        if (!nameInput.value.trim()) {
            showValidationError(nameInput, 'Please enter your full name');
            isValid = false;
        }
        
        // Validate email
        if (!validateEmail(emailInput.value)) {
            showValidationError(emailInput, 'Please enter a valid email');
            isValid = false;
        }
        
        // Validate phone
        if (!phoneInput.value.trim() || !/^\d{10,15}$/.test(phoneInput.value)) {
            showValidationError(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        }
        
        if (isValid) {
            // Proceed to payment
            window.location.href = 'payment.html';
        }
    });
}

// Show validation error
function showValidationError(input, message) {
    const errorElement = document.createElement('p');
    errorElement.className = 'text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    
    // Remove existing error if any
    const existingError = input.nextElementSibling;
    if (existingError && existingError.className.includes('text-red-500')) {
        existingError.remove();
    }
    
    input.classList.add('border-red-500');
    input.insertAdjacentElement('afterend', errorElement);
    
    // Remove error on input
    input.addEventListener('input', function() {
        this.classList.remove('border-red-500');
        if (errorElement) {
            errorElement.remove();
        }
    }, { once: true });
}

// Save booking data to localStorage
function saveBookingData() {
    const bookingData = {
        selectedSeats: Array.from(document.querySelectorAll('.seat.selected')).map(seat => seat.dataset.id),
        route: 'New York to Boston',
        date: 'Nov 15, 2023',
        departure: '08:00 AM',
        busType: 'AC Sleeper'
    };
    
    saveToLocalStorage('currentBooking', bookingData);
}

// Load booking data from localStorage
function loadBookingData() {
    const bookingData = getFromLocalStorage('currentBooking');
    if (bookingData) {
        // Update UI with loaded data
        document.getElementById('selectedSeats').textContent = bookingData.selectedSeats.join(', ') || 'None';
        
        const seatPrice = 25.00;
        const total = (bookingData.selectedSeats.length * seatPrice).toFixed(2);
        document.getElementById('totalFare').textContent = `$${total}`;
    }
}