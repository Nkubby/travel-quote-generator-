let hotelCount = 1;

function addHotel() {
    if (hotelCount >= 5) {
        alert('Maximum 5 hotel options allowed');
        return;
    }
    
    hotelCount++;
    const container = document.getElementById('hotelsContainer');
    const hotelDiv = document.createElement('div');
    hotelDiv.className = 'hotel-section';
    hotelDiv.innerHTML = `
        <h3>🏨 Hotel Option ${hotelCount}</h3>
        <div class="hotel-row">
            <div>
                <label>Hotel Name</label>
                <input type="text" class="hotel-name" placeholder="e.g., Riande Urban Hotel">
            </div>
            <div>
                <label>Hotel Price (USD)</label>
                <input type="number" class="hotel-price" placeholder="0" step="0.01">
            </div>
        </div>
        <button class="btn btn-remove" onclick="removeHotel(this)">Remove Hotel</button>
    `;
    container.appendChild(hotelDiv);
}

function removeHotel(button) {
    if (hotelCount <= 1) {
        alert('At least one hotel option is required');
        return;
    }
    button.parentElement.remove();
    hotelCount--;
    
    // Renumber remaining hotels
    const hotels = document.querySelectorAll('.hotel-section h3');
    hotels.forEach((h3, index) => {
        h3.textContent = `🏨 Hotel Option ${index + 1}`;
    });
}

function calculatePackage(flightPrice, hotelPrice, adults, children) {
    const totalPeople = adults + children;
    
    // Base Cost
    const baseCost = flightPrice + hotelPrice;
    
    // Taxi Fee
    let taxiFee;
    if (totalPeople === 2) {
        taxiFee = 50;
    } else if (totalPeople > 2) {
        taxiFee = 50 + (10 * (totalPeople - 2));
    } else {
        taxiFee = 50; // For 1 person
    }
    
    // Service Fee
    let serviceFee;
    if (adults === 1 && children === 0) {
        serviceFee = 130;
    } else {
        serviceFee = 65 * totalPeople;
    }
    
    // Calculations
    const subtotal1 = baseCost + taxiFee + serviceFee;
    const subtotal2 = subtotal1 * 2.03;
    const subtotal3 = subtotal2 + (subtotal2 * 0.02);
    const totalPackageAmount = subtotal3 / 2;
    const perPersonFee = totalPackageAmount / totalPeople;
    
    return {
        totalPackageAmount: Math.round(totalPackageAmount * 100) / 100,
        perPersonFee: Math.round(perPersonFee * 100) / 100
    };
}

function generateQuote() {
    const travelDates = document.getElementById('travelDates').value;
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const flightPrice = parseFloat(document.getElementById('flightPrice').value) || 0;
    
    const hotelNames = document.querySelectorAll('.hotel-name');
    const hotelPrices = document.querySelectorAll('.hotel-price');
    
    // Validation
    if (!travelDates || adults === 0 || flightPrice === 0) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Calculate results for each hotel
    const results = [];
    for (let i = 0; i < hotelNames.length; i++) {
        const hotelName = hotelNames[i].value;
        const hotelPrice = parseFloat(hotelPrices[i].value) || 0;
        
        if (hotelName && hotelPrice > 0) {
            const calculation = calculatePackage(flightPrice, hotelPrice, adults, children);
            results.push({
                name: hotelName,
                totalAmount: calculation.totalPackageAmount,
                perPerson: calculation.perPersonFee
            });
        }
    }
    
    // Display results
    displayResults(results);
    
    // Generate formatted quote
    generateFormattedQuote(travelDates, adults, children, results);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No valid hotel options found</p>';
        return;
    }
    
    let html = '<div class="results"><h3>💰 Calculated Prices</h3>';
    
    results.forEach(result => {
        html += `
            <div class="result-item">
                <h4>${result.name}</h4>
                <p><strong>Total Package:</strong> $${result.totalAmount.toFixed(2)}</p>
                <p><strong>Per Person:</strong> $${result.perPerson.toFixed(2)}</p>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

function generateFormattedQuote(travelDates, adults, children, results) {
    const totalTravelers = adults + children;
    let travelersText = `${adults} Adults`;
    if (children > 0) {
        travelersText += `, ${children} Child${children > 1 ? 'ren' : ''}`;
    }
    
    let hotelOptionsText = '';
    results.forEach(result => {
        hotelOptionsText += `${result.name}\n• $${result.totalAmount.toFixed(2)} ($${result.perPerson.toFixed(2)} per person)\n`;
    });
    
    const quote = `Panama Getaway ✈️🌴

📅 Travel Dates: ${travelDates}

🧳 Travelers: ${travelersText}

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

    const quoteDiv = document.getElementById('quoteOutput');
    quoteDiv.innerHTML = `
        <div class="quote-output">${quote}</div>
        <button class="btn copy-btn" onclick="copyQuote()">📋 Copy Quote</button>
    `;
}

function copyQuote() {
    const quoteText = document.querySelector('.quote-output').textContent;
    navigator.clipboard.writeText(quoteText).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Initialize with sample data
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('travelDates').value = 'September 3 – 10, 2025';
    document.getElementById('adults').value = '2';
    document.getElementById('children').value = '0';
    document.getElementById('flightPrice').value = '800';
    document.querySelector('.hotel-name').value = 'Riande Urban Hotel';
    document.querySelector('.hotel-price').value = '600';
});
