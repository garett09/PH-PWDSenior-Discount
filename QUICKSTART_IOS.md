# Quick Start: iOS App Setup

Follow these steps to get your iOS app running.

## ⚠️ IMPORTANT: Install Dependencies First

The npm install was hanging. Try this:

```bash
cd "/Users/adriangarett.sian/Documents/GitHub Repos/PH-PWDSenior-Discount"

# Option 1: Try with npm
npm install --legacy-peer-deps

# Option 2: If still hanging, try clearing cache first
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps

# Option 3: Try with different registry
npm install --legacy-peer-deps --registry=https://registry.npmjs.org/

# Option 4: Try on different network (mobile hotspot, different WiFi)
```

## Once Dependencies are Installed

### Step 1: Build the Web App
```bash
npm run build
```

This creates the `out/` folder with your static files.

### Step 2: Add iOS Platform
```bash
npx cap add ios
```

This creates the `ios/` folder with your Xcode project.

### Step 3: Copy Privacy Manifest
```bash
cp ios-resources/PrivacyInfo.xcprivacy ios/App/App/
```

Then add it to Xcode (see ios-resources/README.md for details).

### Step 4: Open in Xcode
```bash
npm run cap:open:ios
```

### Step 5: Configure in Xcode

1. **Select the App target** (top left)
2. **General tab**:
   - Display Name: `DiscountPH`
   - Bundle Identifier: `com.discountph.app` (or your own)
   - Version: `1.0.0`
   - Build: `1`

3. **Signing & Capabilities tab**:
   - Select your Team (Apple Developer account)
   - Xcode will automatically manage signing

4. **Select a simulator** (e.g., iPhone 15 Pro)

5. **Click the Play button** (▶️) to build and run

## That's It! 🎉

Your app should now be running in the iOS simulator.

## Next Steps

- Add app icons (see ios-resources/README.md)
- Test on a real device
- Prepare App Store screenshots
- Submit to App Store Connect

## Common Issues

### "No such module 'Capacitor'"
```bash
cd ios/App
pod install
cd ../..
```

### Changes not showing
```bash
npm run build
npx cap sync ios
```

### Build errors in Xcode
- Clean build folder: `Product` → `Clean Build Folder` (Cmd+Shift+K)
- Restart Xcode

## Full Documentation

See `IOS_SETUP.md` for complete documentation.

