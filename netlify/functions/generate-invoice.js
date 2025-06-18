const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
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

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        
        // Generate HTML content from template
        const templatePath = path.join(process.cwd(), 'views', 'invoice-template.ejs');
        const htmlContent = await ejs.renderFile(templatePath, { 
            invoice: invoiceData 
        });
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        
        await browser.close();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Invoice-${invoiceData.invoiceNumber}.pdf"`
            },
            body: pdfBuffer.toString('base64'),
            isBase64Encoded: true
        };

    } catch (error) {
        console.error('Error generating invoice:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to generate invoice',
                message: error.message
            })
        };
    }
};
