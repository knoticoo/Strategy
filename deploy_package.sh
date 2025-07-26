#!/bin/bash

# Create deployment package for Ubuntu
echo "📦 Creating deployment package..."

# Create temporary directory
DEPLOY_DIR="ai-art-analyzer-deploy"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy essential files
cp app.py $DEPLOY_DIR/
cp requirements.txt $DEPLOY_DIR/
cp run.py $DEPLOY_DIR/
cp setup.sh $DEPLOY_DIR/
cp start.sh $DEPLOY_DIR/
cp nginx.conf $DEPLOY_DIR/
cp docker-compose.yml $DEPLOY_DIR/
cp Dockerfile $DEPLOY_DIR/
cp README.md $DEPLOY_DIR/
cp DEPLOYMENT.md $DEPLOY_DIR/
cp .gitignore $DEPLOY_DIR/

# Copy directories
cp -r templates/ $DEPLOY_DIR/
cp -r static/ $DEPLOY_DIR/

# Create archive
tar -czf ai-art-analyzer-deploy.tar.gz $DEPLOY_DIR/

echo "✅ Package created: ai-art-analyzer-deploy.tar.gz"
echo ""
echo "📤 To deploy to Ubuntu:"
echo "1. Copy package: scp ai-art-analyzer-deploy.tar.gz user@your-server:/home/user/"
echo "2. On Ubuntu server:"
echo "   tar -xzf ai-art-analyzer-deploy.tar.gz"
echo "   cd ai-art-analyzer-deploy"
echo "   chmod +x setup.sh && ./setup.sh"

# Cleanup
rm -rf $DEPLOY_DIR