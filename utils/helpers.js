function numberToWords(num) {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
    
    function convertHundreds(n) {
        let result = '';
        
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        
        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        } else if (n >= 10) {
            result += teens[n - 10] + ' ';
            return result;
        }
        
        if (n > 0) {
            result += ones[n] + ' ';
        }
        
        return result;
    }
    
    function convertNumberToWords(number) {
        if (number === 0) return '';
        
        let result = '';
        let crore = Math.floor(number / 10000000);
        number %= 10000000;
        
        let lakh = Math.floor(number / 100000);
        number %= 100000;
        
        let thousand = Math.floor(number / 1000);
        number %= 1000;
        
        let hundred = number;
        
        if (crore > 0) {
            result += convertHundreds(crore) + 'Crore ';
        }
        
        if (lakh > 0) {
            result += convertHundreds(lakh) + 'Lakh ';
        }
        
        if (thousand > 0) {
            result += convertHundreds(thousand) + 'Thousand ';
        }
        
        if (hundred > 0) {
            result += convertHundreds(hundred);
        }
        
        return result.trim();
    }
    
    // Handle decimal numbers
    const [integerPart, decimalPart] = num.toString().split('.');
    let result = convertNumberToWords(parseInt(integerPart));
    
    if (decimalPart && parseInt(decimalPart) > 0) {
        result += ' and ' + convertNumberToWords(parseInt(decimalPart)) + ' Paisa';
    }
    
    return result + ' Only';
}

function formatCurrency(amount, currency = 'INR') {
    const formatters = {
        'INR': new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }),
        'USD': new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })
    };
    
    const formatter = formatters[currency] || formatters['INR'];
    return formatter.format(amount);
}

function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        default:
            return `${day}/${month}/${year}`;
    }
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`;
}

function calculateTimeDifference(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end - start;
    
    if (diffMs < 0) {
        // Handle next day scenario
        const nextDayEnd = new Date(`2000-01-02T${endTime}:00`);
        const nextDayDiffMs = nextDayEnd - start;
        const hours = Math.floor(nextDayDiffMs / (1000 * 60 * 60));
        const minutes = Math.floor((nextDayDiffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function generateRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

module.exports = {
    numberToWords,
    formatCurrency,
    formatDate,
    formatTime,
    calculateTimeDifference,
    generateRandomId,
    capitalizeWords,
    truncateText
};
