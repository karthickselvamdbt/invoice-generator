const invoiceService = require('../services/invoiceService');
const pdfService = require('../services/pdfService');
const { validateInvoiceData } = require('../utils/validation');
const database = require('../utils/database');

class InvoiceController {
    // Show the main invoice form
    async showInvoiceForm(req, res) {
        try {
            const companyDetails = {
                name: process.env.COMPANY_NAME,
                gst: process.env.COMPANY_GST,
                address: process.env.COMPANY_ADDRESS,
                phone: process.env.COMPANY_PHONE,
                email: process.env.COMPANY_EMAIL,
                website: process.env.COMPANY_WEBSITE
            };

            res.render('invoice-form', { 
                title: 'Taxi Invoice Generator',
                company: companyDetails
            });
        } catch (error) {
            console.error('Error showing invoice form:', error);
            res.status(500).json({ error: 'Failed to load invoice form' });
        }
    }

    // Generate PDF invoice
    async generateInvoice(req, res) {
        try {
            // Validate input data
            const validationResult = validateInvoiceData(req.body);
            if (!validationResult.isValid) {
                return res.status(400).json({ 
                    error: 'Validation failed', 
                    details: validationResult.errors 
                });
            }

            // Generate invoice data
            const invoiceData = await invoiceService.createInvoiceData(req.body);
            
            // Save invoice to database
            const savedInvoice = await database.saveInvoice(invoiceData);
            
            // Generate PDF
            const pdfBuffer = await pdfService.generateInvoicePDF(invoiceData);
            
            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Invoice-${invoiceData.invoiceNumber}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            
            res.send(pdfBuffer);

        } catch (error) {
            console.error('Error generating invoice:', error);
            res.status(500).json({ 
                error: 'Failed to generate invoice',
                message: error.message
            });
        }
    }

    // Preview invoice in HTML format
    async previewInvoice(req, res) {
        try {
            const validationResult = validateInvoiceData(req.body);
            if (!validationResult.isValid) {
                return res.status(400).json({ 
                    error: 'Validation failed', 
                    details: validationResult.errors 
                });
            }

            const invoiceData = await invoiceService.createInvoiceData(req.body);
            
            res.render('invoice-template', { 
                invoice: invoiceData,
                title: `Invoice Preview - ${invoiceData.invoiceNumber}`
            });

        } catch (error) {
            console.error('Error previewing invoice:', error);
            res.status(500).json({ 
                error: 'Failed to preview invoice',
                message: error.message
            });
        }
    }

    // Get all invoices
    async getAllInvoices(req, res) {
        try {
            const invoices = await database.getAllInvoices();
            res.json({ success: true, data: invoices });
        } catch (error) {
            console.error('Error fetching invoices:', error);
            res.status(500).json({ 
                error: 'Failed to fetch invoices',
                message: error.message
            });
        }
    }

    // Get invoice by ID
    async getInvoiceById(req, res) {
        try {
            const { id } = req.params;
            const invoice = await database.getInvoiceById(id);
            
            if (!invoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            
            res.json({ success: true, data: invoice });
        } catch (error) {
            console.error('Error fetching invoice:', error);
            res.status(500).json({ 
                error: 'Failed to fetch invoice',
                message: error.message
            });
        }
    }

    // Save invoice
    async saveInvoice(req, res) {
        try {
            const validationResult = validateInvoiceData(req.body);
            if (!validationResult.isValid) {
                return res.status(400).json({ 
                    error: 'Validation failed', 
                    details: validationResult.errors 
                });
            }

            const invoiceData = await invoiceService.createInvoiceData(req.body);
            const savedInvoice = await database.saveInvoice(invoiceData);
            
            res.json({ 
                success: true, 
                message: 'Invoice saved successfully',
                data: savedInvoice
            });

        } catch (error) {
            console.error('Error saving invoice:', error);
            res.status(500).json({ 
                error: 'Failed to save invoice',
                message: error.message
            });
        }
    }
}

module.exports = new InvoiceController();
