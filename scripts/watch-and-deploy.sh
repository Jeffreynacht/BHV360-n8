#!/bin/bash

echo "👀 WATCHING FOR CHANGES..."
echo "Will auto-deploy when files change"
echo "Press Ctrl+C to stop"

# Install fswatch if not available
if ! command -v fswatch &> /dev/null; then
    echo "Installing fswatch..."
    brew install fswatch  # macOS
    # apt-get install fswatch  # Linux
fi

# Watch for file changes and auto-deploy
fswatch -o . | while read f; do
    echo "📝 Changes detected at $(date '+%H:%M:%S')"
    sleep 2  # Wait for file operations to complete
    npm run live
    echo "⏳ Next check in 10 seconds..."
    sleep 10
done
