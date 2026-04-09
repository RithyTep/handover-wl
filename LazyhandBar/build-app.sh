#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="LazyhandBar"
BUNDLE_ID="com.lazyhand.bar"
VERSION="1.0.0"
BUILD_DIR="$SCRIPT_DIR/.build/arm64-apple-macosx/release"
DIST_DIR="$SCRIPT_DIR/dist"
APP_BUNDLE="$DIST_DIR/${APP_NAME}.app"
CONTENTS="$APP_BUNDLE/Contents"
DMG_NAME="${APP_NAME}-${VERSION}.dmg"

echo "Building release binary..."
cd "$SCRIPT_DIR"
swift build -c release

echo "Creating app bundle..."
rm -rf "$APP_BUNDLE"
mkdir -p "$CONTENTS/MacOS"
mkdir -p "$CONTENTS/Resources"

# Copy binary
cp "$BUILD_DIR/$APP_NAME" "$CONTENTS/MacOS/$APP_NAME"

# Create Info.plist
cat > "$CONTENTS/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>LazyhandBar</string>
    <key>CFBundleDisplayName</key>
    <string>Lazyhand</string>
    <key>CFBundleIdentifier</key>
    <string>${BUNDLE_ID}</string>
    <key>CFBundleVersion</key>
    <string>${VERSION}</string>
    <key>CFBundleShortVersionString</key>
    <string>${VERSION}</string>
    <key>CFBundleExecutable</key>
    <string>${APP_NAME}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSUIElement</key>
    <true/>
    <key>LSMinimumSystemVersion</key>
    <string>14.0</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
    </dict>
</dict>
</plist>
EOF

# Create zip
echo "Creating ZIP..."
cd "$DIST_DIR"
rm -f "${APP_NAME}.zip"
zip -r -q "${APP_NAME}.zip" "${APP_NAME}.app"

# Create DMG
echo "Creating DMG..."
DMG_TEMP="$DIST_DIR/dmg_temp"
rm -rf "$DMG_TEMP" "$DIST_DIR/$DMG_NAME"
mkdir -p "$DMG_TEMP"

# Copy app to temp folder
cp -R "$APP_BUNDLE" "$DMG_TEMP/"

# Create Applications symlink
ln -s /Applications "$DMG_TEMP/Applications"

# Create DMG
hdiutil create -volname "$APP_NAME" \
    -srcfolder "$DMG_TEMP" \
    -ov -format UDZO \
    "$DIST_DIR/$DMG_NAME"

# Cleanup
rm -rf "$DMG_TEMP"

echo ""
echo "========================================="
echo "  Build Complete!"
echo "========================================="
echo ""
echo "  App:  $APP_BUNDLE"
echo "  ZIP:  $DIST_DIR/${APP_NAME}.zip"
echo "  DMG:  $DIST_DIR/$DMG_NAME"
echo ""
echo "To install:"
echo "  1. Open the DMG file"
echo "  2. Drag LazyhandBar to Applications"
echo "  3. Open from Applications"
echo ""
