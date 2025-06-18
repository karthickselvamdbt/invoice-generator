const ejs = require('ejs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        if (event.httpMethod !== 'GET') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        const companyDetails = {
            name: process.env.COMPANY_NAME || 'Silver Track Call Taxi',
            gst: process.env.COMPANY_GST || '33AEOFS0649R1Z9',
            address: process.env.COMPANY_ADDRESS || 'No. 322-1 Auditors colony, Meyyanur Main Road, 5 roads, Salem - 636005, TamilNadu',
            phone: process.env.COMPANY_PHONE || '+91-9786999777',
            email: process.env.COMPANY_EMAIL || 'silvercalltaxi@gmail.com',
            website: process.env.COMPANY_WEBSITE || ''
        };

        // Read the invoice form template
        const templatePath = path.join(process.cwd(), 'views', 'invoice-form.ejs');
        const html = await ejs.renderFile(templatePath, {
            title: 'Silver Track Call Taxi - Invoice Generator',
            company: companyDetails
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: html
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
