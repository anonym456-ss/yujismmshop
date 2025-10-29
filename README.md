
YUJI'S MEGA SERVICE - READY PROJECT (WITH OWNER IMAGE UPLOAD)
============================================================

This project includes an owner dashboard that allows you to add, edit, delete products
and upload images directly in your browser. Images are stored as base64 data URLs in your browser's localStorage
(this means they are saved only on the computer/browser where you add them).

FILES
- package.json
- vite.config.js
- index.html
- src/
  - main.jsx
  - App.jsx  (owner dashboard with image upload & localStorage persistence)
  - styles.css
- api/order.js  (serverless function - forwards orders to Discord webhook)
- config.example.js
- README.md

IMPORTANT: do NOT commit secrets (PayPal client ID, Discord webhook) to a public repo.
Set them as Environment Variables in Vercel (Project Settings -> Environment Variables).

QUICK START (no coding)
1) Go to https://github.com and create a new repository (public).
2) Click "Add file" -> "Upload files" and upload all files from this project folder (the contents of the ZIP).
3) Commit changes.
4) Go to https://vercel.com -> 'Add New' -> 'Project' -> Import Git Repository -> choose your repo.
5) In Vercel, add Environment Variables:
   - VITE_PAYPAL_CLIENT_ID = your PayPal Client ID
   - DISCORD_WEBHOOK_URL = your Discord webhook URL
   - VITE_OWNER_CODE = mediaweiden
6) Deploy. After deploy open your site URL.

HOW TO USE OWNER IMAGE UPLOAD (step-by-step)
- Open your live site and enter the Owner-Code (default: mediaweiden) in the Owner-Code input and click Owner Login.
- Click 'Neues Produkt' to start adding a product.
- Fill in name, price, type, description.
- Click the file input and choose an image from your computer (jpg/png). The image will be converted to base64 and previewed.
- Click 'Speichern'. The product is added and saved in localStorage on your browser.
- To edit a product, click 'Bearbeiten' and change fields or upload a new image. Save again.
- To remove a product, click 'Löschen'.

LIMITATIONS & NEXT STEPS
- Images are saved only in the browser where you add them. If you need images accessible from anywhere, consider:
  - Upload images to GitHub (src/assets) and reference them by path in the product's image field.
  - Use a free image host like Cloudinary (offers free tier) and save the image URLs in products.
  - Implement a small backend (serverless) and store images in S3/Cloudinary and product data in a DB.
- If you want, I can later help you add Cloudinary upload so images are stored online automatically.

TROUBLESHOOTING
- If Vercel build fails complaining about @vitejs/plugin-react, ensure package.json contains it (it is included).
- If PayPal buttons don't show, ensure you set VITE_PAYPAL_CLIENT_ID in Vercel env and redeploy.
- If orders don't reach Discord, ensure DISCORD_WEBHOOK_URL is set in Vercel env.

If you want the ZIP now, tell me and I will provide the download link.
