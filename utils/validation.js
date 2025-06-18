function validateInvoiceData(data) {
    const errors = [];
    
    // Required fields validation
    if (!data.customerName || data.customerName.trim() === '') {
        errors.push('Customer name is required');
    }
    
    if (!data.customerPhone || data.customerPhone.trim() === '') {
        errors.push('Customer phone is required');
    }
    
    if (!data.pickupLocation || data.pickupLocation.trim() === '') {
        errors.push('Pickup location is required');
    }
    
    if (!data.dropLocation || data.dropLocation.trim() === '') {
        errors.push('Drop location is required');
    }
    
    if (!data.pickupDate || data.pickupDate.trim() === '') {
        errors.push('Pickup date is required');
    }
    
    if (!data.pickupTime || data.pickupTime.trim() === '') {
        errors.push('Pickup time is required');
    }
    
    if (!data.vehicleType || data.vehicleType.trim() === '') {
        errors.push('Vehicle type is required');
    }
    
    // Numeric validations
    if (data.baseFare && isNaN(parseFloat(data.baseFare))) {
        errors.push('Base fare must be a valid number');
    }
    
    if (data.distance && isNaN(parseFloat(data.distance))) {
        errors.push('Distance must be a valid number');
    }
    
    if (data.distanceRate && isNaN(parseFloat(data.distanceRate))) {
        errors.push('Distance rate must be a valid number');
    }
    
    // Phone number validation
    if (data.customerPhone && !isValidPhoneNumber(data.customerPhone)) {
        errors.push('Invalid phone number format');
    }
    
    // Email validation (if provided)
    if (data.customerEmail && data.customerEmail.trim() !== '' && !isValidEmail(data.customerEmail)) {
        errors.push('Invalid email format');
    }
    
    // GST validation (if provided)
    if (data.customerGst && data.customerGst.trim() !== '' && !isValidGSTNumber(data.customerGst)) {
        errors.push('Invalid GST number format');
    }
    
    // Date validation
    if (data.pickupDate && !isValidDate(data.pickupDate)) {
        errors.push('Invalid pickup date format');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function isValidPhoneNumber(phone) {
    // Indian phone number validation
    const phoneRegex = /^[\+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidGSTNumber(gst) {
    // Indian GST number validation
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim();
}

function validateAndSanitizeInvoiceData(data) {
    // First sanitize all string inputs
    const sanitizedData = {};
    
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
            sanitizedData[key] = sanitizeInput(data[key]);
        } else {
            sanitizedData[key] = data[key];
        }
    });
    
    // Then validate
    const validation = validateInvoiceData(sanitizedData);
    
    return {
        ...validation,
        data: sanitizedData
    };
}

module.exports = {
    validateInvoiceData,
    validateAndSanitizeInvoiceData,
    isValidPhoneNumber,
    isValidEmail,
    isValidGSTNumber,
    isValidDate,
    sanitizeInput
};
