# Silver Track Call Taxi - Invoice Generator

A Node.js based invoice generator specifically designed for Silver Track Call Taxi with GST compliance and proper address management.

## Features

- Generate professional invoices for Silver Track Call Taxi services
- GST compliance with proper tax calculations (Tamil Nadu GST)
- Customer and business address management
- PDF invoice generation
- Trip details tracking (pickup, drop, distance, time)
- Multiple fare calculation methods
- Invoice numbering system
- Responsive web interface

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your settings
4. Start the application:
   ```bash
   npm start
   ```
   For development:
   ```bash
   npm run dev
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
COMPANY_NAME=Your Taxi Company
COMPANY_GST=22AAAAA0000A1Z5
COMPANY_ADDRESS=Your Company Address
COMPANY_PHONE=+91-9876543210
COMPANY_EMAIL=info@yourtaxicompany.com
```

## API Endpoints

- `GET /` - Home page with invoice form
- `POST /generate-invoice` - Generate and download PDF invoice
- `GET /api/invoices` - List all generated invoices
- `POST /api/save-invoice` - Save invoice data

## Invoice Structure

The generated invoices include:
- Company details with GST number
- Customer information
- Trip details (pickup/drop locations, date/time)
- Fare breakdown with GST calculations
- Total amount in words

## Usage

1. Access the web interface at `http://localhost:3000`
2. Fill in the trip and customer details
3. Generate and download the PDF invoice

## License

MIT License
