const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Home page - Invoice form
router.get('/', invoiceController.showInvoiceForm);

// Generate PDF invoice
router.post('/generate-invoice', invoiceController.generateInvoice);

// API routes
router.get('/api/invoices', invoiceController.getAllInvoices);
router.post('/api/save-invoice', invoiceController.saveInvoice);
router.get('/api/invoice/:id', invoiceController.getInvoiceById);

// Preview invoice (HTML)
router.post('/preview-invoice', invoiceController.previewInvoice);

module.exports = router;
