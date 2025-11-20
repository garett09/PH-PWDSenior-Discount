# iOS Resources

This directory contains resources needed for the iOS app.

## Files

### PrivacyInfo.xcprivacy
**Required for App Store submission.**

This privacy manifest declares:
- **UserDefaults API**: Used for saving calculations locally (CA92.1)
- **File Timestamp API**: Used by Capacitor for asset management (C617.1)
- **No Data Collection**: All calculations are performed locally
- **No Tracking**: No analytics or tracking

**Installation**: After running `npx cap add ios`, copy this file to:
```
ios/App/App/PrivacyInfo.xcprivacy
```

Then add it to Xcode:
1. Open Xcode
2. Right-click on the `App` folder
3. Select "Add Files to App..."
4. Select `PrivacyInfo.xcprivacy`
5. Ensure "Copy items if needed" is checked
6. Click "Add"

## App Icons

You'll need app icons in these sizes:
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone)
- 87x87 (iPhone)
- 80x80 (iPad)
- 76x76 (iPad)
- 60x60 (iPhone)
- 58x58 (iPhone)
- 40x40 (iPhone/iPad)
- 29x29 (iPhone/iPad)
- 20x20 (iPhone/iPad)

**Recommended Tool**: Use [AppIcon.co](https://www.appicon.co/) to generate all sizes from a single 1024x1024 image.

### Design Guidelines for App Icon:
- Use the DiscountPH brand colors (indigo/purple gradient)
- Include a recognizable symbol (e.g., percentage sign, discount tag)
- Keep it simple and readable at small sizes
- No text (except if it's part of the logo)
- Square with no transparency (iOS adds the rounded corners)

## Splash Screen

The splash screen is configured in `capacitor.config.ts`:
- Background color: `#6366f1` (indigo-500)
- Duration: 2000ms (2 seconds)
- No spinner

You can customize the splash image in Xcode:
1. Open `ios/App/App/Assets.xcassets/Splash.imageset`
2. Add your splash screen image
3. Recommended size: 2732x2732 (universal)

### Design Guidelines for Splash Screen:
- Center the DiscountPH logo
- Use the brand gradient background
- Keep it simple - users will only see it for 2 seconds
- Ensure it looks good on all device sizes

## App Store Screenshots

Required sizes:
- **6.7" Display** (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796
- **6.5" Display** (iPhone 11 Pro Max, XS Max): 1242 x 2688

You'll need at least 3 screenshots showing:
1. Main calculator interface
2. Bill breakdown/results
3. Group dining or service charge features

**Tip**: Use the iOS Simulator in Xcode to capture screenshots:
1. Run the app in simulator
2. Press `Cmd + S` to save screenshot
3. Screenshots are saved to Desktop

## Bundle Identifier

The default bundle ID is set to: `com.discountph.app`

You can change this in:
1. `capacitor.config.ts` → `appId`
2. Xcode → Target → Signing & Capabilities → Bundle Identifier

**Important**: The bundle ID must be unique and registered in your Apple Developer account.

## App Store Connect Metadata

Prepare these before submitting:

### App Name
- Primary: **DiscountPH**
- Subtitle (optional): "PWD & Senior Discount Calculator"

### Description
```
DiscountPH is the most accurate PWD and Senior Citizen discount calculator for the Philippines.

✓ Compliant with RA 10754 and RA 11361
✓ Handles complex service charge scenarios
✓ Group dining split calculator
✓ Restaurant and grocery/medicine modes
✓ Detailed bill breakdowns
✓ Save and share calculations
✓ Works offline - no internet required

Perfect for:
• PWD and Senior Citizens
• Restaurant diners
• Family members helping loved ones
• Business owners verifying discounts

All calculations are performed locally on your device. No data is collected or shared.
```

### Keywords
```
discount, PWD, senior citizen, calculator, Philippines, restaurant, bill, service charge, VAT, group dining
```

### Category
- **Primary**: Finance
- **Secondary**: Utilities

### Age Rating
- 4+ (No objectionable content)

### Privacy Policy
Since the app doesn't collect any data, you can use a simple privacy policy:
```
DiscountPH does not collect, store, or share any personal information. 
All calculations are performed locally on your device.
```

Host this on a simple webpage (e.g., GitHub Pages) and provide the URL.

## Support URL

Provide a support URL (can be GitHub repository):
```
https://github.com/[your-username]/PH-PWDSenior-Discount
```

## Version History

### 1.0.0 (Initial Release)
- PWD/Senior discount calculator
- Restaurant and grocery modes
- Service charge handling
- Group dining split calculator
- Save and share calculations
- Offline functionality

