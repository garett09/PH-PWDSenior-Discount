# iOS App Setup Guide for DiscountPH

This guide will help you set up and build the iOS version of DiscountPH using Capacitor.

## Prerequisites

1. **macOS** - Required for iOS development
2. **Xcode** - Download from Mac App Store (latest version recommended)
3. **CocoaPods** - Install with: `sudo gem install cocoapods`
4. **Node.js** - Already installed
5. **Apple Developer Account** - Required for App Store distribution

## Step 1: Install Dependencies

Since npm install is hanging, try one of these methods:

### Method A: Manual Install (Recommended)
```bash
cd "/Users/adriangarett.sian/Documents/GitHub Repos/PH-PWDSenior-Discount"

# Try with different npm registry
npm install @capacitor/core @capacitor/cli @capacitor/ios --legacy-peer-deps --registry=https://registry.npmjs.org/
```

### Method B: Use Different Network
If npm is still hanging, try:
- Switching to a different WiFi network
- Using mobile hotspot
- Disabling VPN if active

### Method C: Check npm Configuration
```bash
npm config get registry  # Should be https://registry.npmjs.org/
npm config set registry https://registry.npmjs.org/
```

## Step 2: Build the Web App

Once Capacitor is installed, build the static export:

```bash
npm run build
```

This creates the `out/` directory with your static HTML/CSS/JS files.

## Step 3: Initialize iOS Platform

```bash
npx cap add ios
```

This creates the `ios/` directory with your Xcode project.

## Step 4: Sync Web Assets to iOS

```bash
npx cap sync ios
```

This copies your built web app into the iOS project.

## Step 5: Open in Xcode

```bash
npm run cap:open:ios
```

Or manually:
```bash
npx cap open ios
```

## Step 6: Configure iOS App in Xcode

### A. Update Bundle Identifier
1. In Xcode, select the **App** target
2. Go to **Signing & Capabilities**
3. Change Bundle Identifier to: `com.discountph.app` (or your own)
4. Select your **Team** (Apple Developer account)

### B. Update App Display Name
1. Select **App** target
2. Go to **General** tab
3. Change **Display Name** to: `DiscountPH`

### C. Configure App Icons
1. In Xcode, go to **Assets.xcassets** → **AppIcon**
2. Drag and drop your app icons (various sizes required)
3. Recommended tool: [AppIcon.co](https://www.appicon.co/) to generate all sizes

### D. Configure Splash Screen
1. Go to **Assets.xcassets** → **Splash**
2. Add your splash screen image
3. Background color is set to `#6366f1` (indigo) in `capacitor.config.ts`

## Step 7: Add Privacy Manifest (Required for App Store)

Create `ios/App/App/PrivacyInfo.xcprivacy`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
    </array>
    <key>NSPrivacyCollectedDataTypes</key>
    <array/>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
</dict>
</plist>
```

## Step 8: Test on Simulator

1. In Xcode, select a simulator (e.g., iPhone 15 Pro)
2. Click the **Play** button (▶️) or press `Cmd + R`
3. Wait for the app to build and launch

## Step 9: Test on Physical Device

1. Connect your iPhone via USB
2. In Xcode, select your device from the device dropdown
3. Click **Play** to build and run
4. On first run, you may need to trust the developer certificate:
   - On iPhone: **Settings** → **General** → **VPN & Device Management**
   - Tap your developer account and **Trust**

## Step 10: Build for App Store

### A. Create App Store Connect Record
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **My Apps** → **+** → **New App**
3. Fill in app details:
   - **Name**: DiscountPH
   - **Bundle ID**: com.discountph.app
   - **SKU**: DISCOUNTPH001
   - **User Access**: Full Access

### B. Archive and Upload
1. In Xcode, select **Any iOS Device (arm64)** as target
2. Go to **Product** → **Archive**
3. Wait for archive to complete
4. Click **Distribute App**
5. Select **App Store Connect**
6. Follow the wizard to upload

### C. Submit for Review
1. In App Store Connect, fill in all required metadata:
   - App description
   - Screenshots (iPhone 6.7" and 6.5" required)
   - Privacy policy URL (if collecting data)
   - Age rating
2. Click **Submit for Review**

## Development Workflow

### Making Changes

After updating your React/Next.js code:

```bash
# 1. Build the web app
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Reopen Xcode (if needed)
npm run cap:open:ios
```

Or use the shortcut:
```bash
npm run ios:build
```

### Live Reload (Development)

For faster development, you can use live reload:

1. Start Next.js dev server:
```bash
npm run dev
```

2. Update `capacitor.config.ts` temporarily:
```typescript
server: {
  url: 'http://localhost:3000',
  cleartext: true
}
```

3. Rebuild in Xcode

**Important**: Remove the `server.url` before building for production!

## Troubleshooting

### "Command PhaseScriptExecution failed"
- Clean build folder: **Product** → **Clean Build Folder** (`Cmd + Shift + K`)
- Delete `ios/App/Pods` and run `pod install` in `ios/App/`

### "No such module 'Capacitor'"
```bash
cd ios/App
pod install
```

### App crashes on launch
- Check Xcode console for errors
- Ensure `out/` directory exists and has content
- Run `npx cap sync ios` again

### Changes not showing
- Make sure you ran `npm run build` (not just `npm run dev`)
- Run `npx cap sync ios` after building
- Clean and rebuild in Xcode

## App Store Compliance Checklist

- [ ] Privacy Manifest added (`PrivacyInfo.xcprivacy`)
- [ ] App icons for all required sizes
- [ ] Launch screen configured
- [ ] Bundle ID is unique and registered
- [ ] App Store Connect record created
- [ ] Screenshots prepared (6.7" and 6.5" displays)
- [ ] App description written
- [ ] Privacy policy URL (if needed)
- [ ] Age rating configured
- [ ] No references to "beta", "test", or "demo" in production

## Useful Commands

```bash
# Build web app
npm run build

# Sync to iOS
npx cap sync ios

# Open Xcode
npm run cap:open:ios

# Full build and open
npm run ios:build

# Update Capacitor
npm update @capacitor/core @capacitor/cli @capacitor/ios --legacy-peer-deps
```

## Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Portal](https://developer.apple.com/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## Support

For issues specific to:
- **Capacitor**: [GitHub Issues](https://github.com/ionic-team/capacitor/issues)
- **Next.js**: [GitHub Discussions](https://github.com/vercel/next.js/discussions)
- **iOS/Xcode**: [Apple Developer Forums](https://developer.apple.com/forums/)

