#!/bin/bash

echo "\x1b[35;01m""Start re-installing dependencies...""\x1b[39;49;00m"

echo "Remove node_modules..."
rm -rf node_modules

echo "Verify npm cache..."
npm cache verify

echo "Npm install..."
npm install

echo "Pods install..."
cd ios && pod install && cd ..

echo "\x1b[35;01m""Done!""\x1b[39;49;00m"
