const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.invoicesFile = path.join(this.dataDir, 'invoices.json');
        this.ensureDataDirectory();
    }
    
    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        
        if (!fs.existsSync(this.invoicesFile)) {
            fs.writeFileSync(this.invoicesFile, JSON.stringify([]));
        }
    }
    
    async saveInvoice(invoiceData) {
        try {
            const invoices = await this.getAllInvoices();
            
            // Add timestamp
            invoiceData.createdAt = new Date().toISOString();
            invoiceData.updatedAt = new Date().toISOString();
            
            invoices.push(invoiceData);
            
            fs.writeFileSync(this.invoicesFile, JSON.stringify(invoices, null, 2));
            
            return invoiceData;
        } catch (error) {
            throw new Error(`Failed to save invoice: ${error.message}`);
        }
    }
    
    async getAllInvoices() {
        try {
            if (!fs.existsSync(this.invoicesFile)) {
                return [];
            }
            
            const data = fs.readFileSync(this.invoicesFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading invoices:', error);
            return [];
        }
    }
    
    async getInvoiceById(id) {
        try {
            const invoices = await this.getAllInvoices();
            return invoices.find(invoice => invoice.id === id);
        } catch (error) {
            throw new Error(`Failed to get invoice: ${error.message}`);
        }
    }
    
    async getInvoiceByNumber(invoiceNumber) {
        try {
            const invoices = await this.getAllInvoices();
            return invoices.find(invoice => invoice.invoiceNumber === invoiceNumber);
        } catch (error) {
            throw new Error(`Failed to get invoice: ${error.message}`);
        }
    }
    
    async updateInvoice(id, updateData) {
        try {
            const invoices = await this.getAllInvoices();
            const index = invoices.findIndex(invoice => invoice.id === id);
            
            if (index === -1) {
                throw new Error('Invoice not found');
            }
            
            updateData.updatedAt = new Date().toISOString();
            invoices[index] = { ...invoices[index], ...updateData };
            
            fs.writeFileSync(this.invoicesFile, JSON.stringify(invoices, null, 2));
            
            return invoices[index];
        } catch (error) {
            throw new Error(`Failed to update invoice: ${error.message}`);
        }
    }
    
    async deleteInvoice(id) {
        try {
            const invoices = await this.getAllInvoices();
            const filteredInvoices = invoices.filter(invoice => invoice.id !== id);
            
            if (invoices.length === filteredInvoices.length) {
                throw new Error('Invoice not found');
            }
            
            fs.writeFileSync(this.invoicesFile, JSON.stringify(filteredInvoices, null, 2));
            
            return true;
        } catch (error) {
            throw new Error(`Failed to delete invoice: ${error.message}`);
        }
    }
    
    async searchInvoices(criteria) {
        try {
            const invoices = await this.getAllInvoices();
            
            return invoices.filter(invoice => {
                if (criteria.customerName) {
                    return invoice.customer.name.toLowerCase().includes(criteria.customerName.toLowerCase());
                }
                if (criteria.dateFrom && criteria.dateTo) {
                    const invoiceDate = new Date(invoice.createdAt);
                    return invoiceDate >= new Date(criteria.dateFrom) && invoiceDate <= new Date(criteria.dateTo);
                }
                if (criteria.invoiceNumber) {
                    return invoice.invoiceNumber.includes(criteria.invoiceNumber);
                }
                return true;
            });
        } catch (error) {
            throw new Error(`Failed to search invoices: ${error.message}`);
        }
    }
}

function initializeDatabase() {
    console.log('📁 Initializing database...');
    const db = new Database();
    console.log('✅ Database initialized successfully');
    return db;
}

module.exports = new Database();
module.exports.initializeDatabase = initializeDatabase;
