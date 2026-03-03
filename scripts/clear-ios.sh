#!/bin/bash

echo "\x1b[35;01m""Start clearing iOS cache...""\x1b[39;49;00m"

echo "Remove all Xcode derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData

echo "Remove iOS build..."
rm -rf ios/build

echo "Remove iOS Pods data..."
rm -rf ios/Pods/*

echo "Pods install..."
cd ios && bundle install && bundle exec pod install && cd ..

echo "\x1b[35;01m""Done clearing iOS cache!""\x1b[39;49;00m"
