const API_URL = 'https://prepaid.desco.org.bd/api/unified/customer/getBalance';

function showLoading() {
    document.getElementById('loading').classList.add('show');
    document.getElementById('resultCard').classList.remove('show');
    document.getElementById('errorMessage').classList.remove('show');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    hideLoading();
}

function showResult(data) {
    document.getElementById('balance').textContent = (data.balance || 0).toFixed(2);
    document.getElementById('accountDisplay').textContent = data.accountNo || '-';
    document.getElementById('meterNo').textContent = data.meterNo || '-';
    document.getElementById('consumption').textContent = (data.currentMonthConsumption || 0).toFixed(2);
    document.getElementById('readingTime').textContent = data.readingTime || '-';

    document.getElementById('resultCard').classList.add('show');
    document.getElementById('errorMessage').classList.remove('show');
    hideLoading();
}

function checkBalance() {
    const accountNo = document.getElementById('accountNo').value.trim();

    if (!accountNo) {
        showError('Please enter an account number');
        return;
    }

    showLoading();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${API_URL}?accountNo=${encodeURIComponent(accountNo)}`, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.code === 200 && response.data) {
                    showResult(response.data);
                } else {
                    showError('Invalid response from server');
                }
            } catch (e) {
                showError('Error parsing response');
            }
        } else {
            showError('Failed to fetch balance. Please try again.');
        }
    };

    xhr.onerror = function() {
        showError('Network error. Please check your connection.');
    };

    xhr.send();
}

// Allow Enter key to submit
document.getElementById('accountNo').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkBalance();
});

// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Load saved account on page load (if you have implementation)
window.onload = function() {
    if (typeof loadSavedAccount === 'function') loadSavedAccount();
};