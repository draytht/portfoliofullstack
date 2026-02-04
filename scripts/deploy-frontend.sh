#!/bin/bash
# deploy-frontend.sh - Deploy React app to S3 + CloudFront

set -e

# Configuration
S3_BUCKET="justdatthang.com"
CLOUDFRONT_DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"  # Update after creating CloudFront
AWS_REGION="us-east-1"

echo "🚀 Deploying Frontend to AWS S3..."

# Step 1: Build the React app
echo "📦 Building React app..."
cd frontend
npm run build

# Step 2: Sync to S3
echo "☁️ Uploading to S3..."
aws s3 sync dist/ s3://$S3_BUCKET \
    --delete \
    --cache-control "max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.json"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
    --cache-control "no-cache, no-store, must-revalidate"

# Upload JSON files with shorter cache
aws s3 sync dist/ s3://$S3_BUCKET \
    --exclude "*" \
    --include "*.json" \
    --cache-control "max-age=3600"

# Step 3: Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*"

echo "✅ Frontend deployed successfully!"
echo "🌐 Website: https://justdatthang.com"
