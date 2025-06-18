const ejs = require('ejs');
const path = require('path');
const invoiceService = require('../../services/invoiceService');
const { validateInvoiceData } = require('../../utils/validation');

exports.handler = async (event, context) => {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        // Parse form data
        const formData = JSON.parse(event.body);
        
        // Validate input data
        const validationResult = validateInvoiceData(formData);
        if (!validationResult.isValid) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    error: 'Validation failed', 
                    details: validationResult.errors 
                })
            };
        }

        // Generate invoice data
        const invoiceData = await invoiceService.createInvoiceData(formData);
        
        // Generate HTML preview
        const templatePath = path.join(process.cwd(), 'views', 'invoice-template.ejs');
        const html = await ejs.renderFile(templatePath, { 
            invoice: invoiceData,
            title: `Invoice Preview - ${invoiceData.invoiceNumber}`
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: html
        };

    } catch (error) {
        console.error('Error previewing invoice:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to preview invoice',
                message: error.message
            })
        };
    }
};
