const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

class PDFService {
    async generateInvoicePDF(invoiceData) {
        let browser;
        try {
            // Launch Puppeteer browser
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            
            // Generate HTML content from template
            const templatePath = path.join(__dirname, '../views/invoice-template.ejs');
            const htmlContent = await ejs.renderFile(templatePath, { 
                invoice: invoiceData 
            });
            
            // Set content and wait for load
            await page.setContent(htmlContent, { 
                waitUntil: 'networkidle0' 
            });
            
            // Generate PDF
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
            
            return pdfBuffer;
            
        } catch (error) {
            throw new Error(`PDF generation failed: ${error.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
    
    async generateMultipleInvoicesPDF(invoicesData) {
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            const pdfBuffers = [];
            
            for (const invoiceData of invoicesData) {
                const templatePath = path.join(__dirname, '../views/invoice-template.ejs');
                const htmlContent = await ejs.renderFile(templatePath, { 
                    invoice: invoiceData 
                });
                
                await page.setContent(htmlContent, { 
                    waitUntil: 'networkidle0' 
                });
                
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
                
                pdfBuffers.push({
                    invoiceNumber: invoiceData.invoiceNumber,
                    buffer: pdfBuffer
                });
            }
            
            return pdfBuffers;
            
        } catch (error) {
            throw new Error(`Multiple PDF generation failed: ${error.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

module.exports = new PDFService();
