const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { numberToWords } = require('../utils/helpers');

class InvoiceService {
    async createInvoiceData(formData) {
        try {
            // Generate invoice number
            const invoiceNumber = await this.generateInvoiceNumber();
            
            // Calculate fare breakdown
            const fareBreakdown = this.calculateFare(formData);
            
            // Prepare invoice data
            const invoiceData = {
                // Invoice metadata
                id: uuidv4(),
                invoiceNumber,
                date: moment().format('DD/MM/YYYY'),
                time: moment().format('HH:mm:ss'),
                
                // Company details
                company: {
                    name: process.env.COMPANY_NAME,
                    gst: process.env.COMPANY_GST,
                    address: process.env.COMPANY_ADDRESS,
                    phone: process.env.COMPANY_PHONE,
                    email: process.env.COMPANY_EMAIL,
                    website: process.env.COMPANY_WEBSITE
                },
                
                // Customer details
                customer: {
                    name: formData.customerName,
                    phone: formData.customerPhone,
                    email: formData.customerEmail || '',
                    address: formData.customerAddress || '',
                    gst: formData.customerGst || ''
                },
                
                // Trip details
                trip: {
                    pickupLocation: formData.pickupLocation,
                    dropLocation: formData.dropLocation,
                    pickupDate: formData.pickupDate,
                    pickupTime: formData.pickupTime,
                    dropDate: formData.dropDate || formData.pickupDate,
                    dropTime: formData.dropTime,
                    distance: parseFloat(formData.distance || 0),
                    duration: formData.duration || '',
                    vehicleType: formData.vehicleType,
                    vehicleNumber: formData.vehicleNumber,
                    driverName: formData.driverName || ''
                },
                
                // Fare breakdown
                fare: fareBreakdown,
                
                // Additional details
                notes: formData.notes || '',
                paymentMethod: formData.paymentMethod || 'Cash'
            };
            
            return invoiceData;
        } catch (error) {
            throw new Error(`Failed to create invoice data: ${error.message}`);
        }
    }
    
    calculateFare(formData) {
        const baseFare = parseFloat(formData.baseFare || 0);
        const distanceRate = parseFloat(formData.distanceRate || 0);
        const timeRate = parseFloat(formData.timeRate || 0);
        const distance = parseFloat(formData.distance || 0);
        const waitingTime = parseFloat(formData.waitingTime || 0);
        const tolls = parseFloat(formData.tolls || 0);
        const parking = parseFloat(formData.parking || 0);
        const extraCharges = parseFloat(formData.extraCharges || 0);
        
        // Calculate fare components
        const distanceFare = distance * distanceRate;
        const timeFare = waitingTime * timeRate;
        
        // Subtotal before tax
        const subtotal = baseFare + distanceFare + timeFare + tolls + parking + extraCharges;
        
        // Calculate GST
        const gstRate = parseFloat(process.env.GST_RATE || 18);
        const gstAmount = (subtotal * gstRate) / 100;
        
        // Calculate CGST and SGST (half each for intra-state)
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;
        
        // Total amount
        const totalAmount = subtotal + gstAmount;
        
        return {
            baseFare,
            distanceFare,
            timeFare,
            tolls,
            parking,
            extraCharges,
            subtotal,
            gstRate,
            cgst,
            sgst,
            gstAmount,
            totalAmount,
            totalInWords: numberToWords(totalAmount),
            currency: process.env.CURRENCY || 'INR'
        };
    }
    
    async generateInvoiceNumber() {
        const prefix = process.env.INVOICE_PREFIX || 'INV';
        const date = moment().format('YYYYMMDD');
        const time = moment().format('HHmmss');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        return `${prefix}-${date}-${time}-${random}`;
    }
}

module.exports = new InvoiceService();
