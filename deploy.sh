#!/bin/bash

echo "Deploying Famiglia-Recipes App..."

echo "Running database migrations..."
npm run db migrate

echo "Building application..."
npm run build

echo "Creating Necessary directories..."
mkdir -p instance
mkdir -p public/static/recipe-images

echo "Stopping existing processes..."
pm2 stop famiglia-recipes 2>/dev/null || true

echo "Starting app with PM2..."
pm2 start ecosystem.config.cjs --env production

pm2 save
pm2 status

echo "Deployment complete!"
echo "Monitor with: pm2 monit"
echo "Logs with: pm2 logs famiglia-recipes"
