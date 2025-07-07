// Global variables
let hotelCount = 0;
const maxHotels = 3;

// Predefined hotel options
const hotelOptions = [
    'Ramada by Wyndham Panama',
    'Riande Urban Hotel',
    'The Executive Hotel',
    'Marinn Place Financial District',
    'Hotel Riu Plaza',
    'Holiday Inn Financial Distrito',
    'Megapolis Hotel Panama'
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add initial hotel option
    addHotel();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('endDate').setAttribute('min', today);
    
    // Add event listeners for date validation
    document.getElementById('startDate').addEventListener('change', validateDates);
    document.getElementById('endDate').addEventListener('change', validateDates);
});

// Add hotel option
function addHotel() {
    if (hotelCount >= maxHotels) {
        return;
    }
    
    hotelCount++;
    const hotelContainer = document.getElementById('hotelContainer');
    
    const hotelSection = document.createElement('div');
    hotelSection.className = 'hotel-section';
    hotelSection.id = `hotel-${hotelCount}`;
    
    hotelSection.innerHTML = `
        <div class="hotel-header">
            <div class="hotel-title">Hotel Option ${hotelCount}</div>
            ${hotelCount > 1 ? `<button class="remove-hotel" onclick="removeHotel(${hotelCount})">Remove</button>` : ''}
        </div>
        <div class="hotel-inputs">
            <div>
                <select id="hotelSelect-${hotelCount}" onchange="toggleCustomHotel(${hotelCount})">
                    <option value="">Select a hotel...</option>
                    ${hotelOptions.map(hotel => `<option value="${hotel}">${hotel}</option>`).join('')}
                    <option value="custom">Other (Enter custom name)</option>
                </select>
                <div class="custom-hotel-input" id="customHotel-${hotelCount}">
                    <input type="text" id="customHotelName-${hotelCount}" placeholder="Enter hotel name">
                </div>
                <div class="error-message" id="hotelNameError-${hotelCount}"></div>
            </div>
            <div>
                <input type="number" id="hotelPrice-${hotelCount}" placeholder="Hotel price" min="0" step="0.01">
                <div class="error-message" id="hotelPriceError-${hotelCount}"></div>
            </div>
        </div>
    `;
    
    hotelContainer.appendChild(hotelSection);
    
    // Update add button state
    if (hotelCount >= maxHotels) {
        document.querySelector('.add-hotel-btn').disabled = true;
        document.querySelector('.add-hotel-btn').textContent = 'Maximum hotels reached';
    }
}

// Remove hotel option
function removeHotel(hotelId) {
    const hotelSection = document.getElementById(`hotel-${hotelId}`);
    if (hotelSection) {
        hotelSection.remove();
        hotelCount--;
        
        // Re-enable add button if needed
        const addBtn = document.querySelector('.add-hotel-btn');
        if (hotelCount < maxHotels) {
            addBtn.disabled = false;
            addBtn.textContent = '+ Add Hotel Option';
        }
        
        // Renumber remaining hotels
        renumberHotels();
    }
}

// Renumber hotels after removal
function renumberHotels() {
    const hotels = document.querySelectorAll('.hotel-section');
    hotels.forEach((hotel, index) => {
        const newNumber = index + 1;
        hotel.id = `hotel-${newNumber}`;
        hotel.querySelector('.hotel-title').textContent = `Hotel Option ${newNumber}`;
        
        // Update all IDs and onclick handlers
        const select = hotel.querySelector('select');
        select.id = `hotelSelect-${newNumber}`;
        select.setAttribute('onchange', `toggleCustomHotel(${newNumber})`);
        
        const customDiv = hotel.querySelector('.custom-hotel-input');
        customDiv.id = `customHotel-${newNumber}`;
        
        const customInput = hotel.querySelector('.custom-hotel-input input');
        customInput.id = `customHotelName-${newNumber}`;
        
        const priceInput = hotel.querySelector('input[type="number"]');
        priceInput.id = `hotelPrice-${newNumber}`;
        
        const removeBtn = hotel.querySelector('.remove-hotel');
        if (removeBtn) {
            removeBtn.setAttribute('onclick', `removeHotel(${newNumber})`);
        }
        
        // Update error message IDs
        const nameError = hotel.querySelector('.error-message');
        nameError.id = `hotelNameError-${newNumber}`;
        
        const priceError = hotel.querySelectorAll('.error-message')[1];
        priceError.id = `hotelPriceError-${newNumber}`;
    });
}

// Toggle custom hotel input
function toggleCustomHotel(hotelId) {
    const select = document.getElementById(`hotelSelect-${hotelId}`);
    const customDiv = document.getElementById(`customHotel-${hotelId}`);
    
    if (select.value === 'custom') {
        customDiv.classList.add('show');
    } else {
        customDiv.classList.remove('show');
    }
}

// Validate dates
function validateDates() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start >= end) {
            showError('endDateError', 'End date must be after start date');
            return false;
        } else {
            hideError('endDateError');
        }
    }
    
    return true;
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Hide error message
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.remove('show');
}

// Validate form inputs
function validateForm() {
    let isValid = true;
    
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
    
    // Validate dates
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate) {
        showError('startDateError', 'Start date is required');
        isValid = false;
    }
    
    if (!endDate) {
        showError('endDateError', 'End date is required');
        isValid = false;
    }
    
    if (startDate && endDate && !validateDates()) {
        isValid = false;
    }
    
    // Validate people count
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    
    if (adults < 0) {
        showError('adultsError', 'Number of adults cannot be negative');
        isValid = false;
    }
    
    if (children < 0) {
        showError('childrenError', 'Number of children cannot be negative');
        isValid = false;
    }
    
    if (adults + children === 0) {
        showError('adultsError', 'At least one traveler is required');
        isValid = false;
    }
    
    // Validate flight price
    const flightPrice = parseFloat(document.getElementById('flightPrice').value);
    if (!flightPrice || flightPrice <= 0) {
        showError('flightPriceError', 'Valid flight price is required');
        isValid = false;
    }
    
    // Validate hotels
    const hotels = document.querySelectorAll('.hotel-section');
    if (hotels.length === 0) {
        isValid = false;
        alert('At least one hotel option is required');
    }
    
    hotels.forEach((hotel, index) => {
        const hotelId = index + 1;
        const select = document.getElementById(`hotelSelect-${hotelId}`);
        const customInput = document.getElementById(`customHotelName-${hotelId}`);
        const priceInput = document.getElementById(`hotelPrice-${hotelId}`);
        
        // Validate hotel name
        let hotelName = '';
        if (select.value === 'custom') {
            hotelName = customInput.value.trim();
            if (!hotelName) {
                showError(`hotelNameError-${hotelId}`, 'Custom hotel name is required');
                isValid = false;
            }
        } else if (!select.value) {
            showError(`hotelNameError-${hotelId}`, 'Hotel selection is required');
            isValid = false;
        }
        
        // Validate hotel price
        const hotelPrice = parseFloat(priceInput.value);
        if (!hotelPrice || hotelPrice <= 0) {
            showError(`hotelPriceError-${hotelId}`, 'Valid hotel price is required');
            isValid = false;
        }
    });
    
    return isValid;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Calculate package details
function calculatePackage(flightPrice, hotelPrice, adults, children) {
    const totalPeople = adults + children;
    const baseCost = flightPrice + hotelPrice;
    
    // Calculate taxi fee
    let taxiFee = 50;
    if (totalPeople > 2) {
        taxiFee = 50 + (10 * (totalPeople - 2));
    }
    
    // Calculate service fee
    let serviceFee;
    if (adults === 1 && children === 0) {
        serviceFee = 130;
    } else {
        serviceFee = 65 * totalPeople;
    }
    
    // Calculate subtotals
    const subtotal1 = baseCost + taxiFee + serviceFee;
    const subtotal2 = subtotal1 * 2.03;
    const subtotal3 = subtotal2 + (subtotal2 * 0.02);
    const totalPackageBeforeRounding = subtotal3 / 2;
    
    // Round up to nearest dollar
    const finalTotal = Math.ceil(totalPackageBeforeRounding);
    
    // Calculate per person fee (not rounded)
    const perPersonFee = finalTotal / totalPeople;
    
    return {
        finalTotal,
        perPersonFee: perPersonFee.toFixed(2)
    };
}

// Generate quote
function generateQuote() {
    if (!validateForm()) {
        return;
    }
    
    // Get form values
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const flightPrice = parseFloat(document.getElementById('flightPrice').value);
    
    // Format dates
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);
    const dateRange = `${startFormatted.split(',')[0]} – ${endFormatted.split(' ').pop()}, ${endFormatted.split(' ').pop()}`;
    
    // Format travelers
    let travelerText = '';
    if (adults > 0) {
        travelerText += `${adults} Adult${adults > 1 ? 's' : ''}`;
    }
    if (children > 0) {
        if (travelerText) travelerText += ', ';
        travelerText += `${children} Child${children > 1 ? 'ren' : ''}`;
    }
    
    // Generate hotel options
    const hotels = document.querySelectorAll('.hotel-section');
    let hotelOptionsText = '';
    
    hotels.forEach((hotel, index) => {
        const hotelId = index + 1;
        const select = document.getElementById(`hotelSelect-${hotelId}`);
        const customInput = document.getElementById(`customHotelName-${hotelId}`);
        const priceInput = document.getElementById(`hotelPrice-${hotelId}`);
        
        let hotelName = select.value === 'custom' ? customInput.value.trim() : select.value;
        const hotelPrice = parseFloat(priceInput.value);
        
        const packageCalc = calculatePackage(flightPrice, hotelPrice, adults, children);
        
        hotelOptionsText += `${hotelName}\n• $${packageCalc.finalTotal} ($${packageCalc.perPersonFee} per person)\n`;
        if (index < hotels.length - 1) {
            hotelOptionsText += '\n';
        }
    });
    
    // Generate complete quote
    const quote = `Panama Getaway ✈️🌴

📅 Travel Dates: ${dateRange}

🧳 Travelers: ${travelerText}

🏨 Hotel Options & Package Prices (USD)
${hotelOptionsText}
✅ Package Inclusions:

✔️ Round-trip airfare

✔️ Hotel accommodation

✔️ Airport transfers

✔️ Daily breakfast

✔️ Taxes & fees

📌 Important Notes:

• Prices are subject to availability and may change until booked.

• Payment is required to secure rates.

📧 Email: bgibookings@gmail.com

📞 Call/WhatsApp: +1 (246) 262-9602

📍 Let's plan your perfect Panama escape! 🌟`;
    
    // Display quote
    document.getElementById('quoteOutput').textContent = quote;
}

// Copy to clipboard with mobile support
function copyToClipboard() {
    const quoteText = document.getElementById('quoteOutput').textContent;
    
    if (quoteText === "Click \"Generate Quote\" to create your travel package quote...") {
        alert('Please generate a quote first!');
        return;
    }
    
    // Modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(quoteText).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyMethod(quoteText);
        });
    } else {
        fallbackCopyMethod(quoteText);
    }
}

// Fallback copy method for older browsers/mobile
function fallbackCopyMethod(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    
    // Focus and select on mobile
    textarea.focus();
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        // If copy fails, show manual copy option
        showManualCopyOption(text);
    }
    
    document.body.removeChild(textarea);
}

// Show copy success message
function showCopySuccess() {
    const successMessage = document.getElementById('copySuccess');
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Show manual copy option for mobile browsers that don't support clipboard
function showManualCopyOption(text) {
    if (confirm('Automatic copy not supported. Would you like to see the quote in a popup to copy manually?')) {
        const popup = window.open('', 'QuotePopup', 'width=400,height=600,scrollbars=yes');
        popup.document.write(`
            <html>
                <head>
                    <title>Travel Quote</title>
                    <style>
                        body { font-family: monospace; padding: 20px; white-space: pre-wrap; line-height: 1.6; }
                        .header { background: #667eea; color: white; padding: 15px; margin: -20px -20px 20px -20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h3>Travel Quote - Select All & Copy</h3>
                    </div>
                    ${text}
                </body>
            </html>
        `);
        popup.document.close();
    }
}