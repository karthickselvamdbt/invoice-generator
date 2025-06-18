#!/bin/bash

echo "🚖 Preparing Silver Track Call Taxi Invoice Generator for Netlify..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create deployment directory
echo "📁 Creating deployment structure..."
mkdir -p deploy
cp -r netlify deploy/
cp -r public deploy/
cp -r views deploy/
cp -r services deploy/
cp -r utils deploy/
cp netlify.toml deploy/
cp package.json deploy/
cp -r node_modules deploy/

echo "✅ Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push this code to GitHub"
echo "2. Connect to Netlify"
echo "3. Set environment variables in Netlify dashboard"
echo "4. Deploy!"
echo ""
echo "Your invoice generator will be live at: https://your-site-name.netlify.app"
