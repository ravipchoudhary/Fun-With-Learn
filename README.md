<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c144e8dc-619c-4022-8317-cca6f252e311

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create a .env file from `.env.example` and set your `GEMINI_API_KEY`
3. Run the app in development mode:
   `npm run dev`

## VPS / Production Deployment

1. SSH into the VPS and go to the project directory
2. Install dependencies:
   `npm install`
3. Create `.env` with:
   ```bash
   PORT=4000
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Build the project:
   `npm run build`
5. Start the production server:
   `npm start`

For background use with PM2:
```bash
npm install -g pm2
pm2 start "npm start" --name fun-with-learn
pm2 save
```
