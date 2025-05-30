#!/bin/bash
echo "=========================================="
echo "Creating admin user if needed..."
echo "=========================================="
node scripts/createAdminUser.js

echo ""
echo "=========================================="
echo "Adding demo data if needed..."
echo "=========================================="
node scripts/seedDemoData.js

echo ""
echo "=========================================="
echo "Starting the server..."
echo "=========================================="
npm start 