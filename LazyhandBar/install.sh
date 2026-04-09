#!/bin/bash
# LazyhandBar One-Click Installer
set -e

APP_NAME="LazyhandBar"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Installing $APP_NAME..."

# Check if running from project directory
if [ -f "$SCRIPT_DIR/build-app.sh" ]; then
    echo "📦 Building from source..."
    cd "$SCRIPT_DIR"
    bash build-app.sh
    APP_PATH="$SCRIPT_DIR/dist/${APP_NAME}.app"
elif [ -f "$SCRIPT_DIR/${APP_NAME}.app/Contents/Info.plist" ]; then
    APP_PATH="$SCRIPT_DIR/${APP_NAME}.app"
else
    echo "❌ Error: Cannot find app source or bundle"
    exit 1
fi

# Kill existing instance
echo "🔄 Stopping existing instance..."
killall "$APP_NAME" 2>/dev/null || true

# Install to Applications
echo "📂 Installing to /Applications..."
rm -rf "/Applications/${APP_NAME}.app"
cp -R "$APP_PATH" /Applications/

# Launch
echo "🎉 Launching $APP_NAME..."
open "/Applications/${APP_NAME}.app"

echo ""
echo "✅ Done! $APP_NAME is now running in your menu bar."
echo ""
