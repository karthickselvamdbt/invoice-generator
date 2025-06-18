# Netlify Deployment Guide for Silver Track Call Taxi Invoice Generator

## 🚀 Deploy to Netlify

### Method 1: GitHub + Netlify (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Silver Track Call Taxi Invoice Generator"
   git branch -M main
   git remote add origin https://github.com/yourusername/silver-track-taxi-invoices.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Use these build settings:
     - **Build command:** `npm install`
     - **Publish directory:** `public`
     - **Functions directory:** `netlify/functions`

3. **Environment Variables:**
   In Netlify dashboard → Site settings → Environment variables, add:
   ```
   COMPANY_NAME=Silver Track Call Taxi
   COMPANY_GST=33AEOFS0649R1Z9
   COMPANY_ADDRESS=No. 322-1 Auditors colony, Meyyanur Main Road, 5 roads, Salem - 636005, TamilNadu
   COMPANY_PHONE=+91-9786999777
   COMPANY_EMAIL=silvercalltaxi@gmail.com
   GST_RATE=5
   INVOICE_PREFIX=STCT
   CURRENCY=INR
   ```

### Method 2: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Method 3: Drag & Drop

1. **Build the site:**
   ```bash
   npm install
   ```

2. **Create deployment package:**
   - Zip the entire project folder
   - Go to Netlify dashboard
   - Drag and drop the zip file

## 📁 Project Structure for Netlify

```
Invoice Generator/
├── netlify/
│   └── functions/
│       ├── index.js
│       ├── generate-invoice.js
│       └── preview-invoice.js
├── public/
│   └── index.html
├── views/
│   ├── invoice-form.ejs
│   └── invoice-template.ejs
├── services/
├── utils/
├── netlify.toml
├── package.json
└── .env.netlify
```

## ⚙️ Configuration Files

### netlify.toml
- Configures build settings
- Sets up redirects for serverless functions
- Handles routing

### Environment Variables
- Set in Netlify dashboard
- Contains your company details
- GST rates and other configuration

## 🔧 Key Changes for Netlify

1. **Serverless Functions:** Converted Express.js routes to Netlify Functions
2. **Static Frontend:** Created standalone HTML file
3. **Puppeteer:** Using `puppeteer-core` with `@sparticuz/chromium` for Netlify
4. **No Database:** Removed local file storage (Netlify is stateless)

## 🌐 After Deployment

Your invoice generator will be available at:
- `https://your-site-name.netlify.app`

Features available:
- ✅ Invoice form with your company details
- ✅ PDF generation with correct GST (2.5% CGST + 2.5% SGST)
- ✅ Invoice preview
- ✅ Professional invoice layout
- ✅ Mobile responsive design

## 🔍 Troubleshooting

1. **Build fails:** Check Node.js version (use Node 18+)
2. **Functions timeout:** Puppeteer may need longer timeout
3. **PDF generation fails:** Check if all dependencies are installed
4. **Environment variables not working:** Verify they're set in Netlify dashboard

## 💡 Custom Domain (Optional)

1. In Netlify dashboard → Domain settings
2. Add your custom domain
3. Configure DNS settings
4. SSL certificate will be auto-generated

## 📱 Features

- **Company Branding:** Silver Track Call Taxi details
- **GST Compliance:** 5% GST (2.5% CGST + 2.5% SGST)
- **Professional Invoices:** PDF generation with proper formatting
- **Mobile Friendly:** Responsive design
- **Secure:** HTTPS by default on Netlify
